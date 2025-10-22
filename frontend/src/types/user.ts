export interface UserData {
  uid: string;                      // User's Unique ID
  username: string;                 // User's name ex: "Nate"
  level: number;
  xp: number;                       // current level (>= 1)
  totalXP: number;                  // lifetime xp  
  xpNeededToNextLevel: number;      // progress within current level
  streak: number;                   // Current Streak Count
  rank: string;                   
  journalCount: number;
  totalJournalEntries: number;
  totalTasksCreated: number;
  totalTasksCompleted: number;
  recentAchievement: string;
  joinDate: string;
  achievements?: Record<string, { unlocked: boolean; dateUnlocked: string }>;
  lastJournalEntryDate: string;
  profilePicture?: string;
  moodHistory?: {
    date: string;
    mood: string;
  }[]; // ex: date: '2025-07-07', mood: "happy"
  journalStats?: {
    totalWordCount: number;
    averageEntryLength: number;
    mostUsedWords: string[];
  };
  taskStats?: {
    currentTasksCreated: number; // total tasks created
    currentTasksCompleted: number; // total tasks completed
    currentTasksPending: number; // total tasks pending
    completionRate: number;
    avgCompletionTime?: number; // optional in hours / mins
    priorityCompletion: {
      high: number;
      medium: number;
      low: number;
    };
  };
  habitStats?: {
    totalHabits: number;
    completedHabits: number;
    currentHabitStreak: number;
    missedDays: number;
  };
  xpHistory?: { date: string; xp: number }[];
  petStatus?: {
    happiness: number;
    health: number;
    cleanliness: number;
  };
  reflectionTrends?: {
    peakMoodTime?: string;
    consistentJournalDays: string[]; // like ["Monday"]
    emotionalThemes: string[]; // like ["gratitude"]
  };
  pointsHistory?: { date: string; points: number }[];
}
