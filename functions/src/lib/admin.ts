import * as admin from "firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

// initialize once
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

export { admin, db, auth, storage, FieldValue, Timestamp };
