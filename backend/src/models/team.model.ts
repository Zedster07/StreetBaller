// Team Model - Data Access Layer
import prisma from '../config/database';

export class TeamModel {
  // Create team
  async createTeam(createdById: string, name: string, description?: string) {
    return await prisma.team.create({
      data: {
        createdById,
        name,
        description,
      },
      include: { teamMemberships: true },
    });
  }

  // Find team by ID
  async findById(id: string) {
    return await prisma.team.findUnique({
      where: { id },
      include: { teamMemberships: { include: { user: true } } },
    });
  }

  // Get all teams
  async findAll() {
    return await prisma.team.findMany({
      where: { isActive: true },
      include: { teamMemberships: true },
    });
  }

  // Add member to team
  async addMember(teamId: string, userId: string, role: string = 'player') {
    return await prisma.teamMembership.create({
      data: {
        teamId,
        userId,
        role,
      },
    });
  }

  // Remove member from team
  async removeMember(teamId: string, userId: string) {
    return await prisma.teamMembership.updateMany({
      where: { teamId, userId },
      data: { leftAt: new Date() },
    });
  }

  // Update team
  async updateTeam(id: string, data: any) {
    return await prisma.team.update({
      where: { id },
      data,
    });
  }
}

export default new TeamModel();
