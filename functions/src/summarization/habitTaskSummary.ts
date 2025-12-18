/**
 * Cloud Function: Update Habit and Task Summary
 *
 * Scheduled to run daily or triggered by habit/task updates.
 * Generates a summary of user's current habits and tasks.
 */

import { onSchedule } from "firebase-functions/v2/scheduler";
import { db } from "../lib/admin";
import { getOpenAI } from "../lib/openai";
import { estimateTokens, getWeekStart, calculateCompletionRate } from "../lib/summaryUtils";
import type { HabitTaskSummary } from "@shared/types/summaries";

/**
 * Scheduled function that runs daily at midnight to update habit/task summaries
 */
export const updateHabitTaskSummaryScheduled = onSchedule(
  {
    schedule: "0 0 * * *", // Every day at midnight
    timeZone: "America/New_York",
    region: "us-central1",
  },
  async (event) => {
    console.log("[Habit/Task Summary] Starting scheduled update");

    try {
      // Find all users who had activity in the last 24 hours
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const activeUsersSnapshot = await db
        .collection("users")
        .where("updatedAt", ">=", yesterday.toISOString())
        .get();

      console.log(`[Habit/Task Summary] Found ${activeUsersSnapshot.size} active users`);

      // Process each user
      const promises = activeUsersSnapshot.docs.map(userDoc =>
        updateHabitTaskSummaryForUser(userDoc.id)
      );

      await Promise.allSettled(promises);

      console.log("✅ [Habit/Task Summary] Scheduled update complete");
    } catch (error) {
      console.error("❌ [Habit/Task Summary] Scheduled update error:", error);
    }
  }
);

/**
 * Updates habit/task summary for a specific user
 */
export async function updateHabitTaskSummaryForUser(userId: string): Promise<void> {
  console.log(`[Habit/Task Summary] Updating for user ${userId}`);

  try {
    // Check if user has AI consent
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    if (!userData?.aiDataConsent?.habitAnalysisEnabled) {
      console.log(`[Habit/Task Summary] User ${userId} has not enabled habit analysis`);
      return;
    }

    // Fetch active habits
    const habitsSnapshot = await db
      .collection(`users/${userId}/habits`)
      .where("isFullyCompleted", "==", false)
      .get();

    const activeHabits = habitsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        title: data.title,
        frequency: data.frequency,
        currentStreak: data.currentStreak || 0,
        category: data.category,
        totalCompletions: data.totalCompletions || 0,
        bestStreak: data.bestStreak || 0,
      };
    });

    // Fetch task statistics
    const weekStart = getWeekStart();

    const pendingTasksCount = await db
      .collection(`users/${userId}/tasks`)
      .where("status", "==", "pending")
      .count()
      .get();

    const completedThisWeekCount = await db
      .collection(`users/${userId}/tasks`)
      .where("status", "==", "completed")
      .where("completedAt", ">=", weekStart.toISOString())
      .count()
      .get();

    const highPriorityCount = await db
      .collection(`users/${userId}/tasks`)
      .where("status", "==", "pending")
      .where("priority", "==", "high")
      .count()
      .get();

    const taskStats = {
      pending: pendingTasksCount.data().count,
      completedThisWeek: completedThisWeekCount.data().count,
      highPriority: highPriorityCount.data().count,
    };

    // Calculate completion rate
    const weeklyCompletionRate = calculateCompletionRate(habitsSnapshot);

    // Find strongest and struggling habits
    let strongestHabit: string | undefined;
    let strugglingHabit: string | undefined;

    if (activeHabits.length > 0) {
      const sortedByStreak = [...activeHabits].sort((a, b) => b.currentStreak - a.currentStreak);
      strongestHabit = sortedByStreak[0].title;

      // Struggling = habit with frequency "daily" but streak < 3
      const struggling = activeHabits.find(
        h => h.frequency === "daily" && h.currentStreak < 3
      );
      strugglingHabit = struggling?.title;
    }

    // Generate AI summary
    const openai = getOpenAI();
    const prompt = `Analyze this user's habit and task performance:

**Habits:**
${activeHabits.map(h => `- ${h.title} (${h.frequency}): ${h.currentStreak}-day streak, ${h.totalCompletions} total completions, category: ${h.category}`).join("\n") || "No active habits"}

**Tasks:**
- Pending: ${taskStats.pending}
- Completed this week: ${taskStats.completedThisWeek}
- High priority pending: ${taskStats.highPriority}

**Performance:**
- Weekly habit completion rate: ${weeklyCompletionRate}%
- Strongest habit: ${strongestHabit || "N/A"}
- Struggling habit: ${strugglingHabit || "N/A"}

Write a 100-150 word summary covering:
1. Overall habit consistency and patterns
2. Task management effectiveness
3. Areas of strength
4. Areas needing attention
5. Productivity trends

Be encouraging but realistic. Focus on actionable insights.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are a productivity coach. Provide insightful, encouraging analysis of habits and tasks. Be specific and actionable.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 200,
    });

    const summary = completion.choices[0]?.message?.content || "Unable to generate summary.";

    console.log(`[Habit/Task Summary] Generated summary (${estimateTokens(summary)} tokens)`);

    // Create summary document
    const summaryDoc: HabitTaskSummary = {
      type: "habit_task_summary",
      userId,
      summary,
      activeHabits: activeHabits.map(h => ({
        title: h.title,
        frequency: h.frequency,
        currentStreak: h.currentStreak,
        category: h.category,
      })),
      taskStats,
      weeklyCompletionRate,
      strongestHabit,
      strugglingHabit,
      generatedAt: new Date().toISOString(),
      tokenCount: estimateTokens(summary),
    };

    // Save summary to Firestore
    await db
      .collection(`users/${userId}/summaries`)
      .doc("habit_task_summary")
      .set(summaryDoc);

    // Update user's summary status
    await userRef.set(
      {
        summaryStatus: {
          lastHabitTaskSummaryUpdate: new Date().toISOString(),
        },
      },
      { merge: true }
    );

    console.log(`✅ [Habit/Task Summary] Updated summary for user ${userId}`);
  } catch (error) {
    console.error(`❌ [Habit/Task Summary] Error for user ${userId}:`, error);
  }
}

/**
 * Manual trigger function for immediate update
 * Can be called from other Cloud Functions when habits/tasks change
 */
export async function triggerHabitTaskSummaryUpdate(userId: string): Promise<void> {
  // Debounce: only update if last update was more than 1 hour ago
  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();
  const lastUpdate = userDoc.data()?.summaryStatus?.lastHabitTaskSummaryUpdate;

  if (lastUpdate) {
    const hourAgo = new Date();
    hourAgo.setHours(hourAgo.getHours() - 1);

    if (new Date(lastUpdate) > hourAgo) {
      console.log(`[Habit/Task Summary] Skipping update for ${userId} (debounced)`);
      return;
    }
  }

  await updateHabitTaskSummaryForUser(userId);
}
