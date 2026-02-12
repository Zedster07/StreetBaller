// Firebase Configuration
import * as admin from 'firebase-admin';
import { logger } from '../utils/logger';

export const initializeFirebase = () => {
  try {
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
    logger.error('❌ Firebase initialization failed:', { error: String(error) });
    throw error;
  }
};

export const getFirebaseAuth = () => admin.auth();
export const getFirebaseFirestore = () => admin.firestore();
