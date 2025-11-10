import { Badge } from "@/components/ui/badge";
import { ProgressCurrentStreak } from "@/features/progress/CurrentStreak";
import { ProgressCurrentLevel } from "@/features/progress/CurrentLevel";
import { ProgressCurrentPoints } from "@/features/progress/CurrentPoints";
import { useUserData } from "@/context/UserDataContext";
import { CurrentRank } from "@/features/progress/CurrentRank";
import { getRankBadgeByLevel } from "@/features/progress/CurrentRank";
import { getLevelsToNextRank } from "@shared/utils/rankSystem";
import { getRankByLevel } from "@shared/utils/rankSystem";

const ProgressStats = () => {
  const { userData } = useUserData();

  // Avoid rendering if data hasn't loaded
  if (!userData) return null;

  // Calculate levels to next rank using shared utility
  const levelsToNextRank = getLevelsToNextRank(userData.level);

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm">
      <div className="flex-col sm:flex-row gap-4 sm:gap-0  flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 ">Your Progress</h2>
        <div className="flex w-full sm:w-fit justify-between items-center">
          <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 text-sm">
            {getRankBadgeByLevel(userData.level)}
          </Badge>
          {userData.nextRank && (
            <span className="text-xs text-gray-500 ml-2">
              {levelsToNextRank} more {levelsToNextRank === 1 ? 'level' : 'levels'} until {userData.nextRank}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Points Card */}
        <ProgressCurrentPoints />

        {/* Level Card */}
        <ProgressCurrentLevel />

        {/* Streak Card */}
        <ProgressCurrentStreak />

        {/* Rank Card */}
        <CurrentRank />
      </div>
    </div>
  );
};

export default ProgressStats;
