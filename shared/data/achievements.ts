/**
 * Shared achievement definitions
 * Used by both frontend and backend to ensure consistency
 */

export interface AchievementDefinition {
  id: number;
  title: string;
  description: string;
  points: number;
  category: "journaling" | "tasks" | "habits" | "streak" | "xp" | "general";
  icon: string;
  requirement: string;
  // Trigger conditions
  trigger: {
    type: "journal_count" | "task_count" | "habit_count" | "streak" | "xp" | "special";
    value: number; // Threshold value to unlock
  };
}

/**
 * All achievements available in the app
 * Organized by category with increasing difficulty
 */
export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  // ============================================================================
  // JOURNALING ACHIEVEMENTS (ID: 1-20)
  // ============================================================================
  {
    id: 1,
    title: "First Journal Entry",
    description: "Completed your first journal entry",
    points: 50,
    category: "journaling",
    icon: "BookOpen",
    requirement: "Write your first journal entry",
    trigger: { type: "journal_count", value: 1 },
  },
  {
    id: 2,
    title: "Five Moments of Reflection",
    description: "Completed 5 journal entries",
    points: 100,
    category: "journaling",
    icon: "BookOpen",
    requirement: "Write 5 journal entries",
    trigger: { type: "journal_count", value: 5 },
  },
  {
    id: 3,
    title: "Ten Thoughts Unveiled",
    description: "Completed 10 journal entries",
    points: 200,
    category: "journaling",
    icon: "BookOpen",
    requirement: "Write 10 journal entries",
    trigger: { type: "journal_count", value: 10 },
  },
  {
    id: 4,
    title: "Quarter-Century of Clarity",
    description: "Completed 25 journal entries",
    points: 500,
    category: "journaling",
    icon: "BookOpen",
    requirement: "Write 25 journal entries",
    trigger: { type: "journal_count", value: 25 },
  },
  {
    id: 5,
    title: "Half-Century of Healing",
    description: "Completed 50 journal entries",
    points: 800,
    category: "journaling",
    icon: "BookOpen",
    requirement: "Write 50 journal entries",
    trigger: { type: "journal_count", value: 50 },
  },
  {
    id: 6,
    title: "Seventy-Five Steps to Self",
    description: "Completed 75 journal entries",
    points: 1000,
    category: "journaling",
    icon: "BookOpen",
    requirement: "Write 75 journal entries",
    trigger: { type: "journal_count", value: 75 },
  },
  {
    id: 7,
    title: "A Hundred Pages of Peace",
    description: "Completed 100 journal entries",
    points: 2000,
    category: "journaling",
    icon: "BookOpen",
    requirement: "Write 100 journal entries",
    trigger: { type: "journal_count", value: 100 },
  },
  {
    id: 8,
    title: "One Hundred and Fifty Insights",
    description: "Completed 150 journal entries",
    points: 4000,
    category: "journaling",
    icon: "BookOpen",
    requirement: "Write 150 journal entries",
    trigger: { type: "journal_count", value: 150 },
  },
  {
    id: 9,
    title: "Two Hundred Reflections",
    description: "Completed 200 journal entries",
    points: 6000,
    category: "journaling",
    icon: "BookOpen",
    requirement: "Write 200 journal entries",
    trigger: { type: "journal_count", value: 200 },
  },
  {
    id: 10,
    title: "Five Hundred Journeys Within",
    description: "Completed 500 journal entries",
    points: 8000,
    category: "journaling",
    icon: "BookOpen",
    requirement: "Write 500 journal entries",
    trigger: { type: "journal_count", value: 500 },
  },
  {
    id: 11,
    title: "Master of Your Mental Space",
    description: "Completed 1000 journal entries",
    points: 10000,
    category: "journaling",
    icon: "BookOpen",
    requirement: "Write 1000 journal entries",
    trigger: { type: "journal_count", value: 1000 },
  },

  // ============================================================================
  // TASK ACHIEVEMENTS (ID: 21-35)
  // ============================================================================
  {
    id: 21,
    title: "First Task Complete",
    description: "Completed your first task",
    points: 50,
    category: "tasks",
    icon: "CheckCircle",
    requirement: "Complete your first task",
    trigger: { type: "task_count", value: 1 },
  },
  {
    id: 22,
    title: "Task Novice",
    description: "Completed 5 tasks",
    points: 100,
    category: "tasks",
    icon: "CheckCircle",
    requirement: "Complete 5 tasks",
    trigger: { type: "task_count", value: 5 },
  },
  {
    id: 23,
    title: "Task Achiever",
    description: "Completed 10 tasks",
    points: 200,
    category: "tasks",
    icon: "CheckCircle",
    requirement: "Complete 10 tasks",
    trigger: { type: "task_count", value: 10 },
  },
  {
    id: 24,
    title: "Task Master",
    description: "Completed 25 tasks",
    points: 500,
    category: "tasks",
    icon: "CheckCircle",
    requirement: "Complete 25 tasks",
    trigger: { type: "task_count", value: 25 },
  },
  {
    id: 25,
    title: "Task Champion",
    description: "Completed 50 tasks",
    points: 800,
    category: "tasks",
    icon: "CheckCircle",
    requirement: "Complete 50 tasks",
    trigger: { type: "task_count", value: 50 },
  },
  {
    id: 26,
    title: "Task Legend",
    description: "Completed 100 tasks",
    points: 2000,
    category: "tasks",
    icon: "CheckCircle",
    requirement: "Complete 100 tasks",
    trigger: { type: "task_count", value: 100 },
  },

  // ============================================================================
  // HABIT ACHIEVEMENTS (ID: 36-50)
  // ============================================================================
  {
    id: 36,
    title: "First Habit Complete",
    description: "Completed a habit for the first time",
    points: 50,
    category: "habits",
    icon: "Zap",
    requirement: "Complete a habit once",
    trigger: { type: "habit_count", value: 1 },
  },
  {
    id: 37,
    title: "Habit Builder",
    description: "Completed habits 10 times",
    points: 100,
    category: "habits",
    icon: "Zap",
    requirement: "Complete habits 10 times total",
    trigger: { type: "habit_count", value: 10 },
  },
  {
    id: 38,
    title: "Habit Enthusiast",
    description: "Completed habits 25 times",
    points: 200,
    category: "habits",
    icon: "Zap",
    requirement: "Complete habits 25 times total",
    trigger: { type: "habit_count", value: 25 },
  },
  {
    id: 39,
    title: "Habit Master",
    description: "Completed habits 50 times",
    points: 500,
    category: "habits",
    icon: "Zap",
    requirement: "Complete habits 50 times total",
    trigger: { type: "habit_count", value: 50 },
  },
  {
    id: 40,
    title: "Habit Champion",
    description: "Completed habits 100 times",
    points: 1000,
    category: "habits",
    icon: "Zap",
    requirement: "Complete habits 100 times total",
    trigger: { type: "habit_count", value: 100 },
  },

  // ============================================================================
  // STREAK ACHIEVEMENTS (ID: 51-65)
  // ============================================================================
  {
    id: 51,
    title: "3-Day Streak",
    description: "Maintained a 3-day journaling streak",
    points: 100,
    category: "streak",
    icon: "Flame",
    requirement: "Journal for 3 consecutive days",
    trigger: { type: "streak", value: 3 },
  },
  {
    id: 52,
    title: "7-Day Warrior",
    description: "Maintained a 7-day journaling streak",
    points: 200,
    category: "streak",
    icon: "Flame",
    requirement: "Journal for 7 consecutive days",
    trigger: { type: "streak", value: 7 },
  },
  {
    id: 53,
    title: "Two-Week Champion",
    description: "Maintained a 14-day journaling streak",
    points: 400,
    category: "streak",
    icon: "Flame",
    requirement: "Journal for 14 consecutive days",
    trigger: { type: "streak", value: 14 },
  },
  {
    id: 54,
    title: "30-Day Legend",
    description: "Maintained a 30-day journaling streak",
    points: 1000,
    category: "streak",
    icon: "Flame",
    requirement: "Journal for 30 consecutive days",
    trigger: { type: "streak", value: 30 },
  },
  {
    id: 55,
    title: "60-Day Master",
    description: "Maintained a 60-day journaling streak",
    points: 2000,
    category: "streak",
    icon: "Flame",
    requirement: "Journal for 60 consecutive days",
    trigger: { type: "streak", value: 60 },
  },
  {
    id: 56,
    title: "100-Day Ascended",
    description: "Maintained a 100-day journaling streak",
    points: 5000,
    category: "streak",
    icon: "Flame",
    requirement: "Journal for 100 consecutive days",
    trigger: { type: "streak", value: 100 },
  },

  // ============================================================================
  // XP ACHIEVEMENTS (ID: 66-80)
  // ============================================================================
  {
    id: 66,
    title: "XP Novice",
    description: "Earned 100 total XP",
    points: 50,
    category: "xp",
    icon: "Award",
    requirement: "Earn 100 XP",
    trigger: { type: "xp", value: 100 },
  },
  {
    id: 67,
    title: "XP Apprentice",
    description: "Earned 500 total XP",
    points: 100,
    category: "xp",
    icon: "Award",
    requirement: "Earn 500 XP",
    trigger: { type: "xp", value: 500 },
  },
  {
    id: 68,
    title: "XP Achiever",
    description: "Earned 1,000 total XP",
    points: 200,
    category: "xp",
    icon: "Award",
    requirement: "Earn 1,000 XP",
    trigger: { type: "xp", value: 1000 },
  },
  {
    id: 69,
    title: "XP Expert",
    description: "Earned 2,500 total XP",
    points: 500,
    category: "xp",
    icon: "Award",
    requirement: "Earn 2,500 XP",
    trigger: { type: "xp", value: 2500 },
  },
  {
    id: 70,
    title: "XP Master",
    description: "Earned 5,000 total XP",
    points: 1000,
    category: "xp",
    icon: "Award",
    requirement: "Earn 5,000 XP",
    trigger: { type: "xp", value: 5000 },
  },
  {
    id: 71,
    title: "XP Legend",
    description: "Earned 10,000 total XP",
    points: 2000,
    category: "xp",
    icon: "Award",
    requirement: "Earn 10,000 XP",
    trigger: { type: "xp", value: 10000 },
  },

  // ============================================================================
  // GENERAL/SPECIAL ACHIEVEMENTS (ID: 81-100)
  // ============================================================================
  {
    id: 99,
    title: "JournalXP",
    description: "This is a secret🤫",
    points: 1000,
    category: "general",
    icon: "Trophy",
    requirement:
      "Hint: It's a clickable button somewhere in the app that doesn't do what you think it would do.",
    trigger: { type: "special", value: 99 },
  },
];

/**
 * Helper function to get achievement by ID
 */
export function getAchievementById(id: number): AchievementDefinition | undefined {
  return ACHIEVEMENT_DEFINITIONS.find((a) => a.id === id);
}

/**
 * Helper function to get all achievements by category
 */
export function getAchievementsByCategory(
  category: AchievementDefinition["category"]
): AchievementDefinition[] {
  return ACHIEVEMENT_DEFINITIONS.filter((a) => a.category === category);
}
