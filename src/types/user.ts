export interface UserData {
  uid: string;
  username: string;
  level: number;
  points: number;
  totalPoints: number;
  streak: number;
  rank: string;
  journalCount: number;
  recentAchievement: string;
  joinDate: string;
  achievements: string[];
  lastActivityDate: string;
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
    tasksCreated: number;
    tasksCompleted: number;
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
  xpHistory?: { // For Graphing
    date: string;
    xp: number;
  };
  petStatus?: {
    happiness: number;
    health: number;
    cleanliness: number;
  };
  reflectionTrends?: {
    peakMoodTime?: string;
    consistentJournalDays: string[];  // like ["Monday"]
    emotionalThemes: string[];  // like ["gratitude"]
  }
}
