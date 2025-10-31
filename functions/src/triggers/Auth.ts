// functions/src/triggers/auth.ts
import * as v1auth from "firebase-functions/v1/auth";
import { db, admin } from "../utils/admin.js";
import { buildUserView } from "./UserView.js";




export const onUserCreated = v1auth.user().onCreate(async (user) => {
  const { uid, email = null, displayName = null, photoURL = null } = user;

  const userRef = db.collection("users").doc(uid);
  const metaRef = db.collection("usersMeta").doc(uid);

  // idempotent
  const snap = await userRef.get();
  if (!snap.exists) {
    await db.runTransaction(async (tx) => {
      tx.set(userRef, {
        uid,
        email,
        username: displayName ?? "",
        photoURL,
        joinDate: admin.firestore.FieldValue.serverTimestamp(),
        theme: "system",
      });
      tx.set(metaRef, {
        xp: 0,
        totalXP: 0,
        level: 1,
        streak: 0,
        rank: "Bronze III",
        journalCount: 0,
        totalJournalEntries: 0,
        totalTasksCreated: 0,
        totalTasksCompleted: 0,
        recentAchievement: "None yet",
        lastJournalEntryDate: "",
        achievements: {}, // record keyed by id
        xpHistory: [],
        pointsHistory: [],
      });
    });
  }

  // Build initial view
  await buildUserView(uid);
});
