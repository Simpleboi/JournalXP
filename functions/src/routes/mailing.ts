import { Router } from "express";
import { requireAuth, AuthenticatedRequest } from "../middleware/requireAuth";
import { db, FieldValue } from "../lib/admin";
import type { UserClient } from "../../../shared/types/user";
import { getRankInfo } from "../../../shared/utils/rankSystem";
import { tsToIso } from "../../../shared/utils/date";
import { standardRateLimit } from "../middleware/rateLimit";
import { verifyUnsubscribeToken } from "../emails/unsubscribeToken";
import { generateWeeklyDigestEmail } from "../emails/weeklyDigest";
import { resend, FROM_EMAIL } from "../lib/resend";

const router = Router();

/**
 * Convert Firestore user document to UserClient DTO
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
    joinDate: doc.joinDate ?? undefined,
    inventory: doc.inventory ?? [],
    journalStats: doc.journalStats,
    taskStats: doc.taskStats,
    habitStats: doc.habitStats,
    sundayConversationCount: doc.sundayConversationCount,
    sundayStats: doc.sundayStats,
    meditationStats: doc.meditationStats,
    communityStats: doc.communityStats,
    petStats: doc.petStats,
    achievementStats: doc.achievementStats,
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
  };
}

/**
 * PATCH /mailing/preferences
 * Update email preferences (weekly digest, product updates)
 */
router.patch(
  "/preferences",
  standardRateLimit,
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      const uid = req.user!.uid;
      const { weeklyDigest, productUpdates } = req.body;

      // Validate inputs
      if (weeklyDigest !== undefined && typeof weeklyDigest !== "boolean") {
        return res.status(400).json({
          error: "Invalid weeklyDigest value",
          details: "weeklyDigest must be a boolean",
          code: "INVALID_WEEKLY_DIGEST",
        });
      }

      if (productUpdates !== undefined && typeof productUpdates !== "boolean") {
        return res.status(400).json({
          error: "Invalid productUpdates value",
          details: "productUpdates must be a boolean",
          code: "INVALID_PRODUCT_UPDATES",
        });
      }

      if (weeklyDigest === undefined && productUpdates === undefined) {
        return res.status(400).json({
          error: "No preferences to update",
          details: "Provide at least one of: weeklyDigest, productUpdates",
          code: "NO_PREFERENCES",
        });
      }

      // Build update object
      const emailPreferencesUpdate: Record<string, any> = {};
      if (weeklyDigest !== undefined) {
        emailPreferencesUpdate.weeklyDigest = weeklyDigest;
      }
      if (productUpdates !== undefined) {
        emailPreferencesUpdate.productUpdates = productUpdates;
      }

      // Get current user data
      const userRef = db.collection("users").doc(uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return res.status(404).json({
          error: "User not found",
          code: "USER_NOT_FOUND",
        });
      }

      const currentPreferences = userDoc.data()?.preferences || {};
      const currentEmailPrefs = currentPreferences.emailPreferences || {
        weeklyDigest: true,
        productUpdates: true,
      };

      // Merge with existing email preferences
      const updatedEmailPreferences = {
        ...currentEmailPrefs,
        ...emailPreferencesUpdate,
      };

      // Update Firestore
      await userRef.update({
        "preferences.emailPreferences": updatedEmailPreferences,
        updatedAt: FieldValue.serverTimestamp(),
      });

      console.log(
        `[Mailing] Updated email preferences for user ${uid}:`,
        updatedEmailPreferences
      );

      // Fetch and return updated user
      const updatedUserDoc = await userRef.get();
      const userData = updatedUserDoc.data()!;

      const userClient = toUserClient({
        ...userData,
        joinDate: tsToIso(userData.joinDate),
        createdAt: tsToIso(userData.createdAt),
        updatedAt: tsToIso(userData.updatedAt),
        lastLogin: tsToIso(userData.lastLogin),
      });

      return res.json({
        user: userClient,
        message: "Email preferences updated successfully",
      });
    } catch (err: any) {
      console.error("[Mailing] Error updating preferences:", err);
      return res.status(500).json({
        error: "Failed to update email preferences",
        details: err.message,
        code: "EMAIL_PREFERENCES_UPDATE_FAILED",
      });
    }
  }
);

/**
 * GET /mailing/unsubscribe
 * Unsubscribe via signed token link (no auth required)
 * Used in email footer unsubscribe links
 */
router.get("/unsubscribe", standardRateLimit, async (req, res) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      return res.status(400).json({
        error: "Missing token",
        details: "Unsubscribe token is required",
        code: "MISSING_TOKEN",
      });
    }

    // Verify and decode token
    const payload = verifyUnsubscribeToken(token);

    if (!payload) {
      return res.status(400).json({
        error: "Invalid or expired token",
        details: "This unsubscribe link is invalid or has expired",
        code: "INVALID_TOKEN",
      });
    }

    const { userId, type } = payload;

    // Get user document
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({
        error: "User not found",
        code: "USER_NOT_FOUND",
      });
    }

    // Build update based on unsubscribe type
    const currentPreferences = userDoc.data()?.preferences || {};
    const currentEmailPrefs = currentPreferences.emailPreferences || {
      weeklyDigest: true,
      productUpdates: true,
    };

    let updatedEmailPreferences: Record<string, any>;
    let unsubscribedFrom: string;

    switch (type) {
      case "weeklyDigest":
        updatedEmailPreferences = {
          ...currentEmailPrefs,
          weeklyDigest: false,
        };
        unsubscribedFrom = "weekly digest emails";
        break;
      case "productUpdates":
        updatedEmailPreferences = {
          ...currentEmailPrefs,
          productUpdates: false,
        };
        unsubscribedFrom = "product update emails";
        break;
      case "all":
        updatedEmailPreferences = {
          weeklyDigest: false,
          productUpdates: false,
          unsubscribedAt: new Date().toISOString(),
        };
        unsubscribedFrom = "all emails";
        break;
      default:
        return res.status(400).json({
          error: "Invalid unsubscribe type",
          code: "INVALID_TYPE",
        });
    }

    // Update Firestore
    await userRef.update({
      "preferences.emailPreferences": updatedEmailPreferences,
      updatedAt: FieldValue.serverTimestamp(),
    });

    console.log(
      `[Mailing] User ${userId} unsubscribed from ${unsubscribedFrom}`
    );

    // Return success response
    // Frontend can redirect to a confirmation page
    return res.json({
      success: true,
      message: `Successfully unsubscribed from ${unsubscribedFrom}`,
      unsubscribedFrom: type,
    });
  } catch (err: any) {
    console.error("[Mailing] Error processing unsubscribe:", err);
    return res.status(500).json({
      error: "Failed to process unsubscribe",
      details: err.message,
      code: "UNSUBSCRIBE_FAILED",
    });
  }
});

/**
 * GET /mailing/preferences
 * Get current email preferences (authenticated)
 */
router.get(
  "/preferences",
  standardRateLimit,
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      const uid = req.user!.uid;

      const userRef = db.collection("users").doc(uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return res.status(404).json({
          error: "User not found",
          code: "USER_NOT_FOUND",
        });
      }

      const preferences = userDoc.data()?.preferences || {};
      const emailPreferences = preferences.emailPreferences || {
        weeklyDigest: true,
        productUpdates: true,
      };

      return res.json({
        emailPreferences,
      });
    } catch (err: any) {
      console.error("[Mailing] Error getting preferences:", err);
      return res.status(500).json({
        error: "Failed to get email preferences",
        details: err.message,
        code: "GET_PREFERENCES_FAILED",
      });
    }
  }
);

/**
 * POST /mailing/test-digest
 * Send a test weekly digest email to the authenticated user
 * For development/testing purposes only
 */
router.post(
  "/test-digest",
  standardRateLimit,
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      const uid = req.user!.uid;

      // Check if Resend is configured
      if (!process.env.RESEND_API_KEY) {
        return res.status(503).json({
          error: "Email service not configured",
          details: "RESEND_API_KEY environment variable is not set",
          code: "EMAIL_NOT_CONFIGURED",
        });
      }

      // Get user data
      const userRef = db.collection("users").doc(uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return res.status(404).json({
          error: "User not found",
          code: "USER_NOT_FOUND",
        });
      }

      const userData = userDoc.data()!;
      const email = userData.email;

      if (!email) {
        return res.status(400).json({
          error: "No email address",
          details: "User does not have an email address configured",
          code: "NO_EMAIL",
        });
      }

      // Get weekly stats
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const [journalsSnapshot, habitsSnapshot, tasksSnapshot] =
        await Promise.all([
          db
            .collection(`users/${uid}/journalEntries`)
            .where("createdAt", ">=", oneWeekAgo)
            .count()
            .get(),
          db
            .collection(`users/${uid}/habits`)
            .where("lastCompletedAt", ">=", oneWeekAgo)
            .count()
            .get(),
          db
            .collection(`users/${uid}/tasks`)
            .where("completedAt", ">=", oneWeekAgo)
            .count()
            .get(),
        ]);

      const journalEntries = journalsSnapshot.data().count;
      const habitsCompleted = habitsSnapshot.data().count;
      const tasksCompleted = tasksSnapshot.data().count;
      const xpEarned = journalEntries * 30; // Estimate based on journal XP

      // Generate email
      const { subject, html } = generateWeeklyDigestEmail({
        userId: uid,
        username: userData.username || userData.displayName || "Friend",
        email,
        currentStreak: userData.streak || 0,
        level: userData.level || 1,
        rank: userData.rank || "Bronze III",
        totalXP: userData.totalXP || 0,
        journalEntriesThisWeek: journalEntries,
        habitsCompletedThisWeek: habitsCompleted,
        tasksCompletedThisWeek: tasksCompleted,
        xpEarnedThisWeek: xpEarned,
        newAchievements: [],
      });

      // Send email
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: `[TEST] ${subject}`,
        html,
      });

      console.log(`[Mailing] Test digest sent to ${email}:`, result);

      return res.json({
        success: true,
        message: `Test digest email sent to ${email}`,
        stats: {
          journalEntries,
          habitsCompleted,
          tasksCompleted,
          xpEarned,
        },
      });
    } catch (err: any) {
      console.error("[Mailing] Error sending test digest:", err);
      return res.status(500).json({
        error: "Failed to send test digest",
        details: err.message,
        code: "TEST_DIGEST_FAILED",
      });
    }
  }
);

export default router;
