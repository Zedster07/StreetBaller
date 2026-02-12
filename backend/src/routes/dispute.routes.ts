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
 * @swagger
 * /api/disputes/{id}:
 *   get:
 *     summary: Get dispute details with voting information
 *     tags:
 *       - Disputes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Dispute details retrieved
 *       404:
 *         description: Dispute not found
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
 * @swagger
 * /api/disputes:
 *   get:
 *     summary: Get all open disputes
 *     tags:
 *       - Disputes
 *     responses:
 *       200:
 *         description: List of open disputes
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
 * @swagger
 * /api/disputes/{id}/vote:
 *   post:
 *     summary: Register a player vote for dispute resolution
 *     tags:
 *       - Disputes
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
 *               - playerId
 *               - voteForTeamId
 *             properties:
 *               playerId:
 *                 type: string
 *                 format: uuid
 *               voteForTeamId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Vote recorded successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
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
