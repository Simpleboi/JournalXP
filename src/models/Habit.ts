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
  targetCompletions?: number;
  currentCompletions?: number;
}

export interface HabitProgress {
  habitId: string;
  date: string;
  completed: boolean;
}
