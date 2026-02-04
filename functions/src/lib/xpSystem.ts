/**
 * XP and Leveling System Utilities for Backend
 *
 * Provides functions to calculate level progression and rank updates
 * when users gain XP from various activities
 */

import { progressFromXp } from "../../../shared/utils/levelSystem";
import { getRankInfo } from "../../../shared/utils/rankSystem";
import {
  calculateBadgeBonus,
  BadgeRarity,
} from "../../../shared/data/badges";

/**
 * Calculate user updates when gaining XP
 * Returns Firestore update object with level, xp, rank, nextRank
 * Note: spendableXP should be incremented separately using FieldValue.increment()
 *
 * @param currentTotalXP - User's current total XP
 * @param xpToAdd - Amount of XP being added
 * @returns Object with fields to update in Firestore (including spendableXPAmount for manual increment)
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
    spendableXPAmount: xpToAdd, // Return amount for caller to use with FieldValue.increment()
  };
}

/**
 * Extended XP update result with badge bonus information
 */
export interface XPUpdateWithBonus {
  totalXP: number;
  xp: number;
  level: number;
  xpNeededToNextLevel: number;
  rank: string;
  nextRank: string | null;
  spendableXPAmount: number;
  // Badge bonus fields
  baseXP: number;
  bonusXP: number;
  badgeRarity: BadgeRarity | undefined;
}

/**
 * Calculate user updates when gaining XP, with badge bonus applied
 *
 * @param currentTotalXP - User's current total XP
 * @param baseXP - Base XP being awarded (before bonus)
 * @param featuredBadge - User's equipped badge ID (optional)
 * @returns Object with fields to update in Firestore, including bonus info
 */
export function calculateXPUpdateWithBonus(
  currentTotalXP: number,
  baseXP: number,
  featuredBadge?: string
): XPUpdateWithBonus {
  // Calculate badge bonus
  const bonus = calculateBadgeBonus(baseXP, featuredBadge);

  // Use total XP (base + bonus) for level/rank calculations
  const newTotalXP = currentTotalXP + bonus.totalXP;
  const progress = progressFromXp(newTotalXP);
  const rankInfo = getRankInfo(progress.level);

  return {
    totalXP: newTotalXP,
    xp: progress.xpInCurrentLevel,
    level: progress.level,
    xpNeededToNextLevel: progress.xpToNextLevel,
    rank: rankInfo.rank,
    nextRank: rankInfo.nextRank,
    spendableXPAmount: bonus.totalXP, // Total including bonus
    // Bonus tracking
    baseXP: bonus.baseXP,
    bonusXP: bonus.bonusXP,
    badgeRarity: bonus.rarity,
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
