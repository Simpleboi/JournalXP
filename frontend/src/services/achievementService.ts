import { authFetch } from "@/lib/authFetch";

export interface Achievement {
  id: number;
  title: string;
  description: string;
  points: number;
  category: "journaling" | "tasks" | "habits" | "streak" | "xp" | "general";
  icon: string;
  requirement: string;
  unlocked: boolean;
  dateUnlocked?: string | null;
}

export interface AchievementStats {
  totalAchievements: number;
  unlockedCount: number;
  totalPoints: number;
  completionPercentage: number;
}

export interface AchievementsResponse {
  achievements: Achievement[];
  stats: AchievementStats;
}

/**
 * Get all achievements with unlocked status
 */
export async function getAchievements(): Promise<AchievementsResponse> {
  return await authFetch("/achievements");
}

/**
 * Get a specific achievement by ID
 */
export async function getAchievement(id: number): Promise<Achievement> {
  return await authFetch(`/achievements/${id}`);
}

/**
 * Unlock a special achievement (for easter eggs, etc.)
 */
export async function unlockSpecialAchievement(id: number): Promise<{
  success: boolean;
  message: string;
  achievement: Achievement;
}> {
  return await authFetch(`/achievements/unlock/${id}`, {
    method: "POST",
  });
}
