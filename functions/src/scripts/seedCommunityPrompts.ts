/**
 * Seed Script: Create Community Prompts
 *
 * This script seeds the initial community prompts into Firestore.
 *
 * Usage:
 *   npx ts-node src/scripts/seedCommunityPrompts.ts
 *
 * Or via npm (after adding to package.json):
 *   npm run seed:prompts
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
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
  initializeApp({
    projectId: projectId,
  });
  console.log("✅ Initialized with default credentials and project ID");
}

const db = getFirestore();

/**
 * Seed prompts data
 */
const SEED_PROMPTS = [
  { text: "What small win are you celebrating today?", category: "gratitude", order: 1 },
  { text: "What's one thing you're looking forward to?", category: "growth", order: 2 },
  { text: "Describe a moment today when you felt at peace.", category: "mindfulness", order: 3 },
  { text: "What lesson has this week taught you?", category: "reflection", order: 4 },
  { text: "Share something kind someone did for you recently.", category: "connection", order: 5 },
  { text: "What's a challenge you're currently facing, and how are you coping?", category: "growth", order: 6 },
  { text: "Name three things you're grateful for right now.", category: "gratitude", order: 7 },
  { text: "What made you smile today?", category: "mindfulness", order: 8 },
  { text: "How have you shown yourself compassion this week?", category: "reflection", order: 9 },
  { text: "Who is someone that inspires you, and why?", category: "connection", order: 10 },
];

/**
 * Get today's date in YYYY-MM-DD format
 */
function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

/**
 * Seed prompts for a specific date
 */
async function seedPromptsForDate(date: string): Promise<void> {
  const activeDate = date;

  // Calculate expiration (30 days from active date)
  const expiresAt = new Date(activeDate);
  expiresAt.setDate(expiresAt.getDate() + 30);

  console.log(`\n📅 Seeding prompts for date: ${activeDate}`);
  console.log(`⏰ Prompts will expire: ${expiresAt.toISOString().split("T")[0]}`);

  // Check if prompts already exist for this date
  const existingPrompts = await db
    .collection("communityPrompts")
    .where("activeDate", "==", activeDate)
    .limit(1)
    .get();

  if (!existingPrompts.empty) {
    console.log(`\n⚠️  Prompts already exist for ${activeDate}. Skipping...`);
    console.log("   To recreate, first delete existing prompts for this date.");
    return;
  }

  const batch = db.batch();

  for (const prompt of SEED_PROMPTS) {
    const promptRef = db.collection("communityPrompts").doc();
    batch.set(promptRef, {
      text: prompt.text,
      category: prompt.category,
      activeDate,
      expiresAt: Timestamp.fromDate(expiresAt),
      createdAt: Timestamp.now(),
      responseCount: 0,
      isActive: true,
      order: prompt.order,
    });
    console.log(`   ✓ Prompt ${prompt.order}: "${prompt.text.substring(0, 40)}..."`);
  }

  await batch.commit();
  console.log(`\n✅ Successfully created ${SEED_PROMPTS.length} prompts for ${activeDate}`);
}

/**
 * Main function
 */
async function main() {
  console.log("🌱 Community Prompts Seed Script");
  console.log("================================\n");

  const args = process.argv.slice(2);
  const date = args[0] || getTodayDate();

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.error("❌ Invalid date format. Please use YYYY-MM-DD format.");
    console.error("   Example: npx ts-node src/scripts/seedCommunityPrompts.ts 2025-01-18");
    process.exit(1);
  }

  try {
    await seedPromptsForDate(date);
    console.log("\n🎉 Seed script completed successfully!");
  } catch (error) {
    console.error("\n❌ Error seeding prompts:", error);
    process.exit(1);
  }

  process.exit(0);
}

main();
