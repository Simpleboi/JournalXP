import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Trophy, TrendingUp, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useUserData } from "@/context/UserDataContext";
import { useState, useEffect } from "react";

// Rank color configurations
const getRankColors = (rank: string) => {
  const baseRank = rank.split(" ")[0]; // Get "Bronze", "Silver", etc.

  switch (baseRank) {
    case "Bronze":
      return {
        gradient: "from-amber-100 via-orange-100 to-amber-100",
        badge: "bg-gradient-to-r from-amber-600 to-orange-700",
        text: "text-amber-800",
        icon: "text-amber-600",
        shimmer: "from-amber-300 via-orange-200 to-amber-300",
        border: "border-amber-200",
      };
    case "Silver":
      return {
        gradient: "from-gray-100 via-slate-200 to-gray-100",
        badge: "bg-gradient-to-r from-gray-500 to-slate-600",
        text: "text-gray-800",
        icon: "text-gray-600",
        shimmer: "from-gray-300 via-slate-300 to-gray-300",
        border: "border-gray-300",
      };
    case "Gold":
      return {
        gradient: "from-yellow-100 via-amber-200 to-yellow-100",
        badge: "bg-gradient-to-r from-yellow-600 to-amber-700",
        text: "text-yellow-900",
        icon: "text-yellow-600",
        shimmer: "from-yellow-300 via-amber-300 to-yellow-300",
        border: "border-yellow-300",
      };
    case "Platinum":
      return {
        gradient: "from-cyan-100 via-blue-200 to-cyan-100",
        badge: "bg-gradient-to-r from-cyan-600 to-blue-700",
        text: "text-cyan-900",
        icon: "text-cyan-600",
        shimmer: "from-cyan-300 via-blue-300 to-cyan-300",
        border: "border-cyan-300",
      };
    case "Diamond":
      return {
        gradient: "from-blue-100 via-indigo-200 to-blue-100",
        badge: "bg-gradient-to-r from-blue-600 to-indigo-700",
        text: "text-blue-900",
        icon: "text-blue-600",
        shimmer: "from-blue-300 via-indigo-300 to-blue-300",
        border: "border-blue-300",
      };
    case "Mythic":
      return {
        gradient: "from-purple-100 via-fuchsia-200 to-purple-100",
        badge: "bg-gradient-to-r from-purple-600 to-fuchsia-700",
        text: "text-purple-900",
        icon: "text-purple-600",
        shimmer: "from-purple-300 via-fuchsia-300 to-purple-300",
        border: "border-purple-300",
      };
    case "Legend":
      return {
        gradient: "from-rose-100 via-pink-200 to-rose-100",
        badge: "bg-gradient-to-r from-rose-600 to-pink-700",
        text: "text-rose-900",
        icon: "text-rose-600",
        shimmer: "from-rose-300 via-pink-300 to-rose-300",
        border: "border-rose-300",
      };
    case "Ascended":
      return {
        gradient: "from-emerald-100 via-teal-200 to-emerald-100",
        badge: "bg-gradient-to-r from-emerald-600 to-teal-700",
        text: "text-emerald-900",
        icon: "text-emerald-600",
        shimmer: "from-emerald-300 via-teal-300 to-emerald-300",
        border: "border-emerald-300",
      };
    default:
      return {
        gradient: "from-green-50 to-teal-50",
        badge: "bg-green-100 text-green-700 border-green-200",
        text: "text-gray-700",
        icon: "text-green-500",
        shimmer: "from-green-300 to-teal-300",
        border: "border-green-200",
      };
  }
};

// Calculate rank rarity percentage
const getRankRarity = (rank: string): number => {
  const baseRank = rank.split(" ")[0];

  const rarityMap: { [key: string]: number } = {
    "Bronze": 56, // 45% of users
    "Silver": 28, // 28% of users
    "Gold": 15,   // 15% of users
    "Platinum": 7, // 7% of users
    "Diamond": 3,  // 3% of users
    "Mythic": 1.5, // 1.5% of users
    "Legend": 0.4, // 0.4% of users
    "Ascended": 0.1, // 0.1% of users
  };

  return rarityMap[baseRank] || 50;
};

// Calculate time in rank
const getTimeInRank = (rankAchievedAt?: string): string => {
  if (!rankAchievedAt) return "Recently achieved";

  const achievedDate = new Date(rankAchievedAt);
  const now = new Date();
  const diffMs = now.getTime() - achievedDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Achieved today!";
  if (diffDays === 1) return "1 day";
  if (diffDays < 30) return `${diffDays} days`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return "1 month";
  if (diffMonths < 12) return `${diffMonths} months`;

  const diffYears = Math.floor(diffMonths / 12);
  return diffYears === 1 ? "1 year" : `${diffYears} years`;
};

// This card is shown on the Homepage under the welcome banner
export const CurrentRank = () => {
  const { userData } = useUserData();
  const [shimmerPosition, setShimmerPosition] = useState(0);

  // Animate shimmer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShimmerPosition((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Conditional Check
  if (!userData) return null;

  const currentRank = getRankByLevel(userData.level);
  const nextRank = getNextRank(userData.level);
  const levelsToNext = getLevelsToNextRank(userData.level);
  const colors = getRankColors(currentRank);
  const rarity = getRankRarity(currentRank);
  const timeInRank = getTimeInRank(userData.progression?.currentRankAchievedAt);

  // Calculate progress to next rank (assumes 5 levels per rank tier)
  const progress = nextRank ? ((5 - levelsToNext) / 5) * 100 : 100;

  return (
    <Card className={`bg-gradient-to-br ${colors.gradient} ${colors.border} border shadow-md hover:shadow-lg transition-all overflow-hidden relative`}>
      {/* Animated shimmer overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) ${shimmerPosition}%, transparent 100%)`,
        }}
      />

      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-lg font-medium ${colors.text}`}>
            <Link to="/achievements">Current Rank</Link>
          </h3>
          <Link to="/achievements">
            <Trophy className={`h-5 w-5 ${colors.icon}`} />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          {/* Rank Badge with metallic sheen */}
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Badge className={`${colors.badge} text-white border-0 px-4 py-2 text-base font-bold shadow-lg relative overflow-hidden`}>
              <span className="relative z-10">{currentRank}</span>
              {/* Metallic shine effect */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${colors.shimmer} opacity-0`}
                animate={{ opacity: [0, 0.5, 0], x: [-100, 200] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </Badge>
          </motion.div>

          {/* Progress to next rank */}
          {nextRank && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className={`${colors.text} font-medium flex items-center gap-1`}>
                  <TrendingUp className="h-3 w-3" />
                  Progress to {nextRank}
                </span>
                <span className={`${colors.text} font-semibold`}>
                  Level {userData.level}/{userData.level + levelsToNext}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className={`text-xs ${colors.text} mt-1 opacity-75`}>
                {levelsToNext} {levelsToNext === 1 ? "level" : "levels"} remaining
              </p>
            </div>
          )}

          {/* Rank Stats */}
          <div className="mt-4 space-y-2">
            {/* Rarity */}
            <div className={`flex items-center gap-2 text-xs ${colors.text}`}>
              <Trophy className="h-3.5 w-3.5" />
              <span className="font-medium">
                Only {rarity}% of users have reached {currentRank.split(" ")[0]} rank
              </span>
            </div>

            {/* Time in rank */}
            <div className={`flex items-center gap-2 text-xs ${colors.text}`}>
              <Clock className="h-3.5 w-3.5" />
              <span>
                {timeInRank === "Recently achieved" || timeInRank === "Achieved today!"
                  ? timeInRank
                  : `You've been ${currentRank.split(" ")[0]} for ${timeInRank}`
                }
              </span>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

// Returns a rank based on level
export function getRankByLevel(level: number): string {
  if (level >= 1 && level <= 5) return "Bronze III 🥉";
  if (level <= 10) return "Bronze II 🥉";
  if (level <= 15) return "Bronze I 🥉";
  if (level <= 20) return "Silver III 🥈";
  if (level <= 25) return "Silver II 🥈";
  if (level <= 30) return "Silver I 🥈";
  if (level <= 35) return "Gold III 🥇";
  if (level <= 40) return "Gold II 🥇";
  if (level <= 45) return "Gold I 🥇";
  if (level <= 50) return "Platinum III 💠";
  if (level <= 55) return "Platinum II 💠";
  if (level <= 60) return "Platinum I 💠";
  if (level <= 65) return "Diamond III 💎";
  if (level <= 70) return "Diamond II 💎";
  if (level <= 75) return "Diamond I 💎";
  if (level <= 80) return "Mythic III 🔱";
  if (level <= 85) return "Mythic II 🔱";
  if (level <= 90) return "Mythic I 🔱";
  if (level <= 95) return "Legend II 🌟";
  if (level <= 100) return "Legend I 🌟";
  return "Ascended 🏆"; // if somehow past 100
}

/**
 * @param level - a number representing the current level the user is on
 * @returns a string that represents the next rank the user should be at
 */
export function getNextRank(level: number): string | null {
  const currentRank = getRankByLevel(level);

  // loop forward throuhg the next levels to find the next different rank
  for (let i = level + 1; i <= 100; i++) {
    const nextRank = getRankByLevel(i);
    if (nextRank !== currentRank) return nextRank;
  }
  return null;
}

/**
 * @param level - a number representing the current user's level
 * @returns a number that represents how many numbers needed to reach the next rank
 */
export function getLevelsToNextRank(level: number): number {
  const currentRank = getRankByLevel(level);

  for (let i = level + 1; i <= 100; i++) {
    const nextRank = getRankByLevel(i);
    if (nextRank !== currentRank) {
      return i - level; // Number of levels to reach the next rank
    }
  }

  return 0; // Already at max rank
}

export function getRankBadgeByLevel(level: number): string {
  if (level >= 1 && level <= 5) return "Mindful Beginner";
  if (level <= 10) return "Mindful Beginner";
  if (level <= 15) return "Mindful Beginner";
  if (level <= 20) return "Welness Explorer";
  if (level <= 25) return "Welness Explorer";
  if (level <= 30) return "Welness Explorer";
  if (level <= 35) return "Self-care Advocate";
  if (level <= 40) return "Self-care Advocate";
  if (level <= 45) return "Self-care Advocate";
  if (level <= 50) return "Focused Pathfinder";
  if (level <= 55) return "Focused Pathfinder";
  if (level <= 60) return "Focused Pathfinder";
  if (level <= 65) return "Growth Master";
  if (level <= 70) return "Growth Master";
  if (level <= 75) return "Growth Master";
  if (level <= 80) return "Mental Warrior";
  if (level <= 85) return "Mental Warrior";
  if (level <= 90) return "Mental Warrior";
  if (level <= 95) return "Peaceful Sage";
  if (level <= 100) return "Peaceful Sage";
  return "Ascended"; // if somehow past 100
}
