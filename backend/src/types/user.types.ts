// Sample User Types
export interface CreateUserDto {
  email: string;
  phoneNumber?: string;
}

export interface CreatePlayerProfileDto {
  displayName: string;
  dateOfBirth: Date;
  heightCm?: number;
  weightKg?: number;
  preferredPosition?: string;
  dominantFoot?: string;
  profilePhotoUrl?: string;
  bio?: string;
}

export interface PlayerProfileDto extends CreatePlayerProfileDto {
  id: string;
  userId: string;
  skillCoins: number;
  trustPoints: number;
  reputation: number;
  tournamentPoints: number;
  skillRating: number;
  gamesPlayed: number;
  goalsScored: number;
  wins: number;
  losses: number;
}

export interface UpdatePlayerProfileDto {
  displayName?: string;
  heightCm?: number;
  weightKg?: number;
  preferredPosition?: string;
  profilePhotoUrl?: string;
  bio?: string;
}
