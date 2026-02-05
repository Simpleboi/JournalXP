import { Router } from "express";
import type { Request, Response } from "express";
import { admin, db, FieldValue } from "../lib/admin";
import { requireAuth, AuthenticatedRequest } from "../middleware/requireAuth";
import { tsToIso } from "../../../shared/utils/date";
import { getRankInfo } from "../../../shared/utils/rankSystem";
import type {
  SessionInitResponse,
  SessionLogoutResponse,
  ApiError,
} from "../../../shared/types/api";
import type { UserClient } from "../../../shared/types/user";
import { standardRateLimit, authRateLimit } from "../middleware/rateLimit";

// Define the session router
const router = Router();

// Session cookie configuration
const SESSION_COOKIE_MAX_AGE = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds
const SESSION_COOKIE_OPTIONS = {
  maxAge: SESSION_COOKIE_MAX_AGE,
  httpOnly: true, // Cookie not accessible via JavaScript
  secure: process.env.NODE_ENV === "production", // HTTPS only in production
  sameSite: "lax" as const, // CSRF protection
  path: "/", // Cookie available on all paths
};

/**
 * Convert Firestore user document to UserClient DTO
 * Sanitizes and transforms server data for client consumption
 */
function toUserClient(doc: any): UserClient {
  const level = doc.level ?? 1;
  const rankInfo = getRankInfo(level);

  return {
    username: doc.username ?? doc.displayName ?? "New User",
    level: level,
    xp: doc.xp ?? 0,
    totalXP: doc.totalXP ?? 0,
    spendableXP: doc.spendableXP ?? 0,
    xpNeededToNextLevel: doc.xpNeededToNextLevel ?? 100,
    streak: doc.streak ?? 0,
    rank: doc.rank ?? rankInfo.rank,
    nextRank: doc.nextRank ?? rankInfo.nextRank,
    profilePicture:
      doc.profilePicture ?? doc.photoURL ?? doc.photoUrl ?? undefined,
    bannerImage: doc.bannerImage ?? undefined,
    bio: doc.bio ?? undefined,
    currentMood: doc.currentMood ?? undefined,
    joinDate: doc.joinDate ?? undefined,
    journalStats: doc.journalStats ?? {
      journalCount: 0,
      totalJournalEntries: 0,
      totalWordCount: 0,
      averageEntryLength: 0,
      mostUsedWords: [],
      totalXPfromJournals: 0,
    },
    taskStats: doc.taskStats ?? {
      currentTasksCreated: 0,
      currentTasksCompleted: 0,
      currentTasksPending: 0,
      completionRate: 0,
      totalTasksCreated: 0,
      totalTasksCompleted: 0,
      totalSuccessRate: 0,
      totalXPfromTasks: 0,
      priorityCompletion: { high: 0, medium: 0, low: 0 },
    },
    habitStats: doc.habitStats ?? {
      totalHabitsCreated: 0,
      totalHabitsCompleted: 0,
      totalHabitCompletions: 0,
      totalXpFromHabits: 0,
      longestStreak: 0,
      currentActiveHabits: 0,
      category: {
        mindfulness: 0,
        productivity: 0,
        social: 0,
        physical: 0,
        custom: 0,
      },
      frequency: {
        daily: 0,
        weekly: 0,
        monthly: 0,
      },
    },
    sundayConversationCount: doc.sundayConversationCount ?? 0,
    sundayStats: doc.sundayStats,
    meditationStats: doc.meditationStats,
    communityStats: doc.communityStats,
    petStats: doc.petStats,
    achievementStats: doc.achievementStats,
    selfReflectionStats: doc.selfReflectionStats,
    milestones: doc.milestones,
    progression: doc.progression,
    patterns: doc.patterns,
    achievements: doc.achievements,
    achievementPoints: doc.achievementPoints,
    preferences: doc.preferences,
    bestStreak: doc.bestStreak,
    currentLoginStreak: doc.currentLoginStreak,
    bestLoginStreak: doc.bestLoginStreak,
    totalActiveDays: doc.totalActiveDays,
    averageSessionsPerWeek: doc.averageSessionsPerWeek,
    inventory: doc.inventory ?? [],
    featuredBadge: doc.featuredBadge ?? undefined,
    aiDataConsent: doc.aiDataConsent ?? {
      sundayEnabled: true,
      journalAnalysisEnabled: true,
      habitAnalysisEnabled: true,
      consentTimestamp: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    },
    lastJournalEntryDate: doc.lastJournalEntryDate ? tsToIso(doc.lastJournalEntryDate) : undefined,
  };
}

/**
 * Create default user document structure
 */
function createDefaultUserData(uid: string, email?: string, name?: string, picture?: string) {
  const initialLevel = 1;
  const rankInfo = getRankInfo(initialLevel);

  return {
    uid,
    email: email ?? null,
    displayName: name ?? null,
    profilePicture: picture ?? null,
    level: initialLevel,
    xp: 0,
    totalXP: 0,
    xpNeededToNextLevel: 100,
    streak: 0,
    rank: rankInfo.rank,
    nextRank: rankInfo.nextRank,
    journalStats: {
      journalCount: 0,
      totalJournalEntries: 0,
      totalWordCount: 0,
      averageEntryLength: 0,
      mostUsedWords: [],
      totalXPfromJournals: 0,
    },
    taskStats: {
      currentTasksCreated: 0,
      currentTasksCompleted: 0,
      currentTasksPending: 0,
      completionRate: 0,
      totalTasksCreated: 0,
      totalTasksCompleted: 0,
      totalSuccessRate: 0,
      totalXPfromTasks: 0,
      priorityCompletion: { high: 0, medium: 0, low: 0 },
    },
    habitStats: {
      totalHabitsCreated: 0,
      totalHabitsCompleted: 0,
      totalHabitCompletions: 0,
      totalXpFromHabits: 0,
      longestStreak: 0,
      currentActiveHabits: 0,
      category: {
        mindfulness: 0,
        productivity: 0,
        social: 0,
        physical: 0,
        custom: 0,
      },
      frequency: {
        daily: 0,
        weekly: 0,
        monthly: 0,
      },
    },
    sundayConversationCount: 0,
    aiDataConsent: {
      sundayEnabled: true,
      journalAnalysisEnabled: true,
      habitAnalysisEnabled: true,
      consentTimestamp: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    },
    preferences: {
      journalWordCountGoal: 250,
      showUpdatesBanner: true,
      emailPreferences: {
        weeklyDigest: true,
        productUpdates: true,
      },
    },
    joinDate: FieldValue.serverTimestamp(),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    lastLogin: FieldValue.serverTimestamp(),
  };
}

/**
 * Check if the streak should be reset based on the last journal entry date
 * Returns true if more than 1 day has passed since the last entry
 */
function shouldResetStreak(lastJournalEntryDate: Date | null): boolean {
  if (!lastJournalEntryDate) {
    return false; // No previous entry, keep streak at 0
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastEntry = new Date(lastJournalEntryDate);
  lastEntry.setHours(0, 0, 0, 0);

  const diffMs = today.getTime() - lastEntry.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Reset streak if more than 1 day has passed
  return diffDays > 1;
}

// TEMP: unauthenticated ping for health checks
router.get("/ping", (_req: Request, res: Response) => {
  res.json({ ok: true, where: "session router" });
});

/**
 * POST /api/session/init
 *
 * Initialize or refresh a user session
 *
 * Flow:
 * 1. Client sends Firebase ID token via Authorization header
 * 2. requireAuth middleware verifies the token
 * 3. Create or update user document in Firestore
 * 4. Optionally create a session cookie for persistent auth
 * 5. Return user data to client
 *
 * Request: Authorization: Bearer <idToken>
 * Response: { user: UserClient, sessionCookie?: boolean, expiresAt?: string }
 */
router.post(
  "/init",
  authRateLimit,
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { uid, email, name, picture } = (req as AuthenticatedRequest).user!;

      // Get or create user document
      const userRef = db.collection("users").doc(uid);
      const snapshot = await userRef.get();

      if (!snapshot.exists) {
        // New user - create document with defaults
        await userRef.set(createDefaultUserData(uid, email, name, picture));
        console.log(`✅ Created new user document for uid: ${uid}`);
      } else {
        // Existing user - update last login and metadata
        const userData = snapshot.data()!;
        const lastJournalEntryDate = userData.lastJournalEntryDate?.toDate() || null;

        // Check if streak should be reset due to inactivity
        const streakExpired = shouldResetStreak(lastJournalEntryDate);

        // Initialize aiDataConsent if missing (for existing users created before this field was added)
        const needsAiConsent = !userData.aiDataConsent;

        await userRef.set(
          {
            lastLogin: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
            // Update profile info if changed
            ...(email && { email }),
            ...(name && { displayName: name }),
            ...(picture && { profilePicture: picture }),
            // Reset streak if more than 1 day has passed since last journal entry
            ...(streakExpired && { streak: 0 }),
            // Initialize AI consent for existing users
            ...(needsAiConsent && {
              aiDataConsent: {
                sundayEnabled: true,
                journalAnalysisEnabled: true,
                habitAnalysisEnabled: true,
                consentTimestamp: new Date().toISOString(),
                lastUpdated: new Date().toISOString(),
              },
            }),
          },
          { merge: true }
        );
        console.log(`✅ Updated existing user for uid: ${uid}${streakExpired ? ' (streak reset due to inactivity)' : ''}${needsAiConsent ? ' (initialized AI consent)' : ''}`);
      }

      // Fetch fresh user data
      const freshSnapshot = await userRef.get();
      const userData = freshSnapshot.data()!;

      // Convert to client DTO
      const clientUser = toUserClient({
        ...userData,
        joinDate: tsToIso(userData.joinDate),
        createdAt: tsToIso(userData.createdAt),
        updatedAt: tsToIso(userData.updatedAt),
        lastLogin: tsToIso(userData.lastLogin),
      });

      // Optional: Create session cookie for persistent authentication
      // This allows the user to stay logged in across browser sessions
      let sessionCookieSet = false;
      let expiresAt: string | undefined;

      const createCookie = req.query.createCookie === "true" || req.body?.createCookie;

      if (createCookie) {
        try {
          // Get the ID token from the Authorization header
          const idToken = req.headers.authorization?.split("Bearer ")[1];

          if (idToken) {
            // Create a session cookie that expires in 14 days
            const sessionCookie = await admin
              .auth()
              .createSessionCookie(idToken, {
                expiresIn: SESSION_COOKIE_MAX_AGE,
              });

            // Set the cookie in the response
            res.cookie("__session", sessionCookie, SESSION_COOKIE_OPTIONS);

            sessionCookieSet = true;
            expiresAt = new Date(Date.now() + SESSION_COOKIE_MAX_AGE).toISOString();

            console.log(`🍪 Session cookie created for uid: ${uid}, expires: ${expiresAt}`);
          }
        } catch (cookieError) {
          console.error("Failed to create session cookie:", cookieError);
          // Don't fail the request if cookie creation fails
          // User can still authenticate with ID tokens
        }
      }

      const response: SessionInitResponse = {
        user: clientUser,
        sessionCookie: sessionCookieSet,
        expiresAt,
        message: snapshot.exists ? "Session refreshed" : "User created successfully",
      };

      res.json(response);
    } catch (error: any) {
      console.error("session/init error:", error);
      const errorResponse: ApiError = {
        error: "Session initialization failed",
        details: error.message,
        code: "SESSION_INIT_FAILED",
      };
      res.status(500).json(errorResponse);
    }
  }
);

/**
 * POST /api/session/logout
 *
 * Logout user and clear session cookies
 *
 * This endpoint:
 * 1. Clears the session cookie
 * 2. Optionally revokes the user's refresh tokens (if uid provided)
 * 3. Returns success response
 *
 * Request: Can be authenticated or unauthenticated
 * Response: { success: true, message: string }
 */
router.post("/logout", standardRateLimit, async (req: Request, res: Response): Promise<void> => {
  try {
    // Clear the session cookie
    res.clearCookie("__session", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    // Optional: Revoke all refresh tokens for the user
    // This forces re-authentication on all devices
    const revokeTokens = req.body?.revokeTokens === true;

    if (revokeTokens) {
      try {
        // Try to get uid from authenticated request
        const uid = (req as AuthenticatedRequest).user?.uid;

        if (uid) {
          await admin.auth().revokeRefreshTokens(uid);
          console.log(`🔒 Revoked refresh tokens for uid: ${uid}`);
        }
      } catch (revokeError) {
        console.error("Failed to revoke tokens:", revokeError);
        // Don't fail the logout if token revocation fails
      }
    }

    const response: SessionLogoutResponse = {
      success: true,
      message: "Logged out successfully",
    };

    res.json(response);
  } catch (error: any) {
    console.error("session/logout error:", error);
    const errorResponse: ApiError = {
      error: "Logout failed",
      details: error.message,
      code: "LOGOUT_FAILED",
    };
    res.status(500).json(errorResponse);
  }
});

/**
 * POST /api/session/refresh
 *
 * Refresh the current session (update lastLogin timestamp)
 *
 * This is useful for extending session lifetime without full re-initialization
 *
 * Request: Requires authentication (Bearer token or session cookie)
 * Response: { user: UserClient, message: string }
 */
router.post(
  "/refresh",
  standardRateLimit,
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { uid } = (req as AuthenticatedRequest).user!;

      const userRef = db.collection("users").doc(uid);

      // Update last login timestamp
      await userRef.set(
        {
          lastLogin: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      // Fetch updated user data
      const snapshot = await userRef.get();
      const userData = snapshot.data()!;

      const clientUser = toUserClient({
        ...userData,
        joinDate: tsToIso(userData.joinDate),
        createdAt: tsToIso(userData.createdAt),
        updatedAt: tsToIso(userData.updatedAt),
        lastLogin: tsToIso(userData.lastLogin),
      });

      res.json({
        user: clientUser,
        message: "Session refreshed",
      });
    } catch (error: any) {
      console.error("session/refresh error:", error);
      const errorResponse: ApiError = {
        error: "Session refresh failed",
        details: error.message,
        code: "SESSION_REFRESH_FAILED",
      };
      res.status(500).json(errorResponse);
    }
  }
);

export default router;
