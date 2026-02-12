# StreetBaller — Project Context

**This file contains context specific to the StreetBaller project.**

## Project Status
🟡 **Planning / Brainstorming** — No code written yet.

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
