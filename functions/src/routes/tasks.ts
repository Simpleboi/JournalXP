import { Router, Request, Response } from "express";
import { db, FieldValue, Timestamp } from "../lib/admin";
import { requireAuth } from "../middleware/requireAuth";

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
            },
          },
          { merge: true }
        );
      } else {
        tx.set(
          userRef,
          {
            totalTasksCreated: FieldValue.increment(1),
            taskStats: {
              totalTasksCreated: FieldValue.increment(1),
              currentTasksCreated: FieldValue.increment(1),
              currentTasksPending: FieldValue.increment(1),
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

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(taskRef);
      if (!snap.exists) throw new Error("Task not found");

      const t = snap.data()!;

      // Already completed? No-op (idempotent)
      if (t.completed) return;

      const now = Timestamp.now();

      tx.update(taskRef, {
        completed: true,
        completedAt: now,
      });

      tx.set(
        userRef,
        {
          taskStats: {
            currentTasksPending: FieldValue.increment(-1),
            currentTasksCompleted: FieldValue.increment(1),
          },
          totalTasksCompleted: FieldValue.increment(1),
          xp: FieldValue.increment(20),
          totalXP: FieldValue.increment(20),
        },
        { merge: true }
      );
    });

    const updated = await taskRef.get();
    res.json(serializeTask(id, updated.data()!));
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
      if (!tSnap.exists) return;

      const t = tSnap.data()!;
      tx.delete(taskRef);

      // Always decrement "created"
      const updates: FirebaseFirestore.UpdateData<FirebaseFirestore.DocumentData> = {
        "taskStats.currentTasksCreated": FieldValue.increment(-1),
      };

      // If it wasn't completed yet, it was pending, so decrement pending
      if (!t.completed) {
        updates["taskStats.currentTasksPending"] = FieldValue.increment(-1);
      } else {
        // Also lower the completed count when deleting a completed task
        updates["taskStats.currentTasksCompleted"] = FieldValue.increment(-1);
      }

      tx.update(userRef, updates);
    });

    res.status(204).send();
  } catch (error: any) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task", details: error.message });
  }
});

export default router;
