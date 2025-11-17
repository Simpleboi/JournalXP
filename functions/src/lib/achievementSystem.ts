/**
 * Achievement System
 * Centralized logic for checking and awarding achievements
 */

import { ACHIEVEMENT_DEFINITIONS, AchievementDefinition } from "../../../shared/data/achievements";
import { FieldValue } from "./admin";

export interface UserStatsForAchievements {
  journalCount: number;
  taskCompletedCount: number;
  habitCompletionCount: number;
  streak: number;
  totalXP: number;
  achievements: number[]; // Already unlocked achievement IDs
}

export interface AchievementCheckResult {
  newlyUnlocked: AchievementDefinition[];
  totalPointsEarned: number;
}

/**
 * Check if user has unlocked any new achievements based on their current stats
 * Returns only newly unlocked achievements (not already in user's achievements array)
 */
export function checkAchievements(stats: UserStatsForAchievements): AchievementCheckResult {
  const alreadyUnlocked = new Set(stats.achievements || []);
  const newlyUnlocked: AchievementDefinition[] = [];

  for (const achievement of ACHIEVEMENT_DEFINITIONS) {
    // Skip if already unlocked
    if (alreadyUnlocked.has(achievement.id)) {
      continue;
    }

    // Skip special achievements (manually triggered)
    if (achievement.trigger.type === "special") {
      continue;
    }

    // Check if achievement should be unlocked based on trigger type
    let shouldUnlock = false;

    switch (achievement.trigger.type) {
      case "journal_count":
        shouldUnlock = stats.journalCount >= achievement.trigger.value;
        break;
      case "task_count":
        shouldUnlock = stats.taskCompletedCount >= achievement.trigger.value;
        break;
      case "habit_count":
        shouldUnlock = stats.habitCompletionCount >= achievement.trigger.value;
        break;
      case "streak":
        shouldUnlock = stats.streak >= achievement.trigger.value;
        break;
      case "xp":
        shouldUnlock = stats.totalXP >= achievement.trigger.value;
        break;
    }

    if (shouldUnlock) {
      newlyUnlocked.push(achievement);
    }
  }

  const totalPointsEarned = newlyUnlocked.reduce((sum, a) => sum + a.points, 0);

  return {
    newlyUnlocked,
    totalPointsEarned,
  };
}

/**
 * Generate Firestore update object for newly unlocked achievements
 * This can be merged into a user document update
 */
export function generateAchievementUpdate(
  newlyUnlocked: AchievementDefinition[]
): Record<string, any> {
  if (newlyUnlocked.length === 0) {
    return {};
  }

  const achievementIds = newlyUnlocked.map((a) => a.id);
  const totalPoints = newlyUnlocked.reduce((sum, a) => sum + a.points, 0);

  return {
    achievements: FieldValue.arrayUnion(...achievementIds),
    achievementPoints: FieldValue.increment(totalPoints),
    "achievementStats.totalUnlocked": FieldValue.increment(newlyUnlocked.length),
    "achievementStats.lastUnlockedDate": FieldValue.serverTimestamp(),
  };
}

/**
 * Unlock a special achievement by ID
 * Use this for manually triggered achievements (like the JournalXP easter egg)
 */
export function unlockSpecialAchievement(achievementId: number): {
  achievement: AchievementDefinition | null;
  update: Record<string, any>;
} {
  const achievement = ACHIEVEMENT_DEFINITIONS.find((a) => a.id === achievementId);

  if (!achievement) {
    return { achievement: null, update: {} };
  }

  const update = {
    achievements: FieldValue.arrayUnion(achievementId),
    achievementPoints: FieldValue.increment(achievement.points),
    "achievementStats.totalUnlocked": FieldValue.increment(1),
    "achievementStats.lastUnlockedDate": FieldValue.serverTimestamp(),
  };

  return { achievement, update };
}

/**
 * Get achievement completion percentage
 */
export function getAchievementCompletionPercentage(unlockedCount: number): number {
  const totalAchievements = ACHIEVEMENT_DEFINITIONS.filter(
    (a) => a.trigger.type !== "special"
  ).length;
  return Math.round((unlockedCount / totalAchievements) * 100);
}

/**
 * Convert achievement stats from user data for checking
 */
export function extractStatsFromUserData(userData: any): UserStatsForAchievements {
  return {
    journalCount: userData.journalStats?.totalJournalEntries || 0,
    taskCompletedCount: userData.taskStats?.totalTasksCompleted || 0,
    habitCompletionCount: userData.habitStats?.totalHabitCompletions || 0,
    streak: userData.streak || 0,
    totalXP: userData.totalXP || 0,
    achievements: userData.achievements || [],
  };
}
