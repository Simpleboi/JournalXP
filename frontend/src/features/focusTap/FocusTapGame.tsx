/**
 * Focus Tap Game Main Component
 *
 * Mode selector and game state manager. Routes between:
 * - Mode selection screen
 * - Warm-Up mode
 * - Challenge mode
 * - Results screen
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Heart, Trophy, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FocusTapWarmUp } from './FocusTapWarmUp';
import { FocusTapChallenge } from './FocusTapChallenge';
import { GameResults } from './GameResults';
import { GameMode, GameResult, FocusTapGameProps } from './types';

type GameScreen = 'menu' | 'warmup' | 'challenge' | 'results';

export const FocusTapGame = ({ onComplete, onXpAwarded }: FocusTapGameProps) => {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('menu');
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  const handleModeSelect = (mode: GameMode) => {
    setCurrentScreen(mode);
  };

  const handleGameComplete = (result: GameResult) => {
    setGameResult(result);
    setCurrentScreen('results');

    // Notify parent components
    if (onComplete) {
      onComplete(result);
    }
    if (onXpAwarded) {
      onXpAwarded(result.xpAwarded, result.mode);
    }
  };

  const handlePlayAgain = () => {
    if (gameResult) {
      setCurrentScreen(gameResult.mode);
    } else {
      setCurrentScreen('menu');
    }
  };

  const handleBackToMenu = () => {
    setGameResult(null);
    setCurrentScreen('menu');
  };

  // Render different screens
  if (currentScreen === 'warmup') {
    return <FocusTapWarmUp onComplete={handleGameComplete} onBack={handleBackToMenu} />;
  }

  if (currentScreen === 'challenge') {
    return <FocusTapChallenge onComplete={handleGameComplete} onBack={handleBackToMenu} />;
  }

  if (currentScreen === 'results' && gameResult) {
    return (
      <GameResults
        result={gameResult}
        onPlayAgain={handlePlayAgain}
        onBackToMenu={handleBackToMenu}
      />
    );
  }

  // Mode Selection Menu
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Target className="h-8 w-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-gray-800">Focus Tap</h1>
              <p className="text-gray-600">Train your focus & earn XP</p>
            </div>
          </div>
        </motion.div>

        {/* Mode Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Warm-Up Mode */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 hover:border-blue-300 transition-colors cursor-pointer group">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                    Recommended
                  </Badge>
                </div>
                <CardTitle className="text-2xl text-gray-800">Warm-Up Mode</CardTitle>
                <CardDescription className="text-gray-600">
                  Calm, wellness-focused practice session
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    60-second timed session
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    No scoring or pressure
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    No penalties for mistakes
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Fixed 20 XP reward
                  </li>
                </ul>

                <div className="pt-4">
                  <Button
                    onClick={() => handleModeSelect('warmup')}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white gap-2 group-hover:shadow-lg transition-shadow"
                  >
                    <Sparkles className="h-4 w-4" />
                    Start Warm-Up
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Perfect for beginners and relaxation
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Challenge Mode */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 border-2 border-purple-700 hover:border-purple-500 transition-colors cursor-pointer group">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-yellow-500 text-yellow-900 animate-pulse">
                    Competitive
                  </Badge>
                </div>
                <CardTitle className="text-2xl text-white">Challenge Mode</CardTitle>
                <CardDescription className="text-white/80">
                  Score-based progression with combos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-white/90">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    Unlimited playtime
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    Combo multipliers & scoring
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    Progressive difficulty
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    Score-based XP (up to 50 XP)
                  </li>
                </ul>

                <div className="pt-4">
                  <Button
                    onClick={() => handleModeSelect('challenge')}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white gap-2 group-hover:shadow-lg transition-shadow"
                  >
                    <Trophy className="h-4 w-4" />
                    Start Challenge
                  </Button>
                </div>

                <p className="text-xs text-white/60 text-center">
                  Wrong tap = combo reset (not game over)
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Info Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">How to Play</h3>
                  <p className="text-sm text-gray-600">
                    A target color will be displayed at the top. Tap only the dots that match the target color.
                    Avoid tapping dots of other colors. In Challenge Mode, build combos to increase your score multiplier!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
