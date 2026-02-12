# StreetBaller — Project Context

**This file contains context specific to the StreetBaller project.**

## Project Status
✅ **Backend Foundation Complete** — Express server running, 12 API endpoints working, PostgreSQL synced, Firebase Admin SDK integrated with real service account credentials.
- Server: Running on localhost:3000
- Database: PostgreSQL 16 (15 tables synced via Prisma)
- Auth: Firebase Admin SDK with real service account
- API Tests: All 4 route groups passing (auth, users, teams, matches)
- GitHub: 6 commits - fully tracked

**Current Phase**: Core API implementation complete, ready for advanced endpoints (match scoring, disputes, leaderboards, tournaments).

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
