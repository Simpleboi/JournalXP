import { Achievement } from "@/models/Achievement";
import { motion } from "framer-motion";
import { FC } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Lock, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GetCategoryColor } from "./AchievementUtils";

interface AchievementElementProps {
  achievement: Achievement;
}

export const AchievementElement: FC<AchievementElementProps> = ({
  achievement,
}) => {

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`overflow-hidden ${
          achievement.unlocked
            ? "border-l-4 border-l-green-500"
            : "border-l-4 border-l-gray-300"
        }`}
      >
        <CardContent className="p-0">
          <div className="p-6">
            <div className="flex items-start">
              <div
                className={`flex-shrink-0 mr-4 p-3 rounded-full ${
                  achievement.unlocked ? "bg-green-50" : "bg-gray-100"
                }`}
              >
                {achievement.unlocked ? (
                  <Trophy className="h-6 w-6 text-green-500" />
                ) : (
                  <Lock className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{achievement.title}</h3>
                  <Badge className={GetCategoryColor(achievement.category)}>
                    {achievement.category.charAt(0).toUpperCase() +
                      achievement.category.slice(1)}
                  </Badge>
                </div>
                <p className="text-gray-600 mt-1">{achievement.description}</p>
                {achievement.unlocked ? (
                  <p className="text-sm text-green-600 mt-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Unlocked {achievement.dateUnlocked}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 mt-2">
                    <span className="font-medium">How to unlock:</span>{" "}
                    {achievement.requirement}
                  </p>
                )}
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-sm font-medium text-indigo-600">
                    {achievement.points} points
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
