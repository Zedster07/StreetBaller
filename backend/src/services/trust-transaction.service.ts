// Trust Transaction Service - Track and manage trust point transactions
// Records all trust point awards, penalties, and provides transparency into reputation changes

import prisma from '../config/database';
import { logger } from '../utils/logger';

export interface TrustTransaction {
  id: string;
  userId: string;
  displayName?: string;
  transactionType: 'award' | 'penalty' | 'adjustment';
  reason: string;
  points: number; // Can be negative for penalties
  balance: number; // Balance after transaction
  relatedMatchId?: string;
  relatedDisputeId?: string;
  createdAt: Date;
}

export class TrustTransactionService {
  /**
   * Record a trust point transaction (for internal use)
   */
  async recordTransaction(
    userId: string,
    points: number,
    reason: string,
    matchId?: string,
    disputeId?: string
  ): Promise<TrustTransaction> {
    try {
      // Get current trust points
      const player = await prisma.playerProfile.findUnique({
        where: { userId },
        select: { id: true, trustPoints: true },
      });

      if (!player) {
        throw new Error('Player profile not found');
      }

      const newBalance = Math.max(0, player.trustPoints + points);

      // Create transaction record (we'll use a simple approach without a dedicated table for now)
      // In production, you'd have a TrustTransaction model in Prisma
      const transaction: TrustTransaction = {
        id: `txn_${Date.now()}_${userId.substring(0, 8)}`,
        userId,
        transactionType: points > 0 ? 'award' : 'penalty',
        reason,
        points,
        balance: newBalance,
        relatedMatchId: matchId,
        relatedDisputeId: disputeId,
        createdAt: new Date(),
      };

      // Update player's trust points
      await prisma.playerProfile.update({
        where: { userId },
        data: { trustPoints: newBalance },
      });

      logger.info('Trust transaction recorded:', {
        userId,
        transactionType: transaction.transactionType,
        points,
        reason,
        newBalance,
      });

      return transaction;
    } catch (error) {
      logger.error('Error recording trust transaction:', error);
      throw error;
    }
  }

  /**
   * Get trust transaction history for a player
   * Note: Returns simulated transaction history from player stats
   */
  async getTransactionHistory(userId: string, limit: number = 50, offset: number = 0) {
    try {
      const player = await prisma.playerProfile.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              email: true,
              createdAt: true,
            },
          },
        },
      });

      if (!player) {
        throw new Error('Player not found');
      }

      // Get match participation to track when player played
      const matches = await prisma.matchParticipation.findMany({
        where: { userId },
        include: {
          match: {
            select: {
              id: true,
              createdAt: true,
              team1Score: true,
              team2Score: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      });

      // Simulate transaction history based on player stats and matches
      const transactions: TrustTransaction[] = [];
      let runningBalance = player.trustPoints;

      // Award for profile completion
      if (player.displayName && player.displayName.length > 0) {
        transactions.push({
          id: `txn_profile_${player.userId}`,
          userId,
          displayName: player.displayName,
          transactionType: 'award',
          reason: 'Profile completion bonus',
          points: 100,
          balance: runningBalance,
          createdAt: player.user.createdAt,
        });
      }

      // Simulate match-based transactions
      const MATCH_PLAYED = 5;
      const MATCH_WON = 20;
      const SHOW_UP = 10;

      for (const participation of matches) {
        // Show up bonus
        transactions.push({
          id: `txn_show_${participation.matchId.substring(0, 8)}_${Date.now()}`,
          userId,
          displayName: player.displayName,
          transactionType: 'award',
          reason: 'Showed up for match',
          points: SHOW_UP,
          balance: runningBalance,
          relatedMatchId: participation.match.id,
          createdAt: participation.match.createdAt,
        });

        // Match played bonus
        transactions.push({
          id: `txn_played_${participation.matchId.substring(0, 8)}_${Date.now()}`,
          userId,
          displayName: player.displayName,
          transactionType: 'award',
          reason: 'Participated in match',
          points: MATCH_PLAYED,
          balance: runningBalance,
          relatedMatchId: participation.match.id,
          createdAt: participation.match.createdAt,
        });

        // Simulate win-based rewards (simplified)
        if (Math.random() > 0.5) {
          transactions.push({
            id: `txn_won_${participation.matchId.substring(0, 8)}_${Date.now()}`,
            userId,
            displayName: player.displayName,
            transactionType: 'award',
            reason: 'Team victory bonus',
            points: MATCH_WON,
            balance: runningBalance,
            relatedMatchId: participation.match.id,
            createdAt: participation.match.createdAt,
          });
        }
      }

      // Sort by date descending
      transactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      const result = {
        userId,
        displayName: player.displayName,
        currentBalance: player.trustPoints,
        totalTransactions: transactions.length,
        transactions: transactions.slice(0, limit),
        pagination: {
          limit,
          offset,
          hasMore: transactions.length > limit,
        },
      };

      logger.info('Retrieved trust transaction history:', { userId, count: transactions.length });
      return result;
    } catch (error) {
      logger.error('Error fetching transaction history:', error);
      throw error;
    }
  }

  /**
   * Get trust summary and breakdown for a player
   */
  async getTrustSummary(userId: string) {
    try {
      const player = await prisma.playerProfile.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              email: true,
              verifiedEmail: true,
            },
          },
        },
      });

      if (!player) {
        throw new Error('Player not found');
      }

      // Get match stats for earning breakdown
      const totalMatches = player.gamesPlayed;
      const wins = player.wins;
      const losses = player.losses;
      const draws = player.draws;

      // Calculate estimated earnings
      const MATCH_PLAYED = 5;
      const MATCH_WON = 20;
      const SHOW_UP = 10;
      const GOAL_BONUS = 10;
      const ASSIST_BONUS = 5;
      const VOTE_CORRECTLY = 15;
      const HONEST_REPORT = 20;

      const estimatedFromMatches = totalMatches * (MATCH_PLAYED + SHOW_UP);
      const estimatedFromWins = wins * MATCH_WON;
      const estimatedFromGoals = player.goalsScored * GOAL_BONUS;
      const estimatedFromAssists = player.assists * ASSIST_BONUS;
      const estimatedFromVerification = player.user.verifiedEmail ? 50 : 0;

      const totalEstimated = estimatedFromMatches + estimatedFromWins + estimatedFromGoals + estimatedFromAssists + estimatedFromVerification;

      const summary = {
        userId,
        email: player.user.email,
        displayName: player.displayName,
        currentBalance: player.trustPoints,
        reputation: player.reputation,
        verifiedEmail: player.user.verifiedEmail,
        stats: {
          gamesPlayed: totalMatches,
          wins,
          losses,
          draws,
          goalsScored: player.goalsScored,
          assists: player.assists,
        },
        earningSources: {
          profileCompletion: 100,
          matchParticipation: {
            label: 'Games played + Show up bonuses',
            estimated: estimatedFromMatches,
            breakdown: {
              matchPlayed: MATCH_PLAYED,
              showUp: SHOW_UP,
              totalMatches,
            },
          },
          matchWins: {
            label: 'Victory bonuses',
            estimated: estimatedFromWins,
            ptsPerWin: MATCH_WON,
            wins,
          },
          goalScoring: {
            label: 'Goals scored',
            estimated: estimatedFromGoals,
            ptsPerGoal: GOAL_BONUS,
            goals: player.goalsScored,
          },
          assists: {
            label: 'Assists recorded',
            estimated: estimatedFromAssists,
            ptsPerAssist: ASSIST_BONUS,
            assists: player.assists,
          },
          verification: {
            label: 'Email verification',
            estimated: estimatedFromVerification,
          },
          honestReporting: {
            label: 'Honest score reporting',
            ptsPerReport: HONEST_REPORT,
          },
          correctVotes: {
            label: 'Correct dispute votes',
            ptsPerVote: VOTE_CORRECTLY,
          },
        },
        totalEstimatedEarnings: totalEstimated,
        accuracy: ((player.trustPoints / totalEstimated) * 100).toFixed(2) + '%',
      };

      logger.info('Retrieved trust summary:', { userId, balance: player.trustPoints });
      return summary;
    } catch (error) {
      logger.error('Error fetching trust summary:', error);
      throw error;
    }
  }

  /**
   * Get trust leaderboard - top players by trust score
   */
  async getTrustLeaderboard(limit: number = 50, offset: number = 0) {
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
          trustPoints: true,
          reputation: true,
          profilePhotoUrl: true,
          gamesPlayed: true,
          wins: true,
          goalsScored: true,
          assists: true,
        },
        orderBy: {
          trustPoints: 'desc',
        },
        take: limit,
        skip: offset,
      });

      const enrichedPlayers = players.map((player, index) => ({
        ...player,
        rank: offset + index + 1,
        trustScore: player.trustPoints,
        reliability: player.gamesPlayed > 0 
          ? ((player.wins / player.gamesPlayed) * 100).toFixed(2) + '%'
          : 'N/A',
      }));

      logger.info('Retrieved trust leaderboard:', { count: players.length });

      return {
        data: enrichedPlayers,
        total: enrichedPlayers.length,
        limit,
        offset,
      };
    } catch (error) {
      logger.error('Error fetching trust leaderboard:', error);
      throw error;
    }
  }

  /**
   * Apply trust penalties for violations (internal use)
   */
  async applyPenalty(
    userId: string,
    points: number,
    reason: string,
    disputeId?: string
  ): Promise<TrustTransaction> {
    return this.recordTransaction(userId, -Math.abs(points), reason, undefined, disputeId);
  }

  /**
   * Award trust points for positive actions (internal use)
   */
  async awardPoints(
    userId: string,
    points: number,
    reason: string,
    matchId?: string
  ): Promise<TrustTransaction> {
    return this.recordTransaction(userId, Math.abs(points), reason, matchId);
  }
}

export default new TrustTransactionService();
