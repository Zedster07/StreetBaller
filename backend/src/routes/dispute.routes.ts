// Dispute Routes - Handle dispute resolution and voting
import { Router } from 'express';
import { verifyFirebaseToken } from '../middleware/auth.middleware';
import { z } from 'zod';
import { catchAsync } from '../middleware/errorHandler';
import trustService from '../services/trust.service';
import { logger } from '../utils/logger';

const router = Router();

// Validation schemas
const playerVoteSchema = z.object({
  playerId: z.string().uuid(),
  voteForTeamId: z.string().uuid(),
});

/**
 * GET /api/disputes/:id
 * Get dispute details with voting information
 */
router.get(
  '/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const dispute = await trustService.getDisputeDetails(id);

    res.status(200).json({
      success: true,
      data: dispute,
    });
  })
);

/**
 * GET /api/disputes
 * Get all open disputes
 */
router.get(
  '/',
  catchAsync(async (req, res) => {
    const disputes = await trustService.getOpenDisputes();

    res.status(200).json({
      success: true,
      data: disputes,
    });
  })
);

/**
 * POST /api/disputes/:id/vote
 * Register a player vote for dispute resolution
 * Headers: Authorization: Bearer <token>
 * Body: { playerId, voteForTeamId }
 */
router.post(
  '/:id/vote',
  verifyFirebaseToken,
  catchAsync(async (req, res) => {
    const { id } = req.params;

    // Validate request body
    const validation = playerVoteSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid vote data',
          details: validation.error.errors,
        },
      });
    }

    const { playerId, voteForTeamId } = validation.data;
    const vote = await trustService.playerVote(id, playerId, voteForTeamId);

    res.status(201).json({
      success: true,
      message: 'Vote recorded successfully',
      data: vote,
    });
  })
);

export default router;
