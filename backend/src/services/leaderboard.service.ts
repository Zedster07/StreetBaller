// Leaderboard Service - Statistics & Rankings
// Calculates player and team rankings with comprehensive stats aggregation

import prisma from '../config/database';
import { logger } from '../utils/logger';

export class LeaderboardService {
  /**
   * Get top players ranked by skill rating
   * @param limit - Number of players to return (default 50)
   * @param offset - Pagination offset (default 0)
   */
  async getTopPlayersByRating(limit: number = 50, offset: number = 0) {
    try {
      const players = await prisma.playerProfile.findMany({
        where: {
          user: {
            verifiedEmail: true, // Only include verified players
          },
        },
        select: {
          id: true,
          userId: true,
          displayName: true,
          profilePhotoUrl: true,
          skillRating: true,
          overallRating: true,
          gamesPlayed: true,
          wins: true,
          losses: true,
          draws: true,
          goalsScored: true,
          assists: true,
          trustPoints: true,
          skillCoins: true,
          preferredPosition: true,
        },
        orderBy: {
          skillRating: 'desc',
        },
        take: limit,
        skip: offset,
      });

      // Calculate derived stats
      const enrichedPlayers = players.map((player) => ({
        ...player,
        rank: offset + (players.indexOf(player) + 1),
        winRate: player.gamesPlayed > 0 ? ((player.wins / player.gamesPlayed) * 100).toFixed(2) : '0.00',
        goalsPerGame: player.gamesPlayed > 0 ? (player.goalsScored / player.gamesPlayed).toFixed(2) : '0.00',
        assistsPerGame: player.gamesPlayed > 0 ? (player.assists / player.gamesPlayed).toFixed(2) : '0.00',
      }));

      logger.info('Retrieved top players by rating', { count: players.length, limit, offset });

      return {
        data: enrichedPlayers,
        total: enrichedPlayers.length,
        limit,
        offset,
      };
    } catch (error) {
      logger.error('Error fetching top players by rating:', error);
      throw error;
    }
  }

  /**
   * Get top players ranked by goals scored
   */
  async getTopPlayersByGoals(limit: number = 50, offset: number = 0) {
    try {
      const players = await prisma.playerProfile.findMany({
        where: {
          user: {
            verifiedEmail: true,
          },
        },
        select: {
          id: true,
          userId: true,
          displayName: true,
          profilePhotoUrl: true,
          skillRating: true,
          goalsScored: true,
          gamesPlayed: true,
          wins: true,
          losses: true,
          draws: true,
          assists: true,
          trustPoints: true,
          preferredPosition: true,
        },
        orderBy: {
          goalsScored: 'desc',
        },
        take: limit,
        skip: offset,
      });

      const enrichedPlayers = players.map((player, index) => ({
        ...player,
        rank: offset + index + 1,
        winRate: player.gamesPlayed > 0 ? ((player.wins / player.gamesPlayed) * 100).toFixed(2) : '0.00',
        goalsPerGame: player.gamesPlayed > 0 ? (player.goalsScored / player.gamesPlayed).toFixed(2) : '0.00',
        assistsPerGame: player.gamesPlayed > 0 ? (player.assists / player.gamesPlayed).toFixed(2) : '0.00',
      }));

      logger.info('Retrieved top players by goals', { count: players.length, limit, offset });

      return {
        data: enrichedPlayers,
        total: players.length,
        limit,
        offset,
      };
    } catch (error) {
      logger.error('Error fetching top players by goals:', error);
      throw error;
    }
  }

  /**
   * Get top players ranked by assists
   */
  async getTopPlayersByAssists(limit: number = 50, offset: number = 0) {
    try {
      const players = await prisma.playerProfile.findMany({
        where: {
          user: {
            verifiedEmail: true,
          },
        },
        select: {
          id: true,
          userId: true,
          displayName: true,
          profilePhotoUrl: true,
          skillRating: true,
          assists: true,
          gamesPlayed: true,
          wins: true,
          losses: true,
          draws: true,
          goalsScored: true,
          trustPoints: true,
          preferredPosition: true,
        },
        orderBy: {
          assists: 'desc',
        },
        take: limit,
        skip: offset,
      });

      const enrichedPlayers = players.map((player, index) => ({
        ...player,
        rank: offset + index + 1,
        winRate: player.gamesPlayed > 0 ? ((player.wins / player.gamesPlayed) * 100).toFixed(2) : '0.00',
        goalsPerGame: player.gamesPlayed > 0 ? (player.goalsScored / player.gamesPlayed).toFixed(2) : '0.00',
        assistsPerGame: player.gamesPlayed > 0 ? (player.assists / player.gamesPlayed).toFixed(2) : '0.00',
      }));

      logger.info('Retrieved top players by assists', { count: players.length, limit, offset });

      return {
        data: enrichedPlayers,
        total: players.length,
        limit,
        offset,
      };
    } catch (error) {
      logger.error('Error fetching top players by assists:', error);
      throw error;
    }
  }

  /**
   * Get top players ranked by match wins
   */
  async getTopPlayersByWins(limit: number = 50, offset: number = 0) {
    try {
      const players = await prisma.playerProfile.findMany({
        where: {
          user: {
            verifiedEmail: true,
          },
        },
        select: {
          id: true,
          userId: true,
          displayName: true,
          profilePhotoUrl: true,
          skillRating: true,
          wins: true,
          gamesPlayed: true,
          losses: true,
          draws: true,
          goalsScored: true,
          assists: true,
          trustPoints: true,
          preferredPosition: true,
        },
        orderBy: {
          wins: 'desc',
        },
        take: limit,
        skip: offset,
      });

      const enrichedPlayers = players.map((player, index) => ({
        ...player,
        rank: offset + index + 1,
        winRate: player.gamesPlayed > 0 ? ((player.wins / player.gamesPlayed) * 100).toFixed(2) : '0.00',
        goalsPerGame: player.gamesPlayed > 0 ? (player.goalsScored / player.gamesPlayed).toFixed(2) : '0.00',
        assistsPerGame: player.gamesPlayed > 0 ? (player.assists / player.gamesPlayed).toFixed(2) : '0.00',
      }));

      logger.info('Retrieved top players by wins', { count: players.length, limit, offset });

      return {
        data: enrichedPlayers,
        total: players.length,
        limit,
        offset,
      };
    } catch (error) {
      logger.error('Error fetching top players by wins:', error);
      throw error;
    }
  }

  /**
   * Get player stats by ID
   */
  async getPlayerStats(playerId: string) {
    try {
      const player = await prisma.playerProfile.findUnique({
        where: { id: playerId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              verifiedEmail: true,
              createdAt: true,
            },
          },
        },
      });

      if (!player) {
        throw new Error('Player not found');
      }

      // Get raw rank for this player
      const rank = await prisma.playerProfile.count({
        where: {
          skillRating: {
            gt: player.skillRating,
          },
          user: {
            verifiedEmail: true,
          },
        },
      });

      const stats = {
        id: player.id,
        userId: player.userId,
        displayName: player.displayName,
        profilePhotoUrl: player.profilePhotoUrl,
        preferredPosition: player.preferredPosition,
        dominantFoot: player.dominantFoot,
        bio: player.bio,
        email: player.user.email,
        verifiedEmail: player.user.verifiedEmail,
        memberSince: player.user.createdAt,
        // Performance metrics
        skillRating: player.skillRating,
        overallRating: player.overallRating,
        rank: rank + 1,
        // Match statistics
        gamesPlayed: player.gamesPlayed,
        wins: player.wins,
        losses: player.losses,
        draws: player.draws,
        winRate: player.gamesPlayed > 0 ? ((player.wins / player.gamesPlayed) * 100).toFixed(2) : '0.00',
        drawRate: player.gamesPlayed > 0 ? ((player.draws / player.gamesPlayed) * 100).toFixed(2) : '0.00',
        // Offensive stats
        goalsScored: player.goalsScored,
        assists: player.assists,
        goalsPerGame: player.gamesPlayed > 0 ? (player.goalsScored / player.gamesPlayed).toFixed(2) : '0.00',
        assistsPerGame: player.gamesPlayed > 0 ? (player.assists / player.gamesPlayed).toFixed(2) : '0.00',
        // Currency & reputation
        skillCoins: player.skillCoins,
        trustPoints: player.trustPoints,
        reputation: player.reputation,
        tournamentPoints: player.tournamentPoints,
      };

      logger.info('Retrieved player stats', { playerId, displayName: player.displayName });

      return stats;
    } catch (error) {
      logger.error('Error fetching player stats:', error);
      throw error;
    }
  }

  /**
   * Get team rankings by win rate
   */
  async getTopTeamsByWinRate(limit: number = 50, offset: number = 0) {
    try {
      const teams = await prisma.team.findMany({
        where: {
          gamesPlayed: {
            gt: 0, // Only teams with at least one game
          },
        },
        select: {
          id: true,
          name: true,
          logoUrl: true,
          primaryColor: true,
          secondaryColor: true,
          gamesPlayed: true,
          wins: true,
          losses: true,
          draws: true,
          teamMemberships: {
            select: {
              userId: true,
            },
          },
          createdAt: true,
        },
        orderBy: [
          { wins: 'desc' },
          { gamesPlayed: 'desc' },
        ],
        take: limit,
        skip: offset,
      });

      const enrichedTeams = teams.map((team, index) => ({
        id: team.id,
        name: team.name,
        logoUrl: team.logoUrl,
        primaryColor: team.primaryColor,
        secondaryColor: team.secondaryColor,
        rank: offset + index + 1,
        memberCount: team.teamMemberships.length,
        gamesPlayed: team.gamesPlayed,
        wins: team.wins,
        losses: team.losses,
        draws: team.draws,
        winRate: ((team.wins / team.gamesPlayed) * 100).toFixed(2),
        createdAt: team.createdAt,
      }));

      logger.info('Retrieved top teams by wins', { count: teams.length, limit, offset });

      return {
        data: enrichedTeams,
        total: enrichedTeams.length,
        limit,
        offset,
      };
    } catch (error) {
      logger.error('Error fetching top teams:', error);
      throw error;
    }
  }

  /**
   * Get team stats by ID
   */
  async getTeamStats(teamId: string) {
    try {
      const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: {
          teamMemberships: {
            select: {
              userId: true,
              role: true,
              joinedAt: true,
              user: {
                select: {
                  playerProfile: {
                    select: {
                      displayName: true,
                      skillRating: true,
                      goalsScored: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!team) {
        throw new Error('Team not found');
      }

      // Get creator email
      const creator = await prisma.user.findUnique({
        where: { id: team.createdById },
        select: { email: true },
      });

      // Get current rank
      const rank = await prisma.team.count({
        where: {
          wins: {
            gt: team.wins,
          },
          gamesPlayed: {
            gt: 0,
          },
        },
      });

      return {
        id: team.id,
        name: team.name,
        logoUrl: team.logoUrl,
        primaryColor: team.primaryColor,
        secondaryColor: team.secondaryColor,
        description: team.description,
        formation: team.formation,
        createdBy: creator?.email || 'Unknown',
        createdAt: team.createdAt,
        updatedAt: team.updatedAt,
        rank: rank + 1,
        members: {
          total: team.teamMemberships.length,
          list: team.teamMemberships.map((membership) => ({
            userId: membership.userId,
            displayName: membership.user.playerProfile?.displayName || 'Unknown',
            skillRating: membership.user.playerProfile?.skillRating || 0,
            role: membership.role,
            joinedAt: membership.joinedAt,
          })),
        },
        stats: {
          gamesPlayed: team.gamesPlayed,
          wins: team.wins,
          losses: team.losses,
          draws: team.draws,
          winRate: team.gamesPlayed > 0 ? ((team.wins / team.gamesPlayed) * 100).toFixed(2) : '0.00',
          drawRate: team.gamesPlayed > 0 ? ((team.draws / team.gamesPlayed) * 100).toFixed(2) : '0.00',
          totalGoalsScored: team.teamMemberships.reduce((sum: number, m: any) => sum + (m.user.playerProfile?.goalsScored || 0), 0),
          averageTeamRating: team.teamMemberships.length > 0 
            ? (team.teamMemberships.reduce((sum: number, m: any) => sum + (m.user.playerProfile?.skillRating || 0), 0) / team.teamMemberships.length).toFixed(2)
            : '0.00',
        },
      };
    } catch (error) {
      logger.error('Error fetching team stats:', error);
      throw error;
    }
  }

  /**
   * Get global leaderboard summary (top 10s across categories)
   */
  async getLeaderboardSummary() {
    try {
      const [topByRating, topByGoals, topByWins, topTeams] = await Promise.all([
        prisma.playerProfile.findMany({
          where: { user: { verifiedEmail: true } },
          select: {
            id: true,
            userId: true,
            displayName: true,
            skillRating: true,
            profilePhotoUrl: true,
          },
          orderBy: { skillRating: 'desc' },
          take: 10,
        }),
        prisma.playerProfile.findMany({
          where: { user: { verifiedEmail: true } },
          select: {
            id: true,
            userId: true,
            displayName: true,
            goalsScored: true,
            profilePhotoUrl: true,
          },
          orderBy: { goalsScored: 'desc' },
          take: 10,
        }),
        prisma.playerProfile.findMany({
          where: { user: { verifiedEmail: true } },
          select: {
            id: true,
            userId: true,
            displayName: true,
            wins: true,
            profilePhotoUrl: true,
          },
          orderBy: { wins: 'desc' },
          take: 10,
        }),
        prisma.team.findMany({
          where: { gamesPlayed: { gt: 0 } },
          select: {
            id: true,
            name: true,
            wins: true,
            gamesPlayed: true,
            logoUrl: true,
          },
          orderBy: [{ wins: 'desc' }, { gamesPlayed: 'desc' }],
          take: 10,
        }),
      ]);

      logger.info('Retrieved leaderboard summary');

      return {
        topPlayersByRating: topByRating.map((p, i) => ({
          rank: i + 1,
          ...p,
        })),
        topPlayersByGoals: topByGoals.map((p, i) => ({
          rank: i + 1,
          ...p,
        })),
        topPlayersByWins: topByWins.map((p, i) => ({
          rank: i + 1,
          ...p,
        })),
        topTeams: topTeams.map((t, i) => ({
          rank: i + 1,
          winRate: ((t.wins / t.gamesPlayed) * 100).toFixed(2),
          ...t,
        })),
      };
    } catch (error) {
      logger.error('Error fetching leaderboard summary:', error);
      throw error;
    }
  }
}

export default new LeaderboardService();
