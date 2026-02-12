// Match Controller - Request Handling & Validation Layer
import { Request, Response } from 'express';
import { MatchService } from '../services/match.service';
import { catchAsync } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class MatchController {
  private matchService = MatchService;

  // Create match
  createMatch = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'User not authenticated' },
      });
    }

    const { team1Id, team2Id, pitchId, matchDate, format } = req.body;

    const match = await this.matchService.createMatch(
      { team1Id, team2Id, pitchId, matchDate, format },
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

  // Submit score by referee
  submitScore = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'User not authenticated' },
      });
    }

    const { id } = req.params;
    const { team1Score, team2Score } = req.body;

    const match = await this.matchService.submitScore(id, team1Score, team2Score);

    res.status(200).json({
      success: true,
      data: match,
    });
  });

  // Approve or dispute score
  approveOrDisputeScore = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'User not authenticated' },
      });
    }

    const { id } = req.params;
    const { approved, teamId } = req.body;

    const result = await this.matchService.approveOrDisputeScore(id, teamId, approved);

    res.status(200).json({
      success: true,
      data: result,
    });
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

  // Get upcoming matches
  getUpcomingMatches = catchAsync(async (req: Request, res: Response) => {
    const matches = await this.matchService.getUpcomingMatches();

    res.status(200).json({
      success: true,
      data: matches,
    });
  });
}

export default new MatchController();
