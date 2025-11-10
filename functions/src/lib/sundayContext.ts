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
  pastConversations?: Array<{
    id: string;
    date: string;
    messageCount: number;
    preview: string; // Preview of the conversation
  }>;
}

/**
 * Gather user context from Firestore to personalize AI responses
 * Retrieves recent journal entries, mood patterns, habit data, stats, and past conversations
 *
 * @param uid - User ID
 * @param currentConversationId - Optional ID of current conversation to exclude from past conversations
 */
export async function gatherUserContext(
  uid: string,
  currentConversationId?: string
): Promise<UserContext> {
  const context: UserContext = {};

  try {
    // Get recent journal entries (last 5) from user's subcollection
    const journalsSnapshot = await db
      .collection("users")
      .doc(uid)
      .collection("journalEntries")
      .orderBy("createdAt", "desc")
      .limit(5)
      .get()
      .catch((err) => {
        console.warn("Could not fetch journals:", err.message);
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

    // Get active habits from user's subcollection
    const habitsSnapshot = await db
      .collection("users")
      .doc(uid)
      .collection("habits")
      .where("isFullyCompleted", "==", false)
      .limit(5)
      .get()
      .catch((err) => {
        console.warn("Could not fetch habits:", err.message);
        return null;
      });

    if (habitsSnapshot && !habitsSnapshot.empty) {
      const activeHabits: string[] = [];
      let totalCompletions = 0;
      let totalGoals = 0;

      habitsSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.title) {
          activeHabits.push(data.title);
        }
        if (data.currentCompletions !== undefined && data.targetCompletions !== undefined) {
          totalCompletions += data.currentCompletions;
          totalGoals += data.targetCompletions;
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

  // Get past Sunday conversations for memory/context
  try {
    const conversationsSnapshot = await db
      .collection("users")
      .doc(uid)
      .collection("sunday_conversations")
      .orderBy("updatedAt", "desc")
      .limit(5) // Load last 5 conversations
      .get();

    if (!conversationsSnapshot.empty) {
      const pastConversations: Array<{
        id: string;
        date: string;
        messageCount: number;
        preview: string;
      }> = [];

      conversationsSnapshot.forEach((doc) => {
        // Skip the current conversation to avoid duplicate context
        if (currentConversationId && doc.id === currentConversationId) {
          return;
        }

        const data = doc.data();
        const messages = data.messages || [];

        // Only include conversations that have actual messages
        if (messages.length === 0) {
          return;
        }

        // Create a preview of the conversation (first user message + first assistant response)
        let preview = "";
        const userMsg = messages.find((m: any) => m.role === "user");
        const assistantMsg = messages.find((m: any) => m.role === "assistant");

        if (userMsg && assistantMsg) {
          const userPreview = userMsg.content.length > 80
            ? userMsg.content.substring(0, 80) + "..."
            : userMsg.content;
          const assistantPreview = assistantMsg.content.length > 80
            ? assistantMsg.content.substring(0, 80) + "..."
            : assistantMsg.content;
          preview = `User: "${userPreview}" | Sunday: "${assistantPreview}"`;
        }

        pastConversations.push({
          id: doc.id,
          date: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          messageCount: messages.length,
          preview,
        });
      });

      context.pastConversations = pastConversations;
    }
  } catch (error) {
    console.warn("Error gathering past conversations:", error);
    // Don't fail if past conversations can't be loaded
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

  if (context.pastConversations && context.pastConversations.length > 0) {
    parts.push("\nPast conversations with Sunday:");
    parts.push("You have talked with this user before. Here are summaries of your recent conversations:");
    context.pastConversations.forEach((convo, index) => {
      const date = new Date(convo.date).toLocaleDateString();
      parts.push(
        `${index + 1}. [${date}] ${convo.messageCount} messages - ${convo.preview}`
      );
    });
    parts.push("Use this context to maintain continuity and remember what you've discussed with this user.");
  }

  return parts.length > 0
    ? `\n\nUser Context:\n${parts.join("\n")}`
    : "";
}
