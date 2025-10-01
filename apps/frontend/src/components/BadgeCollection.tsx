import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Star, Clock, Calendar, Zap, Trophy } from "lucide-react";
import { motion } from "framer-motion";

export interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: "streak" | "entry" | "level" | "mood" | "achievement" | "special";
  earned: boolean;
  earnedDate?: string;
}

interface BadgeCollectionProps {
  badges?: BadgeItem[];
  showAll?: boolean;
}

const BadgeCollection = ({
  badges = [
    {
      id: "first-entry",
      name: "First Entry",
      description: "Completed your first journal entry",
      icon: "entry",
      earned: true,
      earnedDate: "2023-04-01",
    },
    {
      id: "7-day-streak",
      name: "7-Day Streak",
      description: "Maintained activity for 7 consecutive days",
      icon: "streak",
      earned: true,
      earnedDate: "2023-04-07",
    },
    {
      id: "level-5",
      name: "Level 5 Achieved",
      description: "Reached level 5 in your wellbeing journey",
      icon: "level",
      earned: true,
      earnedDate: "2023-04-15",
    },
    {
      id: "mood-tracker",
      name: "Mood Maestro",
      description: "Tracked your mood for 14 consecutive days",
      icon: "mood",
      earned: false,
    },
    {
      id: "gratitude-guru",
      name: "Gratitude Guru",
      description: "Completed 10 gratitude journal entries",
      icon: "achievement",
      earned: false,
    },
    {
      id: "wellbeing-champion",
      name: "Wellbeing Champion",
      description: "Earned 5000 total points",
      icon: "special",
      earned: false,
    },
  ],
  showAll = false,
}: BadgeCollectionProps) => {
  // Filter badges to show only earned ones if showAll is false
  const displayBadges = showAll
    ? badges
    : badges.filter((badge) => badge.earned);

  // Get the icon component based on the badge type
  const getIconComponent = (iconType: string) => {
    switch (iconType) {
      case "streak":
        return <Zap className="h-5 w-5 text-orange-500" />;
      case "entry":
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case "level":
        return <Star className="h-5 w-5 text-purple-500" />;
      case "mood":
        return <Clock className="h-5 w-5 text-green-500" />;
      case "achievement":
        return <Award className="h-5 w-5 text-indigo-500" />;
      case "special":
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      default:
        return <Award className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Your Badges</h3>
          {!showAll && displayBadges.length < badges.length && (
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-gray-100"
            >
              View All ({badges.length})
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {displayBadges.map((badge) => (
            <motion.div
              key={badge.id}
              className={`flex items-center p-3 rounded-lg ${badge.earned ? "bg-gradient-to-r from-indigo-50 to-purple-50" : "bg-gray-100"}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.03 }}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${badge.earned ? "bg-white" : "bg-gray-200"} mr-3`}
              >
                {getIconComponent(badge.icon)}
              </div>
              <div>
                <p
                  className={`font-medium text-sm ${badge.earned ? "text-gray-800" : "text-gray-500"}`}
                >
                  {badge.name}
                </p>
                <p className="text-xs text-gray-500 truncate max-w-[150px]">
                  {badge.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BadgeCollection;
