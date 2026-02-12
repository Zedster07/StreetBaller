// User Controller - Request Handling & Validation Layer
import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { catchAsync } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class UserController {
  private userService = UserService;

  // Register user
  registerUser = catchAsync(async (req: Request, res: Response) => {
    const { email, firebaseUid } = req.body;

    logger.info('User registration request:', { email });

    const user = await this.userService.registerUser(email, firebaseUid);

    res.status(201).json({
      success: true,
      data: user,
    });
  });

  // Get user profile
  getUserProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'User not authenticated' },
      });
    }

    const user = await this.userService.getUserProfile(userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  });

  // Setup player profile
  setupPlayerProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'User not authenticated' },
      });
    }

    const profile = await this.userService.setupPlayerProfile(userId, req.body);

    res.status(200).json({
      success: true,
      data: profile,
    });
  });

  // Update player profile
  updatePlayerProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'User not authenticated' },
      });
    }

    const profile = await this.userService.updatePlayerProfile(userId, req.body);

    res.status(200).json({
      success: true,
      data: profile,
    });
  });
}

export default new UserController();
