// User Routes
import { Router } from 'express';
import userController from '../controllers/user.controller';
import { verifyFirebaseToken } from '../middleware/auth.middleware';

const router = Router();

/**
 * POST /api/users/profile/setup
 * Setup player profile (first time setup)
 * Headers: Authorization: Bearer <token>
 * Body: { displayName, dateOfBirth, heightCm, weightKg, preferredPosition, dominantFoot, bio }
 */
router.post('/profile/setup', verifyFirebaseToken, userController.setupPlayerProfile);

/**
 * PATCH /api/users/profile
 * Update player profile
 * Headers: Authorization: Bearer <token>
 * Body: Partial player profile fields
 */
router.patch('/profile', verifyFirebaseToken, userController.updatePlayerProfile);

export default router;
