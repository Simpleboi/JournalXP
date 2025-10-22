import admin from "@/lib/firebaseAdmin";
import { db } from "@/lib/firebaseAdmin";
import { xpNeededFor } from "./curve";

export type AwardResult = {
  newLevel: number;
  newXP: number;
  leveledUp: boolean;
  levelsGained: number;
  xpAllocated: number;
};

export async function awardPoints(
  uid: string,
  delta: number,
  reason: string
): Promise<AwardResult> {
  if (!Number.isFinite(delta) || delta <= 0)
    throw new Error("delta must be > 0");
  const userRef = db.collection("users").doc(uid);

  return db.runTransaction(async (tx) => {
    const snap = await tx.get(userRef);
    if (!snap.exists) {
      tx.set(
        userRef,
        { level: 1, xp: 0, totalXP: 0, nextLevelXPNeeded: xpNeededFor(1) },
        { merge: true }
      );
      return {
        newLevel: 1,
        newXP: 0,
        leveledUp: false,
        levelsGained: 0,
        xpAllocated: 0,
      };
    }

    const data = snap.data() || {};
    let level = Number(data.level ?? 1);
    let xp = Number(data.xp ?? 0);
    let totalXP = Number(data.totalXP ?? 0);

    let remaining = Math.floor(delta);
    let levelsGained = 0;

    const MAX_LEVEL_UPS = 100;
    while (remaining > 0) {
      const needed = xpNeededFor(level);
      const room = needed - xp;

      if (remaining < room) {
        xp += remaining;
        totalXP += remaining;
        remaining = 0;
      } else {
        totalXP += room;
        remaining -= room;
        xp = 0;
        level += 1;
        levelsGained++;
        if (levelsGained >= MAX_LEVEL_UPS) break;
      }
    }

    tx.set(
      userRef,
      {
        level,
        xp,
        totalXP,
        nextLevelXPNeeded: xpNeededFor(level),
        lastActiveAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return {
      newLevel: level,
      newXP: xp,
      leveledUp: levelsGained > 0,
      levelsGained,
      xpAllocated: Math.floor(delta),
    };
  });
}


/*
import { awardPoints } from "@/domain/xp/awardPoints";

export async function completeTask(req, res) {
  // ...your existing transaction that marks the task as completed & updates taskStats...
  const uid = (req as any).uid as string;

  const result = await awardPoints(uid, 20, "task_completed");
  // respond with both updated task + xp result
  res.json({ , xp: result });
}

this is an example of using it in a controller.
*/