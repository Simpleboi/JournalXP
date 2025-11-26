/**
 * Insight Patterns Tab
 * Historical data and pattern analysis moved from Overview
 */

import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Award,
  Flame,
  Trophy,
  Calendar,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { getMoodColorInsight } from "@/utils/InsightUtils";
import { useState, useEffect } from "react";
import {
  getJournalEntries,
  JournalEntryResponse,
} from "@/services/JournalService";
import { useAuth } from "@/context/AuthContext";
import { useUserData } from "@/context/UserDataContext";
import { fetchTasksFromServer } from "@/services/taskService";
import { getHabits } from "@/services/HabitService";
import { Task } from "@/types/TaskType";
import { Habit } from "@/models/Habit";
import {
  parseISO,
  subDays,
  isSameDay,
  eachDayOfInterval,
  format,
} from "date-fns";

// Helper function to get mood score (1-10 scale)
const getMoodScore = (mood?: string): number => {
  const moodScores: { [key: string]: number } = {
    excited: 10,
    happy: 9,
    motivated: 8,
    confident: 8,
    grateful: 9,
    hopeful: 8,
    calm: 7,
    relaxed: 7,
    neutral: 5,
    tired: 4,
    lonely: 3,
    sad: 3,
    anxious: 2,
    overwhelmed: 2,
    angry: 2,
  };
  return moodScores[mood || "neutral"] || 5;
};

interface HeatmapDay {
  date: Date;
  count: number;
  journals: number;
  tasks: number;
  habits: number;
}

interface Achievement {
  id: string;
  text: string;
  icon: string;
  date?: string;
}

export const InsightPatterns = () => {
  return (
    <TabsContent value="patterns" className="space-y-6">
      {/* Activity Heatmap Calendar */}
      <StreakHeatmapCalendar />

      {/* Two-column layout for distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Distribution */}
        <MoodDistribution />

        {/* XP Breakdown */}
        <XPOverview />
      </div>

      {/* Quick Stats Grid */}
      <QuickStatsGrid />

      {/* Achievement Milestones */}
      <AchievementTicker />
    </TabsContent>
  );
};

// Streak Heatmap Calendar (30-day version)
const StreakHeatmapCalendar = () => {
  const { user } = useAuth();
  const [heatmapData, setHeatmapData] = useState<HeatmapDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const calculateHeatmap = async () => {
      try {
        setLoading(true);

        const [journals, tasks, habits] = await Promise.all([
          getJournalEntries(),
          fetchTasksFromServer(),
          getHabits(),
        ]);

        const today = new Date();
        const startDate = subDays(today, 29); // Last 30 days
        const days = eachDayOfInterval({ start: startDate, end: today });

        const heatmap = days.map((day) => {
          const dayJournals = journals.filter((j) =>
            isSameDay(parseISO(j.date), day)
          ).length;

          const dayTasks = tasks.filter(
            (t) =>
              t.completed &&
              t.createdAt &&
              isSameDay(parseISO(t.createdAt), day)
          ).length;

          const dayHabits = habits.filter(
            (h) => h.lastCompleted && isSameDay(parseISO(h.lastCompleted), day)
          ).length;

          const totalActivity = dayJournals + dayTasks + dayHabits;

          return {
            date: day,
            count: totalActivity,
            journals: dayJournals,
            tasks: dayTasks,
            habits: dayHabits,
          };
        });

        setHeatmapData(heatmap);
      } catch (error) {
        console.error("Error calculating heatmap:", error);
      } finally {
        setLoading(false);
      }
    };

    calculateHeatmap();
  }, [user]);

  if (loading) {
    return null;
  }

  const getIntensityColor = (count: number) => {
    if (count === 0) return "bg-gray-200";
    if (count <= 2) return "bg-green-200";
    if (count <= 5) return "bg-green-400";
    return "bg-green-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5" />
          Activity Heatmap (Last 30 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1">
          {heatmapData.map((day, i) => (
            <div
              key={i}
              className={`w-6 h-6 rounded ${getIntensityColor(day.count)} hover:ring-2 hover:ring-indigo-400 transition-all cursor-pointer`}
              title={`${format(day.date, "MMM dd")}: ${day.journals} journals, ${day.tasks} tasks, ${day.habits} habits`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs text-gray-600">
          <span>Less</span>
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <div className="w-4 h-4 bg-green-200 rounded"></div>
          <div className="w-4 h-4 bg-green-400 rounded"></div>
          <div className="w-4 h-4 bg-green-600 rounded"></div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
};

// Mood Distribution
const MoodDistribution = () => {
  const { user } = useAuth();
  const [moodData, setMoodData] = useState<
    { mood: string; count: number; percentage: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [totalEntries, setTotalEntries] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchMoodData = async () => {
      try {
        setLoading(true);
        const entries = await getJournalEntries();

        const moodCounts: Record<string, number> = {};
        entries.forEach((entry: JournalEntryResponse) => {
          const mood = entry.mood || "neutral";
          moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        });

        const total = entries.length;
        setTotalEntries(total);

        const moodArray = Object.entries(moodCounts)
          .map(([mood, count]) => ({
            mood,
            count,
            percentage: total > 0 ? Math.round((count / total) * 100) : 0,
          }))
          .sort((a, b) => b.count - a.count);

        setMoodData(moodArray);
      } catch (error) {
        console.error("Error fetching mood data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, [user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          Mood Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-64 overflow-y-auto">
        {loading ? (
          <div className="text-center text-gray-500 py-4">
            Loading mood data...
          </div>
        ) : totalEntries === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No journal entries yet. Start journaling to see your mood
            distribution!
          </div>
        ) : (
          moodData.map(({ mood, count, percentage }) => (
            <div key={mood} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`w-4 h-4 rounded-full ${getMoodColorInsight(mood)}`}
                />
                <span className="capitalize">{mood.replace("_", " ")}</span>
              </div>

              <div className="flex items-center gap-2">
                <Progress
                  value={percentage}
                  max={100}
                  className={`w-24 h-2 ${getMoodColorInsight(mood)} rounded-full overflow-hidden`}
                ></Progress>
                <span className="text-sm font-medium w-16 text-right">
                  {percentage}% ({count})
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

// XP Overview
const XPOverview = () => {
  const { user } = useAuth();
  const [xpData, setXpData] = useState<
    { source: string; xp: number; percentage: number; color: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [totalXP, setTotalXP] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchXPData = async () => {
      try {
        setLoading(true);

        const [journals, tasks, habits] = await Promise.all([
          getJournalEntries(),
          fetchTasksFromServer(),
          getHabits(),
        ]);

        const journalXP = journals.length * 30;
        const taskXP = tasks.filter((task: Task) => task.completed).length * 20;
        const habitXP = habits.reduce((total: number, habit: Habit) => {
          return total + habit.currentCompletions * habit.xpReward;
        }, 0);

        const total = journalXP + taskXP + habitXP;
        setTotalXP(total);

        const sources = [
          {
            source: "Journaling",
            xp: journalXP,
            percentage: total > 0 ? Math.round((journalXP / total) * 100) : 0,
            color: "from-purple-400 to-purple-600",
          },
          {
            source: "Tasks",
            xp: taskXP,
            percentage: total > 0 ? Math.round((taskXP / total) * 100) : 0,
            color: "from-blue-400 to-blue-600",
          },
          {
            source: "Habits",
            xp: habitXP,
            percentage: total > 0 ? Math.round((habitXP / total) * 100) : 0,
            color: "from-green-400 to-green-600",
          },
        ].filter((item) => item.xp > 0);

        setXpData(sources);
      } catch (error) {
        console.error("Error fetching XP data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchXPData();
  }, [user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          XP Sources
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-gray-500 py-4">
            Loading XP data...
          </div>
        ) : totalXP === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No XP earned yet. Start journaling, completing tasks, or building
            habits to earn XP!
          </div>
        ) : (
          <div className="space-y-4">
            {xpData.map(({ source, xp, percentage, color }) => (
              <div key={source} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full bg-gradient-to-r ${color}`}
                  ></div>
                  <span className="capitalize">{source}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${color}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-16 text-right">
                    {xp} XP
                  </span>
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
              <span className="font-semibold text-gray-700">Total XP</span>
              <span className="font-bold text-indigo-600">{totalXP} XP</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Quick Stats Grid Component
const QuickStatsGrid = () => {
  const { user } = useAuth();
  const { userData } = useUserData();
  const [habitCompletionRate, setHabitCompletionRate] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchHabitStats = async () => {
      try {
        setLoading(true);
        const habits = await getHabits();

        if (habits.length === 0) {
          setHabitCompletionRate(0);
          return;
        }

        const totalCompletionPercentage = habits.reduce(
          (sum: number, habit: Habit) => {
            const completionPercentage =
              habit.targetCompletions > 0
                ? (habit.currentCompletions / habit.targetCompletions) * 100
                : 0;
            return sum + Math.min(completionPercentage, 100);
          },
          0
        );

        const averageCompletionRate = totalCompletionPercentage / habits.length;
        setHabitCompletionRate(averageCompletionRate);
      } catch (error) {
        console.error("Error fetching habit stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHabitStats();
  }, [user]);

  if (!userData) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-md text-blue-600">Current Streak</p>
              <p className="text-2xl font-bold text-blue-900">
                {userData.streak}
              </p>
              <p className="text-sm text-blue-500">days journaling</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-md text-green-600">Habit Success</p>
              {loading ? (
                <p className="text-2xl font-bold text-green-900">...</p>
              ) : (
                <p className="text-2xl font-bold text-green-900">
                  {habitCompletionRate.toFixed(0)}%
                </p>
              )}
              <p className="text-sm text-green-500">completion rate</p>
            </div>
            <Trophy className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Achievement Ticker
const AchievementTicker = () => {
  const { userData } = useUserData();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!userData) return;

    const recentAchievements: Achievement[] = [];

    // Check for milestone achievements
    if (userData.streak >= 7) {
      recentAchievements.push({
        id: "streak_7",
        text: `${userData.streak}-day streak!`,
        icon: "🔥",
      });
    }

    if (userData.journalStats?.totalJournalEntries >= 100) {
      recentAchievements.push({
        id: "journal_100",
        text: "100 journal entries milestone!",
        icon: "📝",
      });
    }

    if (userData.level >= 10) {
      recentAchievements.push({
        id: "level_10",
        text: `Reached Level ${userData.level}!`,
        icon: "⭐",
      });
    }

    if (userData.taskStats?.totalTasksCompleted >= 30) {
      recentAchievements.push({
        id: "tasks_30",
        text: `Completed ${userData.taskStats.totalTasksCompleted} tasks!`,
        icon: "✅",
      });
    }

    setAchievements(recentAchievements);
  }, [userData]);

  useEffect(() => {
    if (achievements.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % achievements.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [achievements.length]);

  if (achievements.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-center gap-3">
          <Trophy className="h-6 w-6 text-yellow-600" />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">Recent Milestones</p>
            <p className="text-lg font-bold text-yellow-900">
              {achievements[currentIndex].icon} {achievements[currentIndex].text}
            </p>
          </div>
          {achievements.length > 1 && (
            <div className="flex gap-1">
              {achievements.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === currentIndex ? "bg-yellow-600" : "bg-yellow-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
