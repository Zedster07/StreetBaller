// Team Routes
import { Router } from 'express';
import { verifyFirebaseToken } from '../middleware/auth.middleware';
import { catchAsync } from '../middleware/errorHandler';
import { Request, Response } from 'express';
import prisma from '../config/database';
import { logger } from '../utils/logger';

const router = Router();

/**
 * POST /api/teams
 * Create a new team
 * Headers: Authorization: Bearer <token>
 * Body: { name, description, logoUrl, primaryColor, secondaryColor, formation }
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
 * GET /api/teams/:id
 * Get team details
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
 * POST /api/teams/:id/members
 * Add member to team (captain only)
 * Headers: Authorization: Bearer <token>
 * Body: { userId, role?: 'captain' | 'player' }
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
 * DELETE /api/teams/:id/members/:userId
 * Remove member from team (captain only)
 * Headers: Authorization: Bearer <token>
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
 * PATCH /api/teams/:id
 * Update team details
 * Headers: Authorization: Bearer <token>
 * Body: Partial team fields
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
