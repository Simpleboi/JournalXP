/**
 * Game Results Component
 *
 * Displays game completion summary with stats, XP earned, and feedback.
 */

import { motion } from 'framer-motion';
import { Trophy, Zap, Target, Clock, Award, Home, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GameResult } from './types';
import { formatScore, formatDuration, generateFeedbackMessage } from './utils/scoring';
import { useTheme } from '@/context/ThemeContext';

interface GameResultsProps {
  result: GameResult;
  isNewHighScore?: boolean;
  isNewComboRecord?: boolean;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export const GameResults = ({
  result,
  isNewHighScore = false,
  isNewComboRecord = false,
  onPlayAgain,
  onBackToMenu,
}: GameResultsProps) => {
  const { theme } = useTheme();
  const feedbackMessage = generateFeedbackMessage(result);
  const isWarmup = result.mode === 'warmup';

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        isWarmup
          ? 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
          : 'bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900'
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-full max-w-2xl"
      >
        <Card
          className={`${
            isWarmup ? 'bg-white' : 'bg-white/10 backdrop-blur-md border-white/20'
          } shadow-2xl`}
        >
          <CardHeader className="text-center pb-4">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-4"
            >
              {isWarmup ? (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <Target className="h-10 w-10 text-white" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <Trophy className="h-10 w-10 text-white" />
                </div>
              )}
            </motion.div>

            <CardTitle className={`text-3xl ${isWarmup ? 'text-gray-800' : 'text-white'}`}>
              {isWarmup ? 'Warm-Up Complete!' : 'Challenge Complete!'}
            </CardTitle>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`text-lg mt-2 ${isWarmup ? 'text-gray-600' : 'text-white/80'}`}
            >
              {feedbackMessage}
            </motion.p>

            {/* New Records Badges */}
            {(isNewHighScore || isNewComboRecord) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="flex gap-2 justify-center mt-4"
              >
                {isNewHighScore && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 text-sm">
                    <Award className="h-4 w-4 mr-1" />
                    New High Score!
                  </Badge>
                )}
                {isNewComboRecord && (
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-sm">
                    <Zap className="h-4 w-4 mr-1" />
                    Combo Record!
                  </Badge>
                )}
              </motion.div>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* XP Earned */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`${
                  isWarmup ? 'bg-gradient-to-br from-blue-50 to-purple-50' : 'bg-white/10'
                } rounded-lg p-4 text-center`}
              >
                <Zap className={`h-6 w-6 mx-auto mb-2 ${isWarmup ? 'text-blue-600' : 'text-yellow-400'}`} />
                <p className={`text-2xl font-bold ${isWarmup ? 'text-gray-800' : 'text-white'}`}>
                  +{result.xpAwarded}
                </p>
                <p className={`text-xs ${isWarmup ? 'text-gray-600' : 'text-white/60'}`}>XP Earned</p>
              </motion.div>

              {/* Score (Challenge only) */}
              {!isWarmup && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/10 rounded-lg p-4 text-center"
                >
                  <Trophy className="h-6 w-6 mx-auto mb-2 text-yellow-400" />
                  <p className="text-2xl font-bold text-white">{formatScore(result.score)}</p>
                  <p className="text-xs text-white/60">Total Score</p>
                </motion.div>
              )}

              {/* Correct Taps */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: isWarmup ? 0.4 : 0.5 }}
                className={`${
                  isWarmup ? 'bg-gradient-to-br from-green-50 to-emerald-50' : 'bg-white/10'
                } rounded-lg p-4 text-center`}
              >
                <Target className={`h-6 w-6 mx-auto mb-2 ${isWarmup ? 'text-green-600' : 'text-green-400'}`} />
                <p className={`text-2xl font-bold ${isWarmup ? 'text-gray-800' : 'text-white'}`}>
                  {result.correctTaps}
                </p>
                <p className={`text-xs ${isWarmup ? 'text-gray-600' : 'text-white/60'}`}>Correct Taps</p>
              </motion.div>

              {/* Duration */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: isWarmup ? 0.5 : 0.6 }}
                className={`${
                  isWarmup ? 'bg-gradient-to-br from-purple-50 to-pink-50' : 'bg-white/10'
                } rounded-lg p-4 text-center`}
              >
                <Clock className={`h-6 w-6 mx-auto mb-2 ${isWarmup ? 'text-purple-600' : 'text-purple-400'}`} />
                <p className={`text-2xl font-bold ${isWarmup ? 'text-gray-800' : 'text-white'}`}>
                  {formatDuration(result.duration)}
                </p>
                <p className={`text-xs ${isWarmup ? 'text-gray-600' : 'text-white/60'}`}>Duration</p>
              </motion.div>
            </div>

            {/* Challenge Mode Extra Stats */}
            {!isWarmup && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <p className="text-xs text-white/60 mb-1">Max Combo</p>
                  <p className="text-3xl font-bold text-yellow-400">{result.maxCombo}x</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <p className="text-xs text-white/60 mb-1">Max Difficulty</p>
                  <p className="text-3xl font-bold text-purple-400">Level {result.maxDifficulty}</p>
                </div>
              </motion.div>
            )}

            {/* Accuracy (if any wrong taps) */}
            {result.wrongTaps > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: isWarmup ? 0.6 : 0.8 }}
                className={`${
                  isWarmup ? 'bg-gradient-to-r from-gray-50 to-gray-100' : 'bg-white/10'
                } rounded-lg p-4 text-center`}
              >
                <p className={`text-sm ${isWarmup ? 'text-gray-600' : 'text-white/80'}`}>
                  Accuracy:{' '}
                  <span className="font-bold">
                    {Math.round((result.correctTaps / (result.correctTaps + result.wrongTaps)) * 100)}%
                  </span>
                </p>
                <p className={`text-xs mt-1 ${isWarmup ? 'text-gray-500' : 'text-white/60'}`}>
                  {result.correctTaps} correct, {result.wrongTaps} wrong
                </p>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: isWarmup ? 0.7 : 0.9 }}
              className="flex gap-3 pt-4"
            >
              <Button
                onClick={onPlayAgain}
                className={`flex-1 gap-2 ${
                  isWarmup
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                    : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
                } text-white`}
              >
                <RotateCcw className="h-4 w-4" />
                Play Again
              </Button>
              <Button
                onClick={onBackToMenu}
                variant="outline"
                className={`flex-1 gap-2 ${
                  isWarmup
                    ? 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    : 'border-white/20 text-white hover:bg-white/10'
                }`}
              >
                <Home className="h-4 w-4" />
                Main Menu
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
