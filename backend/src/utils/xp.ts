import admin from "@/lib/firebaseAdmin";
import { db } from "@/lib/firebaseAdmin";
import { xpNeededFor } from "./curve";

export type AwardResult = {
  newLevel: number; // the user’s level after the award is applied
  newXP: number; // the XP within the current level after applying the award (not lifetime).
  leveledUp: boolean; // whether any level ups happened in this call.
  levelsGained: number; // how many levels were gained (could be > 1 if a big award).
  xpAllocated: number; // how much of the incoming delta was actually applied (normally equals delta, unless you add caps/guards).
};

export async function awardPoints(
  uid: string,
  xp: number,
  reason: string
): Promise<AwardResult> {
  if (!Number.isFinite(xp) || xp <= 0) throw new Error("xp must be > 0");

  // grab the user reference
  const userRef = db.collection("users").doc(uid);

  return db.runTransaction(async (transaction) => {
    // grab the snapshot
    const snap = await transaction.get(userRef);
    if (!snap.exists) {
      transaction.set(
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

    // grab the user data
    const data = snap.data() || {};
    let level = Number(data.level ?? 1);
    let xp = Number(data.xp ?? 0);
    let totalXP = Number(data.totalXP ?? 0);

    let remaining = Math.floor(xp);
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

    transaction.set(
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
      xpAllocated: Math.floor(xp),
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
