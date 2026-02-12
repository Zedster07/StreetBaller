// Match Model - Data Access Layer
import prisma from '../config/database';
import { CreateMatchDto, SubmitScoreDto } from '../types/match.types';

export class MatchModel {
  // Create match
  async createMatch(data: CreateMatchDto, challengeCreatorId?: string) {
    return await prisma.match.create({
      data: {
        ...data,
        challengeCreatorId,
        status: 'scheduled',
      },
      include: {
        team1: true,
        team2: true,
        matchParticipations: true,
      },
    });
  }

  // Find match by ID
  async findById(id: string) {
    return await prisma.match.findUnique({
      where: { id },
      include: {
        team1: true,
        team2: true,
        referee: true,
        matchParticipations: { include: { user: true } },
        matchEvents: true,
      },
    });
  }

  // Get matches by team
  async findByTeamId(teamId: string) {
    return await prisma.match.findMany({
      where: {
        OR: [{ team1Id: teamId }, { team2Id: teamId }],
      },
    });
  }

  // Get upcoming matches
  async findUpcoming() {
    return await prisma.match.findMany({
      where: {
        status: 'scheduled',
        matchDate: { gte: new Date() },
      },
    });
  }

  // Submit score
  async submitScore(matchId: string, data: SubmitScoreDto) {
    return await prisma.match.update({
      where: { id: matchId },
      data: {
        team1Score: data.team1Score,
        team2Score: data.team2Score,
        status: 'pending-confirmation',
      },
    });
  }

  // Captain approves score
  async approveScore(matchId: string, teamId: string) {
    const match = await this.findById(matchId);
    if (!match) throw new Error('Match not found');

    const isTeam1 = match.team1Id === teamId;
    const data: any = {};

    if (isTeam1) {
      data.team1CaptainApproved = true;
    } else {
      data.team2CaptainApproved = true;
    }

    // If both teams approved, mark as completed
    const updated = await prisma.match.update({
      where: { id: matchId },
      data,
    });

    if (updated.team1CaptainApproved && updated.team2CaptainApproved) {
      return await prisma.match.update({
        where: { id: matchId },
        data: { status: 'completed', bothCaptainsApprovedAt: new Date() },
      });
    }

    return updated;
  }

  // Update match status
  async updateStatus(matchId: string, status: string) {
    return await prisma.match.update({
      where: { id: matchId },
      data: { status },
    });
  }
}

export default new MatchModel();
