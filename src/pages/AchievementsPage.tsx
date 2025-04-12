import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, ArrowLeft, Lock, CheckCircle, Filter } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Achievement } from "@/components/Achievement";

const AchievementsPage = () => {
  const [filter, setFilter] = useState<string>("all");

  // Sample achievement data
  const achievements: Achievement[] = [
    {
      id: 1,
      title: "First Journal Entry",
      description: "Completed your first journal entry",
      points: 50,
      unlocked: true,
      category: "journaling",
      icon: "BookOpen",
      dateUnlocked: "2 weeks ago",
      requirement: "Write your first journal entry",
    },
    {
      id: 2,
      title: "Mindfulness Beginner",
      description: "Completed 5 meditation sessions",
      points: 100,
      unlocked: true,
      category: "mindfulness",
      icon: "Sparkles",
      dateUnlocked: "1 week ago",
      requirement: "Complete 5 meditation sessions",
    },
    {
      id: 3,
      title: "7-Day Streak",
      description: "Logged in for 7 consecutive days",
      points: 150,
      unlocked: true,
      category: "streak",
      icon: "Flame",
      dateUnlocked: "3 days ago",
      requirement: "Log in for 7 consecutive days",
    },
    {
      id: 4,
      title: "Gratitude Master",
      description: "Completed 10 gratitude journal entries",
      points: 200,
      unlocked: false,
      category: "journaling",
      icon: "Heart",
      requirement: "Complete 10 gratitude journal entries",
    },
    {
      id: 5,
      title: "Reflection Guru",
      description: "Wrote 20 journal entries",
      points: 300,
      unlocked: false,
      category: "journaling",
      icon: "PenTool",
      requirement: "Write 20 journal entries",
    },
    {
      id: 6,
      title: "Meditation Expert",
      description: "Completed 30 meditation sessions",
      points: 400,
      unlocked: false,
      category: "mindfulness",
      icon: "Zap",
      requirement: "Complete 30 meditation sessions",
    },
    {
      id: 7,
      title: "30-Day Warrior",
      description: "Maintained a 30-day login streak",
      points: 500,
      unlocked: false,
      category: "streak",
      icon: "Award",
      requirement: "Log in for 30 consecutive days",
    },
    {
      id: 8,
      title: "Community Supporter",
      description: "Shared 5 inspirational quotes",
      points: 250,
      unlocked: false,
      category: "community",
      icon: "Share2",
      requirement: "Share 5 inspirational quotes with the community",
    },
  ];

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
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="mr-2 hover:bg-indigo-50"
          >
            <Link to="/">
              <ArrowLeft className="h-5 w-5 text-indigo-600" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-indigo-600" />
            Achievements
          </h1>
        </div>
      </header>

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
