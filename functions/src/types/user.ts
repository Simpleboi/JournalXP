// Backend TypeScript representation of frontend `UserData`
// Keep this in sync with frontend/src/types/user.ts

export interface UserData {
  uid: string;
  username: string;
  email?: string | null;
  displayName?: string | null;
  level: number;
  xp: number;
  totalXP: number;
  xpNeededToNextLevel: number;
  streak: number;
  rank: string;
  journalCount: number;
  totalJournalEntries: number;
  totalTasksCreated: number;
  totalTasksCompleted: number;
  recentAchievement: string;
  joinDate: string;
  achievements?: Record<string, { unlocked: boolean; dateUnlocked: string }>;
  lastJournalEntryDate: string;
  profilePicture?: string | null;
  moodHistory?: { date: string; mood: string }[];
  journalStats?: {
    totalWordCount: number;
    averageEntryLength: number;
    mostUsedWords: string[];
  };
  taskStats?: {
    currentTasksCreated: number;
    currentTasksCompleted: number;
    currentTasksPending: number;
    completionRate: number;
    avgCompletionTime?: number | null;
    priorityCompletion: { high: number; medium: number; low: number };
  };
  habitStats?: {
    totalHabits: number;
    completedHabits: number;
    currentHabitStreak: number;
    missedDays: number;
  };
  xpHistory?: { date: string; xp: number }[];
  petStatus?: { happiness: number; health: number; cleanliness: number };
  reflectionTrends?: any;
  pointsHistory?: { date: string; points: number }[];
  createdAt?: any;
  updatedAt?: any;
}
