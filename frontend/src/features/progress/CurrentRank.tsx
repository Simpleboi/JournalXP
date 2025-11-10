import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useUserData } from "@/context/UserDataContext";

// This card is shown on the Homepage under the welcome banner
export const CurrentRank = () => {
  const { userData } = useUserData();

  // Conditional Check
  if (!userData) return null;

  return (
    <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-none shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-gray-700">
            <Link to="/achievements">Current Rank</Link>
          </h3>
          <Link to="/achievements">
            <Trophy className="h-5 w-5 text-green-500" />
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1">
            {getRankByLevel(userData.level)}
          </Badge>
          <p className="text-sm text-gray-500 mt-3">
            Your progress will speak for itself, keep working hard!
          </p>
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
