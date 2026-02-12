// User Routes
import { Router } from 'express';
import userController from '../controllers/user.controller';
import { verifyFirebaseToken } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/users/profile/setup:
 *   post:
 *     summary: Setup player profile (first-time initialization)
 *     tags:
 *       - User Profile
 *     description: Initializes a player's profile with personal and football information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - displayName
 *               - preferredPosition
 *               - dominantFoot
 *             properties:
 *               displayName:
 *                 type: string
 *                 example: "John Doe"
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "1995-05-15"
 *               heightCm:
 *                 type: number
 *                 example: 180
 *               weightKg:
 *                 type: number
 *                 example: 75
 *               preferredPosition:
 *                 type: string
 *                 enum: ["GK", "DEF", "MID", "FWD"]
 *                 example: "MID"
 *               dominantFoot:
 *                 type: string
 *                 enum: ["LEFT", "RIGHT", "BOTH"]
 *                 example: "RIGHT"
 *               bio:
 *                 type: string
 *                 example: "Passionate footballer"
 *     responses:
 *       201:
 *         description: Player profile created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/profile/setup', verifyFirebaseToken, userController.setupPlayerProfile);

/**
 * @swagger
 * /api/users/profile:
 *   patch:
 *     summary: Update player profile
 *     tags:
 *       - User Profile
 *     description: Updates an existing player profile with new information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               displayName:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               heightCm:
 *                 type: number
 *               weightKg:
 *                 type: number
 *               preferredPosition:
 *                 type: string
 *               dominantFoot:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Player profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Player profile not found
 */
router.patch('/profile', verifyFirebaseToken, userController.updatePlayerProfile);

export default router;
