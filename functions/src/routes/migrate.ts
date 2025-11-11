import { Router, Request, Response } from "express";
import { db, FieldValue } from "../lib/admin";
import { getRankInfo } from "../../../shared/utils/rankSystem";

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

/**
 * POST /api/migrate/normalize-schema
 *
 * Normalize all user documents to match exact UserServer shape
 * This will remove any extraneous fields and add missing required fields
 *
 * WARNING: This is a destructive operation. Any fields not in the UserServer
 * schema will be permanently deleted.
 */
router.post("/normalize-schema", async (req: Request, res: Response): Promise<void> => {
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

    console.log("🚀 Starting user schema normalization via API...");

    // Allowed root fields
    const ALLOWED_ROOT_FIELDS = new Set([
      "uid", "username", "level", "xp", "totalXP", "xpNeededToNextLevel",
      "streak", "rank", "nextRank", "inventory", "profilePicture", "joinDate",
      "journalStats", "taskStats", "habitStats", "sundayConversationCount",
      "createdAt", "updatedAt", "lastLogin", "lastJournalEntryDate",
      "email", "displayName"
    ]);

    // Get all users
    const usersSnapshot = await db.collection("users").get();
    const totalUsers = usersSnapshot.size;

    let updatedCount = 0;
    let skippedCount = 0;
    const errors: string[] = [];
    const allRemovedFields = new Set<string>();
    const allAddedFields = new Set<string>();

    // Process each user
    for (const doc of usersSnapshot.docs) {
      const uid = doc.id;
      const data = doc.data();

      try {
        // Build normalized document
        const level = data.level ?? 1;
        const rankInfo = getRankInfo(level);
        const now = FieldValue.serverTimestamp();

        const normalized: any = {
          uid: uid,
          username: data.username ?? data.displayName ?? "User",
          level: level,
          xp: data.xp ?? data.points ?? 0,
          totalXP: data.totalXP ?? data.totalPoints ?? 0,
          xpNeededToNextLevel: data.xpNeededToNextLevel ?? 100,
          streak: data.streak ?? 0,
          rank: data.rank ?? data.Rank ?? rankInfo.rank,
          nextRank: data.nextRank ?? data.NextRank ?? rankInfo.nextRank,
          joinDate: data.joinDate ?? data.createdAt ?? now,
        };

        // Optional fields
        if (data.inventory) normalized.inventory = Array.isArray(data.inventory) ? data.inventory : [];
        if (data.profilePicture ?? data.photoURL ?? data.photoUrl) {
          normalized.profilePicture = data.profilePicture ?? data.photoURL ?? data.photoUrl;
        }
        if (data.sundayConversationCount !== undefined) {
          normalized.sundayConversationCount = data.sundayConversationCount;
        }

        // Normalize journalStats
        const currentJournalStats = data.journalStats || {};
        normalized.journalStats = {
          journalCount: currentJournalStats.journalCount ?? data.journalCount ?? 0,
          totalJournalEntries: currentJournalStats.totalJournalEntries ?? data.totalJournalEntries ?? 0,
          totalWordCount: currentJournalStats.totalWordCount ?? 0,
          averageEntryLength: currentJournalStats.averageEntryLength ?? 0,
          mostUsedWords: Array.isArray(currentJournalStats.mostUsedWords) ? currentJournalStats.mostUsedWords : [],
          totalXPfromJournals: currentJournalStats.totalXPfromJournals ?? 0,
        };

        // Normalize taskStats
        const currentTaskStats = data.taskStats || {};
        normalized.taskStats = {
          currentTasksCreated: currentTaskStats.currentTasksCreated ?? 0,
          currentTasksCompleted: currentTaskStats.currentTasksCompleted ?? data.currentTasksComplete ?? 0,
          currentTasksPending: currentTaskStats.currentTasksPending ?? 0,
          completionRate: currentTaskStats.completionRate ?? 0,
          totalTasksCreated: currentTaskStats.totalTasksCreated ?? data.totalTasksCreated ?? 0,
          totalTasksCompleted: currentTaskStats.totalTasksCompleted ?? data.totalTasksCompleted ?? 0,
          totalSuccessRate: currentTaskStats.totalSuccessRate ?? 0,
          totalXPfromTasks: currentTaskStats.totalXPfromTasks ?? 0,
          priorityCompletion: {
            high: currentTaskStats.priorityCompletion?.high ?? 0,
            medium: currentTaskStats.priorityCompletion?.medium ?? 0,
            low: currentTaskStats.priorityCompletion?.low ?? 0,
          },
        };
        if (currentTaskStats.avgCompletionTime !== undefined) {
          normalized.taskStats.avgCompletionTime = currentTaskStats.avgCompletionTime;
        }

        // Normalize habitStats
        const currentHabitStats = data.habitStats || {};
        normalized.habitStats = {
          totalHabitsCreated: currentHabitStats.totalHabitsCreated ?? 0,
          totalHabitsCompleted: currentHabitStats.totalHabitsCompleted ?? 0,
          totalHabitCompletions: currentHabitStats.totalHabitCompletions ?? 0,
          totalXpFromHabits: currentHabitStats.totalXpFromHabits ?? 0,
          longestStreak: currentHabitStats.longestStreak ?? 0,
          currentActiveHabits: currentHabitStats.currentActiveHabits ?? 0,
          category: {
            mindfulness: currentHabitStats.category?.mindfulness ?? 0,
            productivity: currentHabitStats.category?.productivity ?? 0,
            social: currentHabitStats.category?.social ?? 0,
            physical: currentHabitStats.category?.physical ?? 0,
            custom: currentHabitStats.category?.custom ?? 0,
          },
          frequency: {
            daily: currentHabitStats.frequency?.daily ?? 0,
            weekly: currentHabitStats.frequency?.weekly ?? 0,
            monthly: currentHabitStats.frequency?.monthly ?? 0,
          },
        };

        // Preserve server-side metadata
        if (data.createdAt) normalized.createdAt = data.createdAt;
        if (data.updatedAt) normalized.updatedAt = data.updatedAt;
        if (data.lastLogin) normalized.lastLogin = data.lastLogin;
        if (data.lastJournalEntryDate) normalized.lastJournalEntryDate = data.lastJournalEntryDate;
        if (data.email) normalized.email = data.email;
        if (data.displayName) normalized.displayName = data.displayName;

        // Track removed fields
        const fieldsRemoved: string[] = [];
        for (const field of Object.keys(data)) {
          if (!ALLOWED_ROOT_FIELDS.has(field)) {
            fieldsRemoved.push(field);
            allRemovedFields.add(field);
          }
        }

        // Track added fields
        if (!data.username && normalized.username) allAddedFields.add("username");
        if (!data.joinDate) allAddedFields.add("joinDate");
        if (!data.journalStats) allAddedFields.add("journalStats");
        if (!data.taskStats) allAddedFields.add("taskStats");
        if (!data.habitStats) allAddedFields.add("habitStats");

        // Check if changes needed
        const hasChanges = fieldsRemoved.length > 0 ||
                          !data.username ||
                          !data.joinDate ||
                          !data.journalStats ||
                          !data.taskStats ||
                          !data.habitStats;

        if (hasChanges) {
          // Replace entire document with normalized version
          await doc.ref.set({
            ...normalized,
            updatedAt: FieldValue.serverTimestamp(),
          }, { merge: false });

          updatedCount++;
          console.log(`✅ Normalized user ${uid}${fieldsRemoved.length > 0 ? ` (removed: ${fieldsRemoved.join(", ")})` : ""}`);
        } else {
          skippedCount++;
        }
      } catch (error: any) {
        errors.push(`${uid}: ${error.message}`);
        console.error(`❌ Failed to normalize user ${uid}:`, error.message);
      }
    }

    const response = {
      success: true,
      summary: {
        totalUsers,
        updated: updatedCount,
        skipped: skippedCount,
        errors: errors.length,
        removedFields: Array.from(allRemovedFields),
        addedFields: Array.from(allAddedFields),
      },
      errors: errors.length > 0 ? errors : undefined,
      message: `Schema normalization complete: ${updatedCount} users updated, ${skippedCount} skipped`,
    };

    console.log("✨ Schema normalization completed via API");
    res.json(response);
  } catch (error: any) {
    console.error("❌ Schema normalization API error:", error);
    res.status(500).json({
      error: "Schema normalization failed",
      details: error.message,
    });
  }
});

export default router;
