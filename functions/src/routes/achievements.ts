import { Router, Request, Response } from "express";
import { db } from "../lib/admin";
import { requireAuth } from "../middleware/requireAuth";
import { ACHIEVEMENT_DEFINITIONS, getAchievementById } from "../../../shared/data/achievements";
import { unlockSpecialAchievement } from "../lib/achievementSystem";

const router = Router();

/**
 * Achievement DTO for frontend
 */
interface AchievementDTO {
  id: number;
  title: string;
  description: string;
  points: number;
  category: string;
  icon: string;
  requirement: string;
  unlocked: boolean;
  dateUnlocked?: string | null;
}

// ============================================================================
// ROUTES
// ============================================================================

/**
 * GET /api/achievements
 * Get all achievements with unlocked status for the authenticated user
 */
router.get("/", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;

    // Get user's unlocked achievements
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();
    const userData = userDoc.data() || {};

    const unlockedAchievementIds = new Set(userData.achievements || []);

    // Map all achievements with unlocked status
    const achievements: AchievementDTO[] = ACHIEVEMENT_DEFINITIONS.map((achievement) => {
      const unlocked = unlockedAchievementIds.has(achievement.id);

      return {
        id: achievement.id,
        title: achievement.title,
        description: achievement.description,
        points: achievement.points,
        category: achievement.category,
        icon: achievement.icon,
        requirement: achievement.requirement,
        unlocked,
        dateUnlocked: unlocked ? userData.achievementStats?.lastUnlockedDate || null : null,
      };
    });

    // Calculate stats
    const stats = {
      totalAchievements: ACHIEVEMENT_DEFINITIONS.length,
      unlockedCount: unlockedAchievementIds.size,
      totalPoints: userData.achievementPoints || 0,
      completionPercentage: Math.round(
        (unlockedAchievementIds.size / ACHIEVEMENT_DEFINITIONS.length) * 100
      ),
    };

    res.json({
      achievements,
      stats,
    });
  } catch (error: any) {
    console.error("Error getting achievements:", error);
    res.status(500).json({
      error: "Failed to get achievements",
      details: error.message
    });
  }
});

/**
 * GET /api/achievements/:id
 * Get a specific achievement with unlocked status
 */
router.get("/:id", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;
    const achievementId = parseInt(req.params.id);

    if (isNaN(achievementId)) {
      res.status(400).json({ error: "Invalid achievement ID" });
      return;
    }

    const achievement = getAchievementById(achievementId);

    if (!achievement) {
      res.status(404).json({ error: "Achievement not found" });
      return;
    }

    // Check if user has unlocked it
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();
    const userData = userDoc.data() || {};

    const unlocked = (userData.achievements || []).includes(achievementId);

    const dto: AchievementDTO = {
      id: achievement.id,
      title: achievement.title,
      description: achievement.description,
      points: achievement.points,
      category: achievement.category,
      icon: achievement.icon,
      requirement: achievement.requirement,
      unlocked,
      dateUnlocked: unlocked ? userData.achievementStats?.lastUnlockedDate || null : null,
    };

    res.json(dto);
  } catch (error: any) {
    console.error("Error getting achievement:", error);
    res.status(500).json({
      error: "Failed to get achievement",
      details: error.message
    });
  }
});

/**
 * POST /api/achievements/unlock/:id
 * Manually unlock a special achievement (for easter eggs, etc.)
 */
router.post("/unlock/:id", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;
    const achievementId = parseInt(req.params.id);

    if (isNaN(achievementId)) {
      res.status(400).json({ error: "Invalid achievement ID" });
      return;
    }

    const userRef = db.collection("users").doc(uid);

    await db.runTransaction(async (tx) => {
      const userDoc = await tx.get(userRef);
      const userData = userDoc.data() || {};

      // Check if already unlocked
      const alreadyUnlocked = (userData.achievements || []).includes(achievementId);
      if (alreadyUnlocked) {
        throw new Error("Achievement already unlocked");
      }

      // Unlock the achievement
      const { achievement, update } = unlockSpecialAchievement(achievementId);

      if (!achievement) {
        throw new Error("Achievement not found");
      }

      tx.set(userRef, update, { merge: true });
    });

    res.json({
      success: true,
      message: "Achievement unlocked!",
      achievement: getAchievementById(achievementId),
    });
  } catch (error: any) {
    console.error("Error unlocking achievement:", error);

    if (error.message === "Achievement already unlocked") {
      res.status(400).json({ error: error.message });
    } else if (error.message === "Achievement not found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({
        error: "Failed to unlock achievement",
        details: error.message
      });
    }
  }
});

export default router;
