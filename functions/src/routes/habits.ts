import { Router, Request, Response } from "express";
import { db, FieldValue, Timestamp } from "../lib/admin";
import { requireAuth } from "../middleware/requireAuth";
import { calculateXPUpdate } from "../lib/xpSystem";
import {
  checkAchievements,
  generateAchievementUpdate,
  extractStatsFromUserData,
} from "../lib/achievementSystem";

const router = Router();

// ============================================================================
// TYPES
// ============================================================================

interface Habit {
  id: string;
  title: string;
  description: string;
  frequency: "daily" | "weekly" | "monthly";
  completed: boolean;
  streak: number;
  lastCompleted?: string;
  xpReward: number;
  category: "mindfulness" | "physical" | "social" | "productivity" | "custom";
  createdAt: string;
  targetCompletions: number;
  currentCompletions: number;
  isIndefinite?: boolean; // If true, habit has no completion target - focus on building streaks
  isFullyCompleted?: boolean; // When currentCompletions >= targetCompletions (not applicable for indefinite habits)
  completedAt?: string; // When the entire habit goal was completed (not applicable for indefinite habits)
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert Firestore Timestamp to ISO string
 */
function tsToISO(v: any): string | null {
  if (v && typeof v.toDate === "function") return v.toDate().toISOString();
  if (v && typeof v.seconds === "number")
    return new Date(v.seconds * 1000).toISOString();
  return v ?? null;
}

/**
 * Serialize Firestore habit document to client-friendly format
 */
function serializeHabit(id: string, data: FirebaseFirestore.DocumentData): Habit {
  return {
    id,
    title: data.title || "",
    description: data.description || "",
    frequency: data.frequency || "daily",
    completed: !!data.completed,
    streak: data.streak || 0,
    lastCompleted: tsToISO(data.lastCompleted) || undefined,
    xpReward: data.xpReward || 10,
    category: data.category || "custom",
    createdAt: tsToISO(data.createdAt) || new Date().toISOString(),
    targetCompletions: data.targetCompletions || 1,
    currentCompletions: data.currentCompletions || 0,
    isIndefinite: data.isIndefinite || false,
    isFullyCompleted: data.isFullyCompleted || false,
    completedAt: tsToISO(data.completedAt) || undefined,
  };
}

/**
 * Check if enough time has passed to complete the habit again based on frequency
 * Returns true if the habit can be completed now
 */
function canCompleteHabit(
  frequency: "daily" | "weekly" | "monthly",
  lastCompleted: Date | null
): boolean {
  if (!lastCompleted) return true;

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const last = new Date(lastCompleted);
  last.setHours(0, 0, 0, 0);

  const diffMs = now.getTime() - last.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  switch (frequency) {
    case "daily":
      return diffDays >= 1;
    case "weekly":
      return diffDays >= 7;
    case "monthly":
      return diffDays >= 30;
    default:
      return true;
  }
}

/**
 * Calculate streak based on frequency and last completion
 * If the habit was completed within the allowed timeframe, increment streak
 * Otherwise, reset to 1
 */
function calculateStreak(
  frequency: "daily" | "weekly" | "monthly",
  lastCompleted: Date | null,
  currentStreak: number
): number {
  if (!lastCompleted) {
    return 1; // First completion
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const last = new Date(lastCompleted);
  last.setHours(0, 0, 0, 0);

  const diffMs = now.getTime() - last.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  switch (frequency) {
    case "daily":
      // If completed exactly 1 day ago, increment. If completed same day, keep current. Otherwise reset
      if (diffDays === 1) return currentStreak + 1;
      if (diffDays === 0) return currentStreak;
      return 1;
    case "weekly":
      // If completed 7-13 days ago (within a week window), increment
      if (diffDays >= 7 && diffDays <= 13) return currentStreak + 1;
      if (diffDays < 7) return currentStreak;
      return 1;
    case "monthly":
      // If completed 28-35 days ago (within a month window), increment
      if (diffDays >= 28 && diffDays <= 35) return currentStreak + 1;
      if (diffDays < 28) return currentStreak;
      return 1;
    default:
      return currentStreak + 1;
  }
}

// ============================================================================
// ROUTES
// ============================================================================

/**
 * GET /api/habits
 * List all habits for the authenticated user
 */
router.get("/", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;
    const habitsRef = db.collection("users").doc(uid).collection("habits");
    const snapshot = await habitsRef.orderBy("createdAt", "desc").get();

    const habits = snapshot.docs.map((doc) => serializeHabit(doc.id, doc.data()));
    res.json(habits);
  } catch (error: any) {
    console.error("Error listing habits:", error);
    res.status(500).json({ error: "Failed to list habits", details: error.message });
  }
});

/**
 * GET /api/habits/completed
 * List all fully completed habits (currentCompletions >= targetCompletions)
 */
router.get("/completed", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;
    const habitsRef = db.collection("users").doc(uid).collection("habits");
    const snapshot = await habitsRef
      .where("isFullyCompleted", "==", true)
      .orderBy("completedAt", "desc")
      .get();

    const habits = snapshot.docs.map((doc) => serializeHabit(doc.id, doc.data()));
    res.json(habits);
  } catch (error: any) {
    console.error("Error listing completed habits:", error);
    res.status(500).json({ error: "Failed to list completed habits", details: error.message });
  }
});

/**
 * POST /api/habits
 * Create a new habit and update user habitStats
 */
router.post("/", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;
    const {
      title,
      description = "",
      frequency = "daily",
      xpReward = 10,
      category = "custom",
      targetCompletions = 1,
      isIndefinite = false,
    } = req.body;

    if (!title || typeof title !== "string") {
      res.status(400).json({ error: "title is required" });
      return;
    }

    const now = Timestamp.now();
    const userRef = db.collection("users").doc(uid);
    const habitRef = userRef.collection("habits").doc();

    const habitData = {
      title,
      description,
      frequency,
      completed: false,
      streak: 0,
      xpReward,
      category,
      createdAt: now,
      targetCompletions: isIndefinite ? 0 : targetCompletions, // Set to 0 for indefinite habits
      currentCompletions: 0,
      isIndefinite,
      isFullyCompleted: false,
    };

    // Use transaction to create habit and update user stats atomically
    await db.runTransaction(async (tx) => {
      // Create the habit
      tx.set(habitRef, habitData);

      // Update user habitStats
      tx.set(
        userRef,
        {
          "habitStats.totalHabitsCreated": FieldValue.increment(1),
          "habitStats.currentActiveHabits": FieldValue.increment(1),
          [`habitStats.category.${category}`]: FieldValue.increment(1),
          [`habitStats.frequency.${frequency}`]: FieldValue.increment(1),
        },
        { merge: true }
      );
    });

    const created = await habitRef.get();
    res.status(201).json(serializeHabit(habitRef.id, created.data()!));
  } catch (error: any) {
    console.error("Error creating habit:", error);
    res.status(500).json({ error: "Failed to create habit", details: error.message });
  }
});

/**
 * PUT /api/habits/:id
 * Update an existing habit
 * Only allows updating: title, description, category
 * Does NOT allow updating: frequency, xpReward, targetCompletions (these are locked after creation)
 */
router.put("/:id", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;
    const { id } = req.params;
    const updates = req.body;

    if (!id || typeof id !== "string") {
      res.status(400).json({ error: "Habit id is required" });
      return;
    }

    const habitRef = db.collection("users").doc(uid).collection("habits").doc(id);
    const habitSnap = await habitRef.get();

    if (!habitSnap.exists) {
      res.status(404).json({ error: "Habit not found" });
      return;
    }

    // Only allow updating specific fields (title, description, category)
    // Frequency, xpReward, and targetCompletions are NOT editable after creation
    const allowedUpdates = {
      ...(updates.title && { title: updates.title }),
      ...(updates.description !== undefined && { description: updates.description }),
      ...(updates.category && { category: updates.category }),
    };

    // Prevent updating locked fields
    if (Object.keys(allowedUpdates).length === 0) {
      res.status(400).json({ error: "No valid fields to update" });
      return;
    }

    await habitRef.set(allowedUpdates, { merge: true });

    const updated = await habitRef.get();
    res.json(serializeHabit(habitRef.id, updated.data()!));
  } catch (error: any) {
    console.error("Error updating habit:", error);
    res.status(500).json({ error: "Failed to update habit", details: error.message });
  }
});

/**
 * POST /api/habits/:id/complete
 * Mark a habit as completed for the current period (day/week/month)
 * Awards XP, increments streak, and updates habitStats
 */
router.post("/:id/complete", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      res.status(400).json({ error: "Habit id is required" });
      return;
    }

    const habitRef = db.collection("users").doc(uid).collection("habits").doc(id);
    const userRef = db.collection("users").doc(uid);

    // Variable to store newly unlocked achievements
    let newlyUnlockedAchievements: any[] = [];

    await db.runTransaction(async (tx) => {
      // ALL READS MUST COME FIRST
      const habitSnap = await tx.get(habitRef);
      const userSnap = await tx.get(userRef);

      if (!habitSnap.exists) {
        throw new Error("Habit not found");
      }

      const habitData = habitSnap.data()!;
      const lastCompleted = habitData.lastCompleted?.toDate() || null;
      const frequency = habitData.frequency;

      // Check if enough time has passed to complete the habit again
      if (!canCompleteHabit(frequency, lastCompleted)) {
        throw new Error("Cannot complete habit yet. Please wait for the next period.");
      }

      const now = Timestamp.now();
      const currentStreak = habitData.streak || 0;
      const newStreak = calculateStreak(frequency, lastCompleted, currentStreak);
      const newCompletions = (habitData.currentCompletions || 0) + 1;
      const targetCompletions = habitData.targetCompletions || 1;
      const xpReward = habitData.xpReward || 10;
      const isIndefinite = habitData.isIndefinite || false;

      // Check if this completion fulfills the entire habit goal (not applicable for indefinite habits)
      const isNowFullyCompleted = !isIndefinite && newCompletions >= targetCompletions;
      const wasNotFullyCompleted = !habitData.isFullyCompleted;

      // Get current user data to check longest streak and calculate XP
      const userData = userSnap.data() || {};
      const currentLongestStreak = userData.habitStats?.longestStreak || 0;
      const currentTotalXP = userData.totalXP || 0;

      // Calculate XP and level updates
      const xpUpdate = calculateXPUpdate(currentTotalXP, xpReward);

      // Calculate new total habit completions for achievement checking
      const habitStats = userData.habitStats || {};
      const newTotalHabitCompletions = (habitStats.totalHabitCompletions || 0) + 1;

      // Check for newly unlocked achievements with updated stats
      const statsForAchievements = extractStatsFromUserData({
        ...userData,
        habitStats: {
          ...habitStats,
          totalHabitCompletions: newTotalHabitCompletions,
        },
        totalXP: xpUpdate.totalXP,
      });

      const achievementCheck = checkAchievements(statsForAchievements);
      newlyUnlockedAchievements = achievementCheck.newlyUnlocked;
      const achievementUpdate = generateAchievementUpdate(achievementCheck.newlyUnlocked);

      // NOW DO ALL WRITES

      // Update habit
      tx.set(
        habitRef,
        {
          completed: true,
          lastCompleted: now,
          streak: newStreak,
          currentCompletions: newCompletions,
          ...(isNowFullyCompleted && {
            isFullyCompleted: true,
            completedAt: now,
          }),
        },
        { merge: true }
      );

      // Update user stats
      const { spendableXPAmount, ...xpUpdateFields } = xpUpdate;

      const userUpdates: any = {
        ...xpUpdateFields,
        ...achievementUpdate,
        spendableXP: FieldValue.increment(spendableXPAmount),
        "habitStats.totalHabitCompletions": FieldValue.increment(1),
        "habitStats.totalXpFromHabits": FieldValue.increment(xpReward),
      };

      // Update longest streak if new streak is higher
      if (newStreak > currentLongestStreak) {
        userUpdates["habitStats.longestStreak"] = newStreak;
      }

      // If habit just became fully completed, update completion stats
      if (isNowFullyCompleted && wasNotFullyCompleted) {
        userUpdates["habitStats.totalHabitsCompleted"] = FieldValue.increment(1);
        userUpdates["habitStats.currentActiveHabits"] = FieldValue.increment(-1);
      }

      tx.set(userRef, userUpdates, { merge: true });
    });

    const updated = await habitRef.get();
    const response: any = {
      habit: serializeHabit(habitRef.id, updated.data()!),
    };

    // Include newly unlocked achievements in response
    if (newlyUnlockedAchievements.length > 0) {
      response.achievementsUnlocked = newlyUnlockedAchievements.map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        points: a.points,
        category: a.category,
      }));
    }

    res.json(response);
  } catch (error: any) {
    console.error("Error completing habit:", error);
    if (error.message.includes("Cannot complete habit yet")) {
      res.status(400).json({ error: error.message });
    } else if (error.message === "Habit not found") {
      res.status(404).json({ error: "Habit not found" });
    } else {
      res.status(500).json({ error: "Failed to complete habit", details: error.message });
    }
  }
});

/**
 * DELETE /api/habits/:id
 * Delete a habit and update user stats
 */
router.delete("/:id", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      res.status(400).json({ error: "Habit id is required" });
      return;
    }

    const habitRef = db.collection("users").doc(uid).collection("habits").doc(id);
    const userRef = db.collection("users").doc(uid);

    await db.runTransaction(async (tx) => {
      const habitSnap = await tx.get(habitRef);
      if (!habitSnap.exists) {
        throw new Error("Habit not found");
      }

      const habitData = habitSnap.data()!;
      const isFullyCompleted = habitData.isFullyCompleted || false;

      // Delete the habit
      tx.delete(habitRef);

      // Update user stats - only decrement currentActiveHabits if habit was not fully completed
      if (!isFullyCompleted) {
        tx.set(
          userRef,
          {
            "habitStats.currentActiveHabits": FieldValue.increment(-1),
          },
          { merge: true }
        );
      }
    });

    res.status(204).send();
  } catch (error: any) {
    console.error("Error deleting habit:", error);
    if (error.message === "Habit not found") {
      res.status(404).json({ error: "Habit not found" });
    } else {
      res.status(500).json({ error: "Failed to delete habit", details: error.message });
    }
  }
});

/**
 * DELETE /api/habits/all
 * Delete all habits for the authenticated user
 */
router.delete("/all", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;
    const userRef = db.collection("users").doc(uid);
    const habitsCollection = userRef.collection("habits");

    // Get all habits
    const habitsSnapshot = await habitsCollection.get();
    const habitsCount = habitsSnapshot.size;

    if (habitsCount === 0) {
      res.json({
        success: true,
        message: "No habits to delete",
        deletedCount: 0
      });
      return;
    }

    // Delete all habits in batches (Firestore batch limit is 500)
    const batchSize = 500;
    const batches: any[] = [];

    for (let i = 0; i < habitsSnapshot.docs.length; i += batchSize) {
      const batch = db.batch();
      const batchDocs = habitsSnapshot.docs.slice(i, i + batchSize);

      batchDocs.forEach(doc => {
        batch.delete(doc.ref);
      });

      batches.push(batch.commit());
    }

    await Promise.all(batches);

    // Reset habit stats to zero
    await userRef.set({
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
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });

    res.json({
      success: true,
      message: `Successfully deleted ${habitsCount} habits`,
      deletedCount: habitsCount
    });
  } catch (error: any) {
    console.error("Error deleting all habits:", error);
    res.status(500).json({ error: "Failed to delete all habits", details: error.message });
  }
});

export default router;
