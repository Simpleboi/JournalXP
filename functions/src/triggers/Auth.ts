import {auth as v1auth} from "firebase-functions/v1";
import {db} from "../utils/admin";

// Function to trigger when a new User is created
export const onUserCreated = v1auth.user().onCreate(async (user) => {
  const {uid, email = null, displayName = null, photoURL = null} = user;

  const userRef = db.collection("users").doc(uid);
  const metaRef = db.collection("usersMeta").doc(uid);

  const snap = await userRef.get();
  if (snap.exists) return;

  const now = new Date().toISOString();
  await db.runTransaction(async (tx) => {
    tx.set(userRef, {
      uid,
      email,
      displayName,
      photoURL,
      createdAt: now,
      bio: "",
      theme: "system",
    });
    tx.set(metaRef, {
      xp: 0,
      level: 1,
      streak: 0,
      lastEntryAt: null,
      achievements: [],
    });
  });
});

// Function to Delete a user
export const onUserDeleted = v1auth.user().onDelete(async (user) => {
  await db
    .collection("usersMeta")
    .doc(user.uid)
    .delete()
    .catch(() => {});
});
