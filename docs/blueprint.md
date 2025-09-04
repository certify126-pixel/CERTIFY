# **App Name**: CertiCheck Jharkhand

## Core Features:

- User Authentication and Authorization: Securely authenticate users (Verifiers, Institution Admins, Super Admins) using Firebase Authentication and manage access control based on roles using Firestore Security Rules.
- Institution Certificate Record Management: Enable Institution Admins to securely upload and manage verified certificate records via bulk upload (CSV/JSON) and a real-time API endpoint (Cloud Functions).  Generate unique cryptographic hashes (SHA-256) of key certificate data for integrity.
- Certificate Verification Engine: Allow Verifiers to upload certificate images/PDFs to Cloud Storage, triggering a Cloud Function that utilizes the Google Cloud Vision API to extract key text. The tool validates extracted data against records in Firestore, flagging potential forgeries or invalid records.
- Admin Dashboard and Analytics: Provide a secure admin dashboard, accessible only to Super Admins, to view analytics, verification logs, manage institutions, and manage a certificate blacklist in Firestore.
- Verification Log: Log the result of each verification attempt (status, uploaded file reference, timestamp) in a `verification_logs` collection in Firestore.
- Fraud Detection: Automatically flag future verification attempts for certificate IDs or individuals present in the blacklist collection.
- Verification Result Display: The frontend will display the verification status clearly.

## Style Guidelines:

- Primary color: Deep indigo (#4B0082) to convey trust, authority, and knowledge, fitting for an academic and governmental context.
- Background color: Very light indigo (#F0EEF5), offering a clean and unobtrusive backdrop.
- Accent color: Muted violet (#8A2BE2) to provide contrast and highlight key actions, e.g. CTAs, search.
- Headline font: 'Playfair', a serif typeface suitable for headlines. Body font: 'PT Sans', a versatile sans-serif typeface suitable for body text.
- Use clean, minimalist icons from a library like Material Design Icons to represent different certificate types, verification statuses, and user roles.
- Maintain a clean and organized layout, prioritizing clear hierarchy and ease of navigation, ensuring a user-friendly experience for all user types.
- Subtle animations and transitions (e.g., loading indicators, feedback on verification status) to enhance user experience without being distracting.