import { Router } from "express";
import type { Request, Response } from "express";
import { admin, db } from "../lib/admin";
import { requireAuth } from "../middleware/requireAuth";
import { tsToIso } from "../../../shared/utils/date";

// define the session router
const router = Router();

// Shape you return to the client (UserClient)
function toUserClient(doc: any) {
  return {
    username: doc.username ?? doc.displayName ?? "New User",
    level: doc.level ?? 1,
    xp: doc.xp ?? 0,
    totalXP: doc.totalXP ?? 0,
    xpNeededToNextLevel: doc.xpNeededToNextLevel ?? 100,
    streak: doc.streak ?? 0,
    rank: doc.rank ?? "Bronze III",
    profilePicture:
      doc.profilePicture ?? doc.photoURL ?? doc.photoUrl ?? undefined,
    journalStats: doc.journalStats ?? {
      journalCount: 0,
      totalJournalEntries: 0,
      totalWordCount: 0,
      averageEntryLength: 0,
      mostUsedWords: [],
    },
    taskStats: doc.taskStats ?? {
      currentTasksCreated: 0,
      currentTasksCompleted: 0,
      currentTasksPending: 0,
      completionRate: 0,
      priorityCompletion: { high: 0, medium: 0, low: 0 },
    },
  };
}

// TEMP: unauthenticated ping
router.get("/ping", (_req: Request, res: Response) => {
  res.json({ ok: true, where: "session router" });
});


// POST /api/session/init
router.post(
  "/init",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const { uid, email, name, picture } = (req as any).user;

    const userRef = db.collection("users").doc(uid);
    const snapShot = await userRef.get();

    // if our user doesn't exist
    if (!snapShot.exists) {
      await userRef.set({
        uid,
        email: email ?? null,
        displayName: name ?? null,
        profilePicture: picture ?? null,
        level: 1,
        xp: 0,
        totalXP: 0,
        xpNeededToNextLevel: 100,
        streak: 0,
        rank: "Bronze III",
        journalStats: {
          journalCount: 0,
          totalJournalEntries: 0,
          totalWordCount: 0,
          averageEntryLength: 0,
          mostUsedWords: [],
        },
        taskStats: {
          currentTasksCreated: 0,
          currentTasksCompleted: 0,
          currentTasksPending: 0,
          completionRate: 0,
          priorityCompletion: { high: 0, medium: 0, low: 0 },
        },
        joinDate: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      // Touch updatedAt on exising users
      await userRef.set(
        {
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    }

    // Fetch fresh and map to client DTO
    const fresh = (await userRef.get()).data()!;
    const clientUser = toUserClient({
      ...fresh,
      joinDate: tsToIso(fresh.joinDate),
      createdAt: tsToIso(fresh.createdAt),
      updatedAt: tsToIso(fresh.updatedAt),
    });

    res.json({ user: clientUser });
    return;
  }
);

export default router;
