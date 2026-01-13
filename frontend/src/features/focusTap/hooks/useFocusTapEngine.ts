/**
 * useFocusTapEngine Hook
 *
 * Core game engine managing state, dot lifecycle, scoring, and difficulty.
 * Shared between Warm-Up and Challenge modes.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  GameMode,
  GameState,
  GamePhase,
  DotInstance,
  GameResult,
  WARMUP_CONFIG,
} from '../types';
import {
  calculateTapScore,
  calculateDifficultyLevel,
  getSpawnInterval,
  getDotLifespan,
  getMaxDotsOnScreen,
} from '../utils/scoring';
import {
  selectTargetColor,
  spawnDot,
  removeDot,
  removeExpiredDots,
  shouldSpawnDot,
  getColorById,
} from '../utils/dotGenerator';

// ============================================================================
// Initial State
// ============================================================================

const INITIAL_STATE: GameState = {
  mode: null,
  phase: 'idle',
  targetColor: null,
  dots: [],
  correctTaps: 0,
  wrongTaps: 0,
  score: 0,
  combo: 0,
  difficultyLevel: 1,
  timeRemaining: 0,
  startTime: null,
};

// ============================================================================
// Hook Implementation
// ============================================================================

export function useFocusTapEngine() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const lastSpawnTimeRef = useRef<number>(0);
  const gameLoopRef = useRef<number | null>(null);
  const maxComboRef = useRef<number>(0);
  const maxDifficultyRef = useRef<number>(1);

  // =========================================================================
  // Game Loop (Dot Spawning & Cleanup)
  // =========================================================================

  const gameLoop = useCallback(() => {
    setGameState((prev) => {
      if (prev.phase !== 'running' || !prev.targetColor) {
        return prev;
      }

      const currentTime = Date.now();
      let updatedDots = [...prev.dots];

      // Remove expired dots
      updatedDots = removeExpiredDots(updatedDots, currentTime);

      // Determine spawn parameters based on mode
      const isWarmupMode = prev.mode === 'warmup';
      const difficultyLevel = isWarmupMode ? 1 : prev.difficultyLevel;

      const spawnInterval = isWarmupMode
        ? WARMUP_CONFIG.spawnInterval
        : getSpawnInterval(difficultyLevel);

      const dotLifespan = isWarmupMode
        ? WARMUP_CONFIG.dotLifespan
        : getDotLifespan(difficultyLevel);

      const maxDots = isWarmupMode
        ? WARMUP_CONFIG.maxDotsOnScreen
        : getMaxDotsOnScreen(difficultyLevel);

      // Spawn new dot if conditions are met
      if (
        shouldSpawnDot(
          updatedDots,
          maxDots,
          lastSpawnTimeRef.current,
          spawnInterval,
          currentTime
        )
      ) {
        updatedDots = spawnDot(updatedDots, prev.targetColor.id, dotLifespan);
        lastSpawnTimeRef.current = currentTime;
      }

      // Update time remaining (warmup mode only)
      let timeRemaining = prev.timeRemaining;
      if (isWarmupMode && prev.startTime) {
        const elapsed = Math.floor((currentTime - prev.startTime) / 1000);
        timeRemaining = Math.max(0, WARMUP_CONFIG.duration - elapsed);

        // Auto-end warmup when time runs out
        if (timeRemaining === 0) {
          return {
            ...prev,
            phase: 'ended',
            dots: updatedDots,
            timeRemaining: 0,
          };
        }
      }

      return {
        ...prev,
        dots: updatedDots,
        timeRemaining,
      };
    });
  }, []);

  // Start game loop when running
  useEffect(() => {
    if (gameState.phase === 'running') {
      gameLoopRef.current = window.setInterval(gameLoop, 100); // 10 FPS
      return () => {
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current);
        }
      };
    }
  }, [gameState.phase, gameLoop]);

  // =========================================================================
  // Game Control Functions
  // =========================================================================

  const startGame = useCallback((mode: GameMode) => {
    const targetColor = selectTargetColor();
    const startTime = Date.now();

    setGameState({
      ...INITIAL_STATE,
      mode,
      phase: 'running',
      targetColor,
      startTime,
      timeRemaining: mode === 'warmup' ? WARMUP_CONFIG.duration : 0,
    });

    // Set lastSpawnTime to far in the past so first dot spawns immediately
    lastSpawnTimeRef.current = 0;
    maxComboRef.current = 0;
    maxDifficultyRef.current = 1;
  }, []);

  const handleDotTap = useCallback((dotId: string, colorId: string) => {
    setGameState((prev) => {
      if (prev.phase !== 'running' || !prev.targetColor) {
        return prev;
      }

      const isCorrect = colorId === prev.targetColor.id;
      let updatedDots = removeDot(prev.dots, dotId);

      // Warmup Mode: Simple feedback, no scoring
      if (prev.mode === 'warmup') {
        return {
          ...prev,
          dots: updatedDots,
          correctTaps: isCorrect ? prev.correctTaps + 1 : prev.correctTaps,
          wrongTaps: isCorrect ? prev.wrongTaps : prev.wrongTaps + 1,
        };
      }

      // Challenge Mode: Scoring, combo, difficulty
      let newScore = prev.score;
      let newCombo = prev.combo;
      let newCorrectTaps = prev.correctTaps;
      let newWrongTaps = prev.wrongTaps;

      if (isCorrect) {
        // Correct tap: award points, increase combo
        newCombo = prev.combo + 1;
        newCorrectTaps = prev.correctTaps + 1;

        const tapScore = calculateTapScore(newCombo, prev.difficultyLevel);
        newScore = prev.score + tapScore.totalScore;

        // Track max combo
        if (newCombo > maxComboRef.current) {
          maxComboRef.current = newCombo;
        }
      } else {
        // Wrong tap: Reset combo (no game over - wellness focus!)
        newCombo = 0;
        newWrongTaps = prev.wrongTaps + 1;
      }

      // Calculate new difficulty level
      const newDifficultyLevel = calculateDifficultyLevel(newCorrectTaps);
      if (newDifficultyLevel > maxDifficultyRef.current) {
        maxDifficultyRef.current = newDifficultyLevel;
      }

      return {
        ...prev,
        dots: updatedDots,
        correctTaps: newCorrectTaps,
        wrongTaps: newWrongTaps,
        score: newScore,
        combo: newCombo,
        difficultyLevel: newDifficultyLevel,
      };
    });
  }, []);

  const endGame = useCallback((): GameResult | null => {
    if (gameState.phase !== 'running' || !gameState.mode || !gameState.startTime) {
      return null;
    }

    const endTime = Date.now();
    const duration = Math.floor((endTime - gameState.startTime) / 1000);

    const result: GameResult = {
      mode: gameState.mode,
      score: gameState.score,
      correctTaps: gameState.correctTaps,
      wrongTaps: gameState.wrongTaps,
      maxCombo: Math.max(maxComboRef.current, gameState.combo),
      maxDifficulty: maxDifficultyRef.current,
      duration,
      xpAwarded: 0, // Will be calculated by parent component
      timestamp: new Date().toISOString(),
    };

    setGameState((prev) => ({
      ...prev,
      phase: 'ended',
      dots: [], // Clear all dots
    }));

    return result;
  }, [gameState]);

  const resetGame = useCallback(() => {
    setGameState(INITIAL_STATE);
    lastSpawnTimeRef.current = 0;
    maxComboRef.current = 0;
    maxDifficultyRef.current = 1;
  }, []);

  const pauseGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      phase: 'idle',
    }));
  }, []);

  const resumeGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      phase: 'running',
      startTime: Date.now(), // Reset start time to account for pause
    }));
    lastSpawnTimeRef.current = Date.now();
  }, []);

  // =========================================================================
  // Auto-end when phase changes to 'ended'
  // =========================================================================

  useEffect(() => {
    if (gameState.phase === 'ended' && gameState.mode) {
      // Phase changed to ended, trigger cleanup
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    }
  }, [gameState.phase, gameState.mode]);

  // =========================================================================
  // Return API
  // =========================================================================

  return {
    gameState,
    startGame,
    handleDotTap,
    endGame,
    resetGame,
    pauseGame,
    resumeGame,
    maxCombo: maxComboRef.current,
    maxDifficulty: maxDifficultyRef.current,
  };
}
