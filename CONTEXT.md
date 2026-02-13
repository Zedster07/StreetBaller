# StreetBaller — Project Context

**This file contains context specific to the StreetBaller project.**

## Project Status
🟠 **On Hold** (paused 2026-02-13)

✅ **Backend API Complete** — Express server running on localhost:3000, 35 API endpoints documented and tested, PostgreSQL synced, Firebase Admin SDK integrated, Jest test suite (31 tests ✅), Docker containerization ready.

🟡 **Frontend In Progress** — React + Vite + TypeScript + Tailwind CSS web app. Core layout and HomeScreen complete with modern 2026 design (dark glassmorphism, bento grid, SVG icons, warm charcoal palette).

**Frontend Done**:
- ✅ Design token system (tokens.ts → globals.css → tailwind.config.ts)
- ✅ Layout: MainLayout, Sidebar, Header, BottomNav
- ✅ UI Components: GlassCard, ModernButton, Badge, Icon (SVG icon system)
- ✅ HomeScreen: Bento grid, hero card, win rate ring, stats, matches, teams, quick actions, achievements
- ✅ Color palette: Warm dark (#100E0C) + refined emerald gradients + ambient glow

**Frontend Remaining**:
- Pages: Matches, Rankings, Teams, Profile, Awards
- API integration (TanStack Query)
- Auth flow (Firebase + React)
- Mobile responsive polish

**Dev Server**: `cd frontend && npm run dev` → localhost:5173 (or 5174)

**Recent Completions**:
- ✅ Leaderboards & Rankings (8 endpoints)
- ✅ Trust Transactions & Reputation (4 endpoints)  
- ✅ Match Event Tracking (4 endpoints)
- ✅ Jest Test Suite (31 passing tests)
- ✅ Docker Containerization (Dockerfile, docker-compose, entrypoint scripts)
- ✅ Swagger/OpenAPI Documentation at `/api-docs`

**GitHub**: 15 commits (latest: 6ba7a2d - Docker containerization)

**Stats**:
- Endpoints: 35 (27 core + 4 trust + 4 match events)
- Database Tables: 15 (fully Prisma synced)
- Test Coverage: 31 tests (all passing)
- Docker Image: Built successfully (500MB optimized)
- TypeScript Build: 0 errors

## Tech Stack
_Updated based on brainstorming:_

- **Mobile**: Flutter (Dart) — primary client for players
- **Web**: React.js (TypeScript) — for team management & public leaderboards
- **Backend**: Node.js (Express.js) — shared REST API
- **Database**: PostgreSQL (Prisma or TypeORM)
- **Auth**: Firebase Auth (supports Email & Mobile verification)
- **Maps/Location**: Google Maps API
- **Push Notifications**: Firebase Cloud Messaging
- **Storage**: Firebase Storage (team logos, profile photos)
- **Styling**: Tailwind CSS (Web) / Material Design (Mobile)

## Key Entities (Draft)
- **User/Player**: Profile, stats, match history
- **Team**: Roster, schedule, match history
- **Match**: Two teams, date/time, location, format, referee, result
- **Referee Assignment**: User applies, both captains approve
- **Match Result**: Score, goal scorers, confirmed by captains

## Architecture Decisions
_None finalized yet — to be discussed in brainstorming._

## Overrides from Global Standards
_None yet — follows `operating_system/CODING_STANDARDS.md` by default._
