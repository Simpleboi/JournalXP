/**
 * XP and Leveling System Utilities for Backend
 *
 * Provides functions to calculate level progression and rank updates
 * when users gain XP from various activities
 */

import { progressFromXp } from "../../../shared/utils/levelSystem";
import { getRankInfo } from "../../../shared/utils/rankSystem";

/**
 * Calculate user updates when gaining XP
 * Returns Firestore update object with level, xp, rank, and nextRank
 *
 * @param currentTotalXP - User's current total XP
 * @param xpToAdd - Amount of XP being added
 * @returns Object with fields to update in Firestore
 */
export function calculateXPUpdate(currentTotalXP: number, xpToAdd: number) {
  const newTotalXP = currentTotalXP + xpToAdd;

  // Calculate new level and XP progress
  const progress = progressFromXp(newTotalXP);

  // Calculate rank info based on new level
  const rankInfo = getRankInfo(progress.level);

  return {
    totalXP: newTotalXP,
    xp: progress.xpInCurrentLevel,
    level: progress.level,
    xpNeededToNextLevel: progress.xpToNextLevel,
    rank: rankInfo.rank,
    nextRank: rankInfo.nextRank,
  };
}

/**
 * Check if leveling up occurred
 *
 * @param oldLevel - Previous level
 * @param newLevel - New level after XP gain
 * @returns True if user leveled up
 */
export function didLevelUp(oldLevel: number, newLevel: number): boolean {
  return newLevel > oldLevel;
}

/**
 * Check if rank changed
 *
 * @param oldRank - Previous rank
 * @param newRank - New rank after XP gain
 * @returns True if rank changed
 */
export function didRankUp(oldRank: string, newRank: string): boolean {
  return oldRank !== newRank;
}
