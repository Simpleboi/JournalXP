/**
 * Migration Script: Normalize User Schema
 *
 * This script enforces the exact UserServer shape on all user documents.
 * It will:
 * 1. Remove any fields not in the allowed schema
 * 2. Add missing required fields with default values
 * 3. Normalize all nested stats objects to match the exact shape
 *
 * Usage:
 *   ts-node src/scripts/normalizeUserSchema.ts
 *
 * Or via npm:
 *   npm run migrate:normalize
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import * as path from "path";
import * as fs from "fs";
import { getRankInfo } from "../../../shared/utils/rankSystem";

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
  console.log("⚠️  No service account found, using default credentials");
  initializeApp({ projectId: projectId });
  console.log("✅ Initialized with default credentials and project ID");
}

const db = getFirestore();

/**
 * Allowed fields in the user document
 * These are the only fields that should exist
 */
const ALLOWED_ROOT_FIELDS = new Set([
  // UserServer fields
  "uid",
  "username",
  "level",
  "xp",
  "totalXP",
  "xpNeededToNextLevel",
  "streak",
  "rank",
  "nextRank",
  "inventory",
  "profilePicture",
  "joinDate",
  "journalStats",
  "taskStats",
  "habitStats",
  "sundayConversationCount",
  // Server-side metadata fields (not in UserClient but used by backend)
  "createdAt",
  "updatedAt",
  "lastLogin",
  "lastJournalEntryDate",
  "email",
  "displayName",
]);

/**
 * Create a normalized user document with exact schema
 */
function normalizeUserDocument(uid: string, data: any): {
  normalized: any;
  fieldsRemoved: string[];
  fieldsAdded: string[];
  fieldsUpdated: string[];
} {
  const fieldsRemoved: string[] = [];
  const fieldsAdded: string[] = [];
  const fieldsUpdated: string[] = [];

  // Start with required fields
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

  // Optional fields (only include if they exist)
  if (data.inventory) {
    normalized.inventory = Array.isArray(data.inventory) ? data.inventory : [];
  }

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

  // Only add avgCompletionTime if it exists
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

  // Preserve server-side metadata fields
  if (data.createdAt) normalized.createdAt = data.createdAt;
  if (data.updatedAt) normalized.updatedAt = data.updatedAt;
  if (data.lastLogin) normalized.lastLogin = data.lastLogin;
  if (data.lastJournalEntryDate) normalized.lastJournalEntryDate = data.lastJournalEntryDate;
  if (data.email) normalized.email = data.email;
  if (data.displayName) normalized.displayName = data.displayName;

  // Track what changed
  for (const field of Object.keys(data)) {
    if (!ALLOWED_ROOT_FIELDS.has(field)) {
      fieldsRemoved.push(field);
    }
  }

  // Check for added fields
  if (!data.username && normalized.username) fieldsAdded.push("username");
  if ((data.xp === undefined && data.points === undefined) && normalized.xp !== undefined) fieldsAdded.push("xp");
  if ((data.totalXP === undefined && data.totalPoints === undefined) && normalized.totalXP !== undefined) fieldsAdded.push("totalXP");
  if (data.xpNeededToNextLevel === undefined) fieldsAdded.push("xpNeededToNextLevel");
  if (data.rank === undefined && data.Rank === undefined) fieldsAdded.push("rank");
  if (data.joinDate === undefined) fieldsAdded.push("joinDate");
  if (!data.journalStats) fieldsAdded.push("journalStats (normalized)");
  if (!data.taskStats) fieldsAdded.push("taskStats (normalized)");
  if (!data.habitStats) fieldsAdded.push("habitStats (normalized)");

  // Check for updated nested stats
  if (data.journalStats && JSON.stringify(data.journalStats) !== JSON.stringify(normalized.journalStats)) {
    fieldsUpdated.push("journalStats (normalized)");
  }
  if (data.taskStats && JSON.stringify(data.taskStats) !== JSON.stringify(normalized.taskStats)) {
    fieldsUpdated.push("taskStats (normalized)");
  }
  if (data.habitStats && JSON.stringify(data.habitStats) !== JSON.stringify(normalized.habitStats)) {
    fieldsUpdated.push("habitStats (normalized)");
  }

  return { normalized, fieldsRemoved, fieldsAdded, fieldsUpdated };
}

/**
 * Migrate a single user document
 */
async function migrateUserDocument(
  docRef: FirebaseFirestore.DocumentReference,
  uid: string,
  data: any
): Promise<{
  updated: boolean;
  fieldsRemoved: string[];
  fieldsAdded: string[];
  fieldsUpdated: string[];
}> {
  const { normalized, fieldsRemoved, fieldsAdded, fieldsUpdated } = normalizeUserDocument(uid, data);

  const hasChanges = fieldsRemoved.length > 0 || fieldsAdded.length > 0 || fieldsUpdated.length > 0;

  if (hasChanges) {
    // Set the entire document with the normalized shape
    // This will replace all fields, effectively removing any extras
    await docRef.set({
      ...normalized,
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: false }); // merge: false replaces entire document

    return {
      updated: true,
      fieldsRemoved,
      fieldsAdded,
      fieldsUpdated,
    };
  }

  return {
    updated: false,
    fieldsRemoved: [],
    fieldsAdded: [],
    fieldsUpdated: [],
  };
}

/**
 * Main migration function
 */
async function normalizeAllUsers() {
  console.log("🚀 Starting user schema normalization...\n");
  console.log("This will enforce the exact UserServer shape on all user documents.");
  console.log("Any fields not in the schema will be permanently removed.\n");

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
    const allRemovedFields = new Set<string>();
    const allAddedFields = new Set<string>();
    const allUpdatedFields = new Set<string>();

    // Process each user
    for (const doc of usersSnapshot.docs) {
      const uid = doc.id;
      const data = doc.data();

      try {
        const result = await migrateUserDocument(doc.ref, uid, data);

        if (result.updated) {
          updatedCount++;
          console.log(`✅ Updated user ${uid}`);

          if (result.fieldsRemoved.length > 0) {
            console.log(`   🗑️  Removed: ${result.fieldsRemoved.join(", ")}`);
            result.fieldsRemoved.forEach(f => allRemovedFields.add(f));
          }
          if (result.fieldsAdded.length > 0) {
            console.log(`   ➕ Added: ${result.fieldsAdded.join(", ")}`);
            result.fieldsAdded.forEach(f => allAddedFields.add(f));
          }
          if (result.fieldsUpdated.length > 0) {
            console.log(`   🔄 Updated: ${result.fieldsUpdated.join(", ")}`);
            result.fieldsUpdated.forEach(f => allUpdatedFields.add(f));
          }
        } else {
          skippedCount++;
          console.log(`⏭️  Skipped user ${uid} (already normalized)`);
        }
      } catch (error: any) {
        errorCount++;
        console.error(`❌ Error migrating user ${uid}:`, error.message);
      }
    }

    // Summary
    console.log("\n" + "=".repeat(70));
    console.log("📊 Migration Summary");
    console.log("=".repeat(70));
    console.log(`Total users:     ${totalUsers}`);
    console.log(`✅ Updated:      ${updatedCount}`);
    console.log(`⏭️  Skipped:      ${skippedCount}`);
    console.log(`❌ Errors:       ${errorCount}`);
    console.log("=".repeat(70));

    if (allRemovedFields.size > 0) {
      console.log("\n🗑️  Fields Removed Across All Users:");
      console.log(`   ${Array.from(allRemovedFields).join(", ")}`);
    }

    if (allAddedFields.size > 0) {
      console.log("\n➕ Fields Added Across All Users:");
      console.log(`   ${Array.from(allAddedFields).join(", ")}`);
    }

    if (allUpdatedFields.size > 0) {
      console.log("\n🔄 Fields Updated Across All Users:");
      console.log(`   ${Array.from(allUpdatedFields).join(", ")}`);
    }

    console.log("\n" + "=".repeat(70));

    if (errorCount > 0) {
      console.log("\n⚠️  Some migrations failed. Check the errors above.");
      process.exit(1);
    } else {
      console.log("\n✨ Schema normalization completed successfully!");
      console.log("All user documents now match the exact UserServer shape.\n");
      process.exit(0);
    }
  } catch (error: any) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  normalizeAllUsers();
}

export { normalizeAllUsers, normalizeUserDocument };
