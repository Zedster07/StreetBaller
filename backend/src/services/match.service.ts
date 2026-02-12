// Match Service - Business Logic Layer
// Contains all match-related business logic including dispute resolution

import matchModel from '../models/match.model';
import { CreateMatchDto } from '../types/match.types';
import { SKILL_COINS_CONFIG, TRUST_POINTS_CONFIG } from '../config/constants';
import { logger } from '../utils/logger';

export class MatchService {
  private matchModel = matchModel;

  // Create a new match (challenge)
  async createMatch(data: CreateMatchDto, challengeCreatorId: string) {
    logger.info('Creating new match:', { team1: data.team1Id, team2: data.team2Id });

    return await this.matchModel.createMatch(data, challengeCreatorId);
  }

  // Get match details
  async getMatchById(matchId: string) {
    const match = await this.matchModel.findById(matchId);
    if (!match) {
      throw new Error('Match not found');
    }

    return match;
  }

  // Submit score by referee
  async submitScore(matchId: string, team1Score: number, team2Score: number) {
    logger.info('Score submitted:', { matchId, team1Score, team2Score });

    return await this.matchModel.submitScore(matchId, {
      team1Score,
      team2Score,
      events: [], // Will be populated by ref
    });
  }

  // Captain approves or disputes score
  async approveOrDisputeScore(matchId: string, teamId: string, approved: boolean) {
    const match = await this.matchModel.findById(matchId);
    if (!match) {
      throw new Error('Match not found');
    }

    if (approved) {
      logger.info('Score approved:', { matchId, teamId });
      return await this.matchModel.approveScore(matchId, teamId);
    } else {
      logger.info('Score disputed:', { matchId, teamId });
      // Create a dispute record (implemented in Trust Service)
      return { disputed: true };
    }
  }

  // Get matches by team
  async getTeamMatches(teamId: string) {
    return await this.matchModel.findByTeamId(teamId);
  }

  // Get upcoming matches
  async getUpcomingMatches() {
    return await this.matchModel.findUpcoming();
  }
}

export default new MatchService();
