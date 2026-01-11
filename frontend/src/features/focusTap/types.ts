/**
 * Focus Tap Mini-Game Type Definitions
 *
 * Defines all interfaces, types, and enums for the Focus Tap game system.
 */

// ============================================================================
// Game State Types
// ============================================================================

export type GameMode = 'warmup' | 'challenge';
export type GamePhase = 'idle' | 'running' | 'ended';

export interface GameState {
  mode: GameMode | null;
  phase: GamePhase;
  targetColor: GameColor | null;
  dots: DotInstance[];
  correctTaps: number;
  wrongTaps: number;
  score: number;
  combo: number;
  difficultyLevel: number;
  timeRemaining: number; // for warmup mode
  startTime: number | null;
}

// ============================================================================
// Dot System
// ============================================================================

export interface GameColor {
  id: string;
  name: string;
  bg: string; // Tailwind class
  text: string; // Tailwind class
  hex: string; // For programmatic use
}

export interface DotInstance {
  id: string;
  colorId: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  size: number; // px
  spawnedAt: number;
  lifespan: number; // ms
}

export interface DotGenerationConfig {
  spawnInterval: number; // ms between spawns
  dotLifespan: number; // how long dot stays visible
  maxDotsOnScreen: number;
  minDotSize: number; // px
  maxDotSize: number; // px
  safeZone: number; // % from edges to avoid spawning
}

// ============================================================================
// Scoring & Difficulty
// ============================================================================

export interface ScoringConfig {
  basePoints: number;
  comboIncrement: number;
  maxComboMultiplier: number;
  difficultyThreshold: number; // taps needed to level up
}

export interface DifficultyConfig {
  level: number;
  spawnInterval: number;
  dotLifespan: number;
  maxDotsOnScreen: number;
}

export interface ScoreCalculation {
  basePoints: number;
  comboMultiplier: number;
  difficultyMultiplier: number;
  totalScore: number;
}

// ============================================================================
// Game Results & Stats
// ============================================================================

export interface GameResult {
  mode: GameMode;
  score: number;
  correctTaps: number;
  wrongTaps: number;
  maxCombo: number;
  maxDifficulty: number;
  duration: number; // seconds
  xpAwarded: number;
  timestamp: string;
}

export interface FocusTapStats {
  // Warm-up stats
  warmupSessionsCompleted: number;
  warmupTotalXp: number;
  warmupLastPlayed: string | null;

  // Challenge stats
  challengeHighScore: number;
  challengeLongestCombo: number;
  challengeMaxDifficulty: number;
  challengeTotalXp: number;
  challengeLastPlayed: string | null;
  challengeXpEarnedToday: number; // for daily cap
  challengeXpResetDate: string; // to track daily reset

  // Overall
  totalGamesPlayed: number;
  totalXpEarned: number;
  favoriteColor: string | null; // most tapped color
}

// ============================================================================
// Component Props
// ============================================================================

export interface FocusTapGameProps {
  onComplete?: (result: GameResult) => void;
  onXpAwarded?: (xp: number, mode: GameMode) => void;
}

export interface FocusTapWarmUpProps {
  onComplete: (result: GameResult) => void;
  onBack: () => void;
}

export interface FocusTapChallengeProps {
  onComplete: (result: GameResult) => void;
  onBack: () => void;
}

export interface DotProps {
  dot: DotInstance;
  targetColorId: string;
  onTap: (dotId: string, isCorrect: boolean) => void;
  disabled?: boolean;
}

// ============================================================================
// Hook Return Types
// ============================================================================

export interface UseFocusTapEngineReturn {
  gameState: GameState;
  startGame: (mode: GameMode) => void;
  handleDotTap: (dotId: string, colorId: string) => void;
  resetGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
}

// ============================================================================
// Constants Export
// ============================================================================

export const GAME_COLORS: GameColor[] = [
  { id: 'blue', name: 'Blue', bg: 'bg-blue-500', text: 'text-blue-500', hex: '#3B82F6' },
  { id: 'green', name: 'Green', bg: 'bg-green-500', text: 'text-green-500', hex: '#22C55E' },
  { id: 'purple', name: 'Purple', bg: 'bg-purple-500', text: 'text-purple-500', hex: '#A855F7' },
  { id: 'orange', name: 'Orange', bg: 'bg-orange-500', text: 'text-orange-500', hex: '#F97316' },
  { id: 'pink', name: 'Pink', bg: 'bg-pink-500', text: 'text-pink-500', hex: '#EC4899' },
];

export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
  basePoints: 10,
  comboIncrement: 0.1,
  maxComboMultiplier: 5.0,
  difficultyThreshold: 20,
};

export const WARMUP_CONFIG = {
  duration: 60, // seconds
  xpReward: 20,
  spawnInterval: 1800, // ms
  dotLifespan: 4000, // ms
  maxDotsOnScreen: 3,
};

export const CHALLENGE_CONFIG = {
  xpPerHundredScore: 1, // 100 score = 1 XP
  maxXpPerSession: 50,
  dailyXpCap: 200,
  highScoreBonusXp: 10,
};

// ============================================================================
// Utility Types
// ============================================================================

export type ColorId = typeof GAME_COLORS[number]['id'];

export interface TapEvent {
  dotId: string;
  colorId: string;
  isCorrect: boolean;
  timestamp: number;
  combo: number;
  score?: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  hapticFeedback: boolean;
  reducedMotion: boolean;
  showComboCounter: boolean; // Challenge mode only
}
