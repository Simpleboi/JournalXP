export interface LevelDataProps {
  level: number;
  pointsRequired: number;     // XP needed to *reach* this level from the previous one
  totalPointsRequired: number; // Total XP needed to *be at* this level
}

export const levelData: LevelDataProps[] = (() => {
  const baseXP = 100;
  const growthRate = 1.15; // Slightly more challenging curve
  let cumulativeXP = 0;

  return Array.from({ length: 100 }, (_, i) => {
    const level = i + 1;
    const pointsRequired = Math.round(baseXP * Math.pow(growthRate, i));

    cumulativeXP += pointsRequired;

    return {
      level,
      pointsRequired,
      totalPointsRequired: cumulativeXP,
    };
  });
})();

