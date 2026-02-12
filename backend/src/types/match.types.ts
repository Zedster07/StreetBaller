// Sample Match Types
export interface CreateMatchDto {
  team1Id: string;
  team2Id: string;
  pitchId: string;
  matchDate: Date;
  format: '5v5' | '7v7' | '11v11';
}

export interface MatchDto {
  id: string;
  team1Id: string;
  team2Id: string;
  pitchId: string;
  matchDate: Date;
  format: string;
  status: MatchStatus;
  team1Score?: number;
  team2Score?: number;
  refereeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type MatchStatus = 'scheduled' | 'in-progress' | 'pending-confirmation' | 'completed' | 'disputed';

export interface SubmitScoreDto {
  team1Score: number;
  team2Score: number;
  events: MatchEventDto[]; // goals and assists
}

export interface MatchEventDto {
  scorerId: string;
  assisterId?: string;
  minute: number;
  teamId: string;
}

export interface ApproveScoreDto {
  approved: boolean;
  reason?: string; // If rejecting
}
