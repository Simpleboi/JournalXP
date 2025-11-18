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

export default router;
