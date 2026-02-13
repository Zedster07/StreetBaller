/**
 * TypeScript Type Definitions
 * Central location for all app types and interfaces
 */

// ============================================================================
// MATCH TYPES
// ============================================================================

export interface Match {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  team1: Team;
  team2: Team;
  score?: {
    team1: number;
    team2: number;
  };
  maxPlayers: number;
  confirmedPlayers: number;
  referee?: Player;
  tags: string[];
}

// ============================================================================
// PLAYER TYPES
// ============================================================================

export interface Player {
  id: string;
  name: string;
  avatar?: string;
  position?: string;
  trustScore: number;
  rating: number;
  stats: PlayerStats;
  teams: Team[];
  achievements: Achievement[];
  joinedAt: string;
}

export interface PlayerStats {
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  goalsScored: number;
  assistsGiven: number;
  rating: number;
}

// ============================================================================
// TEAM TYPES
// ============================================================================

export interface Team {
  id: string;
  name: string;
  logo?: string;
  captain: Player;
  members: Player[];
  wins: number;
  losses: number;
  rating: number;
  createdAt: string;
  challenges: Challenge[];
}

// ============================================================================
// ACHIEVEMENT TYPES
// ============================================================================

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  badgeColor: 'gold' | 'silver' | 'bronze' | 'purple';
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// ============================================================================
// CHALLENGE TYPES
// ============================================================================

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'match' | 'tournament' | 'custom';
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  team1: Team;
  team2: Team;
  date: string;
  reward: string;
}

// ============================================================================
// LEADERBOARD TYPES
// ============================================================================

export interface LeaderboardEntry {
  rank: number;
  player: Player;
  points: number;
  matchesPlayed: number;
  winRate: number;
  streak: number;
}

// ============================================================================
// EVENT TYPES
// ============================================================================

export interface MatchEvent {
  id: string;
  matchId: string;
  type: 'goal' | 'assist' | 'yellow_card' | 'red_card' | 'substitution' | 'foul';
  player: Player;
  team: Team;
  timestamp: number; // minutes into match
  description: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

// ============================================================================
// USER/AUTH TYPES
// ============================================================================

export interface User extends Player {
  email: string;
  phone?: string;
  bio?: string;
  location?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  notifications: boolean;
  emailUpdates: boolean;
  darkMode: boolean;
  language: string;
}

// ============================================================================
// FILTER/QUERY TYPES
// ============================================================================

export interface MatchFilters {
  status?: Match['status'];
  date?: string;
  location?: string;
  skillLevel?: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  tags?: string[];
}

export interface LeaderboardFilters {
  period?: 'week' | 'month' | 'season' | 'all_time';
  position?: string;
  minMatches?: number;
}
