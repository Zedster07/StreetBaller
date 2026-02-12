// Authentication Middleware (Firebase Token Verification)
import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import { UnauthorizedError } from '../types/error.types';
import { logger } from '../utils/logger';

// Extend Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email?: string;
      };
    }
  }
}

export const verifyFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    // Development mode: accept Firebase UID directly as token
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Dev mode auth: using token as UID', { token });
      req.user = {
        uid: token,
        email: token, // Use as both for dev
      };
      return next();
    }

    // Production mode: verify Firebase token
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
      };
    } catch (firebaseError) {
      logger.error('Firebase token verification failed:', { error: String(firebaseError) });
      throw new UnauthorizedError('Invalid or expired token');
    }

    next();
  } catch (error) {
    logger.error('Auth middleware error:', { error: String(error) });
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired token',
      },
    });
  }
};

// Optional auth — doesn't fail if token is missing
export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
      };
    }
  } catch (error) {
    logger.debug('Optional auth skipped:', { error: String(error) });
  }

  next();
};
