import { Router } from "express";
import { requireAuth, AuthenticatedRequest } from "../middleware/requireAuth";
import { db, FieldValue } from "../lib/admin";
import type { UserClient } from "../../../shared/types/user";
import { getRankInfo } from "../../../shared/utils/rankSystem";
import { tsToIso } from "../../../shared/utils/date";

const router = Router();

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
 * POST /profile/username
 * Update the username for the authenticated user
 *
 */
router.post("/username", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { username } = req.body;
    const uid = req.user!.uid;

    // Validate username
    if (!username || typeof username !== "string") {
      return res.status(400).json({
        error: "Invalid username",
        details: "Username is required and must be a string",
        code: "INVALID_USERNAME",
      });
    }

    // Trim and validate length
    const trimmedUsername = username.trim();
    if (trimmedUsername.length < 2) {
      return res.status(400).json({
        error: "Username too short",
        details: "Username must be at least 2 characters long",
        code: "USERNAME_TOO_SHORT",
      });
    }

    if (trimmedUsername.length > 30) {
      return res.status(400).json({
        error: "Username too long",
        details: "Username must be at most 30 characters long",
        code: "USERNAME_TOO_LONG",
      });
    }

    // Optional: Check for valid characters (alphanumeric, spaces, underscores, hyphens)
    const validUsernameRegex = /^[a-zA-Z0-9\s_-]+$/;
    if (!validUsernameRegex.test(trimmedUsername)) {
      return res.status(400).json({
        error: "Invalid username format",
        details: "Username can only contain letters, numbers, spaces, underscores, and hyphens",
        code: "INVALID_USERNAME_FORMAT",
      });
    }

    // Update the username in Firestore
    const userRef = db.collection("users").doc(uid);
    await userRef.update({
      username: trimmedUsername,
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Fetch updated user data
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res.status(404).json({
        error: "User not found",
        details: "User document does not exist",
        code: "USER_NOT_FOUND",
      });
    }

    const userData = userDoc.data()!;

    // Convert timestamps to ISO strings before passing to toUserClient
    const userClient = toUserClient({
      ...userData,
      joinDate: tsToIso(userData.joinDate),
      createdAt: tsToIso(userData.createdAt),
      updatedAt: tsToIso(userData.updatedAt),
      lastLogin: tsToIso(userData.lastLogin),
    });

    return res.json({
      user: userClient,
      message: "Username updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating username:", err);
    return res.status(500).json({
      error: "Failed to update username",
      details: err.message,
      code: "USERNAME_UPDATE_FAILED",
    });
  }
});

/**
 * PATCH /profile/preferences
 * Update user preferences (theme, notifications, monthly goals, etc.)
 */
router.patch("/preferences", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const uid = req.user!.uid;
    const { theme, notifications, emailNotifications, monthlyJournalGoal, dashboardCards } = req.body;

    console.log("Preferences update request body:", req.body);
    console.log("dashboardCards value:", dashboardCards);

    // Build preferences update object
    const preferencesUpdate: any = {};

    if (theme !== undefined) {
      const validThemes = ['default', 'ocean', 'sunset', 'forest', 'lavender', 'midnight'];
      if (!validThemes.includes(theme)) {
        return res.status(400).json({
          error: "Invalid theme",
          details: `Theme must be one of: ${validThemes.join(', ')}`,
          code: "INVALID_THEME",
        });
      }
      preferencesUpdate.theme = theme;
    }

    if (notifications !== undefined) {
      if (typeof notifications !== "boolean") {
        return res.status(400).json({
          error: "Invalid notifications value",
          details: "Notifications must be a boolean",
          code: "INVALID_NOTIFICATIONS",
        });
      }
      preferencesUpdate.notifications = notifications;
    }

    if (emailNotifications !== undefined) {
      if (typeof emailNotifications !== "boolean") {
        return res.status(400).json({
          error: "Invalid emailNotifications value",
          details: "Email notifications must be a boolean",
          code: "INVALID_EMAIL_NOTIFICATIONS",
        });
      }
      preferencesUpdate.emailNotifications = emailNotifications;
    }

    if (monthlyJournalGoal !== undefined) {
      if (typeof monthlyJournalGoal !== "number" || monthlyJournalGoal < 1 || monthlyJournalGoal > 100) {
        return res.status(400).json({
          error: "Invalid monthly journal goal",
          details: "Monthly journal goal must be a number between 1 and 100",
          code: "INVALID_MONTHLY_GOAL",
        });
      }
      preferencesUpdate.monthlyJournalGoal = monthlyJournalGoal;
    }

    if (dashboardCards !== undefined && dashboardCards !== null) {
      if (!Array.isArray(dashboardCards)) {
        return res.status(400).json({
          error: "Invalid dashboard cards",
          details: "Dashboard cards must be an array",
          code: "INVALID_DASHBOARD_CARDS",
        });
      }
      if (dashboardCards.length < 1) {
        return res.status(400).json({
          error: "Too few dashboard cards",
          details: "At least 1 dashboard card is required",
          code: "TOO_FEW_CARDS",
        });
      }
      if (dashboardCards.length > 6) {
        return res.status(400).json({
          error: "Too many dashboard cards",
          details: "Maximum 6 dashboard cards allowed",
          code: "TOO_MANY_CARDS",
        });
      }
      // Validate each card ID is a string
      if (!dashboardCards.every((card: any) => typeof card === "string")) {
        return res.status(400).json({
          error: "Invalid card ID format",
          details: "All card IDs must be strings",
          code: "INVALID_CARD_ID",
        });
      }
      console.log("Setting dashboardCards in preferencesUpdate:", dashboardCards);
      preferencesUpdate.dashboardCards = dashboardCards;
    }

    if (Object.keys(preferencesUpdate).length === 0) {
      return res.status(400).json({
        error: "No preferences to update",
        details: "At least one preference field must be provided",
        code: "NO_PREFERENCES",
      });
    }

    // Update preferences in Firestore
    const userRef = db.collection("users").doc(uid);

    // Merge with existing preferences
    const userDoc = await userRef.get();
    const currentPreferences = userDoc.data()?.preferences || {};
    const updatedPreferences = { ...currentPreferences, ...preferencesUpdate };

    await userRef.update({
      preferences: updatedPreferences,
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Fetch updated user data
    const updatedUserDoc = await userRef.get();
    if (!updatedUserDoc.exists) {
      return res.status(404).json({
        error: "User not found",
        details: "User document does not exist",
        code: "USER_NOT_FOUND",
      });
    }

    const userData = updatedUserDoc.data()!;

    // Convert timestamps to ISO strings before passing to toUserClient
    const userClient = toUserClient({
      ...userData,
      joinDate: tsToIso(userData.joinDate),
      createdAt: tsToIso(userData.createdAt),
      updatedAt: tsToIso(userData.updatedAt),
      lastLogin: tsToIso(userData.lastLogin),
    });

    return res.json({
      user: userClient,
      message: "Preferences updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating preferences:", err);
    return res.status(500).json({
      error: "Failed to update preferences",
      details: err.message,
      code: "PREFERENCES_UPDATE_FAILED",
    });
  }
});

export default router;
