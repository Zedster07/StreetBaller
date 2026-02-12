-- StreetBaller — Initial Database Schema
-- Migration: 001_initial_schema.sql
-- Description: Core tables for user profiles, teams, matches, trust system, and tournaments.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. USERS & PROFILES
-- ============================================================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20),
  auth_provider VARCHAR(50) DEFAULT 'firebase', -- 'firebase', 'custom'
  firebase_uid VARCHAR(255) UNIQUE,
  verified_email BOOLEAN DEFAULT false,
  verified_phone BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE player_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  display_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  height_cm INT,
  weight_kg INT,
  preferred_position VARCHAR(50),
  dominant_foot VARCHAR(10),
  profile_photo_url TEXT,
  bio TEXT,
  
  -- Accumulated Stats
  games_played INT DEFAULT 0,
  goals_scored INT DEFAULT 0,
  assists INT DEFAULT 0,
  wins INT DEFAULT 0,
  losses INT DEFAULT 0,
  draws INT DEFAULT 0,
  
  -- Currency/Reputation
  skill_coins INT DEFAULT 0,
  trust_points INT DEFAULT 0,
  reputation INT DEFAULT 0,
  tournament_points INT DEFAULT 0,
  
  -- Ratings
  overall_rating FLOAT DEFAULT 0.0,
  skill_rating FLOAT DEFAULT 1200.0, -- Elo-style
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. TEAMS & MEMBERSHIPS
-- ============================================================================

CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  logo_url TEXT,
  primary_color VARCHAR(7),
  secondary_color VARCHAR(7),
  formation VARCHAR(20),
  
  -- Stats
  games_played INT DEFAULT 0,
  wins INT DEFAULT 0,
  losses INT DEFAULT 0,
  draws INT DEFAULT 0,
  goals_for INT DEFAULT 0,
  goals_against INT DEFAULT 0,
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE team_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'player', -- 'captain', 'player'
  jersey_number INT,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  left_at TIMESTAMP, -- NULL if still active
  
  UNIQUE(team_id, user_id)
);

-- ============================================================================
-- 3. PITCHES
-- ============================================================================

CREATE TABLE pitches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100),
  latitude FLOAT,
  longitude FLOAT,
  pitch_type VARCHAR(50),
  surface_type VARCHAR(50),
  capacity INT,
  amenities TEXT, -- JSON array
  
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 4. MATCHES & MATCH EVENTS
-- ============================================================================

CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  team_1_id UUID NOT NULL REFERENCES teams(id),
  team_2_id UUID NOT NULL REFERENCES teams(id),
  challenge_creator_id UUID REFERENCES users(id),
  
  pitch_id UUID NOT NULL REFERENCES pitches(id),
  match_date TIMESTAMP NOT NULL,
  format VARCHAR(20) NOT NULL, -- '5v5', '7v7', '11v11'
  
  referee_id UUID REFERENCES users(id),
  
  status VARCHAR(50) DEFAULT 'scheduled',
  
  -- Score
  team_1_score INT,
  team_2_score INT,
  
  -- Confirmation
  team_1_captain_approved BOOLEAN DEFAULT false,
  team_2_captain_approved BOOLEAN DEFAULT false,
  both_captains_approved_at TIMESTAMP,
  
  -- Dispute
  is_disputed BOOLEAN DEFAULT false,
  dispute_id UUID,
  
  total_goals INT DEFAULT 0,
  total_assists INT DEFAULT 0,
  
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CHECK (team_1_id != team_2_id)
);

CREATE TABLE match_participations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  team_id UUID NOT NULL REFERENCES teams(id),
  
  -- Presence Tracking
  is_present BOOLEAN DEFAULT false,
  checked_in_by_captain_at TIMESTAMP,
  gps_verified BOOLEAN DEFAULT false,
  
  -- Guesting
  is_guest BOOLEAN DEFAULT false,
  guest_rating FLOAT,
  
  position VARCHAR(50),
  status VARCHAR(50) DEFAULT 'completed',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(match_id, user_id)
);

CREATE TABLE match_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id),
  scorer_id UUID NOT NULL REFERENCES users(id),
  assister_id UUID REFERENCES users(id),
  
  event_type VARCHAR(50) DEFAULT 'goal',
  minute INT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 5. DISPUTES & VOTING
-- ============================================================================

CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL UNIQUE REFERENCES matches(id),
  
  disputed_by_team_id UUID NOT NULL REFERENCES teams(id),
  disputed_by_captain_id UUID NOT NULL REFERENCES users(id),
  
  reason TEXT,
  
  status VARCHAR(50) DEFAULT 'voting',
  resolution VARCHAR(50),
  resolved_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dispute_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id UUID NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
  voter_id UUID NOT NULL REFERENCES users(id),
  team_id UUID NOT NULL REFERENCES teams(id),
  
  vote VARCHAR(50) NOT NULL,
  weight FLOAT DEFAULT 1.0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(dispute_id, voter_id)
);

-- ============================================================================
-- 6. TRUST SYSTEM & TRANSACTIONS
-- ============================================================================

CREATE TABLE trust_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  match_id UUID REFERENCES matches(id),
  
  currency_type VARCHAR(50) NOT NULL, -- 'sc', 'tp', 'rep', 'trp'
  
  amount INT NOT NULL,
  reason VARCHAR(255),
  
  balance_before INT,
  balance_after INT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 7. ENDORSEMENTS & TRAITS
-- ============================================================================

CREATE TABLE endorsements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id),
  
  endorsed_user_id UUID NOT NULL REFERENCES users(id),
  endorser_user_id UUID NOT NULL REFERENCES users(id),
  
  trait VARCHAR(50) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 10),
  
  CHECK (endorsed_user_id != endorser_user_id),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(match_id, endorsed_user_id, endorser_user_id, trait)
);

-- ============================================================================
-- 8. TOURNAMENTS
-- ============================================================================

CREATE TABLE tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES users(id),
  
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  tournament_type VARCHAR(50),
  format VARCHAR(20),
  
  start_date DATE NOT NULL,
  end_date DATE,
  
  max_teams INT,
  
  status VARCHAR(50) DEFAULT 'upcoming',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tournament_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id),
  
  points INT DEFAULT 0,
  goals_for INT DEFAULT 0,
  goals_against INT DEFAULT 0,
  
  UNIQUE(tournament_id, team_id)
);

CREATE TABLE tournament_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  match_id UUID NOT NULL UNIQUE REFERENCES matches(id),
  
  round INT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 9. INDEXES (Performance)
-- ============================================================================

-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);

-- Team lookups
CREATE INDEX idx_teams_created_by ON teams(created_by);
CREATE INDEX idx_teams_active ON teams(is_active);

-- Team membership
CREATE INDEX idx_team_memberships_user_id ON team_memberships(user_id);
CREATE INDEX idx_team_memberships_team_id ON team_memberships(team_id);
CREATE INDEX idx_team_memberships_left_at ON team_memberships(left_at);

-- Match lookups
CREATE INDEX idx_matches_team_1_id ON matches(team_1_id);
CREATE INDEX idx_matches_team_2_id ON matches(team_2_id);
CREATE INDEX idx_matches_referee_id ON matches(referee_id);
CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_matches_status ON matches(status);

-- Match participation
CREATE INDEX idx_match_participations_user_id ON match_participations(user_id);
CREATE INDEX idx_match_participations_match_id ON match_participations(match_id);
CREATE INDEX idx_match_participations_is_present ON match_participations(is_present);

-- Match events
CREATE INDEX idx_match_events_match_id ON match_events(match_id);
CREATE INDEX idx_match_events_scorer_id ON match_events(scorer_id);

-- Trust transactions
CREATE INDEX idx_trust_transactions_user_id ON trust_transactions(user_id);
CREATE INDEX idx_trust_transactions_currency_type ON trust_transactions(currency_type);

-- Disputes
CREATE INDEX idx_disputes_match_id ON disputes(match_id);
CREATE INDEX idx_disputes_status ON disputes(status);

-- Tournament
CREATE INDEX idx_tournament_teams_tournament_id ON tournament_teams(tournament_id);
CREATE INDEX idx_tournament_matches_tournament_id ON tournament_matches(tournament_id);

-- ============================================================================
-- 10. KEY CONSTRAINTS & FOREIGN KEYS
-- ============================================================================

-- Update match dispute_id to reference disputes table
ALTER TABLE matches ADD CONSTRAINT fk_matches_dispute 
FOREIGN KEY (dispute_id) REFERENCES disputes(id) ON DELETE SET NULL;
