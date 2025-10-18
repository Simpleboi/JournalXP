import { Request, Response } from "express";
import admin from "firebase-admin";
import { db } from "@/lib/firebaseAdmin";

const FieldValue = admin.firestore.FieldValue;

// ------- Controllers -----------------
function tsToISO(v: any): string | null {
  if (v && typeof v.toDate === "function") return v.toDate().toISOString();
  if (v && typeof v.seconds === "number")
    return new Date(v.seconds * 1000).toISOString();
  return v ?? null;
}

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

// ------- Controllers -----------------

// Function to list daily tasks
export async function listTasks(req: Request, res: Response) {
  const uid = (req as any).uid as string;
  const snap = await db.collection("users").doc(uid).collection("tasks").get();
  const tasks = snap.docs.map((d) => serializeTask(d.id, d.data()));
  res.json(tasks);
}

// Function to create a new task
// taskController.ts (createTask)
export async function createTask(req: Request, res: Response) {
  const uid = (req as any).uid as string;
  const {
    title,
    description = "",
    priority = "medium",
    category = "personal",
    dueDate,
    dueTime,
  } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "title is required" });
  }

  const userRef = db.collection("users").doc(uid);
  const taskRef = userRef.collection("tasks").doc();

  // 👇 deterministic server time
  const now = admin.firestore.Timestamp.now();

  await db.runTransaction(async (tx) => {
    const userSnap = await tx.get(userRef);
    const now = admin.firestore.Timestamp.now();

    // create the task
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

    // ensure user doc exists and stats are initialized
    if (!userSnap.exists) {
      tx.set(
        userRef,
        {
          totalTasksCreated: 1,
          taskStats: {
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
            currentTasksCreated: FieldValue.increment(1),
            currentTasksPending: FieldValue.increment(1),
          },
        },
        { merge: true }
      ); // tx.set with merge updates nested map safely
    }
  });

  const created = await taskRef.get();
  res.status(201).json(serializeTask(taskRef.id, created.data()!)); // returns ISO string
}

// Function to update the task
export async function updateTask(req: Request, res: Response) {
  const uid = (req as any).uid as string;
  const { id } = req.params;
  const { title, description, priority, category, dueDate, dueTime } = req.body;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Task id is required" });
  }

  const taskRef = db.collection("users").doc(uid).collection("tasks").doc(id);
  const patch: any = {};
  if (title !== undefined) patch.title = title;
  if (description !== undefined) patch.description = description;
  if (priority !== undefined) patch.priority = priority;
  if (category !== undefined) patch.category = category;
  if (dueDate !== undefined)
    patch.dueDate = dueDate || admin.firestore.FieldValue.delete();
  if (dueTime !== undefined)
    patch.dueTime = dueTime || admin.firestore.FieldValue.delete();

  await taskRef.update(patch);
  const updated = await taskRef.get();
  res.json(serializeTask(id, updated.data()!)); // ✅ use serializer
}

// Function to Complete Task
export async function completeTask(req: Request, res: Response) {
  const uid = (req as any).uid as string;
  const { id } = req.params;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Task id is required" });
  }

  const userRef = db.collection("users").doc(uid);
  const taskRef = userRef.collection("tasks").doc(id);

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(taskRef);
    if (!snap.exists) throw new Error("Task not found");

    const t = snap.data()!;

    // Already completed? No-op (idempotent)
    if (t.completed) return;

    const now = admin.firestore.Timestamp.now();

    tx.update(taskRef, {
      completed: true,
      completedAt: now,
    });

    tx.update(userRef, {
      taskStats: {
        currentTasksPending: admin.firestore.FieldValue.increment(-1),
        currentTasksCompleted: admin.firestore.FieldValue.increment(1), 
      },
      totalTasksCompleted: admin.firestore.FieldValue.increment(1),
      points: admin.firestore.FieldValue.increment(20),
      totalPoints: admin.firestore.FieldValue.increment(20),
    });
  });

  const updated = await taskRef.get();
  // Use your serializer so completedAt/createdAt are ISO strings:
  res.json(serializeTask(id, updated.data()!));
}

export async function deleteTask(req: Request, res: Response) {
  const uid = (req as any).uid as string;
  const { id } = req.params;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Task id is required" });
  }

  const userRef = db.collection("users").doc(uid);
  const taskRef = userRef.collection("tasks").doc(id);

  await db.runTransaction(async (tx) => {
    const tSnap = await tx.get(taskRef);
    if (!tSnap.exists) return;

    const t = tSnap.data()!;
    const pendingDelta = t.completed ? 0 : -1;

    tx.delete(taskRef);
    tx.update(userRef, {
      "taskStats.currentTasksCreated": FieldValue.increment(-1),
      ...(pendingDelta
        ? {
            "taskStats.currentTasksPending": FieldValue.increment(pendingDelta),
          }
        : {}),
    });
  });

  res.status(204).send();
}
