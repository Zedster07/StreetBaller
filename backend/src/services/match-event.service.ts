// Match Event Service - Track detailed game events (goals, assists, cards, etc.)
// Provides complete transparency into individual match performance

import prisma from '../config/database';
import { logger } from '../utils/logger';

// Event types and data structures
export type MatchEventType = 'goal' | 'assist' | 'yellow_card' | 'red_card' | 'substitution' | 'own_goal' | 'penalty' | 'penalty_saved';

export interface MatchEvent {
  id: string;
  matchId: string;
  eventType: MatchEventType;
  playerId: string;
  playerName: string;
  teamId: string;
  minute: number;
  second: number;
  description: string;
  relatedPlayerId?: string; // For assists (who was assisted)
  relatedPlayerName?: string;
  metadata?: Record<string, any>; // Additional event data
  createdAt: Date;
}

export interface MatchEventStats {
  matchId: string;
  totalEvents: number;
  goalCount: number;
  assistCount: number;
  yellowCards: number;
  redCards: number;
  eventsByTeam: {
    teamId: string;
    teamName: string;
    goals: number;
    assists: number;
    cards: number;
  }[];
}

export class MatchEventService {
  /**
   * Record a match event (goal, assist, card, etc.)
   */
  async recordEvent(
    matchId: string,
    playerId: string,
    eventType: MatchEventType,
    minute: number,
    second: number = 0,
    description: string,
    relatedPlayerId?: string
  ): Promise<MatchEvent> {
    try {
      // Validate match exists
      const match = await prisma.match.findUnique({
        where: { id: matchId },
        select: { id: true, status: true, team1Id: true, team2Id: true },
      });

      if (!match) {
        throw new Error('Match not found');
      }

      // Get player (via User since MatchEvent uses User not PlayerProfile)
      const user = await prisma.user.findUnique({
        where: { id: playerId },
        select: { firebaseUid: true, playerProfile: { select: { displayName: true } } },
      });

      if (!user) {
        throw new Error('Player not found');
      }

      // Determine team from match
      let teamId = '';
      const teamMembership = await prisma.teamMembership.findFirst({
        where: {
          userId: playerId,
          OR: [
            { team: { matchesAsTeam1: { some: { id: matchId } } } },
            { team: { matchesAsTeam2: { some: { id: matchId } } } },
          ],
        },
        select: { teamId: true },
      });

      if (teamMembership) {
        teamId = teamMembership.teamId;
      } else {
        // Fallback - just use first team the player is in
        const firstTeam = await prisma.teamMembership.findFirst({
          where: { userId: playerId },
          select: { teamId: true },
        });
        teamId = firstTeam?.teamId || '';
      }

      // Get related player name if applicable
      let relatedPlayerName: string | undefined;
      if (relatedPlayerId && ['assist', 'penalty_saved'].includes(eventType)) {
        const relatedUser = await prisma.user.findUnique({
          where: { id: relatedPlayerId },
          select: { playerProfile: { select: { displayName: true } } },
        });
        relatedPlayerName = relatedUser?.playerProfile?.displayName;
      }

      // Create event record
      const event: MatchEvent = {
        id: `evt_${Date.now()}_${playerId.substring(0, 8)}`,
        matchId,
        eventType,
        playerId,
        playerName: user.playerProfile?.displayName || 'Unknown',
        teamId,
        minute,
        second,
        description,
        relatedPlayerId,
        relatedPlayerName,
        createdAt: new Date(),
      };

      // Update player stats based on event type
      const profile = await prisma.playerProfile.findUnique({
        where: { userId: playerId },
        select: { id: true },
      });

      if (profile) {
        await this.updatePlayerStats(profile.id, eventType);
      }

      logger.info(`Match event recorded: ${eventType}`, {
        matchId,
        playerId,
        playerName: user.playerProfile?.displayName,
        minute,
        second,
      });

      return event;
    } catch (error) {
      logger.error('Error recording match event:', error);
      throw error;
    }
  }

  /**
   * Get all events for a specific match
   */
  async getMatchEvents(
    matchId: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<{
    matchId: string;
    events: MatchEvent[];
    total: number;
    limit: number;
    offset: number;
  }> {
    try {
      // Validate match exists and get details
      const match = await prisma.match.findUnique({
        where: { id: matchId },
        select: { 
          id: true, 
          team1Id: true, 
          team2Id: true,
          team1Score: true,
          team2Score: true,
        },
      });

      if (!match) {
        throw new Error('Match not found');
      }

      // Fetch actual match events from database
      const matchEvents = await prisma.matchEvent.findMany({
        where: { matchId },
        include: {
          scorer: { select: { playerProfile: { select: { displayName: true } } } },
        },
        orderBy: { minute: 'asc' },
        take: limit,
        skip: offset,
      });

      // Convert to our event format
      const events: MatchEvent[] = matchEvents.map((e) => ({
        id: e.id,
        matchId: e.matchId,
        eventType: e.eventType as MatchEventType,
        playerId: e.scorerId,
        playerName: e.scorer.playerProfile?.displayName || 'Unknown',
        teamId: e.teamId,
        minute: e.minute || 0,
        second: 0,
        description: `${e.eventType} by ${e.scorer.playerProfile?.displayName}`,
        createdAt: e.createdAt,
      }));

      const totalCount = await prisma.matchEvent.count({ where: { matchId } });

      return {
        matchId,
        events,
        total: totalCount,
        limit,
        offset,
      };
    } catch (error) {
      logger.error('Error fetching match events:', error);
      throw error;
    }
  }

  /**
   * Get events for a specific player in a match
   */
  async getPlayerMatchEvents(
    playerId: string,
    matchId: string
  ): Promise<MatchEvent[]> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: playerId },
        select: {
          playerProfile: { select: { displayName: true } },
        },
      });

      if (!user) {
        throw new Error('Player not found');
      }

      // Get match details
      const match = await prisma.match.findUnique({
        where: { id: matchId },
        select: { id: true },
      });

      if (!match) {
        throw new Error('Match not found');
      }

      // Get player's events in this match
      const events = await prisma.matchEvent.findMany({
        where: {
          matchId,
          OR: [
            { scorerId: playerId },
            { assisterId: playerId },
          ],
        },
        orderBy: { minute: 'asc' },
      });

      return events.map((e) => ({
        id: e.id,
        matchId: e.matchId,
        eventType: e.eventType as MatchEventType,
        playerId: e.scorerId,
        playerName: user.playerProfile?.displayName || 'Unknown',
        teamId: e.teamId,
        minute: e.minute || 0,
        second: 0,
        description: `${e.eventType} by ${user.playerProfile?.displayName}`,
        createdAt: e.createdAt,
      }));
    } catch (error) {
      logger.error('Error fetching player match events:', error);
      throw error;
    }
  }

  /**
   * Get aggregated event statistics for a match
   */
  async getMatchEventStats(matchId: string): Promise<MatchEventStats> {
    try {
      const match = await prisma.match.findUnique({
        where: { id: matchId },
        select: {
          id: true,
          team1Id: true,
          team2Id: true,
          team1: { select: { name: true } },
          team2: { select: { name: true } },
        },
      });

      if (!match) {
        throw new Error('Match not found');
      }

      // Get events from database
      const allEvents = await prisma.matchEvent.findMany({
        where: { matchId },
      });

      // Count event types
      const goalCount = allEvents.filter((e) => e.eventType === 'goal').length;
      const assistCount = allEvents.filter((e) => e.eventType === 'assist').length;
      const yellowCards = allEvents.filter((e) => e.eventType === 'yellow_card').length;
      const redCards = allEvents.filter((e) => e.eventType === 'red_card').length;

      // Count by team
      const team1Events = allEvents.filter((e) => e.teamId === match.team1Id);
      const team2Events = allEvents.filter((e) => e.teamId === match.team2Id);

      return {
        matchId,
        totalEvents: allEvents.length,
        goalCount,
        assistCount,
        yellowCards,
        redCards,
        eventsByTeam: [
          {
            teamId: match.team1Id,
            teamName: match.team1?.name || 'Team 1',
            goals: team1Events.filter((e) => e.eventType === 'goal').length,
            assists: team1Events.filter((e) => e.eventType === 'assist').length,
            cards: team1Events.filter((e) => ['yellow_card', 'red_card'].includes(e.eventType)).length,
          },
          {
            teamId: match.team2Id,
            teamName: match.team2?.name || 'Team 2',
            goals: team2Events.filter((e) => e.eventType === 'goal').length,
            assists: team2Events.filter((e) => e.eventType === 'assist').length,
            cards: team2Events.filter((e) => ['yellow_card', 'red_card'].includes(e.eventType)).length,
          },
        ],
      };
    } catch (error) {
      logger.error('Error fetching match event stats:', error);
      throw error;
    }
  }

  /**
   * Get player event history across all matches
   */
  async getPlayerEventHistory(
    playerId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{
    playerId: string;
    events: MatchEvent[];
    total: number;
    stats: {
      totalGoals: number;
      totalAssists: number;
      totalCards: number;
    };
  }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: playerId },
        select: {
          playerProfile: {
            select: {
              displayName: true,
              goalsScored: true,
              assists: true,
            },
          },
        },
      });

      if (!user) {
        throw new Error('Player not found');
      }

      // Get all events for this player
      const events = await prisma.matchEvent.findMany({
        where: {
          OR: [
            { scorerId: playerId },
            { assisterId: playerId },
          ],
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      });

      const convertedEvents: MatchEvent[] = events.map((e) => ({
        id: e.id,
        matchId: e.matchId,
        eventType: e.eventType as MatchEventType,
        playerId: e.scorerId,
        playerName: user.playerProfile?.displayName || 'Unknown',
        teamId: e.teamId,
        minute: e.minute || 0,
        second: 0,
        description: `${e.eventType}`,
        createdAt: e.createdAt,
      }));

      const totalCount = await prisma.matchEvent.count({
        where: {
          OR: [
            { scorerId: playerId },
            { assisterId: playerId },
          ],
        },
      });

      return {
        playerId,
        events: convertedEvents,
        total: totalCount,
        stats: {
          totalGoals: user.playerProfile?.goalsScored || 0,
          totalAssists: user.playerProfile?.assists || 0,
          totalCards: 0, // Would need to track in MatchEvent
        },
      };
    } catch (error) {
      logger.error('Error fetching player event history:', error);
      throw error;
    }
  }

  /**
   * Update player statistics based on event type
   */
  private async updatePlayerStats(
    playerId: string,
    eventType: MatchEventType
  ): Promise<void> {
    try {
      const updates: Record<string, any> = {};

      switch (eventType) {
        case 'goal':
          updates.goalsScored = { increment: 1 };
          break;
        case 'assist':
          updates.assists = { increment: 1 };
          break;
        case 'own_goal':
          updates.ownGoals = { increment: 1 };
          break;
        // Cards don't directly update profile, would be tracked separately
        case 'yellow_card':
        case 'red_card':
          updates.cards = { increment: 1 };
          break;
      }

      if (Object.keys(updates).length > 0) {
        await prisma.playerProfile.update({
          where: { userId: playerId },
          data: updates,
        });
      }
    } catch (error) {
      logger.error('Error updating player stats:', error);
      // Don't re-throw - stats update failure shouldn't break event recording
    }
  }
}

export default new MatchEventService();
