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
 * Serialize Firestore task document to client-friendly format
 */
function serializeTask(id: string, data: FirebaseFirestore.DocumentData) {
  return {
    id,
    title: data.title,
    description: data.description ?? "",
    priority: data.priority ?? "medium",
    category: data.category ?? "personal",
    completed: !!data.completed,
    createdAt: tsToISO(data.createdAt),
    completedAt: tsToISO(data.completedAt),
    dueDate: data.dueDate ?? null,
    dueTime: data.dueTime ?? null,
  };
}

// ============================================================================
// ROUTES
// ============================================================================

/**
 * GET /api/tasks
 * List all tasks for the authenticated user
 */
router.get("/", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;
    const snap = await db.collection("users").doc(uid).collection("tasks").get();
    const tasks = snap.docs.map((d) => serializeTask(d.id, d.data()));
    res.json(tasks);
  } catch (error: any) {
    console.error("Error listing tasks:", error);
    res.status(500).json({ error: "Failed to list tasks", details: error.message });
  }
});

/**
 * POST /api/tasks
 * Create a new task
 */
router.post("/", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;
    const {
      title,
      description = "",
      priority = "medium",
      category = "personal",
      dueDate,
      dueTime,
    } = req.body;

    if (!title || typeof title !== "string") {
      res.status(400).json({ error: "title is required" });
      return;
    }

    const userRef = db.collection("users").doc(uid);
    const taskRef = userRef.collection("tasks").doc();

    // Use transaction to ensure atomic updates
    await db.runTransaction(async (tx) => {
      const userSnap = await tx.get(userRef);
      const now = Timestamp.now();

      // Create the task
      tx.set(taskRef, {
        title,
        description,
        priority,
        category,
        completed: false,
        createdAt: now,
        ...(dueDate ? { dueDate } : {}),
        ...(dueTime ? { dueTime } : {}),
      });

      // Update user task stats
      if (!userSnap.exists) {
        tx.set(
          userRef,
          {
            totalTasksCreated: 1,
            taskStats: {
              totalTasksCreated: 1,
              currentTasksCreated: 1,
              currentTasksPending: 1,
              priorityCompletion: {
                high: priority === "high" ? 1 : 0,
                medium: priority === "medium" ? 1 : 0,
                low: priority === "low" ? 1 : 0,
              },
            },
          },
          { merge: true }
        );
      } else {
        // Build priority update dynamically within taskStats
        const priorityUpdate: any = {};
        if (priority === "high") {
          priorityUpdate.high = FieldValue.increment(1);
        } else if (priority === "medium") {
          priorityUpdate.medium = FieldValue.increment(1);
        } else if (priority === "low") {
          priorityUpdate.low = FieldValue.increment(1);
        }

        tx.set(
          userRef,
          {
            totalTasksCreated: FieldValue.increment(1),
            taskStats: {
              totalTasksCreated: FieldValue.increment(1),
              currentTasksCreated: FieldValue.increment(1),
              currentTasksPending: FieldValue.increment(1),
              priorityCompletion: priorityUpdate,
            },
          },
          { merge: true }
        );
      }
    });

    const created = await taskRef.get();
    res.status(201).json(serializeTask(taskRef.id, created.data()!));
  } catch (error: any) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task", details: error.message });
  }
});

/**
 * PATCH /api/tasks/:id
 * Update an existing task
 */
router.patch("/:id", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;
    const { id } = req.params;
    const { title, description, priority, category, dueDate, dueTime } = req.body;

    if (!id || typeof id !== "string") {
      res.status(400).json({ error: "Task id is required" });
      return;
    }

    const taskRef = db.collection("users").doc(uid).collection("tasks").doc(id);
    const patch: any = {};

    if (title !== undefined) patch.title = title;
    if (description !== undefined) patch.description = description;
    if (priority !== undefined) patch.priority = priority;
    if (category !== undefined) patch.category = category;
    if (dueDate !== undefined)
      patch.dueDate = dueDate || FieldValue.delete();
    if (dueTime !== undefined)
      patch.dueTime = dueTime || FieldValue.delete();

    await taskRef.update(patch);
    const updated = await taskRef.get();

    if (!updated.exists) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.json(serializeTask(id, updated.data()!));
  } catch (error: any) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task", details: error.message });
  }
});

/**
 * POST /api/tasks/:id/complete
 * Mark a task as completed
 */
router.post("/:id/complete", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      res.status(400).json({ error: "Task id is required" });
      return;
    }

    const userRef = db.collection("users").doc(uid);
    const taskRef = userRef.collection("tasks").doc(id);

    // Variable to store newly unlocked achievements
    let newlyUnlockedAchievements: any[] = [];

    await db.runTransaction(async (tx) => {
      // Read both task and user data first
      const snap = await tx.get(taskRef);
      const userSnap = await tx.get(userRef);

      if (!snap.exists) throw new Error("Task not found");

      const t = snap.data()!;

      // Already completed? No-op (idempotent)
      if (t.completed) return;

      // Get user data for XP calculation
      const userData = userSnap.data() || {};
      const currentTotalXP = userData.totalXP || 0;

      // Calculate XP and level updates (20 XP per task completion)
      const xpUpdate = calculateXPUpdate(currentTotalXP, 20);

      // Calculate new lifetime stats
      const taskStats = userData.taskStats || {};
      const newTotalCompleted = (taskStats.totalTasksCompleted || 0) + 1;
      const totalCreated = taskStats.totalTasksCreated || 0;
      const totalSuccessRate = totalCreated > 0 ? (newTotalCompleted / totalCreated) * 100 : 0;

      // Check for newly unlocked achievements with updated stats
      const statsForAchievements = extractStatsFromUserData({
        ...userData,
        taskStats: {
          ...taskStats,
          totalTasksCompleted: newTotalCompleted,
        },
        totalXP: xpUpdate.totalXP,
      });

      const achievementCheck = checkAchievements(statsForAchievements);
      newlyUnlockedAchievements = achievementCheck.newlyUnlocked;
      const achievementUpdate = generateAchievementUpdate(achievementCheck.newlyUnlocked);

      const now = Timestamp.now();

      // Update task
      tx.update(taskRef, {
        completed: true,
        completedAt: now,
      });

      // Update user stats with XP, level, rank, and achievement updates
      const { spendableXPAmount, ...xpUpdateFields } = xpUpdate;

      tx.set(
        userRef,
        {
          ...xpUpdateFields,
          ...achievementUpdate,
          spendableXP: FieldValue.increment(spendableXPAmount),
          taskStats: {
            currentTasksPending: FieldValue.increment(-1),
            currentTasksCompleted: FieldValue.increment(1),
            totalTasksCompleted: FieldValue.increment(1),
            totalSuccessRate: totalSuccessRate,
            totalXPfromTasks: FieldValue.increment(20),
          },
          totalTasksCompleted: FieldValue.increment(1),
        },
        { merge: true }
      );
    });

    const updated = await taskRef.get();
    const response: any = {
      task: serializeTask(id, updated.data()!),
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
    console.error("Error completing task:", error);
    if (error.message === "Task not found") {
      res.status(404).json({ error: "Task not found" });
    } else {
      res.status(500).json({ error: "Failed to complete task", details: error.message });
    }
  }
});

/**
 * DELETE /api/tasks/:id
 * Delete a task
 */
router.delete("/:id", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      res.status(400).json({ error: "Task id is required" });
      return;
    }

    const userRef = db.collection("users").doc(uid);
    const taskRef = userRef.collection("tasks").doc(id);

    await db.runTransaction(async (tx) => {
      const tSnap = await tx.get(taskRef);
      const userSnap = await tx.get(userRef);

      if (!tSnap.exists) return;

      const t = tSnap.data()!;
      const userData = userSnap.data() || {};
      const taskStats = userData.taskStats || {};

      tx.delete(taskRef);

      // Calculate new lifetime stats
      const newTotalCreated = Math.max(0, (taskStats.totalTasksCreated || 0) - 1);
      const newTotalCompleted = t.completed
        ? Math.max(0, (taskStats.totalTasksCompleted || 0) - 1)
        : (taskStats.totalTasksCompleted || 0);
      const totalSuccessRate = newTotalCreated > 0
        ? (newTotalCompleted / newTotalCreated) * 100
        : 0;

      // Build taskStats update object
      const taskStatsUpdate: any = {
        currentTasksCreated: FieldValue.increment(-1),
        totalTasksCreated: FieldValue.increment(-1),
        totalSuccessRate: totalSuccessRate,
      };

      // Decrement priority counter within taskStats
      const taskPriority = t.priority || "medium";
      const priorityUpdate: any = {};
      if (taskPriority === "high") {
        priorityUpdate.high = FieldValue.increment(-1);
      } else if (taskPriority === "medium") {
        priorityUpdate.medium = FieldValue.increment(-1);
      } else if (taskPriority === "low") {
        priorityUpdate.low = FieldValue.increment(-1);
      }
      taskStatsUpdate.priorityCompletion = priorityUpdate;

      // If it wasn't completed yet, it was pending, so decrement pending
      if (!t.completed) {
        taskStatsUpdate.currentTasksPending = FieldValue.increment(-1);
      } else {
        // Also lower the completed count when deleting a completed task
        taskStatsUpdate.currentTasksCompleted = FieldValue.increment(-1);
        taskStatsUpdate.totalTasksCompleted = FieldValue.increment(-1);
      }

      tx.set(userRef, { taskStats: taskStatsUpdate }, { merge: true });
    });

    res.status(204).send();
  } catch (error: any) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task", details: error.message });
  }
});

/**
 * DELETE /api/tasks/all
 * Delete all tasks for the authenticated user
 */
router.delete("/all", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;
    const userRef = db.collection("users").doc(uid);
    const tasksCollection = userRef.collection("tasks");

    // Get all tasks
    const tasksSnapshot = await tasksCollection.get();
    const tasksCount = tasksSnapshot.size;

    if (tasksCount === 0) {
      res.json({
        success: true,
        message: "No tasks to delete",
        deletedCount: 0
      });
      return;
    }

    // Delete all tasks in batches (Firestore batch limit is 500)
    const batchSize = 500;
    const batches: any[] = [];

    for (let i = 0; i < tasksSnapshot.docs.length; i += batchSize) {
      const batch = db.batch();
      const batchDocs = tasksSnapshot.docs.slice(i, i + batchSize);

      batchDocs.forEach(doc => {
        batch.delete(doc.ref);
      });

      batches.push(batch.commit());
    }

    await Promise.all(batches);

    // Reset task stats to zero
    await userRef.set({
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
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });

    res.json({
      success: true,
      message: `Successfully deleted ${tasksCount} tasks`,
      deletedCount: tasksCount
    });
  } catch (error: any) {
    console.error("Error deleting all tasks:", error);
    res.status(500).json({ error: "Failed to delete all tasks", details: error.message });
  }
});

export default router;
