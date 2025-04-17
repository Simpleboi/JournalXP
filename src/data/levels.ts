export interface LevelDataProps {
    level: number;
    pointsRequired: number;
  }
  
  export const levelData: LevelDataProps[] = Array.from({ length: 50 }, (_, i) => {
    const level = i + 1;
    const basePoints = 100;
    const multiplier = 1.1; // 10% increase per level
  
    const pointsRequired = Math.round(basePoints * Math.pow(multiplier, i));
    
    return {
      level,
      pointsRequired,
    };
  });
  