// Firebase Configuration
import * as admin from 'firebase-admin';
import { logger } from '../utils/logger';

export const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length > 0) {
      logger.info('✅ Firebase already initialized');
      return;
    }

    // Skip Firebase initialization in development if credentials are missing
    if (process.env.NODE_ENV === 'development' && !process.env.FIREBASE_PRIVATE_KEY) {
      logger.warn('⚠️  Firebase skipped in development (no credentials provided)');
      return;
    }

    // Initialize with service account credential from environment
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });

    logger.info('✅ Firebase initialized successfully');
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      logger.warn('⚠️  Firebase initialization failed (development mode):', { error: String(error) });
      return;
    }
    logger.error('❌ Firebase initialization failed:', { error: String(error) });
    throw error;
  }
};

export const getFirebaseAuth = () => {
  if (admin.apps.length === 0) {
    throw new Error('Firebase not initialized');
  }
  return admin.auth();
};
export const getFirebaseFirestore = () => admin.firestore();
