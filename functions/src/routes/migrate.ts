import { Router, Request, Response } from "express";
import { db, FieldValue } from "../lib/admin";

const router = Router();

/**
 * POST /api/migrate/user-fields
 *
 * One-time migration endpoint to update field names in user documents
 * This is protected by an API key to prevent unauthorized access
 *
 * Usage:
 *   POST /api/migrate/user-fields?key=YOUR_MIGRATION_KEY
 *
 * Set MIGRATION_KEY in your environment variables for security
 */
router.post("/user-fields", async (req: Request, res: Response): Promise<void> => {
  try {
    // Simple protection - require a migration key
    const migrationKey = process.env.MIGRATION_KEY || "migrate-123";
    const providedKey = req.query.key || req.body.key;

    if (providedKey !== migrationKey) {
      res.status(403).json({
        error: "Unauthorized",
        message: "Invalid migration key",
      });
      return;
    }

    console.log("🚀 Starting user field migration via API...");

    // Field mappings
    const fieldMigrations: Record<string, string> = {
      points: "xp",
      totalPoints: "totalXP",
      Rank: "rank", // Fix capitalization
    };

    // Get all users
    const usersSnapshot = await db.collection("users").get();
    const totalUsers = usersSnapshot.size;

    let updatedCount = 0;
    let skippedCount = 0;
    const errors: string[] = [];

    // Process each user
    for (const doc of usersSnapshot.docs) {
      const data = doc.data();
      const updates: any = {};
      let hasUpdates = false;

      // 1. Field renames
      for (const [oldField, newField] of Object.entries(fieldMigrations)) {
        if (oldField in data && !(newField in data)) {
          updates[newField] = data[oldField];
          updates[oldField] = FieldValue.delete();
          hasUpdates = true;
        }
      }

      // 2. Remove deprecated fields
      const fieldsToRemove = ["achievements", "inventory", "levelProgress", "recentAchievement", "NextRank"];
      for (const field of fieldsToRemove) {
        if (field in data) {
          updates[field] = FieldValue.delete();
          hasUpdates = true;
        }
      }

      // 3. Rank handling
      const currentRank = updates.rank ?? data.rank ?? data.Rank;
      if (!currentRank) {
        updates.rank = "Bronze III";
        hasUpdates = true;
      }

      // 4. Add xpNeededToNextLevel
      if (!data.xpNeededToNextLevel) {
        const level = data.level ?? 1;
        const baseXP = 100;
        const growth = 1.05;
        updates.xpNeededToNextLevel = Math.round(baseXP * Math.pow(growth, level - 1));
        hasUpdates = true;
      }

      // 5. Restructure task stats
      const currentTaskStats = data.taskStats || {};
      if (data.totalTasksCompleted !== undefined || data.totalTasksCreated !== undefined || data.currentTasksComplete !== undefined) {
        updates.taskStats = {
          totalTasksCompleted: data.totalTasksCompleted ?? currentTaskStats.totalTasksCompleted ?? 0,
          totalTasksCreated: data.totalTasksCreated ?? currentTaskStats.totalTasksCreated ?? 0,
          currentTasksCreated: currentTaskStats.currentTasksCreated ?? 0,
          currentTasksCompleted: data.currentTasksComplete ?? currentTaskStats.currentTasksCompleted ?? 0,
          currentTasksPending: currentTaskStats.currentTasksPending ?? 0,
          completionRate: currentTaskStats.completionRate ?? 0,
          avgCompletionTime: currentTaskStats.avgCompletionTime,
          priorityCompletion: currentTaskStats.priorityCompletion ?? { high: 0, medium: 0, low: 0 },
        };
        if (data.totalTasksCompleted !== undefined) updates.totalTasksCompleted = FieldValue.delete();
        if (data.totalTasksCreated !== undefined) updates.totalTasksCreated = FieldValue.delete();
        if (data.currentTasksComplete !== undefined) updates.currentTasksComplete = FieldValue.delete();
        hasUpdates = true;
      }

      // 6. Restructure journal stats
      const currentJournalStats = data.journalStats || {};
      if (data.journalCount !== undefined || data.totalJournalEntries !== undefined) {
        updates.journalStats = {
          journalCount: data.journalCount ?? currentJournalStats.journalCount ?? 0,
          totalJournalEntries: data.totalJournalEntries ?? currentJournalStats.totalJournalEntries ?? 0,
          totalWordCount: currentJournalStats.totalWordCount ?? 0,
          averageEntryLength: currentJournalStats.averageEntryLength ?? 0,
          mostUsedWords: currentJournalStats.mostUsedWords ?? [],
        };
        if (data.journalCount !== undefined) updates.journalCount = FieldValue.delete();
        if (data.totalJournalEntries !== undefined) updates.totalJournalEntries = FieldValue.delete();
        hasUpdates = true;
      }

      if (hasUpdates) {
        try {
          await doc.ref.update({
            ...updates,
            updatedAt: FieldValue.serverTimestamp(),
          });
          updatedCount++;
          console.log(`✅ Migrated user ${doc.id}`);
        } catch (error: any) {
          errors.push(`${doc.id}: ${error.message}`);
          console.error(`❌ Failed to migrate user ${doc.id}:`, error.message);
        }
      } else {
        skippedCount++;
      }
    }

    const response = {
      success: true,
      summary: {
        totalUsers,
        updated: updatedCount,
        skipped: skippedCount,
        errors: errors.length,
      },
      errors: errors.length > 0 ? errors : undefined,
      message: `Migration complete: ${updatedCount} users updated, ${skippedCount} skipped`,
    };

    console.log("✨ Migration completed via API");
    res.json(response);
  } catch (error: any) {
    console.error("❌ Migration API error:", error);
    res.status(500).json({
      error: "Migration failed",
      details: error.message,
    });
  }
});

/**
 * GET /api/migrate/status
 *
 * Check migration status - shows which users still need migration
 */
router.get("/status", async (req: Request, res: Response): Promise<void> => {
  try {
    const usersSnapshot = await db.collection("users").get();
    const needsMigration: string[] = [];
    const migrated: string[] = [];

    for (const doc of usersSnapshot.docs) {
      const data = doc.data();

      // Check if needs migration
      const needsUpdate =
        ("points" in data && !("xp" in data)) ||
        ("totalPoints" in data && !("totalXP" in data)) ||
        "achievements" in data ||
        "inventory" in data ||
        "levelProgress" in data ||
        "recentAchievement" in data ||
        "NextRank" in data ||
        data.totalTasksCompleted !== undefined ||
        data.totalTasksCreated !== undefined ||
        data.journalCount !== undefined ||
        !data.xpNeededToNextLevel;

      if (needsUpdate) {
        needsMigration.push(doc.id);
      } else {
        migrated.push(doc.id);
      }
    }

    res.json({
      totalUsers: usersSnapshot.size,
      needsMigration: needsMigration.length,
      migrated: migrated.length,
      usersNeedingMigration: needsMigration.slice(0, 10), // Show first 10
    });
  } catch (error: any) {
    console.error("Migration status error:", error);
    res.status(500).json({
      error: "Failed to check status",
      details: error.message,
    });
  }
});

export default router;
