// Trust Service - Manages dispute resolution and trust points
import prisma from '../config/database';
import { logger } from '../utils/logger';

export class TrustService {
  // Create a voting session for dispute resolution
  async createDisputeVote(disputeId: string, votingTeamId: string) {
    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
      include: { match: true },
    });

    if (!dispute) {
      throw new Error('Dispute not found');
    }

    // Validate voting team is one of the match teams
    const isValidVoter =
      dispute.match.team1Id === votingTeamId || dispute.match.team2Id === votingTeamId;
    if (!isValidVoter) {
      throw new Error('Team is not allowed to vote on this dispute');
    }

    // Create vote (default: supporting their own team's claim)
    return await prisma.disputeVote.create({
      data: {
        disputeId,
        votingTeamId,
        voteFor: votingTeamId, // Team votes for their own position
      },
    });
  }

  // Register a vote from a player for dispute resolution
  async playerVote(disputeId: string, playerId: string, voteForTeamId: string) {
    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
      include: { match: true },
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
        votingPlayerId: playerId,
      },
    });

    if (existingVote) {
      throw new Error('Player has already voted on this dispute');
    }

    // Record the vote
    const vote = await prisma.disputeVote.create({
      data: {
        disputeId,
        votingPlayerId: playerId,
        voteFor: voteForTeamId,
      },
    });

    logger.info('Player vote recorded:', {
      disputeId,
      playerId,
      voteFor: voteForTeamId,
    });

    // Check if dispute resolution is reached
    await this.checkDisputeResolution(disputeId);

    return vote;
  }

  // Check if dispute should be resolved based on voting
  private async checkDisputeResolution(disputeId: string) {
    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
      include: {
        match: {
          include: {
            team1: { include: { TeamMembership: true } },
            team2: { include: { TeamMembership: true } },
          },
        },
        votes: true,
      },
    });

    if (!dispute) {
      throw new Error('Dispute not found');
    }

    // Get all votes
    const votes = dispute.votes;

    // Minimum votes required (half of participating players + teams)
    const team1Size = dispute.match.team1?.TeamMembership.length || 0;
    const team2Size = dispute.match.team2?.TeamMembership.length || 0;
    const totalParticipants = team1Size + team2Size;
    const requiredVotes = Math.ceil(totalParticipants / 2);

    // Count votes for each team
    const votesFor = {
      [dispute.match.team1Id]: 0,
      [dispute.match.team2Id]: 0,
    };

    for (const vote of votes) {
      if (vote.voteFor === dispute.match.team1Id) {
        votesFor[dispute.match.team1Id]++;
      } else if (vote.voteFor === dispute.match.team2Id) {
        votesFor[dispute.match.team2Id]++;
      }
    }

    // Resolve if majority votes reached
    if (votes.length >= requiredVotes) {
      const winningTeamId =
        votesFor[dispute.match.team1Id] > votesFor[dispute.match.team2Id]
          ? dispute.match.team1Id
          : dispute.match.team2Id;

      await this.resolveDispute(disputeId, winningTeamId);
    }
  }

  // Resolve dispute and adjust match result if needed
  private async resolveDispute(disputeId: string, winningSideTeamId: string) {
    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
      include: { match: true },
    });

    if (!dispute) {
      throw new Error('Dispute not found');
    }

    const resolved = await prisma.dispute.update({
      where: { id: disputeId },
      data: {
        status: 'resolved',
        resolutionTeamId: winningSideTeamId,
        resolvedAt: new Date(),
      },
    });

    logger.info('Dispute resolved:', {
      disputeId,
      winningSide: winningSideTeamId,
    });

    // If disputed team's side wins, revert match to pending scores
    if (winningSideTeamId === dispute.disputingTeamId) {
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
    const losingTeamId =
      winningSideTeamId === dispute.disputingTeamId
        ? dispute.defendingTeamId
        : dispute.disputingTeamId;

    // Award trust to winning side
    await prisma.trustTransaction.create({
      data: {
        teamId: winningSideTeamId,
        amount: 5, // Trust points gained for being honest/correct
        reason: 'Dispute resolution won',
        matchId: dispute.matchId,
      },
    });

    // Deduct trust from losing side (if they disputed falsely)
    if (losingTeamId === dispute.disputingTeamId) {
      await prisma.trustTransaction.create({
        data: {
          teamId: losingTeamId,
          amount: -3, // Penalty for false dispute
          reason: 'False dispute claim',
          matchId: dispute.matchId,
        },
      });
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
      include: {
        match: {
          include: {
            team1: true,
            team2: true,
          },
        },
        votes: {
          include: {
            votingTeam: true,
            votingPlayer: {
              include: { playerProfile: true },
            },
          },
        },
      },
    });

    if (!dispute) {
      throw new Error('Dispute not found');
    }

    return dispute;
  }

  // Get all open disputes
  async getOpenDisputes() {
    return await prisma.dispute.findMany({
      where: { status: 'open' },
      include: {
        match: {
          include: {
            team1: true,
            team2: true,
          },
        },
      },
    });
  }
}

export default new TrustService();
