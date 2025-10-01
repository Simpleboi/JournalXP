// Sample data for activity summary
export const activitySummary = {
  journalEntries: 12,
  tasksCompleted: 28,
  pointsEarned: 450,
  moodAverage: "Good",
  meditationMinutes: 120,
  selfCareActivities: 8,
};

// Sample data for usage patterns
export const usagePatterns = [
  { day: "Monday", minutes: 25 },
  { day: "Tuesday", minutes: 18 },
  { day: "Wednesday", minutes: 30 },
  { day: "Thursday", minutes: 22 },
  { day: "Friday", minutes: 35 },
  { day: "Saturday", minutes: 15 },
  { day: "Sunday", minutes: 20 },
];

export interface MoodEntry {
  date: string;
  mood:
    | "very_happy"
    | "happy"
    | "neutral"
    | "sad"
    | "very_sad"
    | "anxious"
    | "calm"
    | "excited"
    | "tired";
  moodScore: number; // 1-10 scale
  energy: number; // 1-10 scale
  stress: number; // 1-10 scale
  activities: string[]; // activities done that day
  journalEntryId?: string;
}

export interface MoodTrends {
  daily: {
    date: string;
    averageMood: number;
    moodEntries: MoodEntry[];
  }[];
  weekly: {
    weekStart: string;
    averageMood: number;
    moodDistribution: Record<string, number>;
    dominantMood: string;
  }[];
  monthly: {
    month: string;
    year: number;
    averageMood: number;
    moodDistribution: Record<string, number>;
    bestDay: string;
    worstDay: string;
  }[];
  heatmapData: {
    date: string;
    value: number; // mood score for calendar heatmap
    mood: string;
  }[];
}

export interface EmotionalWordCloud {
  words: {
    text: string;
    value: number; // frequency count
    sentiment: "positive" | "negative" | "neutral";
    category: "emotion" | "activity" | "reflection" | "goal";
  }[];
  topEmotions: {
    emotion: string;
    count: number;
    percentage: number;
    trend: "increasing" | "decreasing" | "stable";
  }[];
  sentimentAnalysis: {
    positive: number;
    negative: number;
    neutral: number;
    overallSentiment: "positive" | "negative" | "neutral";
  };
}

export interface JournalStats {
  entryFrequency: {
    daily: { date: string; count: number }[];
    weekly: { week: string; count: number }[];
    monthly: { month: string; count: number }[];
  };
  wordCount: {
    averageWordsPerEntry: number;
    totalWords: number;
    longestEntry: { date: string; wordCount: number };
    shortestEntry: { date: string; wordCount: number };
    wordCountTrend: { date: string; wordCount: number }[];
  };
  streaks: {
    currentStreak: number;
    longestStreak: number;
    streakHistory: { startDate: string; endDate: string; length: number }[];
  };
  reflectiveDepth: {
    averageDepthScore: number; // 1-10 based on keywords, length, emotional words
    depthTrend: { date: string; score: number }[];
    deepestEntries: { date: string; score: number; preview: string }[];
  };
  writingPatterns: {
    preferredTime: string; // morning, afternoon, evening, night
    averageSessionLength: number; // minutes
    mostProductiveDays: string[];
  };
}

export interface TaskHabitCompletion {
  tasks: {
    completionRate: number;
    totalTasks: number;
    completedTasks: number;
    byPriority: {
      high: { total: number; completed: number; rate: number };
      medium: { total: number; completed: number; rate: number };
      low: { total: number; completed: number; rate: number };
    };
    byCategory: {
      category: string;
      total: number;
      completed: number;
      rate: number;
    }[];
    streaks: {
      current: number;
      longest: number;
      history: { date: string; completed: number }[];
    };
    timePatterns: {
      hourOfDay: { hour: number; completionRate: number }[];
      dayOfWeek: { day: string; completionRate: number }[];
    };
  };
  habits: {
    overallCompletionRate: number;
    activeHabits: number;
    completedHabits: number;
    byFrequency: {
      daily: { total: number; avgCompletion: number };
      weekly: { total: number; avgCompletion: number };
      monthly: { total: number; avgCompletion: number };
    };
    habitPerformance: {
      habitId: string;
      name: string;
      completionRate: number;
      currentStreak: number;
      longestStreak: number;
      category: string;
    }[];
    streakData: {
      date: string;
      habitsCompleted: number;
      totalHabits: number;
    }[];
  };
}

export interface XPProgress {
  totalXP: number;
  currentLevel: number;
  xpToNextLevel: number;
  xpBreakdown: {
    journaling: { total: number; percentage: number };
    tasks: { total: number; percentage: number };
    habits: { total: number; percentage: number };
    meditation: { total: number; percentage: number };
    petCare: { total: number; percentage: number };
    bonuses: { total: number; percentage: number };
  };
  xpHistory: {
    date: string;
    xpEarned: number;
    source: string;
    cumulativeXP: number;
  }[];
  levelingHistory: {
    level: number;
    dateAchieved: string;
    xpRequired: number;
  }[];
  xpTrends: {
    daily: { date: string; xp: number }[];
    weekly: { week: string; xp: number }[];
    monthly: { month: string; xp: number }[];
  };
}

export interface VirtualPetMetrics {
  petStats: {
    health: {
      current: number;
      average: number;
      trend: "improving" | "declining" | "stable";
    };
    happiness: {
      current: number;
      average: number;
      trend: "improving" | "declining" | "stable";
    };
    trust: {
      current: number;
      average: number;
      trend: "improving" | "declining" | "stable";
    };
    energy: {
      current: number;
      average: number;
      trend: "improving" | "declining" | "stable";
    };
  };
  careHistory: {
    date: string;
    health: number;
    happiness: number;
    trust: number;
    energy: number;
    activitiesPerformed: string[];
  }[];
  carePatterns: {
    feedingFrequency: { average: number; trend: string };
    playingFrequency: { average: number; trend: string };
    cleaningFrequency: { average: number; trend: string };
    mostActiveTime: string;
    careConsistency: number; // 0-100 score
  };
  petMilestones: {
    bondingLevel: number;
    accessoriesUnlocked: string[];
    questsCompleted: number;
    daysAlive: number;
    revivals: number;
  };
  correlations: {
    userMoodVsPetHealth: number; // correlation coefficient
    journalingVsPetHappiness: number;
    taskCompletionVsPetTrust: number;
  };
}

export interface BehavioralInsights {
  correlations: {
    moodVsTaskCompletion: {
      correlation: number;
      insight: string;
      confidence: "high" | "medium" | "low";
    };
    journalingVsMood: {
      correlation: number;
      insight: string;
      confidence: "high" | "medium" | "low";
    };
    sleepVsProductivity: {
      correlation: number;
      insight: string;
      confidence: "high" | "medium" | "low";
    };
    exerciseVsMood: {
      correlation: number;
      insight: string;
      confidence: "high" | "medium" | "low";
    };
  };
  patterns: {
    bestPerformanceDays: string[];
    worstPerformanceDays: string[];
    optimalJournalingTime: string;
    moodTriggers: {
      trigger: string;
      impact: "positive" | "negative";
      frequency: number;
    }[];
    productivityPatterns: {
      timeOfDay: { time: string; productivity: number }[];
      dayOfWeek: { day: string; productivity: number }[];
    };
  };
  recommendations: {
    type: "habit" | "timing" | "activity" | "goal";
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
    basedOn: string; // what data this is based on
  }[];
  riskFactors: {
    factor: string;
    riskLevel: "high" | "medium" | "low";
    description: string;
    suggestion: string;
  }[];
}

export interface InsightsData {
  userId: string;
  dateRange: {
    start: string;
    end: string;
  };
  moodTrends: MoodTrends;
  emotionalWordCloud: EmotionalWordCloud;
  journalStats: JournalStats;
  taskHabitCompletion: TaskHabitCompletion;
  xpProgress: XPProgress;
  virtualPetMetrics: VirtualPetMetrics;
  behavioralInsights: BehavioralInsights;
  lastUpdated: string;
}

// Chart type recommendations for each metric
export const CHART_TYPES = {
  moodTrends: {
    daily: "line", // Line chart for daily mood trends
    weekly: "bar", // Bar chart for weekly averages
    monthly: "area", // Area chart for monthly trends
    heatmap: "calendar", // Calendar heatmap for mood patterns
    distribution: "pie", // Pie chart for mood distribution
  },
  emotionalWordCloud: {
    words: "wordcloud", // Word cloud visualization
    topEmotions: "horizontal_bar", // Horizontal bar chart
    sentiment: "donut", // Donut chart for sentiment breakdown
  },
  journalStats: {
    frequency: "line", // Line chart for entry frequency
    wordCount: "area", // Area chart for word count trends
    streaks: "timeline", // Timeline visualization
    depth: "scatter", // Scatter plot for depth vs frequency
  },
  taskHabitCompletion: {
    completionRates: "radial_bar", // Radial bar chart
    streaks: "line", // Line chart for streak history
    categories: "stacked_bar", // Stacked bar chart
    timePatterns: "heatmap", // Heatmap for time-based patterns
  },
  xpProgress: {
    breakdown: "pie", // Pie chart for XP sources
    history: "area", // Area chart for XP over time
    levels: "step", // Step chart for level progression
  },
  virtualPetMetrics: {
    stats: "radar", // Radar chart for pet stats
    history: "multi_line", // Multi-line chart for stat history
    correlations: "scatter", // Scatter plot for correlations
  },
  behavioralInsights: {
    correlations: "correlation_matrix", // Correlation matrix
    patterns: "polar", // Polar chart for time patterns
    recommendations: "card_list", // Card-based list view
  },
} as const;

export const sampleInsightsData: InsightsData = {
  userId: "user_123",
  dateRange: {
    start: "2024-03-01",
    end: "2024-03-31",
  },
  moodTrends: {
    daily: [
      {
        date: "2024-03-01",
        averageMood: 7.5,
        moodEntries: [
          {
            date: "2024-03-01",
            mood: "happy",
            moodScore: 8,
            energy: 7,
            stress: 3,
            activities: ["journaling", "exercise"],
          },
        ],
      },
      {
        date: "2024-03-02",
        averageMood: 6.2,
        moodEntries: [
          {
            date: "2024-03-02",
            mood: "neutral",
            moodScore: 6,
            energy: 6,
            stress: 5,
            activities: ["work", "meditation"],
          },
        ],
      },
      {
        date: "2024-03-03",
        averageMood: 8.1,
        moodEntries: [
          {
            date: "2024-03-03",
            mood: "very_happy",
            moodScore: 9,
            energy: 8,
            stress: 2,
            activities: ["socializing", "journaling"],
          },
        ],
      },
      {
        date: "2024-03-04",
        averageMood: 5.8,
        moodEntries: [
          {
            date: "2024-03-04",
            mood: "sad",
            moodScore: 4,
            energy: 5,
            stress: 7,
            activities: ["rest"],
          },
        ],
      },
      {
        date: "2024-03-05",
        averageMood: 7.0,
        moodEntries: [
          {
            date: "2024-03-05",
            mood: "happy",
            moodScore: 7,
            energy: 7,
            stress: 4,
            activities: ["exercise", "reading"],
          },
        ],
      },
    ],
    weekly: [
      {
        weekStart: "2024-03-01",
        averageMood: 6.9,
        moodDistribution: { happy: 40, neutral: 30, sad: 20, very_happy: 10 },
        dominantMood: "happy",
      },
      {
        weekStart: "2024-03-08",
        averageMood: 7.2,
        moodDistribution: { happy: 45, neutral: 25, sad: 15, very_happy: 15 },
        dominantMood: "happy",
      },
      {
        weekStart: "2024-03-15",
        averageMood: 6.5,
        moodDistribution: { happy: 35, neutral: 35, sad: 25, anxious: 5 },
        dominantMood: "neutral",
      },
      {
        weekStart: "2024-03-22",
        averageMood: 7.8,
        moodDistribution: { happy: 50, very_happy: 20, neutral: 20, sad: 10 },
        dominantMood: "happy",
      },
    ],
    monthly: [
      {
        month: "March",
        year: 2024,
        averageMood: 7.1,
        moodDistribution: { happy: 42, neutral: 28, sad: 18, very_happy: 12 },
        bestDay: "2024-03-15",
        worstDay: "2024-03-08",
      },
    ],
    heatmapData: [
      { date: "2024-03-01", value: 8, mood: "happy" },
      { date: "2024-03-02", value: 6, mood: "neutral" },
      { date: "2024-03-03", value: 9, mood: "very_happy" },
      { date: "2024-03-04", value: 4, mood: "sad" },
      { date: "2024-03-05", value: 7, mood: "happy" },
    ],
  },
  emotionalWordCloud: {
    words: [
      {
        text: "grateful",
        value: 45,
        sentiment: "positive",
        category: "emotion",
      },
      {
        text: "anxious",
        value: 23,
        sentiment: "negative",
        category: "emotion",
      },
      {
        text: "peaceful",
        value: 38,
        sentiment: "positive",
        category: "emotion",
      },
      {
        text: "overwhelmed",
        value: 19,
        sentiment: "negative",
        category: "emotion",
      },
      {
        text: "hopeful",
        value: 32,
        sentiment: "positive",
        category: "emotion",
      },
      {
        text: "exercise",
        value: 28,
        sentiment: "neutral",
        category: "activity",
      },
      {
        text: "meditation",
        value: 35,
        sentiment: "positive",
        category: "activity",
      },
      { text: "work", value: 42, sentiment: "neutral", category: "activity" },
      {
        text: "family",
        value: 31,
        sentiment: "positive",
        category: "reflection",
      },
      { text: "growth", value: 26, sentiment: "positive", category: "goal" },
    ],
    topEmotions: [
      { emotion: "grateful", count: 45, percentage: 18.2, trend: "increasing" },
      { emotion: "peaceful", count: 38, percentage: 15.4, trend: "stable" },
      { emotion: "hopeful", count: 32, percentage: 13.0, trend: "increasing" },
      { emotion: "anxious", count: 23, percentage: 9.3, trend: "decreasing" },
      {
        emotion: "overwhelmed",
        count: 19,
        percentage: 7.7,
        trend: "decreasing",
      },
    ],
    sentimentAnalysis: {
      positive: 65.2,
      negative: 22.1,
      neutral: 12.7,
      overallSentiment: "positive",
    },
  },
  journalStats: {
    entryFrequency: {
      daily: [
        { date: "2024-03-01", count: 1 },
        { date: "2024-03-02", count: 0 },
        { date: "2024-03-03", count: 2 },
        { date: "2024-03-04", count: 1 },
        { date: "2024-03-05", count: 1 },
      ],
      weekly: [
        { week: "2024-W09", count: 8 },
        { week: "2024-W10", count: 6 },
        { week: "2024-W11", count: 9 },
        { week: "2024-W12", count: 7 },
      ],
      monthly: [{ month: "2024-03", count: 30 }],
    },
    wordCount: {
      averageWordsPerEntry: 247,
      totalWords: 7410,
      longestEntry: { date: "2024-03-15", wordCount: 456 },
      shortestEntry: { date: "2024-03-08", wordCount: 89 },
      wordCountTrend: [
        { date: "2024-03-01", wordCount: 234 },
        { date: "2024-03-03", wordCount: 312 },
        { date: "2024-03-04", wordCount: 189 },
        { date: "2024-03-05", wordCount: 267 },
      ],
    },
    streaks: {
      currentStreak: 7,
      longestStreak: 12,
      streakHistory: [
        { startDate: "2024-02-15", endDate: "2024-02-26", length: 12 },
        { startDate: "2024-03-01", endDate: "2024-03-07", length: 7 },
      ],
    },
    reflectiveDepth: {
      averageDepthScore: 7.2,
      depthTrend: [
        { date: "2024-03-01", score: 6.8 },
        { date: "2024-03-03", score: 8.1 },
        { date: "2024-03-04", score: 5.9 },
        { date: "2024-03-05", score: 7.5 },
      ],
      deepestEntries: [
        {
          date: "2024-03-15",
          score: 9.2,
          preview: "Today I realized that my anxiety often stems from...",
        },
        {
          date: "2024-03-22",
          score: 8.8,
          preview: "Reflecting on my relationships, I notice patterns...",
        },
      ],
    },
    writingPatterns: {
      preferredTime: "evening",
      averageSessionLength: 12.5,
      mostProductiveDays: ["Sunday", "Wednesday", "Friday"],
    },
  },
  taskHabitCompletion: {
    tasks: {
      completionRate: 78.5,
      totalTasks: 65,
      completedTasks: 51,
      byPriority: {
        high: { total: 15, completed: 13, rate: 86.7 },
        medium: { total: 28, completed: 22, rate: 78.6 },
        low: { total: 22, completed: 16, rate: 72.7 },
      },
      byCategory: [
        { category: "Health", total: 20, completed: 18, rate: 90.0 },
        { category: "Work", total: 25, completed: 19, rate: 76.0 },
        { category: "Personal", total: 20, completed: 14, rate: 70.0 },
      ],
      streaks: {
        current: 5,
        longest: 9,
        history: [
          { date: "2024-03-01", completed: 3 },
          { date: "2024-03-02", completed: 2 },
          { date: "2024-03-03", completed: 4 },
          { date: "2024-03-04", completed: 1 },
          { date: "2024-03-05", completed: 3 },
        ],
      },
      timePatterns: {
        hourOfDay: [
          { hour: 9, completionRate: 85.2 },
          { hour: 14, completionRate: 72.1 },
          { hour: 19, completionRate: 68.9 },
        ],
        dayOfWeek: [
          { day: "Monday", completionRate: 82.1 },
          { day: "Tuesday", completionRate: 79.3 },
          { day: "Wednesday", completionRate: 85.7 },
          { day: "Thursday", completionRate: 76.2 },
          { day: "Friday", completionRate: 71.4 },
          { day: "Saturday", completionRate: 68.9 },
          { day: "Sunday", completionRate: 74.6 },
        ],
      },
    },
    habits: {
      overallCompletionRate: 73.2,
      activeHabits: 8,
      completedHabits: 6,
      byFrequency: {
        daily: { total: 5, avgCompletion: 76.8 },
        weekly: { total: 2, avgCompletion: 85.0 },
        monthly: { total: 1, avgCompletion: 100.0 },
      },
      habitPerformance: [
        {
          habitId: "h1",
          name: "Morning Meditation",
          completionRate: 85.7,
          currentStreak: 12,
          longestStreak: 18,
          category: "mindfulness",
        },
        {
          habitId: "h2",
          name: "Daily Exercise",
          completionRate: 71.4,
          currentStreak: 3,
          longestStreak: 15,
          category: "physical",
        },
        {
          habitId: "h3",
          name: "Gratitude Journal",
          completionRate: 78.6,
          currentStreak: 8,
          longestStreak: 22,
          category: "mindfulness",
        },
        {
          habitId: "h4",
          name: "Read 30 minutes",
          completionRate: 64.3,
          currentStreak: 2,
          longestStreak: 9,
          category: "productivity",
        },
      ],
      streakData: [
        { date: "2024-03-01", habitsCompleted: 4, totalHabits: 5 },
        { date: "2024-03-02", habitsCompleted: 3, totalHabits: 5 },
        { date: "2024-03-03", habitsCompleted: 5, totalHabits: 5 },
        { date: "2024-03-04", habitsCompleted: 2, totalHabits: 5 },
        { date: "2024-03-05", habitsCompleted: 4, totalHabits: 5 },
      ],
    },
  },
  xpProgress: {
    totalXP: 2847,
    currentLevel: 8,
    xpToNextLevel: 153,
    xpBreakdown: {
      journaling: { total: 1024, percentage: 36.0 },
      tasks: { total: 852, percentage: 29.9 },
      habits: { total: 568, percentage: 20.0 },
      meditation: { total: 213, percentage: 7.5 },
      petCare: { total: 142, percentage: 5.0 },
      bonuses: { total: 48, percentage: 1.6 },
    },
    xpHistory: [
      {
        date: "2024-03-01",
        xpEarned: 45,
        source: "journaling",
        cumulativeXP: 2802,
      },
      { date: "2024-03-02", xpEarned: 23, source: "tasks", cumulativeXP: 2825 },
      {
        date: "2024-03-03",
        xpEarned: 67,
        source: "habits",
        cumulativeXP: 2892,
      },
      {
        date: "2024-03-04",
        xpEarned: 12,
        source: "meditation",
        cumulativeXP: 2904,
      },
      {
        date: "2024-03-05",
        xpEarned: 31,
        source: "petCare",
        cumulativeXP: 2935,
      },
    ],
    levelingHistory: [
      { level: 1, dateAchieved: "2024-01-15", xpRequired: 100 },
      { level: 2, dateAchieved: "2024-01-28", xpRequired: 250 },
      { level: 3, dateAchieved: "2024-02-12", xpRequired: 450 },
      { level: 8, dateAchieved: "2024-03-20", xpRequired: 2700 },
    ],
    xpTrends: {
      daily: [
        { date: "2024-03-01", xp: 45 },
        { date: "2024-03-02", xp: 23 },
        { date: "2024-03-03", xp: 67 },
        { date: "2024-03-04", xp: 12 },
        { date: "2024-03-05", xp: 31 },
      ],
      weekly: [
        { week: "2024-W09", xp: 234 },
        { week: "2024-W10", xp: 189 },
        { week: "2024-W11", xp: 267 },
        { week: "2024-W12", xp: 198 },
      ],
      monthly: [{ month: "2024-03", xp: 888 }],
    },
  },
  virtualPetMetrics: {
    petStats: {
      health: { current: 87, average: 82.3, trend: "improving" },
      happiness: { current: 92, average: 85.7, trend: "improving" },
      trust: { current: 78, average: 71.2, trend: "improving" },
      energy: { current: 65, average: 73.8, trend: "declining" },
    },
    careHistory: [
      {
        date: "2024-03-01",
        health: 85,
        happiness: 88,
        trust: 75,
        energy: 80,
        activitiesPerformed: ["feed", "play"],
      },
      {
        date: "2024-03-02",
        health: 82,
        happiness: 85,
        trust: 73,
        energy: 75,
        activitiesPerformed: ["clean"],
      },
      {
        date: "2024-03-03",
        health: 89,
        happiness: 92,
        trust: 78,
        energy: 70,
        activitiesPerformed: ["feed", "play", "clean"],
      },
      {
        date: "2024-03-04",
        health: 86,
        happiness: 87,
        trust: 76,
        energy: 68,
        activitiesPerformed: ["feed"],
      },
      {
        date: "2024-03-05",
        health: 87,
        happiness: 90,
        trust: 78,
        energy: 65,
        activitiesPerformed: ["play"],
      },
    ],
    carePatterns: {
      feedingFrequency: { average: 1.2, trend: "stable" },
      playingFrequency: { average: 0.8, trend: "increasing" },
      cleaningFrequency: { average: 0.6, trend: "stable" },
      mostActiveTime: "evening",
      careConsistency: 78.5,
    },
    petMilestones: {
      bondingLevel: 3,
      accessoriesUnlocked: ["🎀", "🎩", "👑"],
      questsCompleted: 7,
      daysAlive: 45,
      revivals: 0,
    },
    correlations: {
      userMoodVsPetHealth: 0.73,
      journalingVsPetHappiness: 0.68,
      taskCompletionVsPetTrust: 0.81,
    },
  },
  behavioralInsights: {
    correlations: {
      moodVsTaskCompletion: {
        correlation: 0.67,
        insight:
          "Your mood tends to improve when you complete more tasks, especially in the morning.",
        confidence: "high",
      },
      journalingVsMood: {
        correlation: 0.72,
        insight:
          "Regular journaling sessions are strongly associated with better mood stability.",
        confidence: "high",
      },
      sleepVsProductivity: {
        correlation: 0.58,
        insight:
          "Better sleep quality correlates with higher task completion rates the next day.",
        confidence: "medium",
      },
      exerciseVsMood: {
        correlation: 0.64,
        insight:
          "Physical activity sessions are followed by improved mood ratings within 2-4 hours.",
        confidence: "medium",
      },
    },
    patterns: {
      bestPerformanceDays: ["Wednesday", "Friday", "Sunday"],
      worstPerformanceDays: ["Monday", "Thursday"],
      optimalJournalingTime: "8:00 PM - 9:30 PM",
      moodTriggers: [
        {
          trigger: "Incomplete tasks from previous day",
          impact: "negative",
          frequency: 12,
        },
        { trigger: "Morning exercise", impact: "positive", frequency: 18 },
        { trigger: "Social interactions", impact: "positive", frequency: 15 },
        { trigger: "Work stress", impact: "negative", frequency: 8 },
      ],
      productivityPatterns: {
        timeOfDay: [
          { time: "9:00 AM", productivity: 85.2 },
          { time: "2:00 PM", productivity: 72.1 },
          { time: "7:00 PM", productivity: 68.9 },
        ],
        dayOfWeek: [
          { day: "Monday", productivity: 72.1 },
          { day: "Tuesday", productivity: 79.3 },
          { day: "Wednesday", productivity: 85.7 },
          { day: "Thursday", productivity: 76.2 },
          { day: "Friday", productivity: 81.4 },
          { day: "Saturday", productivity: 68.9 },
          { day: "Sunday", productivity: 74.6 },
        ],
      },
    },
    recommendations: [
      {
        type: "timing",
        title: "Optimize Your Morning Routine",
        description:
          "Your task completion rate is 23% higher when you start before 10 AM. Consider scheduling important tasks earlier.",
        priority: "high",
        basedOn: "Task completion time analysis",
      },
      {
        type: "habit",
        title: "Maintain Evening Journaling",
        description:
          "Your mood stability improves significantly on days when you journal between 8-9 PM. Keep this routine!",
        priority: "medium",
        basedOn: "Mood vs journaling time correlation",
      },
      {
        type: "activity",
        title: "Increase Midweek Self-Care",
        description:
          "Your energy dips on Thursdays. Consider adding a self-care activity to break up the week.",
        priority: "medium",
        basedOn: "Weekly energy pattern analysis",
      },
    ],
    riskFactors: [
      {
        factor: "Inconsistent Sleep Schedule",
        riskLevel: "medium",
        description:
          "Irregular bedtimes correlate with lower mood scores and reduced productivity.",
        suggestion:
          "Try to maintain consistent sleep and wake times, even on weekends.",
      },
      {
        factor: "Task Overload on Mondays",
        riskLevel: "low",
        description:
          "Monday task completion rates are 15% below average, potentially causing stress.",
        suggestion:
          "Consider spreading Monday tasks across Sunday evening and Tuesday morning.",
      },
    ],
  },
  lastUpdated: "2024-03-31T23:59:59Z",
};
