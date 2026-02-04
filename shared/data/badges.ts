/**
 * Shared badge data for XP bonus calculations
 * Used by both frontend and backend
 */

// Badge rarity type
export type BadgeRarity = "common" | "rare" | "epic" | "legendary";

// XP bonus multipliers by rarity
export const BADGE_XP_MULTIPLIERS: Record<BadgeRarity, number> = {
  common: 0, // No bonus
  rare: 0.05, // +5%
  epic: 0.1, // +10%
  legendary: 0.15, // +15%
};

// Badge rarity lookup map (badge ID -> rarity)
export const BADGE_RARITIES: Record<string, BadgeRarity> = {
  // Common badges (Level 1-5)
  "badge-first-steps": "common",
  "badge-curious-mind": "common",
  "badge-new-dawn": "common",
  "badge-dreamer": "common",
  "badge-habit-starter": "common",
  "badge-journal-keeper": "common",
  "badge-early-bird": "common",
  "badge-steady-hand": "common",
  "badge-patient-soul": "common",
  "badge-bright-spark": "common",
  // Rare badges (Level 5-12)
  "badge-rising-star": "rare",
  "badge-momentum-builder": "rare",
  "badge-reflection-master": "rare",
  "badge-mindful-explorer": "rare",
  "badge-calm-waters": "rare",
  "badge-focus-master": "rare",
  "badge-gratitude-giver": "rare",
  "badge-boundary-keeper": "rare",
  "badge-resilient-spirit": "rare",
  // Epic badges (Level 15-24)
  "badge-zen-apprentice": "epic",
  "badge-growth-mindset": "epic",
  "badge-night-owl": "epic",
  "badge-heart-of-gold": "epic",
  "badge-shadow-dancer": "epic",
  "badge-flow-state": "epic",
  "badge-growth-champion": "epic",
  "badge-wisdom-seeker": "epic",
  "badge-mountain-climber": "epic",
  "badge-inner-fire": "epic",
  "badge-crystal-clear": "epic",
  "badge-emotional-architect": "epic",
  "badge-mindscape-navigator": "epic",
  "badge-pattern-breaker": "epic",
  "badge-inner-compass": "epic",
  // Legendary badges (Level 30+)
  "badge-mental-warrior": "legendary",
  "badge-peaceful-sage": "legendary",
  "badge-ascended-mind": "legendary",
  "badge-cosmic-thinker": "legendary",
  "badge-void-walker": "legendary",
  "badge-soul-alchemist": "legendary",
  "badge-eternal-flame": "legendary",
  "badge-infinity-keeper": "legendary",
};

/**
 * Get badge rarity from badge ID
 * Returns undefined if badge not found (no bonus applied)
 */
export function getBadgeRarity(badgeId: string | undefined): BadgeRarity | undefined {
  if (!badgeId) return undefined;
  return BADGE_RARITIES[badgeId];
}

/**
 * Get XP multiplier for a badge rarity
 */
export function getBadgeXPMultiplier(rarity: BadgeRarity | undefined): number {
  if (!rarity) return 0;
  return BADGE_XP_MULTIPLIERS[rarity];
}

/**
 * Calculate bonus XP for a given base amount and badge ID
 * Returns { baseXP, bonusXP, totalXP, rarity }
 */
export function calculateBadgeBonus(
  baseXP: number,
  badgeId: string | undefined
): {
  baseXP: number;
  bonusXP: number;
  totalXP: number;
  rarity: BadgeRarity | undefined;
} {
  const rarity = getBadgeRarity(badgeId);
  const multiplier = getBadgeXPMultiplier(rarity);
  const bonusXP = Math.floor(baseXP * multiplier);

  return {
    baseXP,
    bonusXP,
    totalXP: baseXP + bonusXP,
    rarity,
  };
}
