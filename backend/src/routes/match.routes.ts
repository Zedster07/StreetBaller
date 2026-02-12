// Match Routes
import { Router } from 'express';
import matchController from '../controllers/match.controller';
import { verifyFirebaseToken } from '../middleware/auth.middleware';

const router = Router();

/**
 * POST /api/matches
 * Create a new match
 * Headers: Authorization: Bearer <token>
 * Body: { team1Id, team2Id, pitchId, matchDate, format }
 */
router.post('/', verifyFirebaseToken, matchController.createMatch);

/**
 * GET /api/matches/:id
 * Get match details
 */
router.get('/:id', matchController.getMatch);

/**
 * POST /api/matches/:id/score
 * Submit match score (referee only)
 * Headers: Authorization: Bearer <token>
 * Body: { team1Score, team2Score }
 */
router.post('/:id/score', verifyFirebaseToken, matchController.submitScore);

/**
 * POST /api/matches/:id/decision
 * Approve or dispute match score
 * Headers: Authorization: Bearer <token>
 * Body: { approved: boolean, teamId }
 */
router.post('/:id/decision', verifyFirebaseToken, matchController.approveOrDisputeScore);

/**
 * GET /api/matches/team/:teamId
 * Get all matches for a team
 */
router.get('/team/:teamId', matchController.getTeamMatches);

/**
 * GET /api/matches/upcoming
 * Get upcoming matches (for the authenticated user's teams)
 * Headers: Authorization: Bearer <token>
 */
router.get('/upcoming', verifyFirebaseToken, matchController.getUpcomingMatches);

export default router;
