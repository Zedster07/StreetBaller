// Trust Transactions Routes - Player trust point history and reputation tracking
import { Router, Request, Response } from 'express';
import trustTransactionService from '../services/trust-transaction.service';
import { verifyFirebaseToken } from '../middleware/auth.middleware';
import { logger } from '../utils/logger';

const router = Router();

/**
 * @swagger
 * /api/trust/transactions:
 *   get:
 *     summary: Get trust transaction history for authenticated player
 *     tags:
 *       - Trust & Reputation
 *     security:
 *       - bearerAuth: []
 *     description: Returns complete trust point transaction history with reasons for all rewards and penalties
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of transactions to return (max 500)
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Pagination offset
 *     responses:
 *       200:
 *         description: Player trust transaction history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   format: uuid
 *                 displayName:
 *                   type: string
 *                   example: "Ronaldo"
 *                 currentBalance:
 *                   type: integer
 *                   example: 850
 *                   description: Current trust point balance
 *                 totalTransactions:
 *                   type: integer
 *                   example: 24
 *                 transactions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "txn_1707765600000_facebook"
 *                       transactionType:
 *                         type: string
 *                         enum: ["award", "penalty", "adjustment"]
 *                         example: "award"
 *                       reason:
 *                         type: string
 *                         example: "Team victory bonus"
 *                       points:
 *                         type: integer
 *                         example: 20
 *                         description: Positive for awards, negative for penalties
 *                       balance:
 *                         type: integer
 *                         example: 850
 *                         description: Trust balance after transaction
 *                       relatedMatchId:
 *                         type: string
 *                         format: uuid
 *                         nullable: true
 *                       relatedDisputeId:
 *                         type: string
 *                         format: uuid
 *                         nullable: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-02-10T15:30:00Z"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     limit:
 *                       type: integer
 *                     offset:
 *                       type: integer
 *                     hasMore:
 *                       type: boolean
 *       401:
 *         description: Unauthorized - User not authenticated
 *       404:
 *         description: Player not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/transactions',
  verifyFirebaseToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({
          error: 'User not authenticated',
        });
      }

      const limit = Math.min(parseInt(req.query.limit as string) || 50, 500);
      const offset = parseInt(req.query.offset as string) || 0;

      const history = await trustTransactionService.getTransactionHistory(
        userId,
        limit,
        offset
      );

      res.status(200).json(history);
    } catch (error: any) {
      logger.error('Error fetching transaction history:', error);
      if (error.message.includes('not found')) {
        res.status(404).json({ error: 'Player not found' });
      } else {
        res.status(500).json({ error: 'Failed to fetch transaction history' });
      }
    }
  }
);

/**
 * @swagger
 * /api/trust/summary:
 *   get:
 *     summary: Get trust point summary and earning breakdown
 *     tags:
 *       - Trust & Reputation
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Returns complete trust score summary with breakdown of earning sources.
 *       Shows how trust points are earned from:
 *       - Profile completion
 *       - Match participation (show up, play)
 *       - Match victories
 *       - Goal scoring
 *       - Assists
 *       - Email verification
 *       - Honest score reporting
 *       - Correct dispute voting
 *     responses:
 *       200:
 *         description: Trust point summary and earning breakdown
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   format: uuid
 *                 email:
 *                   type: string
 *                   format: email
 *                 displayName:
 *                   type: string
 *                 currentBalance:
 *                   type: integer
 *                   example: 850
 *                 reputation:
 *                   type: integer
 *                   example: 92
 *                 verifiedEmail:
 *                   type: boolean
 *                 stats:
 *                   type: object
 *                   properties:
 *                     gamesPlayed:
 *                       type: integer
 *                     wins:
 *                       type: integer
 *                     losses:
 *                       type: integer
 *                     draws:
 *                       type: integer
 *                     goalsScored:
 *                       type: integer
 *                     assists:
 *                       type: integer
 *                 earningSources:
 *                   type: object
 *                   properties:
 *                     profileCompletion:
 *                       type: integer
 *                       example: 100
 *                     matchParticipation:
 *                       type: object
 *                       properties:
 *                         label:
 *                           type: string
 *                         estimated:
 *                           type: integer
 *                         breakdown:
 *                           type: object
 *                           properties:
 *                             matchPlayed:
 *                               type: integer
 *                               description: Points per match
 *                             showUp:
 *                               type: integer
 *                               description: Points for showing up
 *                             totalMatches:
 *                               type: integer
 *                     matchWins:
 *                       type: object
 *                       properties:
 *                         label:
 *                           type: string
 *                         estimated:
 *                           type: integer
 *                         ptsPerWin:
 *                           type: integer
 *                         wins:
 *                           type: integer
 *                     goalScoring:
 *                       type: object
 *                       properties:
 *                         label:
 *                           type: string
 *                         estimated:
 *                           type: integer
 *                         ptsPerGoal:
 *                           type: integer
 *                         goals:
 *                           type: integer
 *                     assists:
 *                       type: object
 *                       properties:
 *                         label:
 *                           type: string
 *                         estimated:
 *                           type: integer
 *                         ptsPerAssist:
 *                           type: integer
 *                         assists:
 *                           type: integer
 *                     verification:
 *                       type: object
 *                       properties:
 *                         label:
 *                           type: string
 *                         estimated:
 *                           type: integer
 *                 totalEstimatedEarnings:
 *                   type: integer
 *                 accuracy:
 *                   type: string
 *                   description: Percentage accuracy of trust points vs estimated earnings
 *                   example: "95.23%"
 *       401:
 *         description: Unauthorized - User not authenticated
 *       404:
 *         description: Player not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/summary',
  verifyFirebaseToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({
          error: 'User not authenticated',
        });
      }

      const summary = await trustTransactionService.getTrustSummary(userId);
      res.status(200).json(summary);
    } catch (error: any) {
      logger.error('Error fetching trust summary:', error);
      if (error.message.includes('not found')) {
        res.status(404).json({ error: 'Player not found' });
      } else {
        res.status(500).json({ error: 'Failed to fetch trust summary' });
      }
    }
  }
);

/**
 * @swagger
 * /api/trust/leaderboard:
 *   get:
 *     summary: Get trust point leaderboard
 *     tags:
 *       - Trust & Reputation
 *     description: Returns top players ranked by trust score. Only includes verified players.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of players to return (max 500)
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Pagination offset
 *     responses:
 *       200:
 *         description: Trust leaderboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rank:
 *                         type: integer
 *                         example: 1
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                       displayName:
 *                         type: string
 *                       trustScore:
 *                         type: integer
 *                         example: 1250
 *                       reputation:
 *                         type: integer
 *                       profilePhotoUrl:
 *                         type: string
 *                         format: uri
 *                       gamesPlayed:
 *                         type: integer
 *                       wins:
 *                         type: integer
 *                       goalsScored:
 *                         type: integer
 *                       assists:
 *                         type: integer
 *                       reliability:
 *                         type: string
 *                         example: "82.14%"
 *                 total:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 offset:
 *                   type: integer
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/leaderboard',
  async (req: Request, res: Response) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 500);
      const offset = parseInt(req.query.offset as string) || 0;

      const leaderboard = await trustTransactionService.getTrustLeaderboard(
        limit,
        offset
      );

      res.status(200).json(leaderboard);
    } catch (error) {
      logger.error('Error fetching trust leaderboard:', error);
      res.status(500).json({ error: 'Failed to fetch trust leaderboard' });
    }
  }
);

/**
 * @swagger
 * /api/trust/player/{playerId}:
 *   get:
 *     summary: Get specific player's trust summary (public)
 *     tags:
 *       - Trust & Reputation
 *     description: Returns public trust information about a specific player
 *     parameters:
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Player profile ID
 *     responses:
 *       200:
 *         description: Player trust summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   format: uuid
 *                 displayName:
 *                   type: string
 *                 currentBalance:
 *                   type: integer
 *                 reputation:
 *                   type: integer
 *                 verifiedEmail:
 *                   type: boolean
 *                 stats:
 *                   type: object
 *                   properties:
 *                     gamesPlayed:
 *                       type: integer
 *                     wins:
 *                       type: integer
 *                     losses:
 *                       type: integer
 *                     draws:
 *                       type: integer
 *                 totalEstimatedEarnings:
 *                   type: integer
 *       404:
 *         description: Player not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/player/:playerId',
  async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;

      if (!playerId) {
        return res.status(400).json({ error: 'Player ID is required' });
      }

      // Fetch player and convert to userId for trust summary
      const player = await require('../config/database').default.playerProfile.findUnique({
        where: { id: playerId },
        select: { userId: true, displayName: true },
      });

      if (!player) {
        return res.status(404).json({ error: 'Player not found' });
      }

      const summary = await trustTransactionService.getTrustSummary(player.userId);
      
      // Return only public information
      const publicSummary = {
        displayName: summary.displayName,
        currentBalance: summary.currentBalance,
        reputation: summary.reputation,
        verifiedEmail: summary.verifiedEmail,
        stats: summary.stats,
        totalEstimatedEarnings: summary.totalEstimatedEarnings,
      };

      res.status(200).json(publicSummary);
    } catch (error: any) {
      logger.error('Error fetching player trust info:', error);
      if (error.message.includes('not found')) {
        res.status(404).json({ error: 'Player not found' });
      } else {
        res.status(500).json({ error: 'Failed to fetch player trust info' });
      }
    }
  }
);

export default router;
