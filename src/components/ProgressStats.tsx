import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Flame, Award, Star, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { RecentAchievement } from "@/features/progress/ProgressAchievement";
import { ProgressCurrentStreak } from "@/features/progress/CurrentStreak";

interface ProgressStatsProps {
  points?: number;
  level?: number;
  levelProgress?: number;
  streak?: number;
  recentAchievement?: string;
  rank?: string;
  nextRank?: string;
  pointsToNextRank?: number;
}

const ProgressStats = ({
  points = 1250,
  level = 5,
  levelProgress = 65,
  streak = 7,
  recentAchievement = "Consistent Journaler",
  rank = "Reflective Explorer",
  nextRank = "Mindful Adept",
  pointsToNextRank = 750,
}: ProgressStatsProps) => {
  // Calculate points needed for next level
  const pointsForNextLevel = 500;
  const pointsNeeded = pointsForNextLevel - (points % pointsForNextLevel);

  // Define ranks based on levels
  const ranks = [
    "Calm Novice",
    "Mindful Beginner",
    "Reflective Explorer",
    "Mindful Adept",
    "Wellness Journeyer",
    "Balance Seeker",
    "Tranquility Guide",
    "Mindful Master",
    "Wellbeing Sage",
    "Enlightened Guardian",
  ];

  // Get current rank based on level
  const currentRank =
    rank || ranks[Math.min(Math.floor(level / 2), ranks.length - 1)];
  const nextRankValue =
    nextRank || ranks[Math.min(Math.floor(level / 2) + 1, ranks.length - 1)];

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Your Progress</h2>
        <div className="flex items-center">
          <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 text-sm">
            {currentRank}
          </Badge>
          <span className="text-xs text-gray-500 ml-2">
            {pointsToNextRank} points to {nextRankValue}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Points Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-none shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-700">
                Total Points
              </h3>
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            <motion.p
              className="text-3xl font-bold text-indigo-600"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {points}
            </motion.p>
            <p className="text-sm text-gray-500 mt-2">
              {pointsNeeded} XP until next level
            </p>
          </CardContent>
        </Card>

        {/* Level Card */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-none shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-700">
                Current Level
              </h3>
              <Award className="h-5 w-5 text-purple-500" />
            </div>
            <div className="flex items-end gap-2">
              <motion.p
                className="text-3xl font-bold text-purple-600"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {level}
              </motion.p>
              <Badge
                variant="outline"
                className="mb-1 bg-purple-100 text-purple-700 border-purple-200"
              >
                {levelProgress}% to Level {level + 1}
              </Badge>
            </div>
            <div className="mt-2">
              <Progress value={levelProgress} className="h-2 bg-purple-100" />
            </div>
          </CardContent>
        </Card>

        {/* Streak Card */}
        <ProgressCurrentStreak />

        {/* Achievement Card */}
        <RecentAchievement />
      </div>
    </div>
  );
};

export default ProgressStats;
