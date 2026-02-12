// Match Events Routes - Track detailed game events (goals, assists, cards, substitutions)
import { Router, Request, Response } from 'express';
import matchEventService from '../services/match-event.service';
import { verifyFirebaseToken } from '../middleware/auth.middleware';
import { logger } from '../utils/logger';

const router = Router();

/**
 * @swagger
 * /api/match-events/{matchId}:
 *   get:
 *     summary: Get all events for a specific match
 *     tags:
 *       - Match Events
 *     description: Returns complete event log for a match including goals, assists, cards, and substitutions
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Match ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Number of events to return (max 500)
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Pagination offset
 *     responses:
 *       200:
 *         description: Match event log
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 matchId:
 *                   type: string
 *                   format: uuid
 *                 events:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "evt_1707765600000_player"
 *                       eventType:
 *                         type: string
 *                         enum: ["goal", "assist", "yellow_card", "red_card", "substitution", "own_goal", "penalty", "penalty_saved"]
 *                       playerId:
 *                         type: string
 *                         format: uuid
 *                       playerName:
 *                         type: string
 *                         example: "Ronaldo"
 *                       teamId:
 *                         type: string
 *                         format: uuid
 *                       minute:
 *                         type: integer
 *                         example: 25
 *                       second:
 *                         type: integer
 *                         example: 30
 *                       description:
 *                         type: string
 *                         example: "Goal by Ronaldo"
 *                       relatedPlayerId:
 *                         type: string
 *                         format: uuid
 *                         nullable: true
 *                         description: For assists, who was assisted
 *                       relatedPlayerName:
 *                         type: string
 *                         nullable: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 total:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 offset:
 *                   type: integer
 *       404:
 *         description: Match not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:matchId',
  async (req: Request, res: Response) => {
    try {
      const { matchId } = req.params;
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 500);
      const offset = parseInt(req.query.offset as string) || 0;

      if (!matchId) {
        return res.status(400).json({ error: 'Match ID is required' });
      }

      const events = await matchEventService.getMatchEvents(matchId, limit, offset);
      res.status(200).json(events);
    } catch (error: any) {
      logger.error('Error fetching match events:', error);
      if (error.message.includes('not found')) {
        res.status(404).json({ error: 'Match not found' });
      } else {
        res.status(500).json({ error: 'Failed to fetch match events' });
      }
    }
  }
);

/**
 * @swagger
 * /api/match-events/{matchId}/stats:
 *   get:
 *     summary: Get aggregated event statistics for a match
 *     tags:
 *       - Match Events
 *     description: Returns summary statistics of all events in a match
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Match ID
 *     responses:
 *       200:
 *         description: Match event statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 matchId:
 *                   type: string
 *                   format: uuid
 *                 totalEvents:
 *                   type: integer
 *                 goalCount:
 *                   type: integer
 *                 assistCount:
 *                   type: integer
 *                 yellowCards:
 *                   type: integer
 *                 redCards:
 *                   type: integer
 *                 eventsByTeam:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       teamId:
 *                         type: string
 *                         format: uuid
 *                       teamName:
 *                         type: string
 *                       goals:
 *                         type: integer
 *                       assists:
 *                         type: integer
 *                       cards:
 *                         type: integer
 *       404:
 *         description: Match not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:matchId/stats',
  async (req: Request, res: Response) => {
    try {
      const { matchId } = req.params;

      if (!matchId) {
        return res.status(400).json({ error: 'Match ID is required' });
      }

      const stats = await matchEventService.getMatchEventStats(matchId);
      res.status(200).json(stats);
    } catch (error: any) {
      logger.error('Error fetching match event stats:', error);
      if (error.message.includes('not found')) {
        res.status(404).json({ error: 'Match not found' });
      } else {
        res.status(500).json({ error: 'Failed to fetch match statistics' });
      }
    }
  }
);

/**
 * @swagger
 * /api/match-events/player/{playerId}:
 *   get:
 *     summary: Get event history for a player across all matches
 *     tags:
 *       - Match Events
 *     description: Returns all recorded events (goals, assists, cards) for a player with aggregated statistics
 *     parameters:
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Player profile ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of events to return (max 500)
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Pagination offset
 *     responses:
 *       200:
 *         description: Player event history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 playerId:
 *                   type: string
 *                   format: uuid
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MatchEvent'
 *                 total:
 *                   type: integer
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalGoals:
 *                       type: integer
 *                     totalAssists:
 *                       type: integer
 *                     totalCards:
 *                       type: integer
 *       404:
 *         description: Player not found
 *       500:
 *         description: Server error
 */
router.get(
  '/player/:playerId',
  async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 500);
      const offset = parseInt(req.query.offset as string) || 0;

      if (!playerId) {
        return res.status(400).json({ error: 'Player ID is required' });
      }

      const history = await matchEventService.getPlayerEventHistory(playerId, limit, offset);
      res.status(200).json(history);
    } catch (error: any) {
      logger.error('Error fetching player event history:', error);
      if (error.message.includes('not found')) {
        res.status(404).json({ error: 'Player not found' });
      } else {
        res.status(500).json({ error: 'Failed to fetch player event history' });
      }
    }
  }
);

/**
 * @swagger
 * /api/match-events/{matchId}/player/{playerId}:
 *   get:
 *     summary: Get all events for a player in a specific match
 *     tags:
 *       - Match Events
 *     description: Returns all events involving a specific player in a match
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Match ID
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Player profile ID
 *     responses:
 *       200:
 *         description: Player events in match
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 matchId:
 *                   type: string
 *                   format: uuid
 *                 playerId:
 *                   type: string
 *                   format: uuid
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MatchEvent'
 *                 total:
 *                   type: integer
 *       404:
 *         description: Match or player not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:matchId/player/:playerId',
  async (req: Request, res: Response) => {
    try {
      const { matchId, playerId } = req.params;

      if (!matchId || !playerId) {
        return res.status(400).json({ error: 'Match ID and Player ID are required' });
      }

      const events = await matchEventService.getPlayerMatchEvents(playerId, matchId);
      res.status(200).json({
        matchId,
        playerId,
        events,
        total: events.length,
      });
    } catch (error: any) {
      logger.error('Error fetching player events in match:', error);
      if (error.message.includes('not found')) {
        res.status(404).json({ error: 'Match or player not found' });
      } else {
        res.status(500).json({ error: 'Failed to fetch player events' });
      }
    }
  }
);

export default router;
