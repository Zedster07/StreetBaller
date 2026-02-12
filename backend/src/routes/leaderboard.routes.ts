// Leaderboard Routes - Player and Team Rankings
import { Router, Request, Response } from 'express';
import leaderboardService from '../services/leaderboard.service';
import { logger } from '../utils/logger';

const router = Router();

/**
 * @swagger
 * /api/leaderboards:
 *   get:
 *     summary: Get global leaderboard summary
 *     tags:
 *       - Leaderboards
 *     description: Returns top 10 players and teams across all ranking categories
 *     responses:
 *       200:
 *         description: Leaderboard summary with top 10s across categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 topPlayersByRating:
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
 *                         example: "Ronaldo"
 *                       skillRating:
 *                         type: number
 *                         example: 1850.5
 *                       profilePhotoUrl:
 *                         type: string
 *                         format: uri
 *                 topPlayersByGoals:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rank:
 *                         type: integer
 *                       id:
 *                         type: string
 *                       displayName:
 *                         type: string
 *                       goalsScored:
 *                         type: integer
 *                 topPlayersByWins:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rank:
 *                         type: integer
 *                       id:
 *                         type: string
 *                       displayName:
 *                         type: string
 *                       wins:
 *                         type: integer
 *                 topTeams:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rank:
 *                         type: integer
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       wins:
 *                         type: integer
 *                       gamesPlayed:
 *                         type: integer
 *                       winRate:
 *                         type: string
 *                         example: "75.50"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const summary = await leaderboardService.getLeaderboardSummary();
    res.status(200).json(summary);
  } catch (error) {
    logger.error('Error fetching leaderboard summary:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard summary' });
  }
});

/**
 * @swagger
 * /api/leaderboards/players:
 *   get:
 *     summary: Get top players by skill rating
 *     tags:
 *       - Leaderboards
 *     description: Returns ranked list of players sorted by skill rating
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of results to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Pagination offset
 *     responses:
 *       200:
 *         description: Ranked list of top players
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
 *                         example: "Ronaldo"
 *                       profilePhotoUrl:
 *                         type: string
 *                         format: uri
 *                       skillRating:
 *                         type: number
 *                         example: 1850.5
 *                       overallRating:
 *                         type: number
 *                         example: 8.7
 *                       gamesPlayed:
 *                         type: integer
 *                         example: 45
 *                       wins:
 *                         type: integer
 *                         example: 32
 *                       losses:
 *                         type: integer
 *                         example: 10
 *                       draws:
 *                         type: integer
 *                         example: 3
 *                       winRate:
 *                         type: string
 *                         example: "71.11"
 *                       goalsScored:
 *                         type: integer
 *                         example: 67
 *                       goalsPerGame:
 *                         type: string
 *                         example: "1.49"
 *                       assists:
 *                         type: integer
 *                         example: 23
 *                       assistsPerGame:
 *                         type: string
 *                         example: "0.51"
 *                       trustPoints:
 *                         type: integer
 *                       skillCoins:
 *                         type: integer
 *                       preferredPosition:
 *                         type: string
 *                         example: "Forward"
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
router.get('/players', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 500);
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await leaderboardService.getTopPlayersByRating(limit, offset);
    res.status(200).json(result);
  } catch (error) {
    logger.error('Error fetching top players:', error);
    res.status(500).json({ error: 'Failed to fetch player leaderboard' });
  }
});

/**
 * @swagger
 * /api/leaderboards/players/goals:
 *   get:
 *     summary: Get top players by goals scored
 *     tags:
 *       - Leaderboards
 *     description: Returns ranked list of players sorted by goals scored
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Top goal scorers
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
 *                       displayName:
 *                         type: string
 *                       goalsScored:
 *                         type: integer
 *                         example: 127
 *                       gamesPlayed:
 *                         type: integer
 *                       goalsPerGame:
 *                         type: string
 *                       skillRating:
 *                         type: number
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
router.get('/players/goals', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 500);
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await leaderboardService.getTopPlayersByGoals(limit, offset);
    res.status(200).json(result);
  } catch (error) {
    logger.error('Error fetching top goal scorers:', error);
    res.status(500).json({ error: 'Failed to fetch goals leaderboard' });
  }
});

/**
 * @swagger
 * /api/leaderboards/players/assists:
 *   get:
 *     summary: Get top players by assists
 *     tags:
 *       - Leaderboards
 *     description: Returns ranked list of players sorted by assists recorded
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Top playmakers and assist leaders
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
 *                       displayName:
 *                         type: string
 *                       assists:
 *                         type: integer
 *                         example: 54
 *                       gamesPlayed:
 *                         type: integer
 *                       assistsPerGame:
 *                         type: string
 *                       skillRating:
 *                         type: number
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
router.get('/players/assists', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 500);
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await leaderboardService.getTopPlayersByAssists(limit, offset);
    res.status(200).json(result);
  } catch (error) {
    logger.error('Error fetching top assist leaders:', error);
    res.status(500).json({ error: 'Failed to fetch assists leaderboard' });
  }
});

/**
 * @swagger
 * /api/leaderboards/players/wins:
 *   get:
 *     summary: Get top players by match wins
 *     tags:
 *       - Leaderboards
 *     description: Returns ranked list of players sorted by number of match wins
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Top performers by wins
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
 *                       displayName:
 *                         type: string
 *                       wins:
 *                         type: integer
 *                         example: 89
 *                       gamesPlayed:
 *                         type: integer
 *                       winRate:
 *                         type: string
 *                       skillRating:
 *                         type: number
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
router.get('/players/wins', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 500);
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await leaderboardService.getTopPlayersByWins(limit, offset);
    res.status(200).json(result);
  } catch (error) {
    logger.error('Error fetching top players by wins:', error);
    res.status(500).json({ error: 'Failed to fetch wins leaderboard' });
  }
});

/**
 * @swagger
 * /api/leaderboards/players/{playerId}:
 *   get:
 *     summary: Get detailed player stats and rank
 *     tags:
 *       - Leaderboards
 *     description: Returns complete player statistics, achievements, and current rank
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
 *         description: Detailed player statistics and profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 userId:
 *                   type: string
 *                   format: uuid
 *                 displayName:
 *                   type: string
 *                   example: "Ronaldo"
 *                 profilePhotoUrl:
 *                   type: string
 *                   format: uri
 *                 preferredPosition:
 *                   type: string
 *                   example: "Forward"
 *                 dominantFoot:
 *                   type: string
 *                   enum: ["left", "right", "both"]
 *                 bio:
 *                   type: string
 *                 email:
 *                   type: string
 *                   format: email
 *                 verifiedEmail:
 *                   type: boolean
 *                 memberSince:
 *                   type: string
 *                   format: date-time
 *                 skillRating:
 *                   type: number
 *                   example: 1850.5
 *                 overallRating:
 *                   type: number
 *                   example: 8.7
 *                 rank:
 *                   type: integer
 *                   example: 1
 *                 gamesPlayed:
 *                   type: integer
 *                 wins:
 *                   type: integer
 *                 losses:
 *                   type: integer
 *                 draws:
 *                   type: integer
 *                 winRate:
 *                   type: string
 *                   example: "71.11"
 *                 drawRate:
 *                   type: string
 *                   example: "6.67"
 *                 goalsScored:
 *                   type: integer
 *                 assists:
 *                   type: integer
 *                 goalsPerGame:
 *                   type: string
 *                 assistsPerGame:
 *                   type: string
 *                 skillCoins:
 *                   type: integer
 *                 trustPoints:
 *                   type: integer
 *                 reputation:
 *                   type: integer
 *                 tournamentPoints:
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
router.get('/players/:playerId', async (req: Request, res: Response) => {
  try {
    const { playerId } = req.params;

    if (!playerId) {
      res.status(400).json({ error: 'Player ID is required' });
      return;
    }

    const stats = await leaderboardService.getPlayerStats(playerId);
    res.status(200).json(stats);
  } catch (error: any) {
    if (error.message === 'Player not found') {
      res.status(404).json({ error: 'Player not found' });
    } else {
      logger.error('Error fetching player stats:', error);
      res.status(500).json({ error: 'Failed to fetch player stats' });
    }
  }
});

/**
 * @swagger
 * /api/leaderboards/teams:
 *   get:
 *     summary: Get team rankings
 *     tags:
 *       - Leaderboards
 *     description: Returns ranked list of teams sorted by win rate and total games
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Team rankings with statistics
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
 *                       name:
 *                         type: string
 *                         example: "Dream Team"
 *                       logoUrl:
 *                         type: string
 *                         format: uri
 *                       primaryColor:
 *                         type: string
 *                         example: "#FF0000"
 *                       secondaryColor:
 *                         type: string
 *                         example: "#000000"
 *                       memberCount:
 *                         type: integer
 *                       gamesPlayed:
 *                         type: integer
 *                       wins:
 *                         type: integer
 *                       losses:
 *                         type: integer
 *                       draws:
 *                         type: integer
 *                       winRate:
 *                         type: string
 *                         example: "80.00"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
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
router.get('/teams', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 500);
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await leaderboardService.getTopTeamsByWinRate(limit, offset);
    res.status(200).json(result);
  } catch (error) {
    logger.error('Error fetching team rankings:', error);
    res.status(500).json({ error: 'Failed to fetch team leaderboard' });
  }
});

/**
 * @swagger
 * /api/leaderboards/teams/{teamId}:
 *   get:
 *     summary: Get detailed team stats and rank
 *     tags:
 *       - Leaderboards
 *     description: Returns complete team statistics, member breakdown, and current rank
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Team ID
 *     responses:
 *       200:
 *         description: Detailed team statistics and profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 name:
 *                   type: string
 *                   example: "Dream Team"
 *                 logoUrl:
 *                   type: string
 *                   format: uri
 *                 primaryColor:
 *                   type: string
 *                 secondaryColor:
 *                   type: string
 *                 description:
 *                   type: string
 *                 formation:
 *                   type: string
 *                   example: "4-3-3"
 *                 createdBy:
 *                   type: string
 *                   format: email
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 rank:
 *                   type: integer
 *                 members:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     list:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           userId:
 *                             type: string
 *                             format: uuid
 *                           displayName:
 *                             type: string
 *                           skillRating:
 *                             type: number
 *                           role:
 *                             type: string
 *                             enum: ["captain", "member", "reserve"]
 *                           joinedAt:
 *                             type: string
 *                             format: date-time
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
 *                     winRate:
 *                       type: string
 *                     drawRate:
 *                       type: string
 *                     totalGoalsScored:
 *                       type: integer
 *                     averageTeamRating:
 *                       type: string
 *       404:
 *         description: Team not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/teams/:teamId', async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;

    if (!teamId) {
      res.status(400).json({ error: 'Team ID is required' });
      return;
    }

    const stats = await leaderboardService.getTeamStats(teamId);
    res.status(200).json(stats);
  } catch (error: any) {
    if (error.message === 'Team not found') {
      res.status(404).json({ error: 'Team not found' });
    } else {
      logger.error('Error fetching team stats:', error);
      res.status(500).json({ error: 'Failed to fetch team stats' });
    }
  }
});

export default router;
