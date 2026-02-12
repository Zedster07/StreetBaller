// Application Constants
export const MATCH_FORMATS = ['5v5', '7v7', '11v11'] as const;
export const PLAYER_POSITIONS = [
  'GK', // Goalkeeper
  'CB', // Center Back
  'LB', // Left Back
  'RB', // Right Back
  'CM', // Center Mid
  'CAM', // Central Attacking Mid
  'LW', // Left Wing
  'RW', // Right Wing
  'ST', // Striker
] as const;

export const TRUST_POINTS_CONFIG = {
  SHOW_UP: 10,
  VOTE_CORRECTLY: 15,
  HONEST_SCORE_REPORT: 20,
  DISPUTE_PENALTY: -30,
  REFEREE_PENALTY: -50,
} as const;

export const SKILL_COINS_CONFIG = {
  GOAL: 10,
  ASSIST: 5,
  MATCH_PLAYED: 5,
  MATCH_WON: 20,
} as const;

export const DISPUTE_STATUS = ['voting', 'resolved'] as const;
export const DISPUTE_RESOLUTION = ['ref-upheld', 'score-invalidated'] as const;

export const TOURNAMENT_TYPES = ['single-elimination', 'round-robin', 'league'] as const;
export const TOURNAMENT_STATUS = ['upcoming', 'in-progress', 'completed'] as const;
