# StreetBaller — Database Schema

**Core data model for the platform.**

## 🗂 Entity Relationship Diagram (ERD)

```
Users (1) ──── (M) PlayerProfiles
  |
  +──── (M) TeamMemberships ──── (1) Teams
  |
  +──── (M) Matches (as Referee)
  |
  +──── (M) MatchParticipations
  |
  +──── (M) MatchEvents
  |
  +──── (M) TrustTransactions
  |
  +──── (M) DisputeVotes
  |
  +──── (M) Endorsements

Teams (1) ──── (M) TeamMemberships
  |
  +──── (M) Matches (as Team1)
  +──── (M) Matches (as Team2)
  +──── (M) Challenges

Matches (1) ──── (M) MatchParticipations
  |
  +──── (M) MatchEvents
  |
  +──── (1) Dispute (optional)

Disputes (1) ──── (M) DisputeVotes

MatchParticipations (1) ──── (M) MatchEvents

Pitches (1) ──── (M) Matches

Tournaments (1) ──── (M) TournamentMatches
  |
  +──── (M) TournamentTeams

```

---

## 📋 Core Tables

### 1. `users`
Stores authentication and core user data.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20),
  auth_provider VARCHAR(50) DEFAULT 'firebase', -- 'firebase', 'custom'
  firebase_uid VARCHAR(255) UNIQUE,
  verified_email BOOLEAN DEFAULT false,
  verified_phone BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. `player_profiles`
Extended player information (position, physical attributes, etc.).

```sql
CREATE TABLE player_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  display_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  height_cm INT,
  weight_kg INT,
  preferred_position VARCHAR(50), -- 'GK', 'CB', 'LB', 'RB', 'CM', 'CAM', 'ST', 'LW', 'RW'
  dominant_foot VARCHAR(10), -- 'Left', 'Right', 'Both'
  profile_photo_url TEXT,
  bio TEXT,
  
  -- Accumulated Stats
  games_played INT DEFAULT 0,
  goals_scored INT DEFAULT 0,
  assists MEDIUMINT DEFAULT 0,
  wins INT DEFAULT 0,
  losses INT DEFAULT 0,
  draws INT DEFAULT 0,
  
  -- Currency/Reputation
  skill_coins INT DEFAULT 0,
  trust_points INT DEFAULT 0,
  reputation INT DEFAULT 0,
  tournament_points INT DEFAULT 0,
  
  -- Ratings
  overall_rating FLOAT DEFAULT 0.0, -- Derived from trust + skill + games
  skill_rating FLOAT DEFAULT 1200.0, -- Elo-style rating
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3. `teams`
Team information.

```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  logo_url TEXT,
  primary_color VARCHAR(7), -- Hex color
  secondary_color VARCHAR(7),
  formation VARCHAR(20), -- e.g., '4-3-3'
  
  -- Stats
  games_played INT DEFAULT 0,
  wins INT DEFAULT 0,
  losses INT DEFAULT 0,
  draws INT DEFAULT 0,
  goals_for INT DEFAULT 0,
  goals_against INT DEFAULT 0,
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4. `team_memberships`
Links players to teams.

```sql
CREATE TABLE team_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'player', -- 'captain', 'player'
  jersey_number INT,
  joined_at TIMESTAMP DEFAULT NOW(),
  left_at TIMESTAMP, -- NULL if still active
  
  UNIQUE(team_id, user_id) -- One active membership per user per team
);
```

### 5. `pitches`
Admin-verified football pitch locations.

```sql
CREATE TABLE pitches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100),
  latitude FLOAT,
  longitude FLOAT,
  pitch_type VARCHAR(50), -- 'Cage', 'Open Field', 'Indoor', 'Turf'
  surface_type VARCHAR(50), -- 'Grass', 'Artificial', 'Concrete'
  capacity INT, -- Max players
  amenities TEXT, -- JSON: ['toilets', 'parking', 'lights']
  
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id), -- Admin user
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 6. `matches`
Core match data.

```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  team_1_id UUID NOT NULL REFERENCES teams(id),
  team_2_id UUID NOT NULL REFERENCES teams(id),
  challenge_creator_id UUID REFERENCES users(id), -- User who started the challenge
  
  pitch_id UUID NOT NULL REFERENCES pitches(id),
  match_date TIMESTAMP NOT NULL,
  format VARCHAR(20) NOT NULL, -- '5v5', '7v7', '11v11'
  
  referee_id UUID REFERENCES users(id), -- Assigned referee
  
  -- Match Status Flow: Scheduled → In-Progress → Pending-Confirmation → Completed / Disputed
  status VARCHAR(50) DEFAULT 'scheduled',
  
  -- Score (Reported by Ref)
  team_1_score INT,
  team_2_score INT,
  
  -- Confirmation Status
  team_1_captain_approved BOOLEAN DEFAULT false,
  team_2_captain_approved BOOLEAN DEFAULT false,
  both_captains_approved_at TIMESTAMP,
  
  -- Dispute (if any)
  is_disputed BOOLEAN DEFAULT false,
  dispute_id UUID REFERENCES disputes(id),
  
  -- Stats
  total_goals INT DEFAULT 0,
  total_assists INT DEFAULT 0,
  
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 7. `match_participations`
Tracks who played in a match and their check-in status.

```sql
CREATE TABLE match_participations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  team_id UUID NOT NULL REFERENCES teams(id),
  
  -- Presence Tracking
  is_present BOOLEAN DEFAULT false,
  checked_in_by_captain_at TIMESTAMP, -- When captain marked them present
  gps_verified BOOLEAN DEFAULT false, -- Did GPS confirm location?
  gps_check_location POINT, -- PostgreSQL geography point
  
  -- Guesting
  is_guest BOOLEAN DEFAULT false, -- Playing as a "free agent" for this team
  guest_rating FLOAT, -- 1-10 rating by team players (for guests only)
  
  -- Match Stats
  position VARCHAR(50), -- Actual position played
  status VARCHAR(50) DEFAULT 'completed', -- 'completed', 'no-show'
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(match_id, user_id) -- One participation record per user per match
);
```

### 8. `match_events`
Goals and assists.

```sql
CREATE TABLE match_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id),
  scorer_id UUID NOT NULL REFERENCES users(id),
  assister_id UUID REFERENCES users(id), -- NULL if no assist
  
  event_type VARCHAR(50) DEFAULT 'goal', -- 'goal', 'own-goal'
  minute INT,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 9. `disputes`
Handles score disagreements.

```sql
CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL UNIQUE REFERENCES matches(id),
  
  -- Who initiated the dispute?
  disputed_by_team_id UUID NOT NULL REFERENCES teams(id),
  disputed_by_captain_id UUID NOT NULL REFERENCES users(id),
  
  reason TEXT, -- Why they're disputing
  
  -- Vote Status
  status VARCHAR(50) DEFAULT 'voting', -- 'voting', 'resolved'
  resolution VARCHAR(50), -- 'ref-upheld', 'score-invalidated'
  resolved_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 10. `dispute_votes`
Individual player votes in a dispute.

```sql
CREATE TABLE dispute_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id UUID NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
  voter_id UUID NOT NULL REFERENCES users(id),
  team_id UUID NOT NULL REFERENCES teams(id),
  
  vote VARCHAR(50) NOT NULL, -- 'ref-correct', 'ref-wrong'
  weight FLOAT DEFAULT 1.0, -- Based on voter's trust score
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(dispute_id, voter_id) -- One vote per person per dispute
);
```

### 11. `trust_transactions`
Audit log for all trust point movements.

```sql
CREATE TABLE trust_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  match_id UUID REFERENCES matches(id),
  
  -- Which currency?
  currency_type VARCHAR(50) NOT NULL, -- 'sc' (skill coins), 'tp' (trust points), 'rep' (reputation), 'trp' (tournament)
  
  -- Transaction Details
  amount INT NOT NULL, -- Can be negative
  reason VARCHAR(255), -- 'goal-scored', 'match-won', 'honest-vote', 'dispute-penalty', etc.
  
  balance_before INT,
  balance_after INT,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 12. `endorsements`
Player trait ratings from teammates.

```sql
CREATE TABLE endorsements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id),
  
  endorsed_user_id UUID NOT NULL REFERENCES users(id),
  endorser_user_id UUID NOT NULL REFERENCES users(id),
  
  trait VARCHAR(50) NOT NULL, -- 'speed', 'vision', 'strength', 'finishing', 'passing'
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 10),
  
  -- Ensure only teammates can endorse
  CHECK (endorsed_user_id != endorser_user_id),
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(match_id, endorsed_user_id, endorser_user_id, trait) -- One rating per trait per match
);
```

### 13. `tournaments`
Tournament / League / Cup structures.

```sql
CREATE TABLE tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES users(id),
  
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  tournament_type VARCHAR(50), -- 'single-elimination', 'round-robin', 'league'
  format VARCHAR(20), -- '5v5', '7v7', '11v11'
  
  start_date DATE NOT NULL,
  end_date DATE,
  
  max_teams INT,
  
  status VARCHAR(50) DEFAULT 'upcoming', -- 'upcoming', 'in-progress', 'completed'
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 14. `tournament_teams`
Teams registered for a tournament.

```sql
CREATE TABLE tournament_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id),
  
  points INT DEFAULT 0, -- League points accumulated
  goals_for INT DEFAULT 0,
  goals_against INT DEFAULT 0,
  
  UNIQUE(tournament_id, team_id)
);
```

### 15. `tournament_matches`
Individual matches within a tournament.

```sql
CREATE TABLE tournament_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  match_id UUID NOT NULL UNIQUE REFERENCES matches(id),
  
  round INT, -- Which round/week
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔑 Key Design Decisions

1. **UUID for all IDs**: Avoids sequential ID leaks and enables distributed systems later.
2. **Soft Deletes via Timestamps**: `left_at`, `updated_at` allow tracking history without data loss.
3. **Audit Trail via `trust_transactions`**: Every point movement is logged; prevents unauthorized modifications.
4. **Weight on Votes**: A low-trust player's vote counts less than a high-trust player's in disputes.
5. **Match Status Machine**: Prevents logical errors (e.g., scoring before match is in-progress).
6. **Unique Constraints**: Prevent duplicate team memberships, multiple votes, etc.

---

## 🚀 SQL Initialization Script

See `migrations/001_initial_schema.sql` for the full migration file.
