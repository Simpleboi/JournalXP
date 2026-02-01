/**
 * Migration Script: Fix Flat HabitStats Fields
 *
 * This script fixes the issue where habitStats fields were stored as flat
 * dot-notation keys (e.g., "habitStats.totalHabitsCreated") instead of
 * nested fields within the habitStats object.
 *
 * It will:
 * 1. Find all flat habitStats.* fields at the root level
 * 2. Merge their values into the proper nested habitStats structure
 * 3. Delete the flat fields
 *
 * Usage:
 *   ts-node src/scripts/fixHabitStatsFields.ts
 *
 * Or via npm:
 *   npm run migrate:fix-habitstats
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
  console.log("⚠️  No service account found, using default credentials");
  initializeApp({ projectId: projectId });
  console.log("✅ Initialized with default credentials and project ID");
}

const db = getFirestore();

/**
 * Extract flat habitStats fields from document data
 */
function findFlatHabitStatsFields(data: any): { field: string; value: any }[] {
  const flatFields: { field: string; value: any }[] = [];

  for (const key of Object.keys(data)) {
    if (key.startsWith("habitStats.")) {
      flatFields.push({ field: key, value: data[key] });
    }
  }

  return flatFields;
}

/**
 * Parse a flat field path and return the nested path segments
 * e.g., "habitStats.category.physical" -> ["category", "physical"]
 */
function parseFieldPath(flatField: string): string[] {
  // Remove "habitStats." prefix
  const withoutPrefix = flatField.replace("habitStats.", "");
  return withoutPrefix.split(".");
}

/**
 * Merge flat field values into the nested habitStats structure
 */
function mergeIntoNestedStructure(
  currentHabitStats: any,
  flatFields: { field: string; value: any }[]
): any {
  const merged = { ...currentHabitStats };

  // Ensure nested objects exist
  if (!merged.category) {
    merged.category = {
      mindfulness: 0,
      productivity: 0,
      social: 0,
      physical: 0,
      custom: 0,
    };
  }
  if (!merged.frequency) {
    merged.frequency = {
      daily: 0,
      weekly: 0,
      monthly: 0,
    };
  }

  for (const { field, value } of flatFields) {
    const pathSegments = parseFieldPath(field);

    if (pathSegments.length === 1) {
      // Top-level habitStats field (e.g., totalHabitsCreated)
      const key = pathSegments[0];
      // Add the flat value to the existing nested value
      const currentValue = merged[key] ?? 0;
      merged[key] = (typeof value === "number" ? value : 0) + (typeof currentValue === "number" ? currentValue : 0);
    } else if (pathSegments.length === 2) {
      // Nested field (e.g., category.physical)
      const [parent, child] = pathSegments;
      if (merged[parent] && child in merged[parent]) {
        const currentValue = merged[parent][child] ?? 0;
        merged[parent][child] = (typeof value === "number" ? value : 0) + (typeof currentValue === "number" ? currentValue : 0);
      }
    }
  }

  return merged;
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
  flatFieldsFound: string[];
  mergedValues: Record<string, any>;
}> {
  const flatFields = findFlatHabitStatsFields(data);

  if (flatFields.length === 0) {
    return {
      updated: false,
      flatFieldsFound: [],
      mergedValues: {},
    };
  }

  // Get current nested habitStats (or empty object)
  const currentHabitStats = data.habitStats || {};

  // Merge flat field values into nested structure
  const mergedHabitStats = mergeIntoNestedStructure(currentHabitStats, flatFields);

  // Step 1: Update the nested habitStats with merged values
  await docRef.update({
    habitStats: mergedHabitStats,
    updatedAt: FieldValue.serverTimestamp(),
  });

  // Step 2: Delete flat fields in a separate update
  const deleteData: any = {};
  for (const { field } of flatFields) {
    deleteData[field] = FieldValue.delete();
  }
  await docRef.update(deleteData);

  // Build merged values summary for logging
  const mergedValues: Record<string, any> = {};
  for (const { field, value } of flatFields) {
    mergedValues[field] = value;
  }

  return {
    updated: true,
    flatFieldsFound: flatFields.map((f) => f.field),
    mergedValues,
  };
}

/**
 * Main migration function
 */
async function fixHabitStatsFields() {
  console.log("🚀 Starting habitStats flat field migration...\n");
  console.log("This will find flat 'habitStats.*' fields and merge them into the nested structure.\n");

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
    const allFlatFieldsFound = new Set<string>();

    // Process each user
    for (const doc of usersSnapshot.docs) {
      const uid = doc.id;
      const data = doc.data();

      try {
        const result = await migrateUserDocument(doc.ref, uid, data);

        if (result.updated) {
          updatedCount++;
          console.log(`✅ Fixed user ${uid}`);
          console.log(`   🗑️  Flat fields merged & deleted:`);
          for (const field of result.flatFieldsFound) {
            const value = result.mergedValues[field];
            console.log(`      - ${field}: ${value}`);
            allFlatFieldsFound.add(field);
          }
        } else {
          skippedCount++;
          console.log(`⏭️  Skipped user ${uid} (no flat habitStats fields)`);
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
    console.log(`✅ Fixed:        ${updatedCount}`);
    console.log(`⏭️  Skipped:      ${skippedCount}`);
    console.log(`❌ Errors:       ${errorCount}`);
    console.log("=".repeat(70));

    if (allFlatFieldsFound.size > 0) {
      console.log("\n🔧 Flat Fields Found & Fixed:");
      for (const field of allFlatFieldsFound) {
        console.log(`   - ${field}`);
      }
    }

    console.log("\n" + "=".repeat(70));

    if (errorCount > 0) {
      console.log("\n⚠️  Some migrations failed. Check the errors above.");
      process.exit(1);
    } else {
      console.log("\n✨ HabitStats field migration completed successfully!");
      console.log("All flat 'habitStats.*' fields have been merged into the nested structure.\n");
      process.exit(0);
    }
  } catch (error: any) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  fixHabitStatsFields();
}

export { fixHabitStatsFields };
