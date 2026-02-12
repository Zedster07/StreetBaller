# StreetBaller Backend API

Production-ready Express.js backend for the StreetBaller platform.

## 🏗 Architecture

**Layered Architecture:**
```
Routes → Controllers → Services → Models → Database
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed folder structure.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 16+
- Firebase Project
- Docker (optional, for PostgreSQL)

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual credentials
   ```

3. **Start PostgreSQL (with Docker):**
   ```bash
   docker-compose up -d
   ```

4. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

   Server runs on `http://localhost:3000`

## 📝 API Structure

### Core Modules
- **Auth** — User registration, login, token verification
- **Users** — Player profiles, stats, ratings
- **Teams** — Team CRUD, membership management
- **Matches** — Match scheduling, score reporting, dispute resolution
- **Tournaments** — Tournament/league management
- **Trust** — Trust points, reputation system
- **Notifications** — Push notifications, emails

## 🔑 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | API server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `DATABASE_URL` | PostgreSQL connection | `postgresql://...` |
| `FIREBASE_PROJECT_ID` | Firebase project ID | `your-project-id` |
| `FIREBASE_PRIVATE_KEY` | Firebase private key | (from JSON key file) |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email | (from JSON key file) |
| `JWT_SECRET` | JWT signing secret | (generate a random key) |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:3000` |

## 📚 Database

- **ORM**: Prisma
- **Database**: PostgreSQL
- **Migrations**: Located in `prisma/migrations/`

### Common Commands
```bash
npm run migrate        # Create a new migration
npm run migrate:up     # Run all pending migrations
npm run db:seed        # Seed with test data
npm run db:reset       # Reset database (dev only)
```

## 🧪 Testing (Coming Soon)

```bash
npm test              # Run all tests
npm run test:watch    # Run in watch mode
```

## 📋 To-Do (MVP Implementation)

- [ ] User Auth & Registration
- [ ] Team Management
- [ ] Match Scheduling
- [ ] Score Reporting & Dispute Resolution
- [ ] Trust System
- [ ] Leaderboards & Rankings
- [ ] Push Notifications
- [ ] API Documentation (Swagger)

## 📖 API Documentation

_To be generated with Swagger/OpenAPI_

## 🛠 Development

### Code Style
- TypeScript strict mode
- ESLint for linting
- Prettier for formatting

```bash
npm run lint
npm run format
```

### Logging
Uses Winston for structured logging. Check `logs/` directory for output.

## 📦 Deployment

_TBD — Docker & cloud deployment strategy_

## 📄 License

MIT
