// Backend API Project Structure
//
// StreetBaller Backend follows a **Layered Architecture** pattern:
//
// HTTP Request Flow:
// Route → Controller (validation) → Service (business logic) → Model/Repository (data access) → Database
//
// This separation of concerns ensures:
// - Easy to test
// - Easy to maintain
// - Clear responsibilities
// - Scalable development

export const ARCHITECTURE = `
/backend
├── src/
│   ├── index.ts                    # Entry point
│   ├── routes/                     # API routes (HTTP endpoints)
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── team.routes.ts
│   │   ├── match.routes.ts
│   │   └── tournament.routes.ts
│   │
│   ├── controllers/                # Request handling & validation (includes error handling)
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── team.controller.ts
│   │   ├── match.controller.ts
│   │   └── tournament.controller.ts
│   │
│   ├── services/                   # Business logic (core features)
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── team.service.ts
│   │   ├── match.service.ts
│   │   ├── trust.service.ts        # Trust points & dispute logic
│   │   ├── tournament.service.ts
│   │   └── notification.service.ts # Push notifications, emails
│   │
│   ├── models/                     # Data access (Prisma ORM)
│   │   ├── user.model.ts
│   │   ├── team.model.ts
│   │   ├── match.model.ts
│   │   ├── dispute.model.ts
│   │   └── tournament.model.ts
│   │
│   ├── middleware/                 # Middleware functions
│   │   ├── auth.middleware.ts       # Firebase token verification
│   │   ├── errorHandler.ts         # Global error handling
│   │   ├── validation.middleware.ts # Input validation (Zod)
│   │   └── logging.middleware.ts   # Request logging
│   │
│   ├── types/                      # TypeScript interfaces & types
│   │   ├── user.types.ts
│   │   ├── match.types.ts
│   │   ├── error.types.ts
│   │   └── api.types.ts
│   │
│   ├── utils/                      # Helper functions
│   │   ├── logger.ts
│   │   ├── firebase.ts
│   │   ├── validators.ts
│   │   └── helpers.ts
│   │
│   └── config/                     # Configuration files
│       ├── database.ts
│       ├── firebase.ts
│       └── constants.ts
│
├── prisma/
│   ├── schema.prisma               # Prisma ORM schema (already created)
│   ├── migrations/                 # Database migrations
│   └── seed.ts                     # Seed data for development
│
├── migrations/                     # Raw SQL migrations (backup)
│   └── 001_initial_schema.sql
│
├── tests/                          # Unit & integration tests (later phase)
│   ├── unit/
│   └── integration/
│
├── docs/                           # API documentation
│   └── openapi.yaml
│
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
`;
