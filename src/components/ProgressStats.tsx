import { Badge } from "@/components/ui/badge";
import { RecentAchievement } from "@/features/progress/ProgressAchievement";
import { ProgressCurrentStreak } from "@/features/progress/CurrentStreak";
import { ProgressCurrentLevel } from "@/features/progress/CurrentLevel";
import { ProgressCurrentPoints } from "@/features/progress/CurrentPoints";
import { useUserData } from "@/context/UserDataContext";

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

const ProgressStats = () => {
  
  const { userData } = useUserData();

  // Avoid rendering if data hasn't loaded
  if (!userData) return null;

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Your Progress</h2>
        <div className="flex items-center">
          <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 text-sm">
            {userData.rank}
          </Badge>
          <span className="text-xs text-gray-500 ml-2">
            {userData.pointsToNextRank} points to {userData.nextRank}
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
