import { Habit } from "@/models/Habit";

/**
 * Calculates the progress of a habit as a percentage.
 * @param habit The habit object to calculate progress for.
 * @returns A number between 0 and 100 representing percent complete.
 */
export const calculateProgress = (habit: Habit): number => {
  const target = habit.targetCompletions || 1;
  const current = habit.currentCompletions || 0;
  return Math.min(100, Math.round((current / target) * 100));
};
