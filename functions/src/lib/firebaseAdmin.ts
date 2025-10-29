import {
  initializeApp,
  cert,
  applicationDefault,
  getApps,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import type { ServiceAccount } from "firebase-admin";
import fs from "fs";
import path from "path";

// Ensure we only initialize once 
if (!getApps().length) {
  try {
    // Prefer application default credentials
    initializeApp({ credential: applicationDefault() });
  } catch (err) {
    const envPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const possiblePaths = [
      envPath,
      path.resolve(__dirname, "../../creds/service-account.json"),
      path.resolve(__dirname, "../../../backend/creds/service-account.json"),
    ].filter(Boolean) as string[];

    const found = possiblePaths.find((p) => p && fs.existsSync(p));
    if (found) {
      const sa = JSON.parse(fs.readFileSync(found, "utf8")) as ServiceAccount;
      initializeApp({ credential: cert(sa) });
    } else {
      initializeApp();
    }
  }
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();
