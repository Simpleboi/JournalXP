/**
 * Migration Script: Backfill Summaries for Existing Users
 *
 * This script initializes summary documents for existing users who don't have them yet.
 * Run this once after deploying the new summary architecture.
 *
 * Usage:
 *   npm run migrate:summaries
 */

import { db } from "../lib/admin";
import { updateHabitTaskSummaryForUser } from "../summarization/habitTaskSummary";
import { initializeSundayMemory } from "../summarization/sundayMemory";
import type { ProfileSummary, RecentJournalSummary } from "@shared/types/summaries";

/**
 * Main migration function
 */
async function backfillSummaries() {
  console.log("🚀 Starting summary backfill migration...\n");

  const stats = {
    totalUsers: 0,
    profileSummariesCreated: 0,
    journalSummariesCreated: 0,
    habitTaskSummariesCreated: 0,
    sundayMemoriesCreated: 0,
    aiConsentSet: 0,
    summaryStatusSet: 0,
    errors: 0,
  };

  try {
    // Get all users
    const usersSnapshot = await db.collection("users").get();
    stats.totalUsers = usersSnapshot.size;

    console.log(`Found ${stats.totalUsers} users to process\n`);

    // Process users in batches to avoid overwhelming the system
    const BATCH_SIZE = 10;
    const users = usersSnapshot.docs;

    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      const batch = users.slice(i, i + BATCH_SIZE);

      await Promise.allSettled(
        batch.map(async (userDoc) => {
          const userId = userDoc.id;
          const userData = userDoc.data();

          try {
            console.log(`Processing user ${userId}...`);

            // 1. Initialize AI consent if not set
            if (!userData.aiDataConsent) {
              await userDoc.ref.set(
                {
                  aiDataConsent: {
                    sundayEnabled: true,
                    journalAnalysisEnabled: true,
                    habitAnalysisEnabled: true,
                    consentTimestamp: new Date().toISOString(),
                    lastUpdated: new Date().toISOString(),
                  },
                },
                { merge: true }
              );
              stats.aiConsentSet++;
            }

            // 2. Initialize summary status if not set
            if (!userData.summaryStatus) {
              await userDoc.ref.set(
                {
                  summaryStatus: {
                    lastJournalSummaryUpdate: new Date().toISOString(),
                    lastHabitTaskSummaryUpdate: new Date().toISOString(),
                    lastSundayMemoryUpdate: new Date().toISOString(),
                    profileSummaryVersion: 1,
                  },
                },
                { merge: true }
              );
              stats.summaryStatusSet++;
            }

            // 3. Create profile summary if not exists
            const profileSummaryRef = db
              .collection(`users/${userId}/summaries`)
              .doc("profile_summary");

            const profileSummaryDoc = await profileSummaryRef.get();

            if (!profileSummaryDoc.exists) {
              const profileSummary = await generateProfileSummary(userId, userData);
              await profileSummaryRef.set(profileSummary);
              stats.profileSummariesCreated++;
              console.log(`  ✅ Created profile summary`);
            }

            // 4. Create journal summary if not exists
            const journalSummaryRef = db
              .collection(`users/${userId}/summaries`)
              .doc("recent_journal_summary");

            const journalSummaryDoc = await journalSummaryRef.get();

            if (!journalSummaryDoc.exists) {
              const journalSummary = await generateInitialJournalSummary(userId);
              await journalSummaryRef.set(journalSummary);
              stats.journalSummariesCreated++;
              console.log(`  ✅ Created journal summary`);
            }

            // 5. Create habit/task summary if not exists
            const habitTaskSummaryRef = db
              .collection(`users/${userId}/summaries`)
              .doc("habit_task_summary");

            const habitTaskSummaryDoc = await habitTaskSummaryRef.get();

            if (!habitTaskSummaryDoc.exists) {
              await updateHabitTaskSummaryForUser(userId);
              stats.habitTaskSummariesCreated++;
              console.log(`  ✅ Created habit/task summary`);
            }

            // 6. Create Sunday memory if not exists
            const sundayMemoryRef = db
              .collection(`users/${userId}/summaries`)
              .doc("sunday_memory_summary");

            const sundayMemoryDoc = await sundayMemoryRef.get();

            if (!sundayMemoryDoc.exists) {
              await initializeSundayMemory(userId);
              stats.sundayMemoriesCreated++;
              console.log(`  ✅ Created Sunday memory summary`);
            }

            console.log(`  ✅ User ${userId} processed successfully\n`);
          } catch (error) {
            console.error(`  ❌ Error processing user ${userId}:`, error);
            stats.errors++;
          }
        })
      );

      // Add delay between batches to avoid rate limits
      if (i + BATCH_SIZE < users.length) {
        console.log(`Batch complete. Waiting 2 seconds before next batch...\n`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    console.log("\n✅ Migration complete!\n");
    console.log("Summary:");
    console.log(`  Total users processed: ${stats.totalUsers}`);
    console.log(`  Profile summaries created: ${stats.profileSummariesCreated}`);
    console.log(`  Journal summaries created: ${stats.journalSummariesCreated}`);
    console.log(`  Habit/task summaries created: ${stats.habitTaskSummariesCreated}`);
    console.log(`  Sunday memories created: ${stats.sundayMemoriesCreated}`);
    console.log(`  AI consent set: ${stats.aiConsentSet}`);
    console.log(`  Summary status set: ${stats.summaryStatusSet}`);
    console.log(`  Errors: ${stats.errors}`);
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    throw error;
  }
}

/**
 * Generates a simple profile summary from user data
 */
async function generateProfileSummary(
  userId: string,
  userData: any
): Promise<ProfileSummary> {
  const level = userData.level || 1;
  const rank = userData.rank || "Bronze III";
  const joinDate = userData.joinDate || userData.createdAt;

  // Calculate days active
  const daysActive = joinDate
    ? Math.floor(
        (new Date().getTime() - new Date(joinDate).getTime()) / (1000 * 60 * 60 * 24)
      )
    : 0;

  // Get dominant moods from journal stats
  const dominantMoods = ["neutral"]; // Default

  // Build simple summary
  const summary = `User is level ${level} (${rank}). Active for ${daysActive} days. ${
    userData.journalStats?.totalJournalEntries || 0
  } journal entries created.`;

  return {
    type: "profile_summary",
    userId,
    summary,
    version: 1,
    generatedAt: new Date().toISOString(),
    tokenCount: Math.ceil(summary.length / 4),
    basedOn: {
      userLevel: level,
      totalJournals: userData.journalStats?.totalJournalEntries || 0,
      dominantMoods,
    },
  };
}

/**
 * Generates an initial journal summary
 */
async function generateInitialJournalSummary(userId: string): Promise<RecentJournalSummary> {
  const windowStart = new Date();
  windowStart.setDate(windowStart.getDate() - 7);

  return {
    type: "recent_journal_summary",
    userId,
    summary: "No recent journal entries to analyze.",
    windowStart: windowStart.toISOString(),
    windowEnd: new Date().toISOString(),
    entriesAnalyzed: 0,
    dominantMoods: [],
    recurringThemes: [],
    positivePatterns: [],
    concerningPatterns: [],
    totalWordCount: 0,
    averageWordCount: 0,
    generatedAt: new Date().toISOString(),
    tokenCount: 10,
  };
}

// Run migration
if (require.main === module) {
  backfillSummaries()
    .then(() => {
      console.log("\n✅ Migration script completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Migration script failed:", error);
      process.exit(1);
    });
}

export { backfillSummaries };
