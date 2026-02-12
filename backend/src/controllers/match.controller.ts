// Match Controller - Request Handling & Validation Layer
import { Request, Response } from 'express';
import matchService from '../services/match.service';
import { catchAsync } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { z } from 'zod';

// Validation schemas
const createMatchSchema = z.object({
  team1Id: z.string().uuid(),
  team2Id: z.string().uuid(),
  pitchId: z.string().uuid(),
  matchDate: z.string().datetime(),
  format: z.enum(['5v5', '7v7', '11v11']),
});

const submitScoreSchema = z.object({
  team1Score: z.number().int().min(0),
  team2Score: z.number().int().min(0),
  events: z.array(z.object({
    scorerId: z.string().uuid(),
    assisterId: z.string().uuid().optional(),
    minute: z.number().int().min(0).max(120),
    teamId: z.string().uuid(),
    eventType: z.enum(['goal', 'ownGoal', 'yellowCard', 'redCard']).optional(),
  })).optional(),
});

const approveScoreSchema = z.object({
  approved: z.boolean(),
  reason: z.string().optional(),
});

export class MatchController {
  private matchService = matchService;

  // Create match
  createMatch = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'User not authenticated' },
      });
    }

    // Validate request body
    const validation = createMatchSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: validation.error.errors,
        },
      });
    }

    const match = await this.matchService.createMatch(
      {
        ...validation.data,
        matchDate: new Date(validation.data.matchDate),
      },
      userId
    );

    res.status(201).json({
      success: true,
      data: match,
    });
  });

  // Get match details
  getMatch = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const match = await this.matchService.getMatchById(id);

    res.status(200).json({
      success: true,
      data: match,
    });
  });

  // Submit score by referee (with complete validation)
  submitScore = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'User not authenticated' },
      });
    }

    const { id } = req.params;

    // Validate request body
    const validation = submitScoreSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid score submission',
          details: validation.error.errors,
        },
      });
    }

    const { team1Score, team2Score, events } = validation.data;
    const match = await this.matchService.submitScore(id, team1Score, team2Score, events);

    res.status(200).json({
      success: true,
      message: 'Score submitted successfully. Awaiting team captain approval.',
      data: match,
    });
  });

  // Approve or dispute score with proper validation
  approveOrDisputeScore = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'User not authenticated' },
      });
    }

    const { id } = req.params;

    // Validate request body
    const validation = approveScoreSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid decision data',
          details: validation.error.errors,
        },
      });
    }

    const { approved, reason } = validation.data;
    
    // For now, use userId as teamId (in production, fetch user's team)
    // This should be improved to get the user's actual team from the match
    const teamId = userId; // TODO: Get actual team ID from user

    const result = await this.matchService.approveOrDisputeScore(id, teamId, approved, reason);

    if (approved) {
      res.status(200).json({
        success: true,
        message: 'Score approved successfully.',
        data: result,
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Score disputed. Dispute case created for resolution.',
        data: result,
      });
    }
  });

  // Get team matches
  getTeamMatches = catchAsync(async (req: Request, res: Response) => {
    const { teamId } = req.params;

    const matches = await this.matchService.getTeamMatches(teamId);

    res.status(200).json({
      success: true,
      data: matches,
    });
  });

  // Get upcoming matches for authenticated user
  getUpcomingMatches = catchAsync(async (req: Request, res: Response) => {
    const matches = await this.matchService.getUpcomingMatches();

    res.status(200).json({
      success: true,
      data: matches,
    });
  });
}

export default new MatchController();
