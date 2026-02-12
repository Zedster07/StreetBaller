// Team Routes
import { Router } from 'express';
import { verifyFirebaseToken } from '../middleware/auth.middleware';
import { catchAsync } from '../middleware/errorHandler';
import { Request, Response } from 'express';
import prisma from '../config/database';
import { logger } from '../utils/logger';

const router = Router();

/**
 * @swagger
 * /api/teams:
 *   post:
 *     summary: Create a new team
 *     tags:
 *       - Teams
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Manchester United Legends"
 *               description:
 *                 type: string
 *               logoUrl:
 *                 type: string
 *                 format: uri
 *               primaryColor:
 *                 type: string
 *               secondaryColor:
 *                 type: string
 *               formation:
 *                 type: string
 *                 example: "4-3-3"
 *     responses:
 *       201:
 *         description: Team created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', verifyFirebaseToken, catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.uid;
  if (!userId) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'User not authenticated' },
    });
  }

  const { name, description, logoUrl, primaryColor, secondaryColor, formation } = req.body;

  // Get user's database ID
  const user = await prisma.user.findUnique({
    where: { firebaseUid: userId },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'User not found' },
    });
  }

  const team = await prisma.team.create({
    data: {
      createdById: user.id,
      name,
      description: description || null,
      logoUrl: logoUrl || null,
      primaryColor: primaryColor || null,
      secondaryColor: secondaryColor || null,
      formation: formation || null,
    },
    include: {
      teamMemberships: true,
    },
  });

  logger.info('Team created:', { teamId: team.id, createdBy: user.id });

  res.status(201).json({
    success: true,
    data: team,
  });
}));

/**
 * @swagger
 * /api/teams/{id}:
 *   get:
 *     summary: Get team details with members
 *     tags:
 *       - Teams
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Team details retrieved
 *       404:
 *         description: Team not found
 */
router.get('/:id', catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const team = await prisma.team.findUnique({
    where: { id },
    include: {
      teamMemberships: {
        include: { user: { include: { playerProfile: true } } },
      },
      matchesAsTeam1: true,
      matchesAsTeam2: true,
    },
  });

  if (!team) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Team not found' },
    });
  }

  res.status(200).json({
    success: true,
    data: team,
  });
}));

/**
 * @swagger
 * /api/teams/{id}/members:
 *   post:
 *     summary: Add a member to team
 *     tags:
 *       - Teams
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *               role:
 *                 type: string
 *                 enum: ["player", "captain"]
 *                 default: "player"
 *     responses:
 *       201:
 *         description: Member added to team
 *       401:
 *         description: Unauthorized
 */
router.post('/:id/members', verifyFirebaseToken, catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, role = 'player' } = req.body;

  const membership = await prisma.teamMembership.create({
    data: {
      teamId: id,
      userId,
      role,
    },
  });

  logger.info('Team member added:', { teamId: id, userId });

  res.status(201).json({
    success: true,
    data: membership,
  });
}));

/**
 * @swagger
 * /api/teams/{id}/members/{userId}:
 *   delete:
 *     summary: Remove a member from team
 *     tags:
 *       - Teams
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Member removed from team
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id/members/:userId', verifyFirebaseToken, catchAsync(async (req: Request, res: Response) => {
  const { id, userId } = req.params;

  await prisma.teamMembership.delete({
    where: {
      teamId_userId: {
        teamId: id,
        userId,
      },
    },
  });

  logger.info('Team member removed:', { teamId: id, userId });

  res.status(200).json({
    success: true,
    message: 'Member removed from team',
  });
}));

/**
 * @swagger
 * /api/teams/{id}:
 *   patch:
 *     summary: Update team details
 *     tags:
 *       - Teams
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               logoUrl:
 *                 type: string
 *               primaryColor:
 *                 type: string
 *               secondaryColor:
 *                 type: string
 *               formation:
 *                 type: string
 *     responses:
 *       200:
 *         description: Team updated successfully
 *       401:
 *         description: Unauthorized
 */
router.patch('/:id', verifyFirebaseToken, catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, logoUrl, primaryColor, secondaryColor, formation } = req.body;

  const team = await prisma.team.update({
    where: { id },
    data: {
      name,
      description,
      logoUrl,
      primaryColor,
      secondaryColor,
      formation,
    },
  });

  logger.info('Team updated:', { teamId: id });

  res.status(200).json({
    success: true,
    data: team,
  });
}));

export default router;
