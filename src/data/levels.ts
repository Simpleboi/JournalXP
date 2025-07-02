export interface LevelDataProps {
  level: number;
  pointsRequired: number; 
  totalPointsRequired: number;
}

export const levelData: LevelDataProps[] = (() => {
  const baseXP = 100;
  let cumulativeXP = 0;
  let pointsForNextLevel = baseXP;

  return Array.from({ length: 100 }, (_, i) => {
    const level = i + 1;

    // Base level
    if (level === 1) {
      cumulativeXP = 0;
    }
    else {
      cumulativeXP += pointsForNextLevel;
      pointsForNextLevel *= 1.15;
    }


    return {
      level,
      pointsRequired: baseXP,
      totalPointsRequired: cumulativeXP,
    };
  });
})();
