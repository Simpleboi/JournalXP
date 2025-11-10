import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Award, Target, CheckCircle } from "lucide-react";
import { InsightKeyMetrics } from "./InsightTotalStats";
import { Progress } from "@/components/ui/progress";
import { getMoodColorInsight } from "@/utils/InsightUtils";
import { useState, useEffect } from "react";
import { getJournalEntries, JournalEntryResponse } from "@/services/JournalService";
import { useAuth } from "@/context/AuthContext";
import { useUserData } from "@/context/UserDataContext";
import { fetchTasksFromServer } from "@/services/taskService";
import { getHabits } from "@/services/HabitService";
import { Task } from "@/types/TaskType";
import { Habit } from "@/models/Habit";

// Overview Section
export const InsightOverview = () => {
  return (
    <TabsContent value="overview" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Distribution */}
        <MoodDistribution />

        {/* XP Breakdown */}
        <XPOverview />
      </div>

      {/* Quick Stats Grid */}
      <QuickStatsGrid />

      {/* Key Metrics for User Data */}
      <InsightKeyMetrics />
    </TabsContent>
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

        // Calculate overall completion rate
        // For each habit, calculate completion rate based on currentCompletions vs targetCompletions
        const totalCompletionPercentage = habits.reduce((sum: number, habit: Habit) => {
          const completionPercentage = habit.targetCompletions > 0
            ? (habit.currentCompletions / habit.targetCompletions) * 100
            : 0;
          return sum + Math.min(completionPercentage, 100); // Cap at 100%
        }, 0);

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
            <Target className="h-8 w-8 text-blue-500" />
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
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      {/* Pet Health card removed - feature not implemented yet */}
    </div>
  );
};

const MoodDistribution = () => {
  const { user } = useAuth();
  const [moodData, setMoodData] = useState<{ mood: string; count: number; percentage: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEntries, setTotalEntries] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchMoodData = async () => {
      try {
        setLoading(true);
        const entries = await getJournalEntries();

        // Count mood occurrences
        const moodCounts: Record<string, number> = {};
        entries.forEach((entry: JournalEntryResponse) => {
          const mood = entry.mood || "neutral";
          moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        });

        // Calculate percentages and create array
        const total = entries.length;
        setTotalEntries(total);

        const moodArray = Object.entries(moodCounts)
          .map(([mood, count]) => ({
            mood,
            count,
            percentage: total > 0 ? Math.round((count / total) * 100) : 0,
          }))
          .sort((a, b) => b.count - a.count); // Sort by count descending

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
          <div className="text-center text-gray-500 py-4">Loading mood data...</div>
        ) : totalEntries === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No journal entries yet. Start journaling to see your mood distribution!
          </div>
        ) : (
          moodData.map(({ mood, count, percentage }) => (
            <div key={mood} className="flex items-center justify-between">
              {/* Label + color dot */}
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full ${getMoodColorInsight(mood)}`} />
                <span className="capitalize">{mood.replace("_", " ")}</span>
              </div>

              {/* Bar + percentage + count */}
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

// XP Sources Section
const XPOverview = () => {
  const { user } = useAuth();
  const [xpData, setXpData] = useState<{ source: string; xp: number; percentage: number; color: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalXP, setTotalXP] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchXPData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [journals, tasks, habits] = await Promise.all([
          getJournalEntries(),
          fetchTasksFromServer(),
          getHabits(),
        ]);

        // Calculate XP from each source
        const journalXP = journals.length * 30; // 30 XP per journal entry
        const taskXP = tasks.filter((task: Task) => task.completed).length * 20; // 20 XP per completed task

        // Sum up XP from completed habits (each habit has its own xpReward)
        const habitXP = habits.reduce((total: number, habit: Habit) => {
          // Count XP based on current completions
          return total + (habit.currentCompletions * habit.xpReward);
        }, 0);

        // Calculate total and percentages
        const total = journalXP + taskXP + habitXP;
        setTotalXP(total);

        // Create array of XP sources (excluding PetCare as requested)
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
        ].filter(item => item.xp > 0); // Only show sources that have contributed XP

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
          <div className="text-center text-gray-500 py-4">Loading XP data...</div>
        ) : totalXP === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No XP earned yet. Start journaling, completing tasks, or building habits to earn XP!
          </div>
        ) : (
          <div className="space-y-4">
            {xpData.map(({ source, xp, percentage, color }) => (
              <div key={source} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${color}`}></div>
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
