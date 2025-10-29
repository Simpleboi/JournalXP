/*
 * POST /api/session/init
 * - verifies the ID token (middleware)
 * - creates a Firestore user document if missing with sensible defaults
 * - updates email/displayName/photoURL on existing docs
 * - returns a sanitized user object
 */

import { Router, Response } from "express";

type ApiError = { error: string; details?: string };
import { adminAuth, adminDb } from "../lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import type { UserData } from "../types/user";
import { authMiddleware, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// sensible defaults for a new user document that match frontend `UserData` shape
const DEFAULT_USER_DOC = {
  username: "",
  level: 1,
  xp: 0,
  totalXP: 0,
  xpNeededToNextLevel: 100,
  streak: 0,
  rank: "Novice",
  journalCount: 0,
  totalJournalEntries: 0,
  totalTasksCreated: 0,
  totalTasksCompleted: 0,
  recentAchievement: "",
  joinDate: "",
  achievements: {},
  lastJournalEntryDate: "",
  profilePicture: null,
  moodHistory: [] as any[],
  journalStats: {
    totalWordCount: 0,
    averageEntryLength: 0,
    mostUsedWords: [] as string[],
  },
  taskStats: {
    currentTasksCreated: 0,
    currentTasksCompleted: 0,
    currentTasksPending: 0,
    completionRate: 0,
    avgCompletionTime: null,
    priorityCompletion: { high: 0, medium: 0, low: 0 },
  },
  habitStats: {
    totalHabits: 0,
    completedHabits: 0,
    currentHabitStreak: 0,
    missedDays: 0,
  },
  xpHistory: [] as any[],
  petStatus: { happiness: 50, health: 50, cleanliness: 50 },
  reflectionTrends: {},
  pointsHistory: [] as any[],
  createdAt: null as null | Date,
  updatedAt: null as null | Date,
};

// Helper to pick safe fields for the frontend `UserData` shape
function sanitizeUserDoc(doc: any): UserData {
  // Convert Firestore Timestamp to ISO string for frontend. If it's a string already, keep it.
  const joinDateVal = doc.joinDate;
  let joinDateStr = "";
  if (joinDateVal) {
    if (
      typeof joinDateVal === "object" &&
      typeof (joinDateVal as any).toDate === "function"
    ) {
      joinDateStr = (joinDateVal as any).toDate().toISOString();
    } else if (typeof joinDateVal === "string") {
      joinDateStr = joinDateVal;
    }
  }

  return {
    uid: doc.uid,
    username:
      doc.username ??
      doc.displayName ??
      (doc.email ? String(doc.email).split("@")[0] : ""),
    email: doc.email ?? null,
    displayName: doc.displayName ?? null,
    profilePicture: doc.profilePicture ?? doc.photoURL ?? null,
    level: doc.level ?? DEFAULT_USER_DOC.level,
    xp: doc.xp ?? DEFAULT_USER_DOC.xp,
    totalXP: doc.totalXP ?? DEFAULT_USER_DOC.totalXP,
    xpNeededToNextLevel:
      doc.xpNeededToNextLevel ?? DEFAULT_USER_DOC.xpNeededToNextLevel,
    streak: doc.streak ?? DEFAULT_USER_DOC.streak,
    rank: doc.rank ?? DEFAULT_USER_DOC.rank,
    journalCount: doc.journalCount ?? DEFAULT_USER_DOC.journalCount,
    totalJournalEntries:
      doc.totalJournalEntries ?? DEFAULT_USER_DOC.totalJournalEntries,
    totalTasksCreated:
      doc.totalTasksCreated ?? DEFAULT_USER_DOC.totalTasksCreated,
    totalTasksCompleted:
      doc.totalTasksCompleted ?? DEFAULT_USER_DOC.totalTasksCompleted,
    recentAchievement:
      doc.recentAchievement ?? DEFAULT_USER_DOC.recentAchievement,
    joinDate: joinDateStr || DEFAULT_USER_DOC.joinDate,
    achievements: doc.achievements ?? DEFAULT_USER_DOC.achievements,
    lastJournalEntryDate:
      doc.lastJournalEntryDate ?? DEFAULT_USER_DOC.lastJournalEntryDate,
    moodHistory: doc.moodHistory ?? DEFAULT_USER_DOC.moodHistory,
    journalStats: doc.journalStats ?? DEFAULT_USER_DOC.journalStats,
    taskStats: doc.taskStats ?? DEFAULT_USER_DOC.taskStats,
    habitStats: doc.habitStats ?? DEFAULT_USER_DOC.habitStats,
    xpHistory: doc.xpHistory ?? DEFAULT_USER_DOC.xpHistory,
    petStatus: doc.petStatus ?? DEFAULT_USER_DOC.petStatus,
    reflectionTrends: doc.reflectionTrends ?? DEFAULT_USER_DOC.reflectionTrends,
    pointsHistory: doc.pointsHistory ?? DEFAULT_USER_DOC.pointsHistory,
  };
}

/**
 * POST /api/session/init
 * - Must be called after client obtains an ID token from firebase.auth().currentUser.getIdToken()
 * - The token is verified server-side (authMiddleware)
 */
router.post(
  "/session/init",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response<UserData | ApiError>) => {
    try {
      const uid = req.uid;
      if (!uid) return res.status(401).json({ error: "Unauthorized" });

      // Retrieve up-to-date user record from Firebase Auth
      const userRecord = await adminAuth.getUser(uid);

      const userRef = adminDb.collection("users").doc(uid);
      const userSnap = await userRef.get();

      let docData: Partial<UserData> | any;

      if (!userSnap.exists) {
        // Create new user doc with defaults that map to frontend `UserData` type
        docData = {
          uid,
          email: userRecord.email || null,
          displayName: userRecord.displayName || null,
          username:
            userRecord.displayName ??
            (userRecord.email ? String(userRecord.email).split("@")[0] : ""),
          profilePicture: userRecord.photoURL ?? null,
          level: DEFAULT_USER_DOC.level,
          xp: DEFAULT_USER_DOC.xp,
          totalXP: DEFAULT_USER_DOC.totalXP,
          xpNeededToNextLevel: DEFAULT_USER_DOC.xpNeededToNextLevel,
          streak: DEFAULT_USER_DOC.streak,
          rank: DEFAULT_USER_DOC.rank,
          journalCount: DEFAULT_USER_DOC.journalCount,
          totalJournalEntries: DEFAULT_USER_DOC.totalJournalEntries,
          totalTasksCreated: DEFAULT_USER_DOC.totalTasksCreated,
          totalTasksCompleted: DEFAULT_USER_DOC.totalTasksCompleted,
          recentAchievement: DEFAULT_USER_DOC.recentAchievement,
          joinDate: FieldValue.serverTimestamp(),
          achievements: DEFAULT_USER_DOC.achievements,
          lastJournalEntryDate: DEFAULT_USER_DOC.lastJournalEntryDate,
          moodHistory: DEFAULT_USER_DOC.moodHistory,
          journalStats: DEFAULT_USER_DOC.journalStats,
          taskStats: DEFAULT_USER_DOC.taskStats,
          habitStats: DEFAULT_USER_DOC.habitStats,
          xpHistory: DEFAULT_USER_DOC.xpHistory,
          petStatus: DEFAULT_USER_DOC.petStatus,
          reflectionTrends: DEFAULT_USER_DOC.reflectionTrends,
          pointsHistory: DEFAULT_USER_DOC.pointsHistory,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        };

        await userRef.set(docData);
      } else {
        // Update existing doc with latest profile fields (avoid overwriting game data)
        const existing = userSnap.data() || {};
        const updatePayload: any = {
          email: userRecord.email || null,
          displayName: userRecord.displayName || null,
          profilePicture: userRecord.photoURL || null,
          // If username isn't set, derive from displayName/email
          username:
            existing.username ??
            userRecord.displayName ??
            (userRecord.email ? String(userRecord.email).split("@")[0] : ""),
          updatedAt: FieldValue.serverTimestamp(),
        };

        // Merge new profile fields into the existing document
        await userRef.set(updatePayload, { merge: true });
        docData = { ...existing, ...updatePayload };
      }

      const sanitized = sanitizeUserDoc(docData);

      // If the client provided an ID token in Authorization header, mint a session cookie
      // using the Admin SDK so subsequent requests can rely on httpOnly '__session' cookie.
      const rawToken = req.headers.authorization?.split("Bearer ")[1];
      if (rawToken) {
        try {
          const expiresIn = 7 * 24 * 60 * 60 * 1000; // 7 days
          const sessionCookie = await adminAuth.createSessionCookie(rawToken, {
            expiresIn,
          });
          res.cookie("__session", sessionCookie, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: expiresIn,
            path: "/",
          });
        } catch (cookieErr) {
          console.warn("Failed to create session cookie:", cookieErr);
        }
      }

      return res.json(sanitized);
    } catch (err: any) {
      console.error("session/init error", err);
      const message =
        err?.message || String(err) || "Failed to initialize session";
      return res.status(500).json({
        error: message,
        details: message,
      });
    }
  }
);

export default router;
