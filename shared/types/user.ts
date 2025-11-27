// User type for the client side
export interface UserClient {
  username: string;
  level: number;
  xp: number; 
  totalXP: number;
  spendableXP: number;
  xpNeededToNextLevel: number;
  streak: number;
  rank: string;
  nextRank: string | null;
  inventory?: string[];
  profilePicture?: string;
  joinDate?: string;
  bestStreak?: number;
  currentLoginStreak?: number;
  bestLoginStreak?: number;
  totalActiveDays?: number;
  averageSessionsPerWeek?: number;
  journalStats?: {
    journalCount: number;
    totalJournalEntries: number;
    totalWordCount: number;
    averageEntryLength: number;
    mostUsedWords: string[];
    totalXPfromJournals: number;
    totalWordsWritten?: number;
    longestEntry?: number;
    favoriteMood?: string;
    typeBreakdown?: {
      freeWriting: number;
      guided: number;
      gratitude: number;
    };
    favoriteCount?: number;
    bestStreak?: number;
  };
  taskStats?: {
    currentTasksCreated: number;
    currentTasksCompleted: number;
    currentTasksPending: number;
    completionRate: number;
    totalTasksCreated: number;
    totalTasksCompleted: number;
    totalSuccessRate: number;
    totalXPfromTasks: number;
    avgCompletionTime?: number;
    priorityCompletion: {
      high: number;
      medium: number;
      low: number;
    };
    bestStreak?: number;
    onTimeCompletions?: number;
    lateCompletions?: number;
    highPriorityCompleted?: number;
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
    totalFullyCompleted?: number;
    favoriteCategory?: string;
  };
  sundayConversationCount?: number;
  sundayStats?: {
    totalConversations: number;
    totalMessages: number;
    longestConversation: number;
    totalMinutesSpent: number;
    firstChatDate?: string;
  };
  meditationStats?: {
    totalSessions: number;
    totalMinutes: number;
    longestSession: number;
    currentStreak: number;
    bestStreak: number;
    favoriteType?: string;
  };
  communityStats?: {
    totalReflectionsPosted: number;
    totalCommentsGiven: number;
    totalSupportGiven: number;
    totalSupportReceived: number;
    mostSupportedPostId?: string;
  };
  petStats?: {
    totalInteractions: number;
    daysWithPet: number;
    revivals: number;
    questsCompleted: number;
    itemsCollected: number;
  };
  achievementStats?: {
    totalUnlocked: number;
    completionPercentage: number;
    rarestAchievement?: string;
    lastUnlockedDate?: string;
  };
  milestones?: {
    accountCreated: string;
    firstJournal?: string;
    firstTaskCompleted?: string;
    firstHabitCompleted?: string;
    firstMeditation?: string;
    firstCommunityPost?: string;
  };
  progression?: {
    totalLevelUps: number;
    highestRankReached: string;
    xpBreakdown: {
      journals: number;
      tasks: number;
      habits: number;
    };
    fastestLevelUp?: number;
  };
  patterns?: {
    mostProductiveDay?: string;
    preferredJournalingTime?: number;
    consistencyScore?: number;
    moodTrend?: 'improving' | 'stable' | 'declining';
  };
  achievements?: number[]; 
  achievementPoints?: number;
  preferences?: {
    theme?: 'default' | 'ocean' | 'sunset' | 'forest' | 'lavender' | 'midnight';
    notifications?: boolean;
    emailNotifications?: boolean;
    monthlyJournalGoal?: number;
  };
}

// User shape for server side
export interface UserServer extends UserClient {
  uid: string;
  joinDate: string; // ISO string
}