/**
 * Production-ready infinite level system with exponential growth
 *
 * Core formula: cost(L → L+1) = base * growth^(L-1)
 * - Base cost: 100 XP (Level 1 → 2)
 * - Growth rate: 5% per level (1.05 multiplier)
 * - Infinite levels (no cap)
 */

// ============================================================================
// TYPES
// ============================================================================

/**
 * Configuration for the level system
 */
export interface LevelConfig {
  /** Base XP cost for Level 1 → 2 (default: 100) */
  base?: number;
  /** Growth multiplier per level (default: 1.05 for 5% growth) */
  growth?: number;
  /** Number of decimals for rounding user-facing values (default: 2) */
  decimals?: number;
}

/**
 * User's current level state
 */
export interface LevelState {
  /** Current level (minimum 1) */
  level: number;
  /** Total XP accumulated (never negative) */
  xp: number;
}

/**
 * Detailed progress information within current level
 */
export interface ProgressInfo {
  /** Current level */
  level: number;
  /** Total XP accumulated */
  totalXp: number;
  /** XP at the start of current level */
  xpAtLevelStart: number;
  /** XP earned within current level */
  xpInCurrentLevel: number;
  /** XP required to reach next level */
  xpToNextLevel: number;
  /** XP remaining to reach next level */
  xpRemaining: number;
  /** Percentage progress to next level (0-100) */
  percentToNext: number;
}

/**
 * Level threshold information
 */
export interface LevelThreshold {
  /** Starting level */
  from: number;
  /** Target level */
  to: number;
  /** XP cost for this level-up */
  cost: number;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const DEFAULT_CONFIG: Required<LevelConfig> = {
  base: 100,
  growth: 1.05,
  decimals: 2,
};

/**
 * Normalize and validate configuration
 */
function getConfig(cfg?: LevelConfig): Required<LevelConfig> {
  const config = { ...DEFAULT_CONFIG, ...cfg };

  // Validate growth rate
  if (config.growth <= 1) {
    throw new Error(
      `Invalid growth rate: ${config.growth}. Must be > 1 for exponential growth.`
    );
  }

  // Validate base cost
  if (config.base <= 0) {
    throw new Error(`Invalid base cost: ${config.base}. Must be > 0.`);
  }

  return config;
}

/**
 * Round a number to specified decimals
 */
function round(value: number, decimals: number): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Calculate XP required to level up from a specific level
 *
 * Formula: base * growth^(level - 1)
 *
 * @param level - Current level (must be >= 1)
 * @param cfg - Optional configuration
 * @returns XP cost to reach next level
 *
 * @example
 * costForLevelUp(1) // 100 XP (base cost)
 * costForLevelUp(2) // 105 XP (100 * 1.05^1)
 * costForLevelUp(10) // 155.13 XP (100 * 1.05^9)
 */
export function costForLevelUp(level: number, cfg?: LevelConfig): number {
  const config = getConfig(cfg);

  // Clamp level to minimum 1
  const L = Math.max(1, Math.floor(level));

  // cost(L → L+1) = base * growth^(L-1)
  const cost = config.base * Math.pow(config.growth, L - 1);

  return round(cost, config.decimals);
}

/**
 * Calculate total XP required to reach a specific level
 *
 * Uses geometric series formula to avoid loops:
 * sum = base * (r^n - 1) / (r - 1)
 * where r = growth, n = level - 1
 *
 * @param level - Target level (must be >= 1)
 * @param cfg - Optional configuration
 * @returns Total XP needed to reach this level
 *
 * @example
 * totalXpToReachLevel(1) // 0 XP (starting level)
 * totalXpToReachLevel(2) // 100 XP
 * totalXpToReachLevel(10) // 1133.27 XP
 */
export function totalXpToReachLevel(level: number, cfg?: LevelConfig): number {
  const config = getConfig(cfg);

  // Clamp level to minimum 1
  const L = Math.max(1, Math.floor(level));

  // Level 1 requires 0 XP
  if (L <= 1) {
    return 0;
  }

  const r = config.growth;
  const b = config.base;
  const n = L - 1;

  // Geometric series: sum = b * (r^n - 1) / (r - 1)
  const totalXp = b * (Math.pow(r, n) - 1) / (r - 1);

  return round(totalXp, config.decimals);
}

/**
 * Calculate level from total XP using analytical formula (no loops)
 *
 * Inverts the geometric series formula:
 * L = floor(log((xp*(r-1)/b) + 1) / log(r)) + 1
 *
 * @param xp - Total XP accumulated
 * @param cfg - Optional configuration
 * @returns Current level (minimum 1)
 *
 * @example
 * levelFromTotalXp(0) // 1
 * levelFromTotalXp(100) // 2
 * levelFromTotalXp(1133.27) // 10
 */
export function levelFromTotalXp(xp: number, cfg?: LevelConfig): number {
  const config = getConfig(cfg);

  // Clamp XP to non-negative
  const totalXp = Math.max(0, xp);

  // Level 1 if no XP
  if (totalXp <= 0) {
    return 1;
  }

  const r = config.growth;
  const b = config.base;

  // Solve: xp = b * (r^(L-1) - 1) / (r - 1)
  // => L = floor(log((xp*(r-1)/b) + 1) / log(r)) + 1

  const level = Math.floor(Math.log((totalXp * (r - 1)) / b + 1) / Math.log(r)) + 1;

  return Math.max(1, level);
}

/**
 * Get detailed progress information for a given XP amount
 *
 * @param xp - Total XP accumulated
 * @param cfg - Optional configuration
 * @returns Detailed progress information
 *
 * @example
 * progressFromXp(150) // { level: 2, percentToNext: 47.62, ... }
 */
export function progressFromXp(xp: number, cfg?: LevelConfig): ProgressInfo {
  const config = getConfig(cfg);

  // Clamp XP to non-negative
  const totalXp = Math.max(0, xp);

  // Calculate current level
  const level = levelFromTotalXp(totalXp, config);

  // XP at the start of current level
  const xpAtLevelStart = totalXpToReachLevel(level, config);

  // XP needed to reach next level
  const xpToNextLevel = costForLevelUp(level, config);

  // XP earned within current level
  const xpInCurrentLevel = totalXp - xpAtLevelStart;

  // XP remaining to next level
  const xpRemaining = xpToNextLevel - xpInCurrentLevel;

  // Percentage progress (0-100)
  const percentToNext = (xpInCurrentLevel / xpToNextLevel) * 100;

  return {
    level,
    totalXp: round(totalXp, config.decimals),
    xpAtLevelStart: round(xpAtLevelStart, config.decimals),
    xpInCurrentLevel: round(xpInCurrentLevel, config.decimals),
    xpToNextLevel: round(xpToNextLevel, config.decimals),
    xpRemaining: round(xpRemaining, config.decimals),
    percentToNext: round(percentToNext, config.decimals),
  };
}

/**
 * Calculate percentage completion of a specific level given total XP
 *
 * Useful for showing progress bars for arbitrary levels
 *
 * @param level - The level to check progress for
 * @param xp - Total XP accumulated
 * @param cfg - Optional configuration
 * @returns Percentage completion (0-100), clamped to [0, 100]
 *
 * @example
 * youArePercentOfLevel(2, 150) // 47.62% through level 2
 * youArePercentOfLevel(2, 50) // 0% (not yet in level 2)
 * youArePercentOfLevel(2, 250) // 100% (already past level 2)
 */
export function youArePercentOfLevel(
  level: number,
  xp: number,
  cfg?: LevelConfig
): number {
  const config = getConfig(cfg);

  // Clamp inputs
  const L = Math.max(1, Math.floor(level));
  const totalXp = Math.max(0, xp);

  // XP at start and end of this level
  const xpAtLevelStart = totalXpToReachLevel(L, config);
  const xpToNextLevel = costForLevelUp(L, config);
  const xpAtLevelEnd = xpAtLevelStart + xpToNextLevel;

  // Not yet at this level
  if (totalXp < xpAtLevelStart) {
    return 0;
  }

  // Already past this level
  if (totalXp >= xpAtLevelEnd) {
    return 100;
  }

  // Calculate percentage within level
  const xpInLevel = totalXp - xpAtLevelStart;
  const percent = (xpInLevel / xpToNextLevel) * 100;

  return round(percent, config.decimals);
}

/**
 * Get remaining XP needed to reach next level
 *
 * Convenience wrapper over progressFromXp
 *
 * @param xp - Total XP accumulated
 * @param cfg - Optional configuration
 * @returns XP remaining to next level
 *
 * @example
 * remainingXpToNextLevel(150) // 55 XP remaining to level 3
 */
export function remainingXpToNextLevel(xp: number, cfg?: LevelConfig): number {
  const progress = progressFromXp(xp, cfg);
  return progress.xpRemaining;
}

/**
 * Add XP to current state and return updated state with progress info
 *
 * @param state - Current level state
 * @param delta - XP to add (can be negative)
 * @param cfg - Optional configuration
 * @returns Updated state with progress information
 *
 * @example
 * addXp({ level: 1, xp: 50 }, 100) // { level: 2, xp: 150, ... }
 * addXp({ level: 2, xp: 150 }, -50) // { level: 2, xp: 100, ... }
 */
export function addXp(
  state: LevelState,
  delta: number,
  cfg?: LevelConfig
): LevelState & ProgressInfo {
  const config = getConfig(cfg);

  // Calculate new total XP (clamp to non-negative)
  const newXp = Math.max(0, state.xp + delta);

  // Get progress information
  const progress = progressFromXp(newXp, config);

  return {
    level: progress.level,
    xp: progress.totalXp,
    ...progress,
  };
}

/**
 * Format progress information as a user-friendly string
 *
 * @param info - Progress information
 * @param cfg - Optional configuration
 * @returns Formatted string
 *
 * @example
 * formatProgress(progressFromXp(150))
 * // "You are 47.62% into Level 2. 55.00 XP to reach Level 3."
 */
export function formatProgress(info: ProgressInfo, cfg?: LevelConfig): string {
  const config = getConfig(cfg);

  const percent = round(info.percentToNext, config.decimals);
  const remaining = round(info.xpRemaining, config.decimals);

  return `You are ${percent}% into Level ${info.level}. ${remaining} XP to reach Level ${info.level + 1}.`;
}

/**
 * List the next N level-up thresholds for UI/tooltips
 *
 * Useful for displaying upcoming level costs
 *
 * @param level - Starting level
 * @param n - Number of thresholds to return
 * @param cfg - Optional configuration
 * @returns Array of level thresholds
 *
 * @example
 * listNextNThresholds(1, 3)
 * // [
 * //   { from: 1, to: 2, cost: 100 },
 * //   { from: 2, to: 3, cost: 105 },
 * //   { from: 3, to: 4, cost: 110.25 }
 * // ]
 */
export function listNextNThresholds(
  level: number,
  n: number,
  cfg?: LevelConfig
): LevelThreshold[] {
  const config = getConfig(cfg);

  // Clamp inputs
  const startLevel = Math.max(1, Math.floor(level));
  const count = Math.max(0, Math.floor(n));

  const thresholds: LevelThreshold[] = [];

  for (let i = 0; i < count; i++) {
    const fromLevel = startLevel + i;
    const toLevel = fromLevel + 1;
    const cost = costForLevelUp(fromLevel, config);

    thresholds.push({
      from: fromLevel,
      to: toLevel,
      cost,
    });
  }

  return thresholds;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if XP amount is enough to level up from current state
 *
 * @param state - Current level state
 * @param cfg - Optional configuration
 * @returns True if user can level up
 */
export function canLevelUp(state: LevelState, cfg?: LevelConfig): boolean {
  const progress = progressFromXp(state.xp, cfg);
  return progress.percentToNext >= 100;
}

/**
 * Get the number of level-ups that would occur from adding XP
 *
 * @param state - Current level state
 * @param delta - XP to add
 * @param cfg - Optional configuration
 * @returns Number of levels gained
 */
export function getLevelsGained(
  state: LevelState,
  delta: number,
  cfg?: LevelConfig
): number {
  const newState = addXp(state, delta, cfg);
  return newState.level - state.level;
}

/**
 * Calculate XP needed to reach a target level from current XP
 *
 * @param currentXp - Current total XP
 * @param targetLevel - Target level
 * @param cfg - Optional configuration
 * @returns XP needed (0 if already at or past target)
 */
export function xpNeededForLevel(
  currentXp: number,
  targetLevel: number,
  cfg?: LevelConfig
): number {
  const config = getConfig(cfg);

  const totalNeeded = totalXpToReachLevel(targetLevel, config);
  const needed = totalNeeded - Math.max(0, currentXp);

  return Math.max(0, round(needed, config.decimals));
}

/**
 * Get a visual progress bar string
 *
 * @param info - Progress information
 * @param width - Width of progress bar in characters
 * @returns ASCII progress bar
 *
 * @example
 * getProgressBar(progressFromXp(150), 20)
 * // "[=========          ] 47.62%"
 */
export function getProgressBar(info: ProgressInfo, width: number = 20): string {
  const percent = info.percentToNext;
  const filled = Math.floor((percent / 100) * width);
  const empty = width - filled;

  const bar = "[" + "=".repeat(filled) + " ".repeat(empty) + "]";
  return `${bar} ${percent.toFixed(2)}%`;
}
