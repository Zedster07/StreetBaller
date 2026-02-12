# StreetBaller Project Overview

**Status**: 🔨 Backend Scaffolding Complete | Frontend TBD

## 📊 Project Progress

### ✅ Completed
1. **Brainstorming & Requirements** (Feb 12, 2026)
   - MVP scope finalized
   - Trust system & dispute resolution designed
   - Multi-currency reward system (SC, TP, REP, TRP) defined
   - Feature roadmap created (Phase 1, 2, 3)

2. **Database Design** (Feb 12, 2026)
   - Complete schema designed (15 core tables)
   - Prisma ORM schema created
   - SQL migration file ready
   - Indexes and constraints optimized

3. **Backend Scaffolding** (Feb 12, 2026)
   - Express.js project structure initialized
   - Layered architecture (Routes → Controllers → Services → Models)
   - TypeScript strict mode enabled
   - Middleware setup (Auth, Error Handling, Logging, Validation)
   - Firebase authentication integration ready
   - Docker Compose for PostgreSQL dev environment
   - Foundation for all core services created

### 🚀 Next Steps (In Priority Order)

#### Phase 1: Backend API Implementation
1. **API Endpoint Definitions**
   - REST routes for all core features
   - Request/Response schemas (Zod validation)
   - OpenAPI/Swagger documentation

2. **Core Service Implementation**
   - User Auth (Firebase + DB sync)
   - Team Management (CRUD, membership)
   - Match Scheduling & Management
   - Score Reporting & Dispute Resolution
   - Trust Points & Reputation System
   - Referee Assignment & Approval flow

3. **Database Migration & Testing**
   - Run Prisma migrations
   - Seed test data
   - Unit tests for services & models

#### Phase 2: Mobile App (Flutter)
1. Scaffold Flutter project structure
2. Implement Auth flow UI
3. Implement core screens (Profile, Teams, Matches, Leaderboards)
4. API integration

#### Phase 3: Web Dashboard (React)
1. Scaffold React project structure
2. Implement responsive UI
3. Team management dashboard
4. Leaderboards & analytics
5. API integration

### 📁 Repository Structure

```
StreetBaller/
├── backend/                    # ✅ Express API (Scaffolded)
│   ├── src/
│   │   ├── controllers/        # Request handling
│   │   ├── services/           # Business logic
│   │   ├── models/             # Data access
│   │   ├── middleware/         # Auth, error handling
│   │   ├── types/              # TypeScript interfaces
│   │   ├── config/             # Configuration
│   │   └── utils/              # Helpers
│   ├── prisma/                 # ORM schema & migrations
│   ├── migrations/             # Raw SQL migrations
│   ├── package.json
│   ├── tsconfig.json
│   ├── docker-compose.yml
│   └── README.md
│
├── mobile/                     # 🔲 Flutter App (TBD)
├── web/                        # 🔲 React Dashboard (TBD)
│
├── README.md
├── DATABASE_SCHEMA.md
├── BRAINSTORM.md
├── CONTEXT.md
└── ARCHITECTURE.md
```

### 🛠 Tech Stack Summary

| Layer | Technology | Status |
|-------|-----------|--------|
| **Backend API** | Express.js + TypeScript | ✅ Scaffolded |
| **Database** | PostgreSQL + Prisma ORM | ✅ Schema Ready |
| **Authentication** | Firebase Auth | ✅ Configured |
| **Mobile** | Flutter + Dart | ⏳ TBD |
| **Web** | React + TypeScript | ⏳ TBD |
| **Styling** | Tailwind CSS (Web), Material Design (Mobile) | ⏳ TBD |
| **Hosting** | TBD (AWS/GCP/Heroku) | ⏳ TBD |

## 🎯 Key Features (MVP)

- ✅ Designed: User profiles with stats & attributes
- ✅ Designed: Team creation & membership management
- ✅ Designed: Match scheduling between teams
- ✅ Designed: Referee assignment & dual-captain approval
- ✅ Designed: Score submission with dispute resolution
- ✅ Designed: Trust Points & Reputation system
- ✅ Designed: Multi-currency reward system
- ⏳ Implementation: All of the above

## 📝 Important Notes

### Development Setup

**Backend:**
```bash
cd backend
cp .env.example .env  # Configure with Firebase credentials
npm install
docker-compose up -d  # Start PostgreSQL
npx prisma migrate deploy
npm run dev           # Start development server
```

**Database:**
- PostgreSQL in Docker (docker-compose.yml provided)
- Prisma ORM for migrations
- See `backend/README.md` for detailed setup

### Coding Standards
- TypeScript strict mode required
- Async/await with error handling
- Input validation with Zod at controller layer
- Winston logging for all operations
- Service layer handles all business logic
- No direct database queries in controllers/routes

### Git Workflow
- All work on feature branches before production
- Commit messages should be descriptive
- Push documentation updates with code changes

## 📞 Contact & Support

_TBD — Establish team communication channels_

---

**Last Updated**: Feb 12, 2026
**Next Review**: After backend API implementation complete
