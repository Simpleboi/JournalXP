import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, ArrowLeft, Lock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Achievement } from "@/models/Achievement";
import { achievements } from "@/data/achievementData";
import { AchievementHeader } from "@/features/achievements/AchievementsHeader";

const AchievementsPage = () => {
  const [filter, setFilter] = useState<string>("all");

  const filteredAchievements =
    filter === "all"
      ? achievements
      : filter === "unlocked"
      ? achievements.filter((a) => a.unlocked)
      : achievements.filter((a) => !a.unlocked);

  const categoryFiltered = (category: string) => {
    return filter === "category"
      ? achievements.filter((a) => a.category === category)
      : filteredAchievements;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <AchievementHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Achievement Stats */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <h3 className="text-lg text-gray-500">Total Achievements</h3>
                <p className="text-3xl font-bold text-indigo-600">
                  {achievements.length}
                </p>
              </div>
              <div>
                <h3 className="text-lg text-gray-500">Unlocked</h3>
                <p className="text-3xl font-bold text-green-600">
                  {achievements.filter((a) => a.unlocked).length}
                </p>
              </div>
              <div>
                <h3 className="text-lg text-gray-500">Points Earned</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {achievements
                    .filter((a) => a.unlocked)
                    .reduce((sum, a) => sum + a.points, 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className={
                filter === "all" ? "bg-indigo-600 hover:bg-indigo-700" : ""
              }
            >
              All
            </Button>
            <Button
              variant={filter === "unlocked" ? "default" : "outline"}
              onClick={() => setFilter("unlocked")}
              className={
                filter === "unlocked" ? "bg-green-600 hover:bg-green-700" : ""
              }
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Unlocked
            </Button>
            <Button
              variant={filter === "locked" ? "default" : "outline"}
              onClick={() => setFilter("locked")}
              className={
                filter === "locked" ? "bg-gray-600 hover:bg-gray-700" : ""
              }
            >
              <Lock className="h-4 w-4 mr-2" />
              Locked
            </Button>
          </div>

          {/* Achievement Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>

          {filteredAchievements.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                <Trophy className="h-8 w-8 text-indigo-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                No achievements found
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Try a different filter to see more achievements.
              </p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
  // Dynamically determine the color based on category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "mindfulness":
        return "bg-blue-100 text-blue-800";
      case "journaling":
        return "bg-purple-100 text-purple-800";
      case "streak":
        return "bg-orange-100 text-orange-800";
      case "community":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
                  <Badge className={getCategoryColor(achievement.category)}>
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

export default AchievementsPage;
