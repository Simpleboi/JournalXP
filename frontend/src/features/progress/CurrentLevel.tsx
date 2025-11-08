import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useUserData } from "@/context/UserDataContext";
import { levelData } from "@/data/levels";

export const ProgressCurrentLevel = () => {
  const { userData } = useUserData();

  if (!userData) return null;

  // Calculate actual level based on totalXP (handles overflow automatically)
  const totalXP = userData.totalXP || 0;

  // Find the highest level the user has reached
  let calculatedLevel = 1;
  for (let i = 0; i < levelData.length; i++) {
    if (totalXP >= levelData[i].totalPointsRequired) {
      calculatedLevel = levelData[i].level;
    } else {
      break;
    }
  }

  // Get XP required to reach the current level
  const pointsForCurrentLevel =
    levelData[calculatedLevel - 1]?.totalPointsRequired || 0;

  // Get XP required to reach the next level
  const pointsForNextLevel = levelData[calculatedLevel]?.totalPointsRequired || pointsForCurrentLevel;

  // Calculate XP within current level
  const xpInCurrentLevel = totalXP - pointsForCurrentLevel;

  // Calculate percentage progress towards next level
  const xpNeededForNextLevel = pointsForNextLevel - pointsForCurrentLevel;
  const levelProgress = xpNeededForNextLevel > 0
    ? (xpInCurrentLevel / xpNeededForNextLevel) * 100
    : 0;

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-none shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-gray-700">Current Level</h3>
          <Award className="h-5 w-5 text-purple-500" />
        </div>
        <div className="flex items-end gap-2">
          <motion.p
            className="text-3xl font-bold text-purple-600"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {calculatedLevel}
          </motion.p>
          <Badge
            variant="outline"
            className="mb-1 bg-purple-100 text-purple-700 border-purple-200"
          >
            You're at {Math.round(levelProgress)}% of level {calculatedLevel}
          </Badge>
        </div>
        <div className="mt-2">
          <Progress
            value={levelProgress}
            className="h-2 bg-purple-100"
            max={100}
          />
        </div>
      </CardContent>
    </Card>
  );
};
