import { BarChart3, BookOpen, CheckCircle, AlertCircle, Zap } from "lucide-react";
import { FC, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getJournalEntries, JournalEntryResponse } from "@/services/JournalService";
import { fetchTasksFromServer } from "@/services/taskService";
import { getHabits } from "@/services/HabitService";
import { Task } from "@/types/TaskType";
import { Habit } from "@/models/Habit";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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

  const statCards = [
    {
      icon: Zap,
      value: stats.totalXP,
      label: "Total Points",
      sublabel: getTimeRangeLabel(timeRange),
      gradient: "from-indigo-500 to-violet-600",
      bgGradient: "from-indigo-50/80 to-violet-50/80",
      borderColor: "border-indigo-200/60",
      textColor: "text-indigo-900",
      labelColor: "text-indigo-600",
    },
    {
      icon: BookOpen,
      value: stats.journalEntries,
      label: "Journal Entries",
      sublabel: getTimeRangeLabel(timeRange),
      gradient: "from-purple-500 to-fuchsia-600",
      bgGradient: "from-purple-50/80 to-fuchsia-50/80",
      borderColor: "border-purple-200/60",
      textColor: "text-purple-900",
      labelColor: "text-purple-600",
    },
    {
      icon: CheckCircle,
      value: stats.tasksCompleted,
      label: "Tasks Completed",
      sublabel: getTimeRangeLabel(timeRange),
      gradient: "from-pink-500 to-rose-600",
      bgGradient: "from-pink-50/80 to-rose-50/80",
      borderColor: "border-pink-200/60",
      textColor: "text-pink-900",
      labelColor: "text-pink-600",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="bg-white/60 backdrop-blur-md border-2 border-white/50 rounded-xl sm:rounded-2xl p-4 sm:p-6"
          >
            <div className="animate-pulse space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-200 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-20" />
                  <div className="h-6 bg-gray-200 rounded w-16" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <div className="bg-red-50/80 backdrop-blur-md border-2 border-red-200/60 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-center gap-3 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-medium">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              size="sm"
              variant="outline"
              className="ml-2 border-red-300 hover:bg-red-100 rounded-lg"
            >
              Retry
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + index * 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className={`bg-gradient-to-br ${stat.bgGradient} backdrop-blur-md border-2 ${stat.borderColor} rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all`}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-md`}
            >
              <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <p className={`text-xs sm:text-sm font-medium ${stat.labelColor}`}>
                {stat.label}
              </p>
              <p className={`text-2xl sm:text-3xl font-bold ${stat.textColor}`}>
                {stat.value}
              </p>
              <p className={`text-xs ${stat.labelColor} opacity-80`}>
                {stat.sublabel}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
