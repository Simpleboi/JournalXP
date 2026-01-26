import { Badge } from "@/components/ui/badge";
import { ProgressCurrentStreak } from "@/features/progress/CurrentStreak";
import { ProgressCurrentLevel } from "@/features/progress/CurrentLevel";
import { ProgressCurrentPoints } from "@/features/progress/CurrentPoints";
import { useUserData } from "@/context/UserDataContext";
import { CurrentRank } from "@/features/progress/CurrentRank";
import { getRankBadgeByLevel } from "@/features/progress/CurrentRank";
import { getLevelsToNextRank } from "@shared/utils/rankSystem";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/data/themes";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const ProgressStats = () => {
  const { userData } = useUserData();
  const { theme } = useTheme();

  // Avoid rendering if data hasn't loaded
  if (!userData) return null;

  // Calculate levels to next rank using shared utility
  const levelsToNextRank = getLevelsToNextRank(userData.level);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="w-full bg-white/70 backdrop-blur-md border-2 border-white/50 p-5 sm:p-6 rounded-2xl shadow-lg"
    >
      <div className="flex-col sm:flex-row gap-4 sm:gap-0 flex justify-between items-center mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Your Progress
          </h2>
        </div>
        <div className="flex w-full sm:w-fit justify-between items-center gap-2">
          <Badge className="text-white px-4 py-1.5 text-sm rounded-xl shadow-md"
          style={{ background: theme.colors.gradient }}>
            {getRankBadgeByLevel(userData.level)}
          </Badge>
          {userData.nextRank && (
            <span className="text-xs text-gray-500">
              {levelsToNextRank} more {levelsToNextRank === 1 ? 'level' : 'levels'} until {userData.nextRank}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Points Card */}
        <ProgressCurrentPoints />

        {/* Level Card */}
        <ProgressCurrentLevel />

        {/* Streak Card */}
        <ProgressCurrentStreak />

        {/* Rank Card */}
        <CurrentRank />
      </div>
    </motion.div>
  );
};

export default ProgressStats;
