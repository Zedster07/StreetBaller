// Match Service - Business Logic Layer
// Contains all match-related business logic including dispute resolution

import matchModel from '../models/match.model';
import { CreateMatchDto, SubmitScoreDto } from '../types/match.types';
import { SKILL_COINS_CONFIG, TRUST_POINTS_CONFIG } from '../config/constants';
import { logger } from '../utils/logger';
import prisma from '../config/database';

export class MatchService {
  private matchModel = matchModel;

  // Create a new match (challenge)
  async createMatch(data: CreateMatchDto, challengeCreatorId: string) {
    // Validate teams exist and are different
    if (data.team1Id === data.team2Id) {
      throw new Error('Teams must be different');
    }

    const [team1, team2, pitch] = await Promise.all([
      prisma.team.findUnique({ where: { id: data.team1Id } }),
      prisma.team.findUnique({ where: { id: data.team2Id } }),
      prisma.pitch.findUnique({ where: { id: data.pitchId } }),
    ]);

    if (!team1 || !team2) {
      throw new Error('One or both teams not found');
    }
    if (!pitch) {
      throw new Error('Pitch not found');
    }

    // Validate match date is in the future
    if (new Date(data.matchDate) < new Date()) {
      throw new Error('Match date must be in the future');
    }

    logger.info('Creating new match:', { team1: data.team1Id, team2: data.team2Id });

    return await this.matchModel.createMatch(data, challengeCreatorId);
  }

  // Get match details
  async getMatchById(matchId: string) {
    const match = await this.matchModel.findById(matchId);
    if (!match) {
      throw new Error('Match not found');
    }

    return match;
  }

  // Submit score by referee (with full validation)
  async submitScore(matchId: string, team1Score: number, team2Score: number, events: any[] = []) {
    // Validation
    if (team1Score < 0 || team2Score < 0) {
      throw new Error('Scores cannot be negative');
    }

    const match = await this.matchModel.findById(matchId);
    if (!match) {
      throw new Error('Match not found');
    }

    // Validate match can accept scores
    if (match.status !== 'scheduled' && match.status !== 'in-progress') {
      throw new Error(`Cannot submit scores for a ${match.status} match`);
    }

    logger.info('Score submitted:', { matchId, team1Score, team2Score });

    // Record match events (goals, assists, cards)
    if (events && events.length > 0) {
      for (const event of events) {
        await prisma.matchEvent.create({
          data: {
            matchId,
            userId: event.scorerId,
            eventType: event.eventType || 'goal',
            minute: event.minute,
            teamId: event.teamId,
            assistedBy: event.assisterId,
          },
        });
      }
    }

    // Submit score and move match to pending confirmation
    return await this.matchModel.submitScore(matchId, {
      team1Score,
      team2Score,
      events,
    });
  }

  // Captain approves or disputes score
  async approveOrDisputeScore(matchId: string, teamId: string, approved: boolean, reason?: string) {
    const match = await this.matchModel.findById(matchId);
    if (!match) {
      throw new Error('Match not found');
    }

    // Validate match has pending scores
    if (match.status !== 'pending-confirmation') {
      throw new Error('No pending scores to approve/dispute');
    }

    // Verify team is in this match
    const isValidTeam = match.team1Id === teamId || match.team2Id === teamId;
    if (!isValidTeam) {
      throw new Error('Team is not part of this match');
    }

    if (approved) {
      logger.info('Score approved:', { matchId, teamId });
      return await this.matchModel.approveScore(matchId, teamId);
    } else {
      logger.info('Score disputed:', { matchId, teamId, reason });
      // Create a dispute record
      return await this.createDispute(matchId, teamId, reason);
    }
  }

  // Create dispute record
  private async createDispute(matchId: string, disputingTeamId: string, reason?: string) {
    const match = await this.matchModel.findById(matchId);
    if (!match) {
      throw new Error('Match not found');
    }

    // Identify defending team (the one who reported the score)
    const defendingTeamId = match.team1Id === disputingTeamId ? match.team2Id : match.team1Id;

    const dispute = await prisma.dispute.create({
      data: {
        matchId,
        disputingTeamId,
        defendingTeamId,
        reason: reason || 'Score disagreement',
        status: 'open',
      },
    });

    // Update match status to disputed
    await this.matchModel.updateStatus(matchId, 'disputed');

    logger.info('Dispute created:', { matchId, disputingTeamId, defendingTeamId });

    return {
      disputed: true,
      dispute,
    };
  }

  // Get matches by team
  async getTeamMatches(teamId: string) {
    return await this.matchModel.findByTeamId(teamId);
  }

  // Get upcoming matches
  async getUpcomingMatches() {
    return await this.matchModel.findUpcoming();
  }

  // Calculate match rewards (called when match is completed)
  async calculateRewardsForMatch(matchId: string) {
    const match = await this.matchModel.findById(matchId);
    if (!match) {
      throw new Error('Match not found');
    }

    if (match.status !== 'completed') {
      throw new Error('Match must be completed to calculate rewards');
    }

    const winningTeamId = match.team1Score! > match.team2Score! ? match.team1Id : match.team2Id;
    const losingTeamId = winningTeamId === match.team1Id ? match.team2Id : match.team1Id;

    // Get team members
    const [winningTeam, losingTeam] = await Promise.all([
      prisma.team.findUnique({
        where: { id: winningTeamId },
        include: { TeamMembership: true },
      }),
      prisma.team.findUnique({
        where: { id: losingTeamId },
        include: { TeamMembership: true },
      }),
    ]);

    // Award skill coins and trust points
    const rewards = {
      winners: [] as any[],
      losers: [] as any[],
    };

    if (winningTeam) {
      for (const membership of winningTeam.TeamMembership) {
        rewards.winners.push({
          userId: membership.userId,
          skillCoins: SKILL_COINS_CONFIG.WIN,
          trustPoints: TRUST_POINTS_CONFIG.WIN,
        });
      }
    }

    if (losingTeam) {
      for (const membership of losingTeam.TeamMembership) {
        rewards.losers.push({
          userId: membership.userId,
          skillCoins: SKILL_COINS_CONFIG.PARTICIPATION,
          trustPoints: TRUST_POINTS_CONFIG.PARTICIPATION,
        });
      }
    }

    logger.info('Rewards calculated:', { matchId, rewards });
    return rewards;
  }
}

export default new MatchService();
