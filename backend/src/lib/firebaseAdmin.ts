// src/lib/firebaseAdmin.ts
import admin from "firebase-admin";

// Initialize the app
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

// For Database use
export const db = admin.firestore();

// For Admin use
export const authAdmin = admin.auth();

// For Storage use
export const storage = admin.storage();



export default admin;
