// User type for the client side
export interface UserClient {
  username: string;
  level: number;
  xp: number;
  totalXP: number;
  xpNeededToNextLevel: number;
  streak: number;
  rank: string;
  nextRank: string | null;
  inventory?: string[];
  profilePicture?: string;
  joinDate?: string; // ISO string
  journalStats?: {
    journalCount: number;
    totalJournalEntries: number;
    totalWordCount: number;
    averageEntryLength: number;
    mostUsedWords: string[];
  };
  taskStats?: {
    totalTasksCompleted: number;
    currentTasksCreated: number;
    currentTasksCompleted: number;
    currentTasksPending: number;
    completionRate: number;
    avgCompletionTime?: number;
    priorityCompletion: {
      high: number;
      medium: number;
      low: number;
    };
  };
  habitStats?: {
    totalHabitsCreated: number;
    totalHabitsCompleted: number;
    totalHabitCompletions: number;
    totalXpFromHabits: number;
    longestStreak: number;
    currentActiveHabits: number;
    category: {
      mindfulness: number;
      productivity: number;
      social: number;
      physical: number;
      custom: number;
    };
    frequency: {
      daily: number;
      weekly: number;
      monthly: number;
    };
  };
  sundayConversationCount?: number;
}

// User shape for server side
export interface UserServer extends UserClient {
  uid: string;
  joinDate: string; // ISO string
}