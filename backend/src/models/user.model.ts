// User Model - Data Access Layer
import prisma from '../config/database';
import { CreatePlayerProfileDto, UpdatePlayerProfileDto } from '../types/user.types';

export class UserModel {
  // Create user
  async createUser(email: string, firebaseUid: string) {
    return await prisma.user.create({
      data: {
        email,
        firebaseUid,
        authProvider: 'firebase',
      },
    });
  }

  // Find user by ID
  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      include: { playerProfile: true },
    });
  }

  // Find user by Firebase UID
  async findByFirebaseUid(firebaseUid: string) {
    return await prisma.user.findUnique({
      where: { firebaseUid },
      include: { playerProfile: true },
    });
  }

  // Create player profile
  async createPlayerProfile(userId: string, data: CreatePlayerProfileDto) {
    return await prisma.playerProfile.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  // Update player profile
  async updatePlayerProfile(userId: string, data: UpdatePlayerProfileDto) {
    return await prisma.playerProfile.update({
      where: { userId },
      data,
    });
  }

  // Get player profile
  async getPlayerProfile(userId: string) {
    return await prisma.playerProfile.findUnique({
      where: { userId },
    });
  }
}

export default new UserModel();
