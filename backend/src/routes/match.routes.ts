// Match Routes
import { Router } from 'express';
import matchController from '../controllers/match.controller';
import { verifyFirebaseToken } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/matches:
 *   post:
 *     summary: Create a new match
 *     tags:
 *       - Matches
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - team1Id
 *               - team2Id
 *               - pitchId
 *               - matchDate
 *               - format
 *             properties:
 *               team1Id:
 *                 type: string
 *                 format: uuid
 *               team2Id:
 *                 type: string
 *                 format: uuid
 *               pitchId:
 *                 type: string
 *                 format: uuid
 *               matchDate:
 *                 type: string
 *                 format: date-time
 *               format:
 *                 type: string
 *                 enum: ["5v5", "7v7", "11v11"]
 *     responses:
 *       201:
 *         description: Match created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', verifyFirebaseToken, matchController.createMatch);

/**
 * @swagger
 * /api/matches/{id}:
 *   get:
 *     summary: Get match details with participants and events
 *     tags:
 *       - Matches
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Match details retrieved
 *       404:
 *         description: Match not found
 */
router.get('/:id', matchController.getMatch);

/**
 * @swagger
 * /api/matches/{id}/score:
 *   post:
 *     summary: Submit match final score with events
 *     tags:
 *       - Matches
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - team1Score
 *               - team2Score
 *             properties:
 *               team1Score:
 *                 type: integer
 *                 minimum: 0
 *                 example: 3
 *               team2Score:
 *                 type: integer
 *                 minimum: 0
 *                 example: 2
 *               events:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     scorerId:
 *                       type: string
 *                       format: uuid
 *                     assisterId:
 *                       type: string
 *                       format: uuid
 *                     minute:
 *                       type: integer
 *                       minimum: 0
 *                       maximum: 120
 *                     teamId:
 *                       type: string
 *                       format: uuid
 *                     eventType:
 *                       type: string
 *                       enum: ["goal", "ownGoal", "yellowCard", "redCard"]
 *     responses:
 *       200:
 *         description: Score submitted successfully
 *       400:
 *         description: Validation error
 */
router.post('/:id/score', verifyFirebaseToken, matchController.submitScore);

/**
 * @swagger
 * /api/matches/{id}/decision:
 *   post:
 *     summary: Approve or dispute match score
 *     tags:
 *       - Matches
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - approved
 *             properties:
 *               approved:
 *                 type: boolean
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Decision recorded
 */
router.post('/:id/decision', verifyFirebaseToken, matchController.approveOrDisputeScore);

/**
 * @swagger
 * /api/matches/team/{teamId}:
 *   get:
 *     summary: Get all matches for a team
 *     tags:
 *       - Matches
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of team matches
 */
router.get('/team/:teamId', matchController.getTeamMatches);

/**
 * @swagger
 * /api/matches/upcoming:
 *   get:
 *     summary: Get upcoming scheduled matches
 *     tags:
 *       - Matches
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of upcoming matches
 */
router.get('/upcoming', verifyFirebaseToken, matchController.getUpcomingMatches);

export default router;
