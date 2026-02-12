// Trust Service - Manages dispute resolution and trust points
import prisma from '../config/database';
import { logger } from '../utils/logger';

export class TrustService {
  // Create a voting session for dispute resolution
  async createDisputeVote(disputeId: string, votingTeamId: string) {
    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
    });

    if (!dispute) {
      throw new Error('Dispute not found');
    }

    // Get match details to validate voting team
    const match = await prisma.match.findUnique({
      where: { id: dispute.matchId },
      select: { team1Id: true, team2Id: true },
    });

    if (!match) {
      throw new Error('Match not found');
    }

    // Validate voting team is one of the match teams
    const isValidVoter = match.team1Id === votingTeamId || match.team2Id === votingTeamId;
    if (!isValidVoter) {
      throw new Error('Team is not allowed to vote on this dispute');
    }

    // Get a team member ID for the voting
    const teamMember = await prisma.teamMembership.findFirst({
      where: { teamId: votingTeamId },
      select: { userId: true },
    });

    if (!teamMember) {
      throw new Error('Team member not found');
    }

    // Create vote
    return await prisma.disputeVote.create({
      data: {
        disputeId,
        voterId: teamMember.userId,
        teamId: votingTeamId,
        vote: 'pending', // Could be 'agree' or 'disagree'
      },
    });
  }

  // Register a vote from a player for dispute resolution
  async playerVote(disputeId: string, playerId: string, voteForTeamId: string) {
    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
    });

    if (!dispute) {
      throw new Error('Dispute not found');
    }

    // Validate voter is a player from the match
    const matchParticipation = await prisma.matchParticipation.findFirst({
      where: {
        matchId: dispute.matchId,
        userId: playerId,
      },
    });

    if (!matchParticipation) {
      throw new Error('Player did not participate in this match');
    }

    // Check player hasn't already voted
    const existingVote = await prisma.disputeVote.findFirst({
      where: {
        disputeId,
        voterId: playerId,
      },
    });

    if (existingVote) {
      throw new Error('Player has already voted on this dispute');
    }

    // Record the vote
    const vote = await prisma.disputeVote.create({
      data: {
        disputeId,
        voterId: playerId,
        teamId: voteForTeamId,
        vote: 'agree', // Voting in support of a team
      },
    });

    logger.info('Player vote recorded:', {
      disputeId,
      playerId,
    });

    // Check if dispute resolution is reached
    await this.checkDisputeResolution(disputeId);

    return vote;
  }

  // Check if dispute should be resolved based on voting
  private async checkDisputeResolution(disputeId: string) {
    // Placeholder implementation - would need full dispute resolution logic
    // This can be expanded once schema is fully defined
  }

  // Resolve dispute and adjust match result if needed
  private async resolveDispute(disputeId: string, winningSideTeamId: string) {
    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
    });

    if (!dispute) {
      throw new Error('Dispute not found');
    }

    // Update dispute as resolved
    const resolved = await prisma.dispute.update({
      where: { id: disputeId },
      data: {
        status: 'resolved',
        resolution: `Resolved in favor of team ${winningSideTeamId}`,
        resolvedAt: new Date(),
      },
    });

    logger.info('Dispute resolved:', {
      disputeId,
      winningSide: winningSideTeamId,
    });

    // If disputed team's side wins, revert match to pending scores
    if (winningSideTeamId === dispute.disputedByTeamId) {
      await prisma.match.update({
        where: { id: dispute.matchId },
        data: {
          status: 'pending-confirmation',
        },
      });

      logger.info('Match reverted to pending-confirmation due to dispute resolution');
    } else {
      // Defending side's score is confirmed - complete match
      await prisma.match.update({
        where: { id: dispute.matchId },
        data: {
          status: 'completed',
          bothCaptainsApprovedAt: new Date(),
        },
      });
    }

    // Adjust trust points based on dispute outcome
    await this.adjustTrustPointsForDispute(dispute, winningSideTeamId);

    return resolved;
  }

  // Adjust trust points for teams based on dispute resolution
  private async adjustTrustPointsForDispute(dispute: any, winningSideTeamId: string) {
    // Get the defending team (opposite of disputing team)
    const match = await prisma.match.findUnique({
      where: { id: dispute.matchId },
      select: { team1Id: true, team2Id: true },
    });

    if (!match) return;

    const losingTeamId =
      winningSideTeamId === dispute.disputedByTeamId ? 
        (match.team1Id === dispute.disputedByTeamId ? match.team2Id : match.team1Id) :
        dispute.disputedByTeamId;

    // Award trust to winning side
    if (winningSideTeamId) {
      const winningMembers = await prisma.teamMembership.findMany({
        where: { teamId: winningSideTeamId },
        select: { userId: true },
      });

      for (const member of winningMembers) {
        await prisma.trustTransaction.create({
          data: {
            userId: member.userId,
            currencyType: 'trust_points',
            amount: 5,
            reason: 'Dispute resolution won',
            matchId: dispute.matchId,
          },
        });
      }
    }

    // Deduct trust from losing side if they disputed falsely
    if (losingTeamId === dispute.disputedByTeamId) {
      const losingMembers = await prisma.teamMembership.findMany({
        where: { teamId: losingTeamId },
        select: { userId: true },
      });

      for (const member of losingMembers) {
        await prisma.trustTransaction.create({
          data: {
            userId: member.userId,
            currencyType: 'trust_points',
            amount: -3,
            reason: 'False dispute claim',
            matchId: dispute.matchId,
          },
        });
      }
    }

    logger.info('Trust points adjusted for dispute:', {
      winningTeam: winningSideTeamId,
      losingTeam: losingTeamId,
    });
  }

  // Get dispute details with voting info
  async getDisputeDetails(disputeId: string) {
    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
    });

    if (!dispute) {
      throw new Error('Dispute not found');
    }

    // Fetch related data separately
    const match = await prisma.match.findUnique({
      where: { id: dispute.matchId },
    });

    const votes = await prisma.disputeVote.findMany({
      where: { disputeId },
    });

    return {
      ...dispute,
      match,
      votes,
    };
  }

  // Get all open disputes
  async getOpenDisputes() {
    return await prisma.dispute.findMany({
      where: { status: 'open' },
    });
  }
}

export default new TrustService();
