/**
 * Shared badge data for XP bonus calculations
 * Used by both frontend and backend
 */

// Badge rarity type
export type BadgeRarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";

// XP bonus multipliers by rarity
export const BADGE_XP_MULTIPLIERS: Record<BadgeRarity, number> = {
  common: 0, // No bonus
  uncommon: 0.05, // +5%
  rare: 0.1, // +10%
  epic: 0.15, // +15%
  legendary: 0.2, // +20%
  mythic: 0.3, // +30%
};

// Badge rarity lookup map (badge ID -> rarity)
export const BADGE_RARITIES: Record<string, BadgeRarity> = {
  // Common badges (Level 1-10)
  "badge-first-steps": "common",
  "badge-curious-mind": "common",
  "badge-new-dawn": "common",
  "badge-dreamer": "common",
  "badge-bright-spark": "common",
  // Uncommon badges (Level 5-20)
  "badge-habit-starter": "uncommon",
  "badge-journal-keeper": "uncommon",
  "badge-early-bird": "uncommon",
  "badge-steady-hand": "uncommon",
  "badge-patient-soul": "uncommon",
  "badge-rising-star": "uncommon",
  "badge-momentum-builder": "uncommon",
  "badge-reflection-master": "uncommon",
  "badge-resilient-spirit": "uncommon",
  // Rare badges (Level 20-30)
  "badge-mindful-explorer": "rare",
  "badge-calm-waters": "rare",
  "badge-focus-master": "rare",
  "badge-gratitude-giver": "rare",
  "badge-boundary-keeper": "rare",
  "badge-zen-apprentice": "rare",
  "badge-growth-mindset": "rare",
  "badge-night-owl": "rare",
  "badge-heart-of-gold": "rare",
  // Epic badges (Level 30-45)
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
  // Legendary badges (Level 45-65)
  "badge-mental-warrior": "legendary",
  "badge-peaceful-sage": "legendary",
  "badge-ascended-mind": "legendary",
  "badge-cosmic-thinker": "legendary",
  "badge-void-walker": "legendary",
  "badge-soul-alchemist": "legendary",
  "badge-eternal-flame": "legendary",
  "badge-infinity-keeper": "legendary",
  // Mythic badges (Level 70, 75, 80)
  "badge-primordial-light": "mythic",
  "badge-eternal-serenity": "mythic",
  "badge-omniscient-soul": "mythic",
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
