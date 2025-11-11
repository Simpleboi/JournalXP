import { Router, Request, Response } from "express";
import { db, FieldValue } from "../lib/admin";
import { requireAuth } from "../middleware/requireAuth";
import { calculateXPUpdate } from "../lib/xpSystem";
import { getRankInfo } from "../../../shared/utils/rankSystem";

const router = Router();

/**
 * POST /api/test/award-xp
 * Award test XP to the authenticated user
 *
 * TESTING ONLY - This endpoint allows awarding arbitrary XP amounts
 * for testing the leveling and ranking system
 */
router.post("/award-xp", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;
    const { xp } = req.body;

    // Validate XP amount
    if (typeof xp !== "number" || xp <= 0) {
      res.status(400).json({ error: "xp must be a positive number" });
      return;
    }

    // Limit to reasonable amounts (prevent overflow)
    if (xp > 1000000) {
      res.status(400).json({ error: "xp amount too large (max: 1,000,000)" });
      return;
    }

    const userRef = db.collection("users").doc(uid);

    await db.runTransaction(async (tx) => {
      const userSnap = await tx.get(userRef);

      if (!userSnap.exists) {
        throw new Error("User not found");
      }

      const userData = userSnap.data()!;
      const currentTotalXP = userData.totalXP || 0;

      // Calculate XP, level, and rank updates
      const xpUpdate = calculateXPUpdate(currentTotalXP, xp);

      // Update user with new XP, level, and rank
      tx.set(userRef, xpUpdate, { merge: true });
    });

    // Fetch updated user data
    const updatedUser = await userRef.get();
    const updatedData = updatedUser.data()!;

    res.json({
      success: true,
      message: `Awarded ${xp} XP`,
      user: {
        totalXP: updatedData.totalXP,
        xp: updatedData.xp,
        level: updatedData.level,
        rank: updatedData.rank,
        nextRank: updatedData.nextRank,
        xpNeededToNextLevel: updatedData.xpNeededToNextLevel,
      },
    });
  } catch (error: any) {
    console.error("Error awarding test XP:", error);
    res.status(500).json({
      error: "Failed to award XP",
      details: error.message
    });
  }
});

/**
 * POST /api/test/reset-progress
 * Reset user progress to default starter values
 *
 * TESTING/UTILITY - This endpoint resets all user stats to initial state
 * Useful for testing or allowing users to start fresh
 */
router.post("/reset-progress", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;
    const userRef = db.collection("users").doc(uid);

    await db.runTransaction(async (tx) => {
      const userSnap = await tx.get(userRef);

      if (!userSnap.exists) {
        throw new Error("User not found");
      }

      const initialLevel = 1;
      const rankInfo = getRankInfo(initialLevel);

      // Reset to default starter values
      const resetData = {
        level: initialLevel,
        xp: 0,
        totalXP: 0,
        xpNeededToNextLevel: 100,
        streak: 0,
        rank: rankInfo.rank,
        nextRank: rankInfo.nextRank,
        // Preserve user identity fields
        // username, email, displayName, profilePicture, joinDate, createdAt stay the same
        // Reset all stats
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
        updatedAt: FieldValue.serverTimestamp(),
      };

      tx.set(userRef, resetData, { merge: true });
    });

    // Fetch updated user data
    const updatedUser = await userRef.get();
    const updatedData = updatedUser.data()!;

    res.json({
      success: true,
      message: "Progress reset to default values",
      user: {
        level: updatedData.level,
        xp: updatedData.xp,
        totalXP: updatedData.totalXP,
        streak: updatedData.streak,
        rank: updatedData.rank,
        nextRank: updatedData.nextRank,
        journalStats: updatedData.journalStats,
        taskStats: updatedData.taskStats,
        habitStats: updatedData.habitStats,
      },
    });
  } catch (error: any) {
    console.error("Error resetting progress:", error);
    res.status(500).json({
      error: "Failed to reset progress",
      details: error.message
    });
  }
});

export default router;
