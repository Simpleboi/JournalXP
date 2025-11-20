import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Plus,
  TrendingUp,
  Calendar,
  Dumbbell,
  Flame,
  BarChart3,
  ChevronLeft,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkoutSession } from "@/models/Workout";
import {
  getRecentWorkoutSessions,
  getWorkoutStats,
  deleteWorkoutSession,
} from "@/lib/workoutService";

export default function WorkoutsDashboardPage() {
  // Mock user ID (replace with actual auth)
  const userId = "demo-user";

  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [stats, setStats] = useState({
    workoutsThisWeek: 0,
    workoutsThisMonth: 0,
    totalVolumeThisWeek: 0,
    totalVolumeThisMonth: 0,
    currentStreak: 0,
    averageDifficulty: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const recentSessions = getRecentWorkoutSessions(userId, 20);
    setSessions(recentSessions);

    const workoutStats = getWorkoutStats(userId);
    setStats(workoutStats);
  };

  const handleDelete = async (sessionId: string) => {
    if (confirm("Are you sure you want to delete this workout?")) {
      await deleteWorkoutSession(userId, sessionId);
      loadData();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 3) return "bg-green-100 text-green-700 border-green-300";
    if (difficulty <= 6)
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    return "bg-red-100 text-red-700 border-red-300";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/">
                  <ChevronLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Training & Workouts
                </h1>
                <p className="text-sm text-gray-600">
                  Track your fitness journey
                </p>
              </div>
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Link to="/workouts/new">
                <Plus className="h-4 w-4 mr-2" />
                New Workout
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">This Week</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {stats.workoutsThisWeek}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Workouts</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Volume</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {(stats.totalVolumeThisWeek / 1000).toFixed(1)}k
                    </p>
                    <p className="text-xs text-gray-500 mt-1">lbs this week</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Dumbbell className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Streak</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {stats.currentStreak}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Days</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <Flame className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Avg Difficulty</p>
                    <p className="text-3xl font-bold text-green-600">
                      {stats.averageDifficulty.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">out of 10</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/workouts/analytics">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Training Analytics
                    </h3>
                    <p className="text-sm text-gray-600">
                      View progression charts and PRs
                    </p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/workouts/new">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Plus className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Start New Workout
                    </h3>
                    <p className="text-sm text-gray-600">
                      Log today's training session
                    </p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Recent Workouts */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Recent Workouts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {sessions.length === 0 ? (
              <div className="text-center py-12">
                <Dumbbell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No workouts logged yet</p>
                <Button asChild>
                  <Link to="/workouts/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Log Your First Workout
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-800">
                                {formatDate(session.date)}
                              </h3>
                              <Badge
                                className={getDifficultyColor(
                                  session.perceivedDifficulty
                                )}
                              >
                                Difficulty: {session.perceivedDifficulty}/10
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>
                                {session.exercises.length} exercise
                                {session.exercises.length !== 1 ? "s" : ""}
                              </span>
                              <span>•</span>
                              <span>
                                {session.exercises.reduce(
                                  (sum, ex) => sum + ex.sets.length,
                                  0
                                )}{" "}
                                sets
                              </span>
                              <span>•</span>
                              <span>
                                {(session.totalVolume || 0).toLocaleString()}{" "}
                                lbs
                              </span>
                            </div>
                            {session.notes && (
                              <p className="text-sm text-gray-500 mt-2 italic">
                                "{session.notes}"
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Link to={`/workouts/edit/${session.id}`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(session.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
