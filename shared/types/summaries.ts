/**
 * Summary Types for Sunday AI
 *
 * These types define the structure of all summary documents stored in Firestore.
 * Summaries are compressed, token-efficient representations of user data.
 */

/**
 * Base summary interface
 */
interface BaseSummary {
  userId: string;
  generatedAt: string; // ISO timestamp
  tokenCount: number;
}

/**
 * Profile Summary
 *
 * Distilled profile information for AI context.
 * Contains ~100-200 tokens of user personality, goals, and patterns.
 */
export interface ProfileSummary extends BaseSummary {
  type: "profile_summary";
  summary: string; // Main summary text
  version: number; // Increment when profile changes significantly
  expiresAt?: string; // Optional TTL
  basedOn: {
    userLevel: number;
    totalJournals: number;
    dominantMoods: string[]; // Top 3 moods
    primaryGoals?: string[];
  };
}

/**
 * Recent Journal Summary
 *
 * Time-windowed summary of recent journal entries (last 7-14 days).
 * Contains ~200-300 tokens of patterns, themes, and mood trends.
 */
export interface RecentJournalSummary extends BaseSummary {
  type: "recent_journal_summary";
  summary: string; // Main summary text
  windowStart: string; // ISO timestamp
  windowEnd: string; // ISO timestamp
  entriesAnalyzed: number;

  // Pattern detection
  dominantMoods: { mood: string; count: number }[];
  recurringThemes: string[];
  positivePatterns: string[];
  concerningPatterns: string[];

  // Stats
  totalWordCount: number;
  averageWordCount: number;
}

/**
 * Habit and Task Summary
 *
 * Overview of user's current habits and tasks.
 * Contains ~150-250 tokens of habit streaks, task completion, and productivity patterns.
 */
export interface HabitTaskSummary extends BaseSummary {
  type: "habit_task_summary";
  summary: string; // Main summary text

  // Active habits overview
  activeHabits: {
    title: string;
    frequency: string;
    currentStreak: number;
    category: string;
  }[];

  // Task overview
  taskStats: {
    pending: number;
    completedThisWeek: number;
    highPriority: number;
  };

  // Performance metrics
  weeklyCompletionRate: number; // percentage
  strongestHabit?: string;
  strugglingHabit?: string;
}

/**
 * Memory Node
 *
 * A compressed representation of a conversation segment.
 * Created when old messages are summarized and deleted.
 */
export interface MemoryNode {
  id: string;
  theme: string; // e.g., "work anxiety coping strategies"
  createdFrom: string[]; // chatId references
  summary: string; // 50-100 tokens
  timestamp: string; // ISO timestamp
}

/**
 * Sunday Memory Summary
 *
 * Long-term memory of all Sunday conversations.
 * Contains ~300-400 tokens of therapeutic history, techniques, and progress.
 */
export interface SundayMemorySummary extends BaseSummary {
  type: "sunday_memory_summary";
  summary: string; // Main summary text

  // Memory nodes (compressed conversation themes)
  memoryNodes: MemoryNode[];

  // Therapeutic insights
  effectiveTechniques: string[];
  userPreferences: string[];
  triggerPatterns: string[];
  progressAreas: string[];

  // Metadata
  conversationsIncluded: number;
  lastConversationDate: string;
}

/**
 * Union type of all summary types
 */
export type Summary =
  | ProfileSummary
  | RecentJournalSummary
  | HabitTaskSummary
  | SundayMemorySummary;

/**
 * Summary type discriminator
 */
export type SummaryType = Summary["type"];

/**
 * Map of summary types to their interfaces
 */
export interface SummaryTypeMap {
  profile_summary: ProfileSummary;
  recent_journal_summary: RecentJournalSummary;
  habit_task_summary: HabitTaskSummary;
  sunday_memory_summary: SundayMemorySummary;
}
