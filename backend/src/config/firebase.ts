// Firebase Configuration
import * as admin from 'firebase-admin';
import { logger } from './logger';

export const initializeFirebase = () => {
  try {
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    });

    logger.info('✅ Firebase initialized successfully');
  } catch (error) {
    logger.error('❌ Firebase initialization failed:', { error: String(error) });
    throw error;
  }
};

export const getFirebaseAuth = () => admin.auth();
export const getFirebaseFirestore = () => admin.firestore();
