// The Model for a Habit Tracker
export interface Habit {
  id: string;
  title: string;
  description: string;
  frequency: "daily" | "weekly" | "monthly";
  completed: boolean;
  streak: number;
  lastCompleted?: string;
  xpReward: number;
  category: "mindfulness" | "physical" | "social" | "productivity" | "custom";
  createdAt: string;
  targetCompletions: number;
  currentCompletions: number;
  isIndefinite?: boolean; // If true, habit has no completion target - focus on building streaks
  isFullyCompleted?: boolean; // When currentCompletions >= targetCompletions (not applicable for indefinite habits)
  completedAt?: string; // When the entire habit goal was completed (not applicable for indefinite habits)
}

export interface HabitProgress {
  habitId: string;
  date: string;
  completed: boolean;
}
