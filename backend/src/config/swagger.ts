// Swagger Configuration for OpenAPI/Swagger UI
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'StreetBaller API',
      version: '1.0.0',
      description: 'Street soccer gamification platform with match scoring, dispute resolution, and trust-based ranking system.',
      contact: {
        name: 'StreetBaller Team',
        email: 'contact@streetballer.dev',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.streetballer.dev',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Firebase JWT token in Authorization header',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'VALIDATION_ERROR' },
                message: { type: 'string' },
                details: { type: 'array' },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            firebaseUid: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Team: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            logo: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Match: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            team1Id: { type: 'string', format: 'uuid' },
            team2Id: { type: 'string', format: 'uuid' },
            team1Score: { type: 'integer', nullable: true },
            team2Score: { type: 'integer', nullable: true },
            status: { type: 'string', enum: ['scheduled', 'in-progress', 'pending-confirmation', 'completed', 'disputed'] },
            matchDate: { type: 'string', format: 'date-time' },
            format: { type: 'string', enum: ['5v5', '7v7', '11v11'] },
          },
        },
        Dispute: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            matchId: { type: 'string', format: 'uuid' },
            disputingTeamId: { type: 'string', format: 'uuid' },
            defendingTeamId: { type: 'string', format: 'uuid' },
            reason: { type: 'string' },
            status: { type: 'string', enum: ['open', 'resolved'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    './src/routes/auth.routes.ts',
    './src/routes/user.routes.ts',
    './src/routes/team.routes.ts',
    './src/routes/match.routes.ts',
    './src/routes/dispute.routes.ts',
    './src/routes/leaderboard.routes.ts',
    './src/routes/trust.routes.ts',
  ],
};

export const specs = swaggerJsdoc(options);
