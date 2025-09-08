
import admin from 'firebase-admin';

// This is a placeholder for your service account key.
// In a real application, you should load this from a secure environment variable.
const serviceAccount = {
  "type": "service_account",
  "project_id": process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // The following fields are sensitive and should not be hardcoded.
  // Replace with environment variables in a real project.
  "private_key_id": "YOUR_PRIVATE_KEY_ID",
  "private_key": "YOUR_PRIVATE_KEY".replace(/\\n/g, '\n'),
  "client_email": "YOUR_CLIENT_EMAIL",
  "client_id": "YOUR_CLIENT_ID",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "YOUR_CLIENT_X509_CERT_URL"
};

// A helper function to safely initialize the app
function initializeAdminApp() {
    if (admin.apps.length > 0) {
        return admin.app();
    }

    // You must replace the placeholder credentials with your actual
    // service account details. For security, load these from environment variables.
    const creds: admin.ServiceAccount = {
        projectId: serviceAccount.project_id,
        privateKey: serviceAccount.private_key,
        clientEmail: serviceAccount.client_email,
    };
    
    try {
       return admin.initializeApp({
            credential: admin.credential.cert(creds),
            databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
        });
    } catch(error) {
        console.error("Firebase admin initialization error", error);
        // Throwing an error is important here to prevent the app from running
        // with a misconfigured Firebase connection.
        throw new Error("Could not initialize Firebase Admin SDK. Please check your service account credentials.");
    }
}

export const adminApp = initializeAdminApp();
export const adminDb = admin.firestore();
