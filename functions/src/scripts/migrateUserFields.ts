/**
 * Migration Script: Update User Field Names
 *
 * This script migrates user documents from old field names to new ones.
 * 
 * Usage:
 *   ts-node src/scripts/migrateUserFields.ts
 *
 * Or via npm:
 *   npm run migrate:users
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import * as path from "path";
import * as fs from "fs";

// Initialize Firebase Admin
const serviceAccountPath = path.resolve(__dirname, "../../creds/service-account.json");
const rootServiceAccountPath = path.resolve(__dirname, "../../../creds/service-account.json");

let projectId = "journalxp-4ea0f"; // Default project ID

if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = require(serviceAccountPath);
  initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id || projectId,
  });
  console.log("✅ Initialized with service account from functions/creds");
} else if (fs.existsSync(rootServiceAccountPath)) {
  const serviceAccount = require(rootServiceAccountPath);
  initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id || projectId,
  });
  console.log("✅ Initialized with service account from root/creds");
} else {
  // Fallback to default credentials with explicit project ID
  console.log("⚠️  No service account found, using default credentials");
  console.log("💡 Set GOOGLE_APPLICATION_CREDENTIALS environment variable or place service-account.json in functions/creds/");

  // Try to use Application Default Credentials with explicit project
  initializeApp({
    projectId: projectId,
  });
  console.log("✅ Initialized with default credentials and project ID");
}

const db = getFirestore();

/**
 * Field mapping: oldField → newField
 */
const FIELD_MIGRATIONS = {
  points: "xp",
  totalPoints: "totalXP",
  Rank: "rank", // Fix capitalization
  // Add more field migrations here as needed
  // oldFieldName: "newFieldName",
};

/**
 * Migrate a single user document
 */
async function migrateUserDocument(
  docRef: FirebaseFirestore.DocumentReference,
  data: any
): Promise<{ updated: boolean; fields: string[] }> {
  const updates: any = {};
  const fieldsUpdated: string[] = [];

  // ============================================================================
  // 1. FIELD RENAMES
  // ============================================================================
  for (const [oldField, newField] of Object.entries(FIELD_MIGRATIONS)) {
    if (oldField in data && !(newField in data)) {
      updates[newField] = data[oldField];
      updates[oldField] = FieldValue.delete();
      fieldsUpdated.push(`${oldField} → ${newField}`);
    }
  }

  // ============================================================================
  // 2. REMOVE DEPRECATED FIELDS
  // ============================================================================
  const fieldsToRemove = ["achievements", "inventory", "levelProgress", "recentAchievement", "NextRank"];

  for (const field of fieldsToRemove) {
    if (field in data) {
      updates[field] = FieldValue.delete();
      fieldsUpdated.push(`Removed: ${field}`);
    }
  }

  // ============================================================================
  // 3. RANK HANDLING (Set default if missing)
  // ============================================================================
  const currentRank = updates.rank ?? data.rank ?? data.Rank;
  if (!currentRank) {
    updates.rank = "Bronze III";
    fieldsUpdated.push("Added default rank: Bronze III");
  }

  // ============================================================================
  // 4. ADD xpNeededToNextLevel (if missing)
  // ============================================================================
  if (!data.xpNeededToNextLevel) {
    // Calculate based on level or use default
    const level = data.level ?? 1;
    const baseXP = 100;
    const growth = 1.05;
    const xpNeeded = Math.round(baseXP * Math.pow(growth, level - 1));

    updates.xpNeededToNextLevel = xpNeeded;
    fieldsUpdated.push(`Added xpNeededToNextLevel: ${xpNeeded}`);
  }

  // ============================================================================
  // 5. RESTRUCTURE TASK STATS
  // ============================================================================
  const currentTaskStats = data.taskStats || {};
  const needsTaskStatsUpdate =
    data.totalTasksCompleted !== undefined ||
    data.totalTasksCreated !== undefined ||
    data.currentTasksComplete !== undefined;

  if (needsTaskStatsUpdate) {
    updates.taskStats = {
      totalTasksCompleted: data.totalTasksCompleted ?? currentTaskStats.totalTasksCompleted ?? 0,
      totalTasksCreated: data.totalTasksCreated ?? currentTaskStats.totalTasksCreated ?? 0,
      currentTasksCreated: currentTaskStats.currentTasksCreated ?? 0,
      currentTasksCompleted: data.currentTasksComplete ?? currentTaskStats.currentTasksCompleted ?? 0,
      currentTasksPending: currentTaskStats.currentTasksPending ?? 0,
      completionRate: currentTaskStats.completionRate ?? 0,
      avgCompletionTime: currentTaskStats.avgCompletionTime,
      priorityCompletion: currentTaskStats.priorityCompletion ?? {
        high: 0,
        medium: 0,
        low: 0,
      },
    };

    // Remove old root-level fields
    if (data.totalTasksCompleted !== undefined) {
      updates.totalTasksCompleted = FieldValue.delete();
      fieldsUpdated.push("Moved totalTasksCompleted → taskStats");
    }
    if (data.totalTasksCreated !== undefined) {
      updates.totalTasksCreated = FieldValue.delete();
      fieldsUpdated.push("Moved totalTasksCreated → taskStats");
    }
    if (data.currentTasksComplete !== undefined) {
      updates.currentTasksComplete = FieldValue.delete();
      fieldsUpdated.push("Fixed currentTasksComplete → currentTasksCompleted");
    }
  }

  // ============================================================================
  // 6. RESTRUCTURE JOURNAL STATS
  // ============================================================================
  const currentJournalStats = data.journalStats || {};
  const needsJournalStatsUpdate =
    data.journalCount !== undefined ||
    data.totalJournalEntries !== undefined;

  if (needsJournalStatsUpdate) {
    updates.journalStats = {
      journalCount: data.journalCount ?? currentJournalStats.journalCount ?? 0,
      totalJournalEntries: data.totalJournalEntries ?? currentJournalStats.totalJournalEntries ?? 0,
      totalWordCount: currentJournalStats.totalWordCount ?? 0,
      averageEntryLength: currentJournalStats.averageEntryLength ?? 0,
      mostUsedWords: currentJournalStats.mostUsedWords ?? [],
    };

    // Remove old root-level fields
    if (data.journalCount !== undefined) {
      updates.journalCount = FieldValue.delete();
      fieldsUpdated.push("Moved journalCount → journalStats");
    }
    if (data.totalJournalEntries !== undefined) {
      updates.totalJournalEntries = FieldValue.delete();
      fieldsUpdated.push("Moved totalJournalEntries → journalStats");
    }
  }

  // ============================================================================
  // 7. APPLY UPDATES
  // ============================================================================
  if (Object.keys(updates).length > 0) {
    await docRef.update({
      ...updates,
      updatedAt: FieldValue.serverTimestamp(),
    });
    return { updated: true, fields: fieldsUpdated };
  }

  return { updated: false, fields: [] };
}

/**
 * Main migration function
 */
async function migrateAllUsers() {
  console.log("🚀 Starting user field migration...\n");

  try {
    // Get all user documents
    const usersSnapshot = await db.collection("users").get();
    const totalUsers = usersSnapshot.size;

    console.log(`📊 Found ${totalUsers} user documents\n`);

    if (totalUsers === 0) {
      console.log("✅ No users to migrate");
      return;
    }

    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // Process each user
    for (const doc of usersSnapshot.docs) {
      const uid = doc.id;
      const data = doc.data();

      try {
        const result = await migrateUserDocument(doc.ref, data);

        if (result.updated) {
          updatedCount++;
          console.log(`✅ Updated user ${uid}`);
          console.log(`   Fields: ${result.fields.join(", ")}`);
        } else {
          skippedCount++;
          console.log(`⏭️  Skipped user ${uid} (already migrated or no changes needed)`);
        }
      } catch (error: any) {
        errorCount++;
        console.error(`❌ Error migrating user ${uid}:`, error.message);
      }
    }

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("📊 Migration Summary");
    console.log("=".repeat(60));
    console.log(`Total users:     ${totalUsers}`);
    console.log(`✅ Updated:      ${updatedCount}`);
    console.log(`⏭️  Skipped:      ${skippedCount}`);
    console.log(`❌ Errors:       ${errorCount}`);
    console.log("=".repeat(60));

    if (errorCount > 0) {
      console.log("\n⚠️  Some migrations failed. Check the errors above.");
      process.exit(1);
    } else {
      console.log("\n✨ Migration completed successfully!");
      process.exit(0);
    }
  } catch (error: any) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateAllUsers();
}

export { migrateAllUsers, migrateUserDocument };
