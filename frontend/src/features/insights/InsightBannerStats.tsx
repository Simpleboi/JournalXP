import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, LineChart, PieChart, AlertCircle } from "lucide-react";
import { FC, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getJournalEntries, JournalEntryResponse } from "@/services/JournalService";
import { fetchTasksFromServer } from "@/services/taskService";
import { getHabits } from "@/services/HabitService";
import { Task } from "@/types/TaskType";
import { Habit } from "@/models/Habit";
import { Button } from "@/components/ui/button";

interface InsightBannerStatsProps {
  timeRange: string;
}

export const InsightBannerStats: FC<InsightBannerStatsProps> = ({
  timeRange,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalXP: 0,
    journalEntries: 0,
    tasksCompleted: 0,
  });

  // Helper function to get the cutoff date based on time range
  const getCutoffDate = (range: string): Date => {
    const now = new Date();
    const cutoff = new Date();

    switch (range) {
      case "week":
        cutoff.setDate(now.getDate() - 7);
        break;
      case "month":
        cutoff.setMonth(now.getMonth() - 1);
        break;
      case "quarter":
        cutoff.setMonth(now.getMonth() - 3);
        break;
      case "year":
        cutoff.setFullYear(now.getFullYear() - 1);
        break;
      default:
        cutoff.setDate(now.getDate() - 7);
    }

    return cutoff;
  };

  // Helper function to check if a date is within the range
  const isWithinRange = (dateString: string, cutoff: Date): boolean => {
    const date = new Date(dateString);
    return date >= cutoff;
  };

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const cutoffDate = getCutoffDate(timeRange);

        // Fetch all data in parallel
        const [journals, tasks, habits] = await Promise.all([
          getJournalEntries(),
          fetchTasksFromServer(),
          getHabits(),
        ]);

        // Filter journal entries within the time range
        const filteredJournals = journals.filter((entry: JournalEntryResponse) =>
          isWithinRange(entry.createdAt, cutoffDate)
        );

        // Filter completed tasks within the time range
        // NOTE: Task model doesn't have completedAt field, using createdAt as approximation
        // This means we're measuring when tasks were created, not when they were completed
        const filteredTasks = tasks.filter(
          (task: Task) => task.completed && task.createdAt && isWithinRange(task.createdAt, cutoffDate)
        );

        // Filter habits - check if lastCompleted is within range
        const filteredHabits = habits.filter((habit: Habit) =>
          habit.lastCompleted && isWithinRange(habit.lastCompleted, cutoffDate)
        );

        // Calculate XP from filtered activities
        const journalXP = filteredJournals.length * 30;
        const taskXP = filteredTasks.length * 20;
        const habitXP = filteredHabits.reduce((total: number, habit: Habit) => {
          // For habits, we'll count the xpReward once per filtered habit
          // Since we can't track individual completion dates, we approximate
          return total + habit.xpReward;
        }, 0);

        const totalXP = journalXP + taskXP + habitXP;

        setStats({
          totalXP,
          journalEntries: filteredJournals.length,
          tasksCompleted: filteredTasks.length,
        });
      } catch (err) {
        console.error("Error fetching banner stats:", err);
        setError(err instanceof Error ? err.message : "Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, timeRange]);

  const getTimeRangeLabel = (range: string): string => {
    switch (range) {
      case "week":
        return "Past Week";
      case "month":
        return "Past Month";
      case "quarter":
        return "Past 3 Months";
      case "year":
        return "Past Year";
      default:
        return "This " + range;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-gradient-to-br from-gray-50 to-gray-100">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <div className="animate-pulse space-y-2 w-full">
                <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto" />
                <div className="h-4 bg-gray-200 rounded w-24 mx-auto" />
                <div className="h-8 bg-gray-200 rounded w-16 mx-auto" />
                <div className="h-3 bg-gray-200 rounded w-20 mx-auto" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-3 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-medium">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                size="sm"
                variant="outline"
                className="ml-2 border-red-300 hover:bg-red-100"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
            <BarChart3 className="h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-sm text-indigo-700 font-medium">Total Points</p>
          <p className="text-2xl font-bold text-indigo-900">{stats.totalXP}</p>
          <p className="text-xs text-indigo-600">{getTimeRangeLabel(timeRange)}</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
            <LineChart className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-sm text-purple-700 font-medium">Journal Entries</p>
          <p className="text-2xl font-bold text-purple-900">
            {stats.journalEntries}
          </p>
          <p className="text-xs text-purple-600">{getTimeRangeLabel(timeRange)}</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-2">
            <PieChart className="h-6 w-6 text-pink-600" />
          </div>
          <p className="text-sm text-pink-700 font-medium">Tasks Completed</p>
          <p className="text-2xl font-bold text-pink-900">
            {stats.tasksCompleted}
          </p>
          <p className="text-xs text-pink-600">{getTimeRangeLabel(timeRange)}</p>
        </CardContent>
      </Card>

      {/* Meditation Minutes card removed - feature not implemented yet */}
    </div>
  );
};
