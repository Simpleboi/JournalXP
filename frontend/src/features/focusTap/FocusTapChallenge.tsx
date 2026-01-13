/**
 * Focus Tap Challenge Mode Component
 *
 * Competitive mode with scoring, combos, and difficulty progression.
 * Wrong taps reset combo (wellness-focused - no game over).
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Target, Zap, TrendingUp, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFocusTapEngine } from './hooks/useFocusTapEngine';
import { Dot } from './Dot';
import { FocusTapChallengeProps } from './types';
import { calculateChallengeXP, formatScore } from './utils/scoring';
import { useTheme } from '@/context/ThemeContext';

export const FocusTapChallenge = ({ onComplete, onBack }: FocusTapChallengeProps) => {
  const { gameState, startGame, handleDotTap, endGame, maxCombo, maxDifficulty } =
    useFocusTapEngine();
  const { theme } = useTheme();
  const [showComboAnimation, setShowComboAnimation] = useState(false);

  // Auto-start game on mount
  useEffect(() => {
    startGame('challenge');
  }, [startGame]);

  // Combo animation trigger
  useEffect(() => {
    if (gameState.combo > 0 && gameState.combo % 10 === 0) {
      setShowComboAnimation(true);
      const timer = setTimeout(() => setShowComboAnimation(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState.combo]);

  const handleEndGame = () => {
    const result = endGame();
    if (result) {
      const xp = calculateChallengeXP(result.score);
      onComplete({
        ...result,
        xpAwarded: xp,
      });
    }
  };

  const targetColor = gameState.targetColor;
  const comboMultiplier = 1 + gameState.combo * 0.1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-white">Challenge Mode</h1>
          <Button
            variant="outline"
            onClick={handleEndGame}
            className="gap-2 border-white/20 text-white hover:bg-white/10"
          >
            End Game
          </Button>
        </div>

        {/* Stats Bar */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              {/* Score */}
              <div>
                <p className="text-xs text-white/60 uppercase tracking-wide mb-1">Score</p>
                <p className="text-2xl font-bold text-white">{formatScore(gameState.score)}</p>
              </div>

              {/* Combo */}
              <div>
                <p className="text-xs text-white/60 uppercase tracking-wide mb-1">Combo</p>
                <motion.p
                  className="text-2xl font-bold text-yellow-400"
                  key={gameState.combo}
                  initial={{ scale: 1 }}
                  animate={{ scale: showComboAnimation ? [1, 1.3, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {gameState.combo}x
                </motion.p>
              </div>

              {/* Difficulty */}
              <div>
                <p className="text-xs text-white/60 uppercase tracking-wide mb-1">Difficulty</p>
                <p className="text-2xl font-bold text-purple-400">
                  Level {gameState.difficultyLevel}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Target Display */}
      <div className="max-w-4xl mx-auto mb-4">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-white/80" />
                <span className="text-sm font-medium text-white/80">Target:</span>
              </div>
              {targetColor && (
                <motion.div
                  className={`${targetColor.bg} px-6 py-2 rounded-lg shadow-lg`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <span className="text-white font-bold text-xl">{targetColor.name}</span>
                </motion.div>
              )}
              {gameState.combo >= 10 && (
                <Badge
                  className="bg-yellow-500 text-yellow-900 animate-pulse"
                  style={{ backgroundImage: theme.colors.gradient }}
                >
                  <Zap className="h-3 w-3 mr-1" />
                  {comboMultiplier.toFixed(1)}x Multiplier
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Game Area */}
      <div
        className="max-w-4xl mx-auto relative bg-black/30 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/10"
        style={{ height: '500px' }}
      >
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Dots */}
        <AnimatePresence>
          {gameState.dots.map((dot) => (
            <Dot
              key={dot.id}
              dot={dot}
              targetColorId={targetColor?.id || ''}
              onTap={handleDotTap}
              disabled={gameState.phase !== 'running'}
            />
          ))}
        </AnimatePresence>

        {/* Combo Celebration Overlay */}
        <AnimatePresence>
          {showComboAnimation && gameState.combo >= 20 && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
            >
              <div className="text-center">
                <Award className="h-24 w-24 text-yellow-400 mx-auto mb-2" />
                <p className="text-4xl font-bold text-white">
                  {gameState.combo} COMBO!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center Message (when no dots) */}
        {gameState.dots.length === 0 && gameState.phase === 'running' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <TrendingUp className="h-12 w-12 text-white/40 mx-auto mb-2 animate-pulse" />
              <p className="text-white/60 text-lg">Dots incoming...</p>
              <p className="text-white/40 text-sm mt-2">Stay focused!</p>
            </motion.div>
          </div>
        )}
      </div>

      {/* Bottom Stats */}
      <div className="max-w-4xl mx-auto mt-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span>Correct: {gameState.correctTaps}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <span>Missed: {gameState.wrongTaps}</span>
                </div>
              </div>
              <div className="text-white/60 text-xs">
                Wrong tap = combo reset (not game over!)
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
