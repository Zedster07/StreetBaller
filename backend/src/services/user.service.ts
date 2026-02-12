// User Service - Business Logic Layer
// Contains all user-related business logic

import userModel from '../models/user.model';
import { CreatePlayerProfileDto, UpdatePlayerProfileDto } from '../types/user.types';
import { logger } from '../utils/logger';

export class UserService {
  private userModel = userModel;

  // Register a new user
  async registerUser(email: string, firebaseUid: string) {
    logger.info('Registering new user:', { email });

    const user = await this.userModel.createUser(email, firebaseUid);
    return user;
  }

  // Get user profile
  async getUserProfile(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  // Create or update player profile
  async setupPlayerProfile(userId: string, data: CreatePlayerProfileDto) {
    logger.info('Setting up player profile:', { userId });

    const existingProfile = await this.userModel.getPlayerProfile(userId);

    if (existingProfile) {
      // Update if exists
      return await this.userModel.updatePlayerProfile(userId, data);
    }

    // Create new
    return await this.userModel.createPlayerProfile(userId, data);
  }

  // Update player profile
  async updatePlayerProfile(userId: string, data: UpdatePlayerProfileDto) {
    logger.info('Updating player profile:', { userId });
    return await this.userModel.updatePlayerProfile(userId, data);
  }

  // Find user by Firebase UID (for login flow)
  async findByFirebaseUid(firebaseUid: string) {
    return await this.userModel.findByFirebaseUid(firebaseUid);
  }
}

export default new UserService();
