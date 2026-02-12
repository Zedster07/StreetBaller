// StreetBaller Backend - Entry Point
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { logger } from './utils/logger';
import { specs } from './config/swagger';

// Routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import teamRoutes from './routes/team.routes';
import matchRoutes from './routes/match.routes';
import disputeRoutes from './routes/dispute.routes';
import leaderboardRoutes from './routes/leaderboard.routes';

// Middleware
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// ============================================================================
// Middleware Setup
// ============================================================================

// Security
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================================
// Health Check
// ============================================================================

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================================================
// Swagger/OpenAPI Documentation
// ============================================================================

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    swaggerOptions: {
      deepLinking: true,
      persistAuthorization: true,
      displayOperationId: true,
    },
    customCss: '.topbar { display: none }',
    customSiteTitle: 'StreetBaller API Documentation',
  })
);

app.get('/api-docs.json', (req, res) => {
  res.set('Content-Type', 'application/json');
  res.send(specs);
});

// ============================================================================
// API Routes
// ============================================================================

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/leaderboards', leaderboardRoutes);

// ============================================================================
// Error Handling
// ============================================================================

app.use(errorHandler);

// ============================================================================
// Server Start
// ============================================================================

app.listen(PORT, () => {
  logger.info(`🚀 StreetBaller API running on http://localhost:${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
