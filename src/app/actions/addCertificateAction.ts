
'use server';

import { createHash } from 'crypto';
import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
import { FieldValue } from 'firebase-admin/firestore';

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
    }
}

const adminDb = admin.firestore();


export async function addCertificateAction(formData: FormData) {
    const studentName = formData.get('studentName') as string;
    const rollNumber = formData.get('rollNumber') as string;
    const certificateId = formData.get('certificateId') as string;
    const issueDate = formData.get('issueDate') as string;
    const course = formData.get('course') as string;
    const institution = formData.get('institution') as string;
    
    if (!studentName || !rollNumber || !certificateId || !issueDate || !course || !institution) {
        return { success: false, message: "Missing required fields." };
    }

    try {
        const hash = createHash('sha256');
        hash.update(rollNumber + certificateId + issueDate);
        const certificateHash = hash.digest('hex');

        const newCertificate = {
            studentName,
            rollNumber,
            certificateId,
            issueDate,
            course,
            institution,
            certificateHash,
            status: 'Issued',
            createdAt: FieldValue.serverTimestamp(),
        };

        const docRef = await adminDb.collection("certificates").add(newCertificate);
        console.log(`Stored certificate for ${studentName}. Firestore ID: ${docRef.id}`);

        return {
            success: true,
            certificateHash,
            message: 'Certificate data has been successfully stored in Firestore.',
            firestoreId: docRef.id,
        };

    } catch (error: any) {
        console.error("Error adding certificate to Firestore:", error);
        return { success: false, message: error.message || "Failed to store certificate data. An internal error occurred." };
    }
}
