import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useUserData } from "@/context/UserDataContext";
import {
  getJournalEntries,
  JournalEntryResponse,
} from "@/services/JournalService";
import { fetchTasksFromServer } from "@/services/taskService";
import { getHabits } from "@/services/HabitService";
import { Task } from "@/types/TaskType";
import { Habit } from "@/models/Habit";
import {
  format,
  subDays,
  startOfDay,
  isSameDay,
  parseISO,
} from "date-fns";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Flame,
  Heart,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MoodEntry {
  date: Date;
  mood: string;
  hasJournal: boolean;
  hasTask: boolean;
}

interface MoodDistribution {
  mood: string;
  count: number;
  percentage: number;
}

interface MoodTrendData {
  date: string;
  moodScore: number;
  entriesCount: number;
}

interface MoodCorrelation {
  withJournaling: number;
  withTasks: number;
  averageMood: string;
}

// Mood to score mapping (positive moods = higher scores)
const MOOD_SCORES: { [key: string]: number } = {
  // Positive moods (7-10)
  happy: 9,
  excited: 10,
  motivated: 9,
  grateful: 9,
  confident: 8,
  hopeful: 8,
  relaxed: 7,

  // Neutral moods (5-6)
  calm: 6,
  neutral: 5,

  // Negative moods (1-4)
  tired: 4,
  anxious: 3,
  overwhelmed: 3,
  sad: 2,
  lonely: 2,
  angry: 2,
};

// Colors for mood pie chart
const MOOD_COLORS: { [key: string]: string } = {
  happy: "#FCD34D",
  excited: "#F59E0B",
  motivated: "#10B981",
  grateful: "#8B5CF6",
  confident: "#3B82F6",
  hopeful: "#EC4899",
  relaxed: "#14B8A6",
  calm: "#06B6D4",
  neutral: "#9CA3AF",
  tired: "#6B7280",
  anxious: "#F97316",
  overwhelmed: "#EF4444",
  sad: "#6366F1",
  lonely: "#7C3AED",
  angry: "#DC2626",
};

export const InsightMoodTrends: React.FC = () => {
  const { user } = useAuth();
  const { userData } = useUserData();
  const [timeRange, setTimeRange] = useState("week");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Raw data states (fetched once)
  const [journals, setJournals] = useState<JournalEntryResponse[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);

  // Mood data states
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [moodDistribution, setMoodDistribution] = useState<MoodDistribution[]>(
    []
  );
  const [moodTrendData, setMoodTrendData] = useState<MoodTrendData[]>([]);
  const [weeklyMoodSummary, setWeeklyMoodSummary] = useState({
    totalDays: 0,
    moodedDays: 0,
    topMood: "",
    topMoodCount: 0,
  });
  const [moodCorrelation, setMoodCorrelation] = useState<MoodCorrelation>({
    withJournaling: 0,
    withTasks: 0,
    averageMood: "",
  });

  // Helper function to get date range
  const getDateRange = (range: string): Date[] => {
    const now = new Date();
    const dates: Date[] = [];
    let daysToInclude = 7;

    if (range === "month") {
      daysToInclude = 30;
    } else if (range === "quarter") {
      daysToInclude = 90;
    }

    for (let i = daysToInclude - 1; i >= 0; i--) {
      dates.push(subDays(startOfDay(now), i));
    }

    return dates;
  };

  // Format date for display
  const formatDateForDisplay = (date: Date, range: string): string => {
    if (range === "week") {
      return format(date, "EEE"); // Mon, Tue, Wed
    } else if (range === "month") {
      return format(date, "MMM d"); // Jan 1
    } else {
      return format(date, "MMM d");
    }
  };

  // Fetch data once on mount
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [journalsData, tasksData, habitsData] = await Promise.all([
          getJournalEntries(),
          fetchTasksFromServer(),
          getHabits(),
        ]);

        setJournals(journalsData);
        setTasks(tasksData);
        setHabits(habitsData);
      } catch (err) {
        console.error("Error fetching mood data:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load mood insights. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Memoized date range calculation
  const dateRange = useMemo(() => getDateRange(timeRange), [timeRange]);

  // Memoized mood entries processing
  const processedMoodData = useMemo(() => {
    const moodEntriesData: MoodEntry[] = [];
    const moodCounts: { [key: string]: number } = {};

    journals.forEach((entry: JournalEntryResponse) => {
      if (entry.mood) {
        const entryDate = startOfDay(parseISO(entry.createdAt));

        // Only include entries in the date range
        if (dateRange.some((date) => isSameDay(date, entryDate))) {
          moodEntriesData.push({
            date: entryDate,
            mood: entry.mood,
            hasJournal: true,
            hasTask: false,
          });

          moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
        }
      }
    });

    moodEntriesData.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Calculate mood distribution
    const totalMoods = moodEntriesData.length;
    const distribution: MoodDistribution[] = Object.entries(moodCounts)
      .map(([mood, count]) => ({
        mood,
        count,
        percentage: Math.round((count / totalMoods) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    // Calculate mood trend data
    const trendData = dateRange.map((date) => {
      const dayMoods = moodEntriesData.filter((entry) =>
        isSameDay(entry.date, date)
      );
      const avgScore =
        dayMoods.length > 0
          ? dayMoods.reduce(
              (sum, entry) => sum + (MOOD_SCORES[entry.mood] || 5),
              0
            ) / dayMoods.length
          : 0;

      return {
        date: formatDateForDisplay(date, timeRange),
        moodScore: Math.round(avgScore * 10) / 10,
        entriesCount: dayMoods.length,
      };
    });

    return {
      moodEntriesData,
      distribution,
      trendData,
    };
  }, [journals, dateRange, timeRange]);

  // Memoized weekly summary
  const weeklyData = useMemo(() => {
    const weekMoodCounts: { [key: string]: number } = {};
    const weekDates = getDateRange("week");

    weekDates.forEach((date) => {
      const dayMoods = processedMoodData.moodEntriesData.filter((entry) =>
        isSameDay(entry.date, date)
      );
      dayMoods.forEach((entry) => {
        weekMoodCounts[entry.mood] = (weekMoodCounts[entry.mood] || 0) + 1;
      });
    });

    const weekMoodedDays = new Set(
      processedMoodData.moodEntriesData
        .filter((entry) =>
          weekDates.some((date) => isSameDay(entry.date, date))
        )
        .map((entry) => entry.date.getTime())
    ).size;

    const topWeekMood = Object.entries(weekMoodCounts).sort(
      (a, b) => b[1] - a[1]
    )[0];

    return {
      totalDays: 7,
      moodedDays: weekMoodedDays,
      topMood: topWeekMood?.[0] || "",
      topMoodCount: topWeekMood?.[1] || 0,
    };
  }, [processedMoodData.moodEntriesData]);

  // Memoized correlation data
  const correlationData = useMemo(() => {
    const daysWithJournal = new Set<number>();
    const daysWithTasks = new Set<number>();

    journals.forEach((entry: JournalEntryResponse) => {
      const entryDate = startOfDay(parseISO(entry.createdAt));
      if (dateRange.some((date) => isSameDay(date, entryDate))) {
        daysWithJournal.add(entryDate.getTime());
      }
    });

    tasks.forEach((task: Task) => {
      if (task.completed && task.createdAt) {
        const taskDate = startOfDay(parseISO(task.createdAt));
        if (dateRange.some((date) => isSameDay(date, taskDate))) {
          daysWithTasks.add(taskDate.getTime());
        }
      }
    });

    const moodsWithJournal: number[] = [];
    const moodsWithoutJournal: number[] = [];
    const moodsWithTasks: number[] = [];
    const moodsWithoutTasks: number[] = [];

    processedMoodData.moodEntriesData.forEach((entry) => {
      const dayTime = entry.date.getTime();
      const score = MOOD_SCORES[entry.mood] || 5;

      if (daysWithJournal.has(dayTime)) {
        moodsWithJournal.push(score);
      } else {
        moodsWithoutJournal.push(score);
      }

      if (daysWithTasks.has(dayTime)) {
        moodsWithTasks.push(score);
      } else {
        moodsWithoutTasks.push(score);
      }
    });

    const avgWithJournal =
      moodsWithJournal.length > 0
        ? moodsWithJournal.reduce((a, b) => a + b, 0) / moodsWithJournal.length
        : 0;
    const avgWithoutJournal =
      moodsWithoutJournal.length > 0
        ? moodsWithoutJournal.reduce((a, b) => a + b, 0) /
          moodsWithoutJournal.length
        : 0;
    const avgWithTasks =
      moodsWithTasks.length > 0
        ? moodsWithTasks.reduce((a, b) => a + b, 0) / moodsWithTasks.length
        : 0;
    const avgWithoutTasks =
      moodsWithoutTasks.length > 0
        ? moodsWithoutTasks.reduce((a, b) => a + b, 0) /
          moodsWithoutTasks.length
        : 0;

    const journalCorrelation =
      avgWithoutJournal > 0
        ? Math.round(
            ((avgWithJournal - avgWithoutJournal) / avgWithoutJournal) * 100
          )
        : 0;
    const taskCorrelation =
      avgWithoutTasks > 0
        ? Math.round(((avgWithTasks - avgWithoutTasks) / avgWithoutTasks) * 100)
        : 0;

    const allScores = processedMoodData.moodEntriesData.map(
      (e) => MOOD_SCORES[e.mood] || 5
    );
    const overallAvg =
      allScores.length > 0
        ? allScores.reduce((a, b) => a + b, 0) / allScores.length
        : 0;

    const closestMood = Object.entries(MOOD_SCORES).reduce(
      (closest, [mood, score]) => {
        return Math.abs(score - overallAvg) <
          Math.abs(MOOD_SCORES[closest] - overallAvg)
          ? mood
          : closest;
      },
      "neutral"
    );

    return {
      withJournaling: journalCorrelation,
      withTasks: taskCorrelation,
      averageMood: closestMood,
    };
  }, [journals, tasks, processedMoodData.moodEntriesData, dateRange]);

  // Update state when memoized values change
  useEffect(() => {
    setMoodEntries(processedMoodData.moodEntriesData);
    setMoodDistribution(processedMoodData.distribution);
    setMoodTrendData(processedMoodData.trendData);
  }, [processedMoodData]);

  useEffect(() => {
    setWeeklyMoodSummary(weeklyData);
  }, [weeklyData]);

  useEffect(() => {
    setMoodCorrelation(correlationData);
  }, [correlationData]);

  const handleRetry = useCallback(() => {
    setError(null);
    setLoading(true);
    window.location.reload();
  }, []);

  // Get trend icon
  const getTrendIcon = () => {
    if (moodTrendData.length < 2) return <Minus className="h-5 w-5" />;

    const firstHalf = moodTrendData.slice(
      0,
      Math.floor(moodTrendData.length / 2)
    );
    const secondHalf = moodTrendData.slice(
      Math.floor(moodTrendData.length / 2)
    );

    const firstAvg =
      firstHalf.reduce((sum, d) => sum + d.moodScore, 0) / firstHalf.length;
    const secondAvg =
      secondHalf.reduce((sum, d) => sum + d.moodScore, 0) / secondHalf.length;

    if (secondAvg > firstAvg + 0.5) {
      return <TrendingUp className="h-5 w-5 text-green-500" />;
    } else if (secondAvg < firstAvg - 0.5) {
      return <TrendingDown className="h-5 w-5 text-red-500" />;
    }
    return <Minus className="h-5 w-5 text-gray-500" />;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading mood insights...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Failed to Load Mood Insights
              </h3>
              <p className="text-sm text-red-700 mb-4">{error}</p>
            </div>
            <Button
              onClick={handleRetry}
              variant="outline"
              className="border-red-300 hover:bg-red-100"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header with Time Range Selector */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl text-primary">
                Mood Trends & Insights
              </CardTitle>
              <CardDescription>
                Track your emotional wellness journey over time
              </CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Past Week</SelectItem>
                <SelectItem value="month">Past Month</SelectItem>
                <SelectItem value="quarter">Past 3 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Weekly Mood Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-indigo-600">
                {weeklyMoodSummary.moodedDays}/{weeklyMoodSummary.totalDays}
              </p>
              <p className="text-xs text-gray-500">
                {weeklyMoodSummary.topMood && (
                  <>
                    Mostly{" "}
                    <span className="font-semibold capitalize">
                      {weeklyMoodSummary.topMood}
                    </span>
                  </>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Average Mood */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Average Mood
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-purple-600 capitalize">
                {moodCorrelation.averageMood || "N/A"}
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                {getTrendIcon()}
                <span>Overall trend</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Journal Streak */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Flame className="h-4 w-4" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-orange-600">
                {userData?.streak || 0}{" "}
                {userData?.streak === 1 ? "day" : "days"}
              </p>
              <p className="text-xs text-gray-500">Journal entries</p>
            </div>
          </CardContent>
        </Card>

        {/* Best Journal Streak */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Flame className="h-4 w-4" />
              Best Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-yellow-600">
                {userData?.bestStreak || userData?.journalStats?.bestStreak || 0}{" "}
                {(userData?.bestStreak || userData?.journalStats?.bestStreak || 0) === 1 ? "day" : "days"}
              </p>
              <p className="text-xs text-gray-500">Your record!</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Trend Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mood Trend Over Time</CardTitle>
            <CardDescription>
              Your mood scores tracked daily (1-10 scale)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {moodTrendData.filter((d) => d.moodScore > 0).length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <p>
                  No mood data available. Start journaling to track your moods!
                </p>
              </div>
            ) : (
              <div className="w-full" style={{ minHeight: 300 }}>
                <ResponsiveContainer width="100%" height={300} minWidth={100}>
                  <LineChart
                    data={moodTrendData.filter((d) => d.moodScore > 0)}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                      formatter={(value: number) => [
                        value.toFixed(1),
                        "Mood Score",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="moodScore"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      dot={{ fill: "#8B5CF6", r: 4 }}
                      activeDot={{ r: 6 }}
                      isAnimationActive={false}
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mood Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mood Distribution</CardTitle>
            <CardDescription>
              Breakdown of your emotional states
            </CardDescription>
          </CardHeader>
          <CardContent>
            {moodDistribution.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <p>No mood data available</p>
              </div>
            ) : (
              <div className="w-full">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={moodDistribution}
                      dataKey="count"
                      nameKey="mood"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry) => `${entry.mood} (${entry.percentage}%)`}
                      labelLine={true}
                    >
                      {moodDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={MOOD_COLORS[entry.mood] || "#9CA3AF"}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string, props: any) => [
                        `${value} times (${props.payload.percentage}%)`,
                        props.payload.mood,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Mood Correlation Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activity Impact on Mood</CardTitle>
          <CardDescription>
            How your activities correlate with your emotional well-being
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Journaling Impact */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-700">
                  📝 Journaling Impact
                </h4>
                <span
                  className={`text-2xl font-bold ${
                    moodCorrelation.withJournaling > 0
                      ? "text-green-600"
                      : moodCorrelation.withJournaling < 0
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {moodCorrelation.withJournaling > 0 ? "+" : ""}
                  {moodCorrelation.withJournaling}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    moodCorrelation.withJournaling > 0
                      ? "bg-green-500"
                      : moodCorrelation.withJournaling < 0
                      ? "bg-red-500"
                      : "bg-gray-400"
                  }`}
                  style={{
                    width: `${Math.min(
                      Math.abs(moodCorrelation.withJournaling),
                      100
                    )}%`,
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                {moodCorrelation.withJournaling > 0 ? (
                  <>
                    Your mood is{" "}
                    <strong>{moodCorrelation.withJournaling}% better</strong> on
                    days you journal
                  </>
                ) : moodCorrelation.withJournaling < 0 ? (
                  <>Your mood tends to be lower on journaling days</>
                ) : (
                  <>Not enough data to determine correlation</>
                )}
              </p>
            </div>

            {/* Task Completion Impact */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-700">
                  ✅ Task Completion Impact
                </h4>
                <span
                  className={`text-2xl font-bold ${
                    moodCorrelation.withTasks > 0
                      ? "text-green-600"
                      : moodCorrelation.withTasks < 0
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {moodCorrelation.withTasks > 0 ? "+" : ""}
                  {moodCorrelation.withTasks}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    moodCorrelation.withTasks > 0
                      ? "bg-green-500"
                      : moodCorrelation.withTasks < 0
                      ? "bg-red-500"
                      : "bg-gray-400"
                  }`}
                  style={{
                    width: `${Math.min(
                      Math.abs(moodCorrelation.withTasks),
                      100
                    )}%`,
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                {moodCorrelation.withTasks > 0 ? (
                  <>
                    Completing tasks boosts your mood by{" "}
                    <strong>{moodCorrelation.withTasks}%</strong>
                  </>
                ) : moodCorrelation.withTasks < 0 ? (
                  <>Task days tend to be more stressful</>
                ) : (
                  <>Not enough data to determine correlation</>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mood Breakdown Table */}
      {moodDistribution.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detailed Mood Breakdown</CardTitle>
            <CardDescription>
              Complete summary of all recorded moods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {moodDistribution.map((mood, index) => (
                <div
                  key={mood.mood}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: MOOD_COLORS[mood.mood] || "#9CA3AF",
                      }}
                    ></div>
                    <span className="font-medium capitalize">{mood.mood}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {mood.count} times
                    </span>
                    <span className="text-sm font-semibold text-indigo-600 min-w-[3rem] text-right">
                      {mood.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};
