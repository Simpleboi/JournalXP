import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, ArrowLeft, Lock, CheckCircle, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  getAchievements,
  Achievement,
  AchievementStats,
} from "@/services/achievementService";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/context/AuthContext";


const AchievementsPage = () => {
  const [filter, setFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<AchievementStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user && !loading) {
      navigate("/login");
    }
  }, [user, navigate, loading]);

  // Fetch achievements on mount
  useEffect(() => {
    if (user) {
      fetchAchievements();
    }
  }, [user]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const data = await getAchievements();
      setAchievements(data.achievements);
      setStats(data.stats);
    } catch (error: any) {
      console.error("Error fetching achievements:", error);
      showToast({
        title: "Error",
        description: "Failed to load achievements. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Apply both status filter (all/unlocked/locked) and category filter
  const filteredAchievements = achievements
    .filter((a) => {
      // Status filter
      if (filter === "unlocked") return a.unlocked;
      if (filter === "locked") return !a.unlocked;
      return true; // "all"
    })
    .filter((a) => {
      // Category filter
      if (categoryFilter === "all") return true;
      return a.category === categoryFilter;
    });

  // Show loading while checking auth or fetching data
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{!user ? "Checking authentication..." : "Loading achievements..."}</p>
        </div>
      </div>
    );
  }

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
                  {stats?.totalAchievements || 0}
                </p>
              </div>
              <div>
                <h3 className="text-lg text-gray-500">Unlocked</h3>
                <p className="text-3xl font-bold text-green-600">
                  {stats?.unlockedCount || 0}
                </p>
              </div>
              <div>
                <h3 className="text-lg text-gray-500">Points Earned</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {stats?.totalPoints || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="space-y-4 mb-6">
            {/* Status Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
              <div className="flex flex-wrap gap-2">
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
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={categoryFilter === "all" ? "default" : "outline"}
                  onClick={() => setCategoryFilter("all")}
                  size="sm"
                  className={
                    categoryFilter === "all" ? "bg-indigo-600 hover:bg-indigo-700" : ""
                  }
                >
                  All
                </Button>
                <Button
                  variant={categoryFilter === "journaling" ? "default" : "outline"}
                  onClick={() => setCategoryFilter("journaling")}
                  size="sm"
                  className={
                    categoryFilter === "journaling" ? "bg-purple-600 hover:bg-purple-700" : ""
                  }
                >
                  Journaling
                </Button>
                <Button
                  variant={categoryFilter === "tasks" ? "default" : "outline"}
                  onClick={() => setCategoryFilter("tasks")}
                  size="sm"
                  className={
                    categoryFilter === "tasks" ? "bg-blue-600 hover:bg-blue-700" : ""
                  }
                >
                  Tasks
                </Button>
                <Button
                  variant={categoryFilter === "habits" ? "default" : "outline"}
                  onClick={() => setCategoryFilter("habits")}
                  size="sm"
                  className={
                    categoryFilter === "habits" ? "bg-green-600 hover:bg-green-700" : ""
                  }
                >
                  Habits
                </Button>
                <Button
                  variant={categoryFilter === "streak" ? "default" : "outline"}
                  onClick={() => setCategoryFilter("streak")}
                  size="sm"
                  className={
                    categoryFilter === "streak" ? "bg-orange-600 hover:bg-orange-700" : ""
                  }
                >
                  Streak
                </Button>
                <Button
                  variant={categoryFilter === "xp" ? "default" : "outline"}
                  onClick={() => setCategoryFilter("xp")}
                  size="sm"
                  className={
                    categoryFilter === "xp" ? "bg-yellow-600 hover:bg-yellow-700" : ""
                  }
                >
                  XP
                </Button>
                <Button
                  variant={categoryFilter === "general" ? "default" : "outline"}
                  onClick={() => setCategoryFilter("general")}
                  size="sm"
                  className={
                    categoryFilter === "general" ? "bg-pink-600 hover:bg-pink-700" : ""
                  }
                >
                  General
                </Button>
              </div>
            </div>
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
      case "journaling":
        return "bg-purple-100 text-purple-800";
      case "tasks":
        return "bg-blue-100 text-blue-800";
      case "habits":
        return "bg-green-100 text-green-800";
      case "streak":
        return "bg-orange-100 text-orange-800";
      case "xp":
        return "bg-yellow-100 text-yellow-800";
      case "general":
        return "bg-pink-100 text-pink-800";
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
        className={`overflow-hidden ${achievement.unlocked ? "border-l-4 border-l-green-500" : "border-l-4 border-l-gray-300"}`}
      >
        <CardContent className="p-0">
          <div className="p-6">
            <div className="flex items-start">
              <div
                className={`flex-shrink-0 mr-4 p-3 rounded-full ${achievement.unlocked ? "bg-green-50" : "bg-gray-100"}`}
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
                    Unlocked{achievement.dateUnlocked ? ` on ${new Date(achievement.dateUnlocked).toLocaleDateString()}` : ""}
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