/**
 * Community Content Cleanup - Scheduled Function
 *
 * Runs daily at 2 AM EST to clean up expired community content:
 * - Deletes prompts past their expiration date (30 days after activeDate)
 * - Deletes all responses and hearts associated with expired prompts
 * - Cleans up orphaned reports
 */

import { onSchedule } from "firebase-functions/v2/scheduler";
import { db, Timestamp } from "../lib/admin";

/**
 * Batch delete helper - handles Firestore's 500 document limit per batch
 */
async function deleteBatch(
  query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>,
  description: string
): Promise<number> {
  let totalDeleted = 0;
  let batchDeleted = 0;

  do {
    const snapshot = await query.limit(500).get();
    if (snapshot.empty) break;

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    batchDeleted = snapshot.size;
    totalDeleted += batchDeleted;

    console.log(`[Community Cleanup] Deleted ${batchDeleted} ${description}`);
  } while (batchDeleted === 500);

  return totalDeleted;
}

/**
 * Delete all hearts for a response
 */
async function deleteResponseHearts(responseId: string): Promise<number> {
  const heartsRef = db
    .collection("communityResponses")
    .doc(responseId)
    .collection("hearts");

  return deleteBatch(heartsRef, `hearts for response ${responseId}`);
}

/**
 * Scheduled function to clean up expired community content
 * Runs daily at 2 AM EST
 */
export const cleanupCommunityContent = onSchedule(
  {
    schedule: "0 2 * * *", // Daily at 2 AM
    timeZone: "America/New_York",
    region: "us-central1",
  },
  async () => {
    console.log("[Community Cleanup] Starting cleanup job");
    const startTime = Date.now();

    try {
      const now = Timestamp.now();

      // 1. Find expired prompts
      const expiredPromptsSnapshot = await db
        .collection("communityPrompts")
        .where("expiresAt", "<=", now)
        .get();

      console.log(`[Community Cleanup] Found ${expiredPromptsSnapshot.size} expired prompts`);

      let totalPromptsDeleted = 0;
      let totalResponsesDeleted = 0;
      let totalHeartsDeleted = 0;

      // 2. For each expired prompt, delete its responses and the prompt itself
      for (const promptDoc of expiredPromptsSnapshot.docs) {
        const promptId = promptDoc.id;
        console.log(`[Community Cleanup] Processing expired prompt: ${promptId}`);

        // Find all responses for this prompt
        const responsesSnapshot = await db
          .collection("communityResponses")
          .where("promptId", "==", promptId)
          .get();

        // Delete hearts for each response
        for (const responseDoc of responsesSnapshot.docs) {
          const heartsDeleted = await deleteResponseHearts(responseDoc.id);
          totalHeartsDeleted += heartsDeleted;
        }

        // Delete responses
        if (!responsesSnapshot.empty) {
          const batch = db.batch();
          responsesSnapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
          });
          await batch.commit();
          totalResponsesDeleted += responsesSnapshot.size;
        }

        // Delete the prompt
        await promptDoc.ref.delete();
        totalPromptsDeleted++;

        console.log(
          `[Community Cleanup] Deleted prompt ${promptId} with ${responsesSnapshot.size} responses`
        );
      }

      // 3. Clean up orphaned reports (reports for responses that no longer exist)
      const reportsSnapshot = await db
        .collection("communityReports")
        .where("status", "==", "pending")
        .get();

      let orphanedReportsDeleted = 0;

      for (const reportDoc of reportsSnapshot.docs) {
        const responseId = reportDoc.data().responseId;
        const responseDoc = await db.collection("communityResponses").doc(responseId).get();

        if (!responseDoc.exists) {
          await reportDoc.ref.delete();
          orphanedReportsDeleted++;
        }
      }

      console.log(`[Community Cleanup] Deleted ${orphanedReportsDeleted} orphaned reports`);

      // 4. Clean up old resolved reports (older than 90 days)
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const oldReportsQuery = db
        .collection("communityReports")
        .where("status", "in", ["resolved", "dismissed"])
        .where("reviewedAt", "<=", Timestamp.fromDate(ninetyDaysAgo));

      const oldReportsDeleted = await deleteBatch(oldReportsQuery, "old resolved reports");

      const duration = Date.now() - startTime;
      console.log(
        `[Community Cleanup] Completed in ${duration}ms:`,
        {
          promptsDeleted: totalPromptsDeleted,
          responsesDeleted: totalResponsesDeleted,
          heartsDeleted: totalHeartsDeleted,
          orphanedReportsDeleted,
          oldReportsDeleted,
        }
      );
    } catch (error) {
      console.error("[Community Cleanup] Error during cleanup:", error);
      throw error;
    }
  }
);

/**
 * One-time seed function for creating initial prompts (for testing)
 * This can be called manually or via a one-time migration
 */
export const SEED_PROMPTS = [
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
 * Seed prompts for a specific date (for testing/migration)
 * Call this function from a one-time migration script
 */
export async function seedPromptsForDate(date: string): Promise<void> {
  const activeDate = date; // YYYY-MM-DD format

  // Calculate expiration (30 days from active date)
  const expiresAt = new Date(activeDate);
  expiresAt.setDate(expiresAt.getDate() + 30);

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
  }

  await batch.commit();
  console.log(`[Seed] Created ${SEED_PROMPTS.length} prompts for ${activeDate}`);
}
