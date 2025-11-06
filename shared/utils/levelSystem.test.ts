/**
 * Unit tests for the infinite level system
 */

import {
  costForLevelUp,
  totalXpToReachLevel,
  levelFromTotalXp,
  progressFromXp,
  youArePercentOfLevel,
  remainingXpToNextLevel,
  addXp,
  formatProgress,
  listNextNThresholds,
  canLevelUp,
  getLevelsGained,
  xpNeededForLevel,
  getProgressBar,
  type LevelConfig,
  type LevelState,
} from "./levelSystem";

describe("Level System", () => {
  // ============================================================================
  // CORE FUNCTIONS
  // ============================================================================

  describe("costForLevelUp", () => {
    it("should return base cost (100) for level 1 → 2", () => {
      expect(costForLevelUp(1)).toBe(100);
    });

    it("should apply 5% growth per level", () => {
      expect(costForLevelUp(2)).toBe(105); // 100 * 1.05^1
      expect(costForLevelUp(3)).toBe(110.25); // 100 * 1.05^2
      expect(costForLevelUp(4)).toBeCloseTo(115.76, 2); // 100 * 1.05^3
    });

    it("should handle large levels", () => {
      const cost = costForLevelUp(100);
      expect(cost).toBeGreaterThan(0);
      expect(cost).toBeLessThan(Infinity);
    });

    it("should clamp negative levels to 1", () => {
      expect(costForLevelUp(-5)).toBe(100);
      expect(costForLevelUp(0)).toBe(100);
    });

    it("should respect custom config", () => {
      const config: LevelConfig = { base: 200, growth: 1.1 };
      expect(costForLevelUp(1, config)).toBe(200);
      expect(costForLevelUp(2, config)).toBe(220); // 200 * 1.1^1
    });
  });

  describe("totalXpToReachLevel", () => {
    it("should return 0 for level 1", () => {
      expect(totalXpToReachLevel(1)).toBe(0);
    });

    it("should return base cost for level 2", () => {
      expect(totalXpToReachLevel(2)).toBe(100);
    });

    it("should correctly sum geometric series", () => {
      // Level 3: 100 + 105 = 205
      expect(totalXpToReachLevel(3)).toBe(205);

      // Level 4: 100 + 105 + 110.25 = 315.25
      expect(totalXpToReachLevel(4)).toBe(315.25);

      // Level 10: sum of geometric series
      const level10 = totalXpToReachLevel(10);
      expect(level10).toBeCloseTo(1133.27, 1);
    });

    it("should handle large levels efficiently", () => {
      const start = Date.now();
      const xp = totalXpToReachLevel(1000);
      const duration = Date.now() - start;

      expect(xp).toBeGreaterThan(0);
      expect(duration).toBeLessThan(10); // Should be instant (no loops)
    });

    it("should clamp negative levels to 1", () => {
      expect(totalXpToReachLevel(-5)).toBe(0);
      expect(totalXpToReachLevel(0)).toBe(0);
    });
  });

  describe("levelFromTotalXp", () => {
    it("should return level 1 for 0 XP", () => {
      expect(levelFromTotalXp(0)).toBe(1);
    });

    it("should return level 1 for XP < 100", () => {
      expect(levelFromTotalXp(50)).toBe(1);
      expect(levelFromTotalXp(99)).toBe(1);
    });

    it("should return level 2 for 100 ≤ XP < 205", () => {
      expect(levelFromTotalXp(100)).toBe(2);
      expect(levelFromTotalXp(150)).toBe(2);
      expect(levelFromTotalXp(204)).toBe(2);
    });

    it("should return level 3 for 205 ≤ XP < 315.25", () => {
      expect(levelFromTotalXp(205)).toBe(3);
      expect(levelFromTotalXp(250)).toBe(3);
      expect(levelFromTotalXp(315)).toBe(3);
    });

    it("should be inverse of totalXpToReachLevel", () => {
      for (let level = 1; level <= 50; level++) {
        const xp = totalXpToReachLevel(level);
        const calculatedLevel = levelFromTotalXp(xp);
        expect(calculatedLevel).toBe(level);
      }
    });

    it("should handle large XP values efficiently", () => {
      const start = Date.now();
      const level = levelFromTotalXp(1000000);
      const duration = Date.now() - start;

      expect(level).toBeGreaterThan(0);
      expect(duration).toBeLessThan(10); // Should be instant (no loops)
    });

    it("should clamp negative XP to level 1", () => {
      expect(levelFromTotalXp(-100)).toBe(1);
    });
  });

  describe("progressFromXp", () => {
    it("should return correct progress for level 1", () => {
      const progress = progressFromXp(50);

      expect(progress.level).toBe(1);
      expect(progress.totalXp).toBe(50);
      expect(progress.xpAtLevelStart).toBe(0);
      expect(progress.xpInCurrentLevel).toBe(50);
      expect(progress.xpToNextLevel).toBe(100);
      expect(progress.xpRemaining).toBe(50);
      expect(progress.percentToNext).toBe(50);
    });

    it("should return correct progress for level 2", () => {
      const progress = progressFromXp(150); // 50 XP into level 2

      expect(progress.level).toBe(2);
      expect(progress.totalXp).toBe(150);
      expect(progress.xpAtLevelStart).toBe(100);
      expect(progress.xpInCurrentLevel).toBe(50);
      expect(progress.xpToNextLevel).toBe(105);
      expect(progress.xpRemaining).toBe(55);
      expect(progress.percentToNext).toBeCloseTo(47.62, 1);
    });

    it("should return 100% progress at exact level boundary", () => {
      const progress = progressFromXp(205); // Exactly at level 3

      expect(progress.level).toBe(3);
      expect(progress.percentToNext).toBe(0); // Start of level 3
    });

    it("should handle 0 XP", () => {
      const progress = progressFromXp(0);

      expect(progress.level).toBe(1);
      expect(progress.totalXp).toBe(0);
      expect(progress.percentToNext).toBe(0);
    });
  });

  describe("youArePercentOfLevel", () => {
    it("should return 0% if XP is before target level", () => {
      expect(youArePercentOfLevel(2, 50)).toBe(0); // Level 1 XP, checking level 2
    });

    it("should return 100% if XP is past target level", () => {
      expect(youArePercentOfLevel(2, 300)).toBe(100); // Level 3 XP, checking level 2
    });

    it("should return correct % for XP within target level", () => {
      const percent = youArePercentOfLevel(2, 150); // 50 XP into level 2
      expect(percent).toBeCloseTo(47.62, 1); // 50 / 105 * 100
    });

    it("should return 0% at exact level start", () => {
      expect(youArePercentOfLevel(2, 100)).toBe(0);
    });

    it("should return 100% at exact level end", () => {
      expect(youArePercentOfLevel(2, 205)).toBe(100);
    });
  });

  describe("remainingXpToNextLevel", () => {
    it("should return correct remaining XP", () => {
      expect(remainingXpToNextLevel(0)).toBe(100); // Need 100 to reach level 2
      expect(remainingXpToNextLevel(50)).toBe(50); // Need 50 more
      expect(remainingXpToNextLevel(100)).toBe(105); // At level 2, need 105 to reach level 3
    });
  });

  describe("addXp", () => {
    it("should add positive XP and level up", () => {
      const state: LevelState = { level: 1, xp: 50 };
      const result = addXp(state, 150);

      expect(result.level).toBe(3); // 50 + 150 = 200 XP → Level 3
      expect(result.xp).toBe(200);
    });

    it("should subtract XP but not drop below 0", () => {
      const state: LevelState = { level: 2, xp: 150 };
      const result = addXp(state, -200);

      expect(result.level).toBe(1);
      expect(result.xp).toBe(0); // Clamped to 0
    });

    it("should return progress info", () => {
      const state: LevelState = { level: 1, xp: 0 };
      const result = addXp(state, 50);

      expect(result.percentToNext).toBe(50);
      expect(result.xpRemaining).toBe(50);
    });

    it("should handle exact level-up amounts", () => {
      const state: LevelState = { level: 1, xp: 0 };
      const result = addXp(state, 100);

      expect(result.level).toBe(2);
      expect(result.xp).toBe(100);
      expect(result.percentToNext).toBe(0); // At start of level 2
    });
  });

  describe("formatProgress", () => {
    it("should format progress string correctly", () => {
      const progress = progressFromXp(150);
      const formatted = formatProgress(progress);

      expect(formatted).toContain("47.62%");
      expect(formatted).toContain("Level 2");
      expect(formatted).toContain("55");
      expect(formatted).toContain("Level 3");
    });
  });

  describe("listNextNThresholds", () => {
    it("should list correct number of thresholds", () => {
      const thresholds = listNextNThresholds(1, 3);

      expect(thresholds).toHaveLength(3);
      expect(thresholds[0]).toEqual({ from: 1, to: 2, cost: 100 });
      expect(thresholds[1]).toEqual({ from: 2, to: 3, cost: 105 });
      expect(thresholds[2]).toEqual({ from: 3, to: 4, cost: 110.25 });
    });

    it("should handle starting from higher levels", () => {
      const thresholds = listNextNThresholds(5, 2);

      expect(thresholds).toHaveLength(2);
      expect(thresholds[0].from).toBe(5);
      expect(thresholds[0].to).toBe(6);
      expect(thresholds[1].from).toBe(6);
      expect(thresholds[1].to).toBe(7);
    });

    it("should return empty array for n=0", () => {
      expect(listNextNThresholds(1, 0)).toEqual([]);
    });
  });

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  describe("canLevelUp", () => {
    it("should return false if not enough XP", () => {
      expect(canLevelUp({ level: 1, xp: 50 })).toBe(false);
    });

    it("should return true if enough XP", () => {
      expect(canLevelUp({ level: 1, xp: 100 })).toBe(true);
      expect(canLevelUp({ level: 1, xp: 150 })).toBe(true);
    });
  });

  describe("getLevelsGained", () => {
    it("should return 0 for no level up", () => {
      expect(getLevelsGained({ level: 1, xp: 50 }, 30)).toBe(0);
    });

    it("should return 1 for single level up", () => {
      expect(getLevelsGained({ level: 1, xp: 50 }, 50)).toBe(1);
    });

    it("should return multiple levels for large XP gain", () => {
      expect(getLevelsGained({ level: 1, xp: 0 }, 500)).toBe(4); // Should reach level 5
    });

    it("should handle negative delta", () => {
      expect(getLevelsGained({ level: 3, xp: 300 }, -100)).toBe(-1); // Drop to level 2
    });
  });

  describe("xpNeededForLevel", () => {
    it("should return XP needed to reach target", () => {
      expect(xpNeededForLevel(0, 2)).toBe(100);
      expect(xpNeededForLevel(50, 2)).toBe(50);
      expect(xpNeededForLevel(0, 5)).toBeCloseTo(431.01, 1);
    });

    it("should return 0 if already at or past target", () => {
      expect(xpNeededForLevel(100, 2)).toBe(0);
      expect(xpNeededForLevel(500, 2)).toBe(0);
    });
  });

  describe("getProgressBar", () => {
    it("should generate ASCII progress bar", () => {
      const progress = progressFromXp(50); // 50% of level 1
      const bar = getProgressBar(progress, 20);

      expect(bar).toContain("[");
      expect(bar).toContain("]");
      expect(bar).toContain("50.00%");
      expect(bar).toMatch(/\[=+\s+\]/); // Should have filled and empty spaces
    });

    it("should handle 0% progress", () => {
      const progress = progressFromXp(0);
      const bar = getProgressBar(progress, 10);

      expect(bar).toContain("[          ]");
      expect(bar).toContain("0.00%");
    });

    it("should handle 100% progress", () => {
      const progress = progressFromXp(100);
      const bar = getProgressBar(progress, 10);

      expect(bar).toContain("0.00%"); // At level 2 start, 0% into level 2
    });
  });

  // ============================================================================
  // CONFIGURATION TESTS
  // ============================================================================

  describe("Custom Configuration", () => {
    it("should throw error for invalid growth rate", () => {
      expect(() => costForLevelUp(1, { growth: 1 })).toThrow();
      expect(() => costForLevelUp(1, { growth: 0.95 })).toThrow();
    });

    it("should throw error for invalid base cost", () => {
      expect(() => costForLevelUp(1, { base: 0 })).toThrow();
      expect(() => costForLevelUp(1, { base: -100 })).toThrow();
    });

    it("should respect custom decimals", () => {
      const config: LevelConfig = { decimals: 0 };
      const cost = costForLevelUp(3, config); // 110.25 → 110

      expect(cost).toBe(110);
    });

    it("should work with different base values", () => {
      const config: LevelConfig = { base: 50 };

      expect(costForLevelUp(1, config)).toBe(50);
      expect(costForLevelUp(2, config)).toBe(52.5); // 50 * 1.05
    });

    it("should work with different growth rates", () => {
      const config: LevelConfig = { growth: 1.1 }; // 10% growth

      expect(costForLevelUp(1, config)).toBe(100);
      expect(costForLevelUp(2, config)).toBe(110); // 100 * 1.1
    });
  });

  // ============================================================================
  // EDGE CASES
  // ============================================================================

  describe("Edge Cases", () => {
    it("should handle very large XP values", () => {
      const progress = progressFromXp(999999999);

      expect(progress.level).toBeGreaterThan(0);
      expect(progress.level).toBeLessThan(Infinity);
      expect(progress.percentToNext).toBeGreaterThanOrEqual(0);
      expect(progress.percentToNext).toBeLessThanOrEqual(100);
    });

    it("should handle fractional XP values", () => {
      const progress = progressFromXp(123.456);

      expect(progress.totalXp).toBe(123.46); // Rounded to 2 decimals
    });

    it("should handle fractional level inputs (should floor)", () => {
      expect(costForLevelUp(2.9)).toBe(105); // Floors to level 2
    });

    it("should maintain consistency across operations", () => {
      // Add XP then subtract it should return to original state
      const state: LevelState = { level: 1, xp: 150 };
      const added = addXp(state, 100);
      const subtracted = addXp(added, -100);

      expect(subtracted.level).toBe(state.level);
      expect(subtracted.xp).toBe(state.xp);
    });

    it("should handle rapid level-ups", () => {
      const state: LevelState = { level: 1, xp: 0 };
      const result = addXp(state, 10000);

      expect(result.level).toBeGreaterThan(1);
      expect(result.xp).toBe(10000);

      // Verify the level is correct
      const verifyLevel = levelFromTotalXp(10000);
      expect(result.level).toBe(verifyLevel);
    });
  });

  // ============================================================================
  // PERFORMANCE TESTS
  // ============================================================================

  describe("Performance", () => {
    it("should handle 1000 level calculations in < 100ms", () => {
      const start = Date.now();

      for (let i = 1; i <= 1000; i++) {
        totalXpToReachLevel(i);
      }

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it("should handle 1000 XP → level conversions in < 100ms", () => {
      const start = Date.now();

      for (let xp = 0; xp < 100000; xp += 100) {
        levelFromTotalXp(xp);
      }

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it("should calculate progress efficiently", () => {
      const start = Date.now();

      for (let i = 0; i < 1000; i++) {
        progressFromXp(i * 100);
      }

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(100);
    });
  });
});
