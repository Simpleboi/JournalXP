/**
 * Rank system utilities
 * Shared between frontend and backend for consistency
 */

export interface RankInfo {
  rank: string;
  nextRank: string | null;
  levelsToNextRank: number;
}

/**
 * Returns a rank based on level
 */
export function getRankByLevel(level: number): string {
  if (level >= 1 && level <= 5) return "Bronze III";
  if (level <= 10) return "Bronze II";
  if (level <= 15) return "Bronze I";
  if (level <= 20) return "Silver III";
  if (level <= 25) return "Silver II";
  if (level <= 30) return "Silver I";
  if (level <= 35) return "Gold III";
  if (level <= 40) return "Gold II";
  if (level <= 45) return "Gold I";
  if (level <= 50) return "Platinum III";
  if (level <= 55) return "Platinum II";
  if (level <= 60) return "Platinum I";
  if (level <= 65) return "Diamond III";
  if (level <= 70) return "Diamond II";
  if (level <= 75) return "Diamond I";
  if (level <= 80) return "Mythic III";
  if (level <= 85) return "Mythic II";
  if (level <= 90) return "Mythic I";
  if (level <= 95) return "Legend II";
  if (level <= 100) return "Legend I";
  return "Ascended"; // if somehow past 100
}

/**
 * Get the next rank from current level
 */
export function getNextRank(level: number): string | null {
  const currentRank = getRankByLevel(level);

  // loop forward through the next levels to find the next different rank
  for (let i = level + 1; i <= 100; i++) {
    const nextRank = getRankByLevel(i);
    if (nextRank !== currentRank) return nextRank;
  }
  return null;
}

/**
 * Get how many levels until next rank
 */
export function getLevelsToNextRank(level: number): number {
  const currentRank = getRankByLevel(level);

  for (let i = level + 1; i <= 100; i++) {
    const nextRank = getRankByLevel(i);
    if (nextRank !== currentRank) {
      return i - level; // Number of levels to reach the next rank
    }
  }

  return 0; // Already at max rank
}

/**
 * Get rank badge title by level
 */
export function getRankBadgeByLevel(level: number): string {
  if (level >= 1 && level <= 5) return "Mindful Beginner";
  if (level <= 10) return "Mindful Beginner";
  if (level <= 15) return "Mindful Beginner";
  if (level <= 20) return "Wellness Explorer";
  if (level <= 25) return "Wellness Explorer";
  if (level <= 30) return "Wellness Explorer";
  if (level <= 35) return "Self-care Advocate";
  if (level <= 40) return "Self-care Advocate";
  if (level <= 45) return "Self-care Advocate";
  if (level <= 50) return "Focused Pathfinder";
  if (level <= 55) return "Focused Pathfinder";
  if (level <= 60) return "Focused Pathfinder";
  if (level <= 65) return "Growth Master";
  if (level <= 70) return "Growth Master";
  if (level <= 75) return "Growth Master";
  if (level <= 80) return "Mental Warrior";
  if (level <= 85) return "Mental Warrior";
  if (level <= 90) return "Mental Warrior";
  if (level <= 95) return "Peaceful Sage";
  if (level <= 100) return "Peaceful Sage";
  return "Ascended"; // if somehow past 100
}

/**
 * Get complete rank information for a given level
 */
export function getRankInfo(level: number): RankInfo {
  return {
    rank: getRankByLevel(level),
    nextRank: getNextRank(level),
    levelsToNextRank: getLevelsToNextRank(level),
  };
}
