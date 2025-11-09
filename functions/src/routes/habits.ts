import { Router, Request, Response } from "express";
import { db, FieldValue, Timestamp } from "../lib/admin";
import { requireAuth } from "../middleware/requireAuth";

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
  isFullyCompleted?: boolean; // When currentCompletions >= targetCompletions
  completedAt?: string; // When the entire habit goal was completed
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
 * Create a new habit
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
    } = req.body;

    if (!title || typeof title !== "string") {
      res.status(400).json({ error: "title is required" });
      return;
    }

    const now = Timestamp.now();
    const habitRef = db.collection("users").doc(uid).collection("habits").doc();

    const habitData = {
      title,
      description,
      frequency,
      completed: false,
      streak: 0,
      xpReward,
      category,
      createdAt: now,
      targetCompletions,
      currentCompletions: 0,
      isFullyCompleted: false,
    };

    await habitRef.set(habitData);

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

    // Only allow updating certain fields
    const allowedUpdates = {
      ...(updates.title && { title: updates.title }),
      ...(updates.description !== undefined && { description: updates.description }),
      ...(updates.frequency && { frequency: updates.frequency }),
      ...(updates.xpReward !== undefined && { xpReward: updates.xpReward }),
      ...(updates.category && { category: updates.category }),
      ...(updates.targetCompletions !== undefined && {
        targetCompletions: updates.targetCompletions,
      }),
    };

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
 * Awards XP and increments streak
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

    await db.runTransaction(async (tx) => {
      const habitSnap = await tx.get(habitRef);
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

      // Check if this completion fulfills the entire habit goal
      const isNowFullyCompleted = newCompletions >= targetCompletions;

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

      // Award XP to user
      tx.set(
        userRef,
        {
          xp: FieldValue.increment(xpReward),
          totalXP: FieldValue.increment(xpReward),
        },
        { merge: true }
      );
    });

    const updated = await habitRef.get();
    res.json(serializeHabit(habitRef.id, updated.data()!));
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
 * Delete a habit
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
    const habitSnap = await habitRef.get();

    if (!habitSnap.exists) {
      res.status(404).json({ error: "Habit not found" });
      return;
    }

    await habitRef.delete();
    res.status(204).send();
  } catch (error: any) {
    console.error("Error deleting habit:", error);
    res.status(500).json({ error: "Failed to delete habit", details: error.message });
  }
});

export default router;
