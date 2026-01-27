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
      const { spendableXPAmount, ...xpUpdateFields } = xpUpdate;

      // Update user with new XP, level, and rank
      tx.set(userRef, {
        ...xpUpdateFields,
        spendableXP: FieldValue.increment(spendableXPAmount),
      }, { merge: true });
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
 * Reset user to default state as if they just created a new account
 *
 * This endpoint resets all user stats to initial state and deletes:
 * - All tasks
 * - All habits
 * - All journal entries
 * - All Sunday chat conversations and messages
 * - All summaries
 *
 * User identity (email, username, profile picture, join date) is preserved.
 */
router.post("/reset-progress", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;
    const userRef = db.collection("users").doc(uid);

    // Helper function to delete a subcollection in batches
    const deleteSubcollection = async (collectionRef: FirebaseFirestore.CollectionReference): Promise<number> => {
      const snapshot = await collectionRef.get();
      const count = snapshot.size;

      if (count > 0) {
        const batchSize = 500;
        const batches: Promise<void>[] = [];

        for (let i = 0; i < snapshot.docs.length; i += batchSize) {
          const batch = db.batch();
          const batchDocs = snapshot.docs.slice(i, i + batchSize);

          batchDocs.forEach(doc => {
            batch.delete(doc.ref);
          });

          batches.push(batch.commit().then(() => {}));
        }

        await Promise.all(batches);
      }

      return count;
    };

    // Delete all tasks
    const tasksCount = await deleteSubcollection(userRef.collection("tasks"));

    // Delete all habits
    const habitsCount = await deleteSubcollection(userRef.collection("habits"));

    // Delete all journal entries
    const journalsCount = await deleteSubcollection(userRef.collection("journalEntries"));

    // Delete all summaries (AI-generated summaries)
    await deleteSubcollection(userRef.collection("summaries"));

    // Delete all Sunday chats (including nested messages)
    const sundayChatsSnapshot = await userRef.collection("sundayChats").get();
    const sundayChatsCount = sundayChatsSnapshot.size;

    for (const chatDoc of sundayChatsSnapshot.docs) {
      // Delete messages subcollection first
      await deleteSubcollection(chatDoc.ref.collection("messages"));
      // Then delete the chat document
      await chatDoc.ref.delete();
    }

    // Reset user stats in a transaction
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
        spendableXP: 0,
        xpNeededToNextLevel: 100,
        streak: 0,
        rank: rankInfo.rank,
        nextRank: rankInfo.nextRank,
        // Preserve user identity fields
        // username, email, displayName, profilePicture, joinDate, createdAt stay the same
        // Reset achievements and inventory
        achievements: [],
        achievementPoints: 0,
        inventory: [],
        // Reset all journal stats
        journalStats: {
          journalCount: 0,
          totalJournalEntries: 0,
          totalWordCount: 0,
          averageEntryLength: 0,
          mostUsedWords: [],
          wordFrequency: {},
          totalXPfromJournals: 0,
          totalWordsWritten: 0,
          longestEntry: 0,
          typeBreakdown: {
            freeWriting: 0,
            guided: 0,
            gratitude: 0,
          },
          lifetimeTypeBreakdown: {
            freeWriting: 0,
            guided: 0,
            gratitude: 0,
          },
          favoriteCount: 0,
          bestStreak: 0,
        },
        // Reset last journal entry date
        lastJournalEntryDate: null,
        taskStats: {
          currentTasksCreated: 0,
          currentTasksCompleted: 0,
          currentTasksPending: 0,
          completionRate: 0,
          totalTasksCreated: 0,
          totalTasksCompleted: 0,
          totalSuccessRate: 0,
          totalXPfromTasks: 0,
          avgCompletionTime: 0,
          priorityCompletion: { high: 0, medium: 0, low: 0 },
          bestStreak: 0,
          onTimeCompletions: 0,
          lateCompletions: 0,
          highPriorityCompleted: 0,
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
          totalFullyCompleted: 0,
        },
        // Reset additional stats
        sundayConversationCount: 0,
        sundayStats: {
          totalConversations: 0,
          totalMessages: 0,
          longestConversation: 0,
          totalMinutesSpent: 0,
        },
        meditationStats: {
          totalSessions: 0,
          totalMinutes: 0,
          longestSession: 0,
          currentStreak: 0,
          bestStreak: 0,
        },
        communityStats: {
          totalReflectionsPosted: 0,
          totalCommentsGiven: 0,
          totalSupportGiven: 0,
          totalSupportReceived: 0,
        },
        petStats: {
          totalInteractions: 0,
          daysWithPet: 0,
          revivals: 0,
          questsCompleted: 0,
          itemsCollected: 0,
        },
        achievementStats: {
          totalUnlocked: 0,
          completionPercentage: 0,
        },
        progression: {
          totalLevelUps: 0,
          highestRankReached: rankInfo.rank,
          xpBreakdown: {
            journals: 0,
            tasks: 0,
            habits: 0,
          },
        },
        patterns: {
          consistencyScore: 0,
        },
        bestStreak: 0,
        currentLoginStreak: 0,
        bestLoginStreak: 0,
        totalActiveDays: 0,
        averageSessionsPerWeek: 0,
        updatedAt: FieldValue.serverTimestamp(),
      };

      tx.set(userRef, resetData, { merge: true });
    });

    // Fetch updated user data
    const updatedUser = await userRef.get();
    const updatedData = updatedUser.data()!;

    res.json({
      success: true,
      message: `Account reset to fresh start. Deleted ${journalsCount} journal entries, ${tasksCount} tasks, ${habitsCount} habits, and ${sundayChatsCount} Sunday conversations.`,
      deletedCounts: {
        journals: journalsCount,
        tasks: tasksCount,
        habits: habitsCount,
        sundayChats: sundayChatsCount,
      },
      user: {
        level: updatedData.level,
        xp: updatedData.xp,
        totalXP: updatedData.totalXP,
        spendableXP: updatedData.spendableXP,
        streak: updatedData.streak,
        rank: updatedData.rank,
        nextRank: updatedData.nextRank,
        achievements: updatedData.achievements,
        achievementPoints: updatedData.achievementPoints,
        inventory: updatedData.inventory,
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
