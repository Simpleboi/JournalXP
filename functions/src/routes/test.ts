import { Router, Request, Response } from "express";
import { db } from "../lib/admin";
import { requireAuth } from "../middleware/requireAuth";
import { calculateXPUpdate } from "../lib/xpSystem";

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

export default router;
