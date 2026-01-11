/**
 * Focus Tap Warm-Up Mode Component
 *
 * Calm, wellness-focused focus training session.
 * Fixed 60-second duration, no scoring, no penalties.
 */

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Target, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useFocusTapEngine } from './hooks/useFocusTapEngine';
import { Dot } from './Dot';
import { FocusTapWarmUpProps, WARMUP_CONFIG } from './types';
import { calculateWarmupXP, formatDuration } from './utils/scoring';
import { useTheme } from '@/context/ThemeContext';

export const FocusTapWarmUp = ({ onComplete, onBack }: FocusTapWarmUpProps) => {
  const { gameState, startGame, handleDotTap, endGame } = useFocusTapEngine();
  const { theme } = useTheme();

  // Auto-start game on mount
  useEffect(() => {
    startGame('warmup');
  }, [startGame]);

  // Handle game end
  useEffect(() => {
    if (gameState.phase === 'ended' && gameState.mode === 'warmup') {
      const result = endGame();
      if (result) {
        const xp = calculateWarmupXP();
        onComplete({
          ...result,
          xpAwarded: xp,
        });
      }
    }
  }, [gameState.phase, gameState.mode, endGame, onComplete]);

  const targetColor = gameState.targetColor;
  const timeRemaining = gameState.timeRemaining;
  const progress = ((WARMUP_CONFIG.duration - timeRemaining) / WARMUP_CONFIG.duration) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Focus Warm-Up</h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>

        {/* Info Bar */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              {/* Target Color Display */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Tap only:</span>
                </div>
                {targetColor && (
                  <motion.div
                    className={`${targetColor.bg} px-4 py-2 rounded-lg shadow-md`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <span className="text-white font-bold text-lg">{targetColor.name}</span>
                  </motion.div>
                )}
              </div>

              {/* Timer */}
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-600" />
                <span className="text-lg font-mono font-bold text-gray-800">
                  {formatDuration(timeRemaining)}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <Progress value={progress} className="h-2" />
            </div>

            {/* Instruction Text */}
            <p className="text-sm text-gray-600 mt-3 text-center">
              Take a deep breath and focus. Tap only the {targetColor?.name.toLowerCase()} dots.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Game Area */}
      <div
        className="max-w-4xl mx-auto relative bg-white/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden"
        style={{ height: '500px' }}
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="currentColor" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#dots)" />
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

        {/* Center Message (when no dots) */}
        {gameState.dots.length === 0 && gameState.phase === 'running' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-gray-500 text-lg">Dots will appear soon...</p>
              <p className="text-gray-400 text-sm mt-2">Stay focused and breathe</p>
            </motion.div>
          </div>
        )}
      </div>

      {/* Bottom Info */}
      <div className="max-w-4xl mx-auto mt-6">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>Correct: {gameState.correctTaps}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400" />
                <span>Mistakes: {gameState.wrongTaps}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">No penalties - just practice</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
