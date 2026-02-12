// Authentication Routes
import { Router, Request, Response } from 'express';
import userController from '../controllers/user.controller';
import { verifyFirebaseToken } from '../middleware/auth.middleware';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user with Firebase UID
 * Body: { email: string, firebaseUid: string }
 */
router.post('/register', userController.registerUser);

/**
 * GET /api/auth/me
 * Get current authenticated user profile
 * Headers: Authorization: Bearer <token>
 */
router.get('/me', verifyFirebaseToken, userController.getUserProfile);

export default router;
