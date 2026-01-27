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
  featuredBadge?: string; // Badge ID to display on profile
  profilePicture?: string;
  bannerImage?: string; // URL or preset key for profile banner
  bio?: string; // User bio, max 160 characters
  currentMood?: {
    emoji: string;
    label: string;
    updatedAt: string; // ISO timestamp
  };
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
    lifetimeTypeBreakdown?: {
      freeWriting: number;
      guided: number;
      gratitude: number;
    };
    favoriteCount?: number;
    bestStreak?: number;
    wordFrequency?: Record<string, number>; // Tracks word usage counts
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
  sundayDailyConversationCount?: number; // Daily count that resets at noon
  sundayDailyResetAt?: string; // ISO timestamp of next reset (noon)
  sundayStats?: {
    totalConversations: number;
    totalMessages: number;
    longestConversation: number;
    totalMinutesSpent: number;
    firstChatDate?: string;
  };
  selfReflectionStats?: {
    generationCount: number;           // Total generations ever
    dailyGenerationCount: number;      // Generations today
    dailyResetAt: string;              // ISO timestamp of next midnight
    lastGeneratedAt: string;           // ISO timestamp of last generation
    totalReflectionsGenerated: number; // Lifetime count
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
    totalResponses: number;
    totalHeartsGiven: number;
    totalHeartsReceived: number;
    responsesToday: number;
    dailyResetAt: string; // ISO timestamp of next midnight
    totalXPfromCommunity: number;
    // Legacy fields (kept for backwards compatibility during migration)
    totalReflectionsPosted?: number;
    totalCommentsGiven?: number;
    totalSupportGiven?: number;
    totalSupportReceived?: number;
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
    currentRankAchievedAt?: string; // ISO timestamp when current rank was achieved
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
    dashboardCards?: string[]; // Array of card IDs in preferred order (max 6)
    welcomeButtons?: string[]; // Array of card IDs for welcome banner quick actions (exactly 3)
    showUpdatesBanner?: boolean; // Whether to show the updates banner on homepage
  };
  aiDataConsent?: {
    sundayEnabled: boolean;
    journalAnalysisEnabled: boolean;
    habitAnalysisEnabled: boolean;
    allowFullContentAnalysis: boolean; // If true, AI can read actual journal content; if false, only metadata
    consentTimestamp: string; // ISO
    lastUpdated: string;
  };
  summaryStatus?: {
    lastJournalSummaryUpdate: string; // ISO
    lastHabitTaskSummaryUpdate: string;
    lastSundayMemoryUpdate: string;
    profileSummaryVersion: number;
  };
  totalSundayMessages?: number;
  lastSundayChat?: string; // ISO timestamp
  lastJournalEntryDate?: string; // ISO timestamp
}

// User shape for server side
export interface UserServer extends UserClient {
  uid: string;
  joinDate: string; // ISO string
  email?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
}