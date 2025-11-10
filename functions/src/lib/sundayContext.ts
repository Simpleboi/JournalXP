import { db } from "./admin";

/**
 * User context data for Sunday AI prompts
 */
export interface UserContext {
  recentJournalEntries?: Array<{
    content: string;
    mood?: string;
    date: string;
  }>;
  moodPatterns?: {
    mostCommonMood?: string;
    recentMoods?: string[];
  };
  habitData?: {
    activeHabits?: string[];
    completionRate?: number;
  };
  stats?: {
    journalCount?: number;
    taskCompletionRate?: number;
    currentStreak?: number;
    level?: number;
  };
}

/**
 * Gather user context from Firestore to personalize AI responses
 * Retrieves recent journal entries, mood patterns, habit data, and stats
 */
export async function gatherUserContext(
  uid: string
): Promise<UserContext> {
  const context: UserContext = {};

  try {
    // Get recent journal entries (last 5)
    // Note: This query requires a Firestore composite index
    const journalsSnapshot = await db
      .collection("journals")
      .where("userId", "==", uid)
      .orderBy("createdAt", "desc")
      .limit(5)
      .get()
      .catch((err) => {
        console.warn("Could not fetch journals (index may be missing):", err.message);
        return null;
      });

    if (journalsSnapshot && !journalsSnapshot.empty) {
      const recentMoods: string[] = [];
      const entries: Array<{
        content: string;
        mood?: string;
        date: string;
      }> = [];

      journalsSnapshot.forEach((doc) => {
        const data = doc.data();
        entries.push({
          content: data.content || "",
          mood: data.mood,
          date: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        });
        if (data.mood) {
          recentMoods.push(data.mood);
        }
      });

      context.recentJournalEntries = entries;

      // Calculate mood patterns
      if (recentMoods.length > 0) {
        const moodCounts: Record<string, number> = {};
        recentMoods.forEach((mood) => {
          moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        });

        const mostCommon = Object.entries(moodCounts).sort(
          ([, a], [, b]) => b - a
        )[0];

        context.moodPatterns = {
          mostCommonMood: mostCommon?.[0],
          recentMoods: recentMoods.slice(0, 3),
        };
      }
    }

    // Get active habits
    const habitsSnapshot = await db
      .collection("habits")
      .where("userId", "==", uid)
      .where("completed", "==", false)
      .limit(5)
      .get();

    if (!habitsSnapshot.empty) {
      const activeHabits: string[] = [];
      let totalCompletions = 0;
      let totalGoals = 0;

      habitsSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.habitName) {
          activeHabits.push(data.habitName);
        }
        if (data.currentProgress !== undefined && data.goal !== undefined) {
          totalCompletions += data.currentProgress;
          totalGoals += data.goal;
        }
      });

      const completionRate =
        totalGoals > 0 ? (totalCompletions / totalGoals) * 100 : 0;

      context.habitData = {
        activeHabits,
        completionRate: Math.round(completionRate),
      };
    }

    // Get user stats
    const userDoc = await db.collection("users").doc(uid).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      context.stats = {
        journalCount: userData?.journalStats?.journalCount || 0,
        taskCompletionRate: userData?.taskStats?.completionRate || 0,
        currentStreak: userData?.streak || 0,
        level: userData?.level || 1,
      };
    }
  } catch (error) {
    console.error("Error gathering user context:", error);
    // Return partial context even if some data fails
  }

  return context;
}

/**
 * Format user context into a natural language string for AI prompt
 */
export function formatContextForPrompt(context: UserContext): string {
  const parts: string[] = [];

  if (context.stats) {
    parts.push(
      `The user is currently level ${context.stats.level} with a ${context.stats.currentStreak}-day streak.`
    );
    if (context.stats.journalCount) {
      parts.push(
        `They have written ${context.stats.journalCount} journal entries.`
      );
    }
  }

  if (context.moodPatterns?.recentMoods && context.moodPatterns.recentMoods.length > 0) {
    parts.push(
      `Their recent moods have been: ${context.moodPatterns.recentMoods.join(", ")}.`
    );
  }

  if (context.habitData?.activeHabits && context.habitData.activeHabits.length > 0) {
    parts.push(
      `They are currently working on these habits: ${context.habitData.activeHabits.join(", ")}.`
    );
  }

  if (
    context.recentJournalEntries &&
    context.recentJournalEntries.length > 0
  ) {
    parts.push("\nRecent journal entries:");
    context.recentJournalEntries.slice(0, 3).forEach((entry, index) => {
      const preview =
        entry.content.length > 150
          ? entry.content.substring(0, 150) + "..."
          : entry.content;
      parts.push(
        `${index + 1}. [${entry.mood || "no mood"}] ${preview}`
      );
    });
  }

  return parts.length > 0
    ? `\n\nUser Context:\n${parts.join("\n")}`
    : "";
}
