/**
 * Scoring Utility Functions
 *
 * Handles all score calculations, XP rewards, and difficulty progression
 * for the Focus Tap mini-game.
 */

import {
  ScoringConfig,
  ScoreCalculation,
  DEFAULT_SCORING_CONFIG,
  CHALLENGE_CONFIG,
  WARMUP_CONFIG,
  GameResult,
} from '../types';

// ============================================================================
// Score Calculation
// ============================================================================

/**
 * Calculates score for a single correct tap based on current combo and difficulty
 *
 * Formula: basePoints × comboMultiplier × difficultyMultiplier
 *
 * @param combo - Current combo count
 * @param difficultyLevel - Current difficulty level (1+)
 * @param config - Scoring configuration
 * @returns Score calculation breakdown
 */
export function calculateTapScore(
  combo: number,
  difficultyLevel: number,
  config: ScoringConfig = DEFAULT_SCORING_CONFIG
): ScoreCalculation {
  // Combo multiplier: increases by 0.1 per combo, capped at 5.0x
  const comboMultiplier = Math.min(
    1 + combo * config.comboIncrement,
    config.maxComboMultiplier
  );

  // Difficulty multiplier: straight multiplier based on level
  const difficultyMultiplier = difficultyLevel;

  // Total score for this tap
  const totalScore = Math.round(
    config.basePoints * comboMultiplier * difficultyMultiplier
  );

  return {
    basePoints: config.basePoints,
    comboMultiplier,
    difficultyMultiplier,
    totalScore,
  };
}

/**
 * Calculates difficulty level based on correct taps
 *
 * @param correctTaps - Total correct taps in session
 * @param config - Scoring configuration
 * @returns Current difficulty level (1+)
 */
export function calculateDifficultyLevel(
  correctTaps: number,
  config: ScoringConfig = DEFAULT_SCORING_CONFIG
): number {
  return Math.floor(correctTaps / config.difficultyThreshold) + 1;
}

// ============================================================================
// XP Rewards
// ============================================================================

/**
 * Calculates XP reward for Warm-Up mode (fixed amount)
 *
 * @returns XP amount
 */
export function calculateWarmupXP(): number {
  return WARMUP_CONFIG.xpReward;
}

/**
 * Calculates XP reward for Challenge mode based on score
 *
 * Formula: min(score / 100, maxXpPerSession)
 * Daily cap applied separately
 *
 * @param score - Final score
 * @param isNewHighScore - Whether this beat previous high score
 * @returns XP amount (before daily cap)
 */
export function calculateChallengeXP(
  score: number,
  isNewHighScore: boolean = false
): number {
  // Base XP from score
  const baseXP = Math.floor(score / 100) * CHALLENGE_CONFIG.xpPerHundredScore;

  // Cap at max per session
  const cappedXP = Math.min(baseXP, CHALLENGE_CONFIG.maxXpPerSession);

  // Bonus for new high score
  const bonusXP = isNewHighScore ? CHALLENGE_CONFIG.highScoreBonusXp : 0;

  return cappedXP + bonusXP;
}

/**
 * Applies daily XP cap for Challenge mode
 *
 * @param earnedXP - XP from this session
 * @param alreadyEarnedToday - XP already earned today
 * @returns XP to actually award (respecting daily cap)
 */
export function applyDailyXPCap(
  earnedXP: number,
  alreadyEarnedToday: number
): number {
  const remainingCap = CHALLENGE_CONFIG.dailyXpCap - alreadyEarnedToday;

  if (remainingCap <= 0) {
    return 0; // Daily cap reached
  }

  return Math.min(earnedXP, remainingCap);
}

// ============================================================================
// Difficulty Configuration
// ============================================================================

/**
 * Gets spawn interval for current difficulty level
 *
 * Formula: max(minInterval, baseInterval - (level × reduction))
 *
 * @param difficultyLevel - Current difficulty level
 * @returns Spawn interval in milliseconds
 */
export function getSpawnInterval(difficultyLevel: number): number {
  const baseInterval = 1500; // ms
  const reduction = 100; // ms per level
  const minInterval = 400; // ms

  return Math.max(minInterval, baseInterval - difficultyLevel * reduction);
}

/**
 * Gets dot lifespan for current difficulty level
 *
 * Formula: max(minLifespan, baseLifespan - (level × reduction))
 *
 * @param difficultyLevel - Current difficulty level
 * @returns Dot lifespan in milliseconds
 */
export function getDotLifespan(difficultyLevel: number): number {
  const baseLifespan = 4000; // ms
  const reduction = 200; // ms per level
  const minLifespan = 2000; // ms

  return Math.max(minLifespan, baseLifespan - difficultyLevel * reduction);
}

/**
 * Gets maximum dots allowed on screen for current difficulty
 *
 * @param difficultyLevel - Current difficulty level
 * @returns Max dots on screen
 */
export function getMaxDotsOnScreen(difficultyLevel: number): number {
  const baseDots = 3;
  const increment = 0.5;
  const maxDots = 8;

  return Math.min(maxDots, Math.floor(baseDots + difficultyLevel * increment));
}

// ============================================================================
// Statistics & Records
// ============================================================================

/**
 * Determines if a new record was set
 *
 * @param result - Current game result
 * @param previousHighScore - Previous high score
 * @param previousLongestCombo - Previous longest combo
 * @returns Record status
 */
export function checkForRecords(
  result: GameResult,
  previousHighScore: number = 0,
  previousLongestCombo: number = 0
): {
  isNewHighScore: boolean;
  isNewComboRecord: boolean;
  improvements: string[];
} {
  const isNewHighScore = result.mode === 'challenge' && result.score > previousHighScore;
  const isNewComboRecord = result.mode === 'challenge' && result.maxCombo > previousLongestCombo;

  const improvements: string[] = [];
  if (isNewHighScore) improvements.push('New High Score!');
  if (isNewComboRecord) improvements.push('New Combo Record!');

  return {
    isNewHighScore,
    isNewComboRecord,
    improvements,
  };
}

/**
 * Formats score with thousands separators
 *
 * @param score - Score to format
 * @returns Formatted score string
 */
export function formatScore(score: number): string {
  return score.toLocaleString();
}

/**
 * Formats duration in MM:SS format
 *
 * @param seconds - Duration in seconds
 * @returns Formatted time string
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Generates performance feedback message based on game result
 *
 * @param result - Game result
 * @returns Encouraging feedback message
 */
export function generateFeedbackMessage(result: GameResult): string {
  if (result.mode === 'warmup') {
    return 'Great warm-up session! Your focus is primed for deep work.';
  }

  // Challenge mode feedback
  const { score, maxCombo, maxDifficulty } = result;

  if (score === 0) {
    return 'Every expert was once a beginner. Try again!';
  }

  if (score < 100) {
    return 'Nice start! Keep practicing to improve your focus.';
  }

  if (score < 500) {
    return `Good effort! You reached a ${maxCombo}-combo streak.`;
  }

  if (score < 1000) {
    return `Impressive ${maxCombo}-combo! Your concentration is improving.`;
  }

  if (score < 2000) {
    return `Outstanding! Level ${maxDifficulty} difficulty mastered.`;
  }

  return `Phenomenal ${formatScore(score)} score! You're in the zone! 🔥`;
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Validates game result data
 *
 * @param result - Game result to validate
 * @returns Whether result is valid
 */
export function validateGameResult(result: GameResult): boolean {
  if (!result.mode || !['warmup', 'challenge'].includes(result.mode)) {
    return false;
  }

  if (result.score < 0 || result.correctTaps < 0 || result.wrongTaps < 0) {
    return false;
  }

  if (result.maxCombo < 0 || result.maxDifficulty < 1) {
    return false;
  }

  if (result.duration < 0) {
    return false;
  }

  return true;
}
