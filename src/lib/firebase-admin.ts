
import admin from 'firebase-admin';
import { getApps, getApp } from 'firebase-admin/app';

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!getApps().length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.stack);
    // Throwing an error is important here to prevent the app from running
    // with a misconfigured Firebase connection.
    // throw new Error('Could not initialize Firebase Admin SDK. Please check your service account credentials in the environment variables.');
  }
}

export const adminDb = admin.firestore();
