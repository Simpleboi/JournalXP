export interface LevelDataProps {
  level: number;
  pointsRequired: number; // XP needed to go from this level → next
  totalPointsRequired: number; // total XP to reach this level
}

export const levelData: LevelDataProps[] = (() => {
  const baseXP = 100;
  const growthRate = 1.05; // 5% harder to reach the next level
  let cumulativeXP = 0;
  let pointsForNextLevel = baseXP;

  return Array.from({ length: 100 }, (_, i) => {
    const level = i + 1;

    // For level 1, you haven't earned any XP yet
    if (level === 1) {
      cumulativeXP = 0;
    } else {
      cumulativeXP += pointsForNextLevel; // Add the XP required for the *previous* level
      pointsForNextLevel *= growthRate; // Increase XP needed for the next level
    }

    return {
      level,
      pointsRequired: Math.floor(pointsForNextLevel),
      totalPointsRequired: Math.floor(cumulativeXP),
    };
  });
})();
