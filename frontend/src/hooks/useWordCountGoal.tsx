import { useMemo } from "react";

interface WordCountGoalResult {
  currentCount: number;
  goal: number;
  progress: number; // 0-100
  remaining: number;
  isGoalMet: boolean;
  progressColor: string;
}

/**
 * Custom hook for word count goals
 */
export function useWordCountGoal(content: string, goal: number = 250): WordCountGoalResult {
  const currentCount = useMemo(() => {
    if (!content || typeof content !== "string") return 0;
    return content.trim().split(/\s+/).filter((word) => word.length > 0).length;
  }, [content]);

  const progress = Math.min((currentCount / goal) * 100, 100);
  const remaining = Math.max(goal - currentCount, 0);
  const isGoalMet = currentCount >= goal;

  const progressColor = useMemo(() => {
    if (progress >= 100) return "text-green-600";
    if (progress >= 75) return "text-blue-600";
    if (progress >= 50) return "text-yellow-600";
    return "text-gray-600";
  }, [progress]);

  return {
    currentCount,
    goal,
    progress,
    remaining,
    isGoalMet,
    progressColor,
  };
}
