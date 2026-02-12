# StreetBaller — Brainstorming

**Scratchpad for ideas, features, and chaotic thoughts before we structure them.**

## 💡 The Big Idea
- **What**: A mobile-first platform that gamifies street/pickup football. Players build a career profile with real stats, join/create teams, schedule matches, and have community refs validate results.
- **Why**: Millions of street footballers play regularly but have zero digital identity, stats, or organized infrastructure. Existing apps handle booking — none handle the *career/gamification* layer.
- **Who**: Pickup/street football players (ages 16-35), amateur league organizers, football-passionate communities in urban areas.

## 🧠 Feature Dump

### Core (MVP)
- [x] User registration & profile (name, age, height, weight, preferred position, dominant foot, photo)
- [x] Account Verification (Email/Mobile) to prevent botting
- [x] Player stats dashboard (games played, goals, assists, wins, losses, rating)
- [x] Create a team (name, logo, colors, roster)
- [x] Join a team (request to join, captain approves) — one team at a time
- [x] Match Lobby: Captains mark players "Present" (Manual or Auto-GPS)
- [x] Free Agent / Guesting: Play for other teams; no stat points, only team ratings (1-10)
- [x] Pitch Directory: Admin-verified locations only (no home grounds)
- [x] Leave a team
- [x] Team schedule (set recurring play times, location)
- [x] Challenge another team to a match (date, time, location, format: 5v5, 7v7, 11v11)
- [x] Match acceptance flow (captain of challenged team accepts/rejects)
- [x] Referee application per match (any user can apply)
- [x] Referee approval (both team captains must approve the ref)
- [x] Post-match: Ref submits final score + goal scorers
- [x] Trust Layer: Captains approve score. If dispute -> Player Vote -> Penalty/Reward Trust Points
- [x] Referee Trust/Reputation leaderboard & ranked system
- [ ] Player rating / XP system based on match results

### Phase 2
- [ ] Tournament creation & bracket management
- [ ] Leaderboards (city-wide, country-wide)
- [ ] Elo-style skill rating
- [ ] MVP voting after each match
- [ ] Player achievements / badges
- [ ] Social feed (match results, highlights, team news)
- [ ] Team stats & history

### Phase 3 (Monetization & Growth)
- [ ] Premium team pages / branding
- [ ] Tournament entry fees (platform takes a cut)
- [ ] Sponsored leagues / challenges
- [ ] Highlight video uploads
- [ ] Scout / talent discovery feed

## ❓ Open Questions
- **Minimum players per team**: Flexible based on match format (5v5, 7v7, etc.)
- **Dispute handling**: Solved via Social Consensus (Player Vote) + Trust Points.
- **Support multiple sports**: Stick to Football (Soccer) first.
- **Location services**: Google Maps integration for pitch locations.
- **Communication**: Notifications for MVP; Real-time chat potentially Phase 2.
- **Account integrity**: Solved via Email/Mobile verification.
- **Platforms**: Both Mobile (Flutter) and Web (React).

## 🗺 Rough Roadmap / Phasing
- **Phase 1 (MVP)**: Profile → Team → Match Scheduling → Score Reporting (Trust System) → Stats
- **Phase 2**: Tournaments, Leaderboards, Achievements, Social Feed, Real-time Chat
- **Phase 3**: Monetization, Premium Features, Scouting, Video Highlights

## 🏗 System Deep Dives

### 🛡 The Trust & Anti-Inflation System
To prevent stat/attribute inflation:
1. **Weighted Endorsements**: A player's rating or endorsement of another player is weighted by *their own* trust score. If a low-trust player rates someone 10/10, it has 10% impact. If a high-trust player does it, it has 100% impact.
2. **One-Time Endorsements**: You can only endorse a specific player for a specific trait *once every X matches* worked together. No "daily boosting" with friends.
3. **Mutual Verification**: For a match to be "Official" (counting for stat points), at least 80% of the roster on both sides must be "Present" in the lobby.

### 🏆 Points & Rewards (Refined)
- **Skill Coins (SC)**: Gained by playing games and scoring goals/assists. Used for cosmetics and profile upgrades.
- **Trust Points (TP)**: Gained by showing up to games, voting honestly in disputes, and providing accurate post-match stats. High TP is required for "Captain" and "Referee" status.
- **Reputation (REP)**: Gained by diversity of play — playing with/against different teams and players. Prevents "stat padding" with just one group of friends.
- **Tournament Points (TRP)**: Gained by winning matches specifically in Tournaments, Leagues, and Cups. Used for high-level rankings and specialized rewards.
- **Trophies**: Digital badges for major milestones (e.g., "100 Career Goals", "Tournament Winner").
