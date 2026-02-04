/**
 * Weekly Digest - Scheduled Function
 *
 * Runs every Monday at 9 AM EST to send personalized weekly digest emails
 * to users who have opted in to receive them.
 */

import { onSchedule } from "firebase-functions/v2/scheduler";
import { db } from "../lib/admin";
import { resend, FROM_EMAIL } from "../lib/resend";
import { generateWeeklyDigestEmail } from "../emails/weeklyDigest";

// Process users in batches to avoid Resend rate limits
const BATCH_SIZE = 50;
// Only email users active in the last 30 days
const ACTIVE_DAYS_THRESHOLD = 30;

interface UserDigestData {
  id: string;
  email: string;
  username: string;
  streak: number;
  level: number;
  rank: string;
  totalXP: number;
}

/**
 * Get users who should receive the weekly digest
 */
async function getDigestRecipients(): Promise<UserDigestData[]> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - ACTIVE_DAYS_THRESHOLD);

  // Query users with weeklyDigest enabled
  // Note: Firestore doesn't support nested field queries well, so we query broadly
  // and filter in memory
  const usersSnapshot = await db
    .collection("users")
    .where("lastLogin", ">=", thirtyDaysAgo)
    .get();

  const recipients: UserDigestData[] = [];

  for (const doc of usersSnapshot.docs) {
    const data = doc.data();

    // Check if user has opted in to weekly digest
    const emailPrefs = data.preferences?.emailPreferences;
    if (!emailPrefs?.weeklyDigest) {
      continue;
    }

    // Skip users without email
    if (!data.email) {
      continue;
    }

    recipients.push({
      id: doc.id,
      email: data.email,
      username: data.username || data.displayName || "Friend",
      streak: data.streak || 0,
      level: data.level || 1,
      rank: data.rank || "Bronze III",
      totalXP: data.totalXP || 0,
    });
  }

  return recipients;
}

/**
 * Get weekly activity stats for a user
 */
async function getWeeklyStats(userId: string): Promise<{
  journalEntries: number;
  habitsCompleted: number;
  tasksCompleted: number;
  xpEarned: number;
  newAchievements: string[];
}> {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // Count journal entries this week
  const journalsSnapshot = await db
    .collection(`users/${userId}/journalEntries`)
    .where("createdAt", ">=", oneWeekAgo)
    .count()
    .get();

  // Count habit completions this week
  // Note: This depends on how habits track completions - adjust as needed
  const habitsSnapshot = await db
    .collection(`users/${userId}/habits`)
    .where("lastCompletedAt", ">=", oneWeekAgo)
    .count()
    .get();

  // Count tasks completed this week
  const tasksSnapshot = await db
    .collection(`users/${userId}/tasks`)
    .where("completedAt", ">=", oneWeekAgo)
    .count()
    .get();

  // Get user's current total XP to estimate weekly gain
  // For more accurate tracking, you'd need to store XP history
  // const userDoc = await db.collection("users").doc(userId).get();
  // const userData = userDoc.data();

  // Calculate estimated XP earned (30 XP per journal, variable for tasks/habits)
  const journalXP = journalsSnapshot.data().count * 30;
  const estimatedXP = journalXP; // Add task/habit XP if tracked

  // Get new achievements (simplified - would need achievement unlock timestamps)
  const newAchievements: string[] = [];

  return {
    journalEntries: journalsSnapshot.data().count,
    habitsCompleted: habitsSnapshot.data().count,
    tasksCompleted: tasksSnapshot.data().count,
    xpEarned: estimatedXP,
    newAchievements,
  };
}

/**
 * Send digest email to a single user
 */
async function sendDigestToUser(user: UserDigestData): Promise<boolean> {
  try {
    const stats = await getWeeklyStats(user.id);

    const { subject, html } = generateWeeklyDigestEmail({
      userId: user.id,
      username: user.username,
      email: user.email,
      currentStreak: user.streak,
      level: user.level,
      rank: user.rank,
      totalXP: user.totalXP,
      journalEntriesThisWeek: stats.journalEntries,
      habitsCompletedThisWeek: stats.habitsCompleted,
      tasksCompletedThisWeek: stats.tasksCompleted,
      xpEarnedThisWeek: stats.xpEarned,
      newAchievements: stats.newAchievements,
    });

    await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject,
      html,
    });

    console.log(`[Weekly Digest] Sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error(`[Weekly Digest] Failed to send to ${user.email}:`, error);
    return false;
  }
}

/**
 * Process a batch of users
 */
async function processBatch(users: UserDigestData[]): Promise<{
  sent: number;
  failed: number;
}> {
  const results = await Promise.allSettled(
    users.map((user) => sendDigestToUser(user))
  );

  let sent = 0;
  let failed = 0;

  for (const result of results) {
    if (result.status === "fulfilled" && result.value) {
      sent++;
    } else {
      failed++;
    }
  }

  return { sent, failed };
}

/**
 * Weekly Digest Scheduled Function
 * Runs every Monday at 9 AM EST
 */
export const sendWeeklyDigest = onSchedule(
  {
    schedule: "0 9 * * 1", // 9 AM on Mondays
    timeZone: "America/New_York",
    region: "us-central1",
    // Allow more time for processing many users
    timeoutSeconds: 540, // 9 minutes
    memory: "512MiB",
  },
  async () => {
    console.log("[Weekly Digest] Starting weekly digest job");
    const startTime = Date.now();

    try {
      // Check if Resend is configured
      if (!process.env.RESEND_API_KEY) {
        console.log("[Weekly Digest] Skipping - RESEND_API_KEY not configured");
        return;
      }

      // Get all users who should receive the digest
      const recipients = await getDigestRecipients();
      console.log(`[Weekly Digest] Found ${recipients.length} recipients`);

      if (recipients.length === 0) {
        console.log("[Weekly Digest] No recipients, skipping");
        return;
      }

      let totalSent = 0;
      let totalFailed = 0;

      // Process in batches
      for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
        const batch = recipients.slice(i, i + BATCH_SIZE);
        console.log(
          `[Weekly Digest] Processing batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} users)`
        );

        const { sent, failed } = await processBatch(batch);
        totalSent += sent;
        totalFailed += failed;

        // Small delay between batches to avoid rate limits
        if (i + BATCH_SIZE < recipients.length) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      const duration = Date.now() - startTime;
      console.log(`[Weekly Digest] Completed in ${duration}ms:`, {
        totalRecipients: recipients.length,
        sent: totalSent,
        failed: totalFailed,
      });
    } catch (error) {
      console.error("[Weekly Digest] Error during digest job:", error);
      throw error;
    }
  }
);
