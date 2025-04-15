import { Badge } from "@/components/ui/badge";
import { RecentAchievement } from "@/features/progress/ProgressAchievement";
import { ProgressCurrentStreak } from "@/features/progress/CurrentStreak";
import { ProgressCurrentLevel } from "@/features/progress/CurrentLevel";
import { ProgressCurrentPoints } from "@/features/progress/CurrentPoints";

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
        <ProgressCurrentPoints />

        {/* Level Card */}
        <ProgressCurrentLevel />

        {/* Streak Card */}
        <ProgressCurrentStreak />

        {/* Achievement Card */}
        <RecentAchievement />
      </div>
    </div>
  );
};

export default ProgressStats;
