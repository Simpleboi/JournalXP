import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
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
  Activity,
  BookOpen,
  CheckCircle2,
  Loader2,
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
  happy: 9,
  excited: 10,
  motivated: 9,
  grateful: 9,
  confident: 8,
  hopeful: 8,
  relaxed: 7,
  calm: 6,
  neutral: 5,
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

// Mood emoji mapping
const MOOD_EMOJI: { [key: string]: string } = {
  happy: "😊",
  excited: "🤩",
  motivated: "💪",
  grateful: "🙏",
  confident: "😎",
  hopeful: "🌟",
  relaxed: "😌",
  calm: "🧘",
  neutral: "😐",
  tired: "😴",
  anxious: "😰",
  overwhelmed: "😵",
  sad: "😢",
  lonely: "🥺",
  angry: "😠",
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
  const [moodDistribution, setMoodDistribution] = useState<MoodDistribution[]>([]);
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

  const getDateRange = (range: string): Date[] => {
    const now = new Date();
    const dates: Date[] = [];
    let daysToInclude = 7;
    if (range === "month") daysToInclude = 30;
    else if (range === "quarter") daysToInclude = 90;

    for (let i = daysToInclude - 1; i >= 0; i--) {
      dates.push(subDays(startOfDay(now), i));
    }
    return dates;
  };

  const formatDateForDisplay = (date: Date, range: string): string => {
    if (range === "week") return format(date, "EEE");
    return format(date, "MMM d");
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

  const dateRange = useMemo(() => getDateRange(timeRange), [timeRange]);

  const processedMoodData = useMemo(() => {
    const moodEntriesData: MoodEntry[] = [];
    const moodCounts: { [key: string]: number } = {};

    journals.forEach((entry: JournalEntryResponse) => {
      if (entry.mood) {
        const entryDate = startOfDay(parseISO(entry.createdAt));
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

    const totalMoods = moodEntriesData.length;
    const distribution: MoodDistribution[] = Object.entries(moodCounts)
      .map(([mood, count]) => ({
        mood,
        count,
        percentage: Math.round((count / totalMoods) * 100),
      }))
      .sort((a, b) => b.count - a.count);

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

    return { moodEntriesData, distribution, trendData };
  }, [journals, dateRange, timeRange]);

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

      if (daysWithJournal.has(dayTime)) moodsWithJournal.push(score);
      else moodsWithoutJournal.push(score);

      if (daysWithTasks.has(dayTime)) moodsWithTasks.push(score);
      else moodsWithoutTasks.push(score);
    });

    const avg = (arr: number[]) =>
      arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    const avgWithJournal = avg(moodsWithJournal);
    const avgWithoutJournal = avg(moodsWithoutJournal);
    const avgWithTasks = avg(moodsWithTasks);
    const avgWithoutTasks = avg(moodsWithoutTasks);

    const journalCorrelation =
      avgWithoutJournal > 0
        ? Math.round(((avgWithJournal - avgWithoutJournal) / avgWithoutJournal) * 100)
        : 0;
    const taskCorrelation =
      avgWithoutTasks > 0
        ? Math.round(((avgWithTasks - avgWithoutTasks) / avgWithoutTasks) * 100)
        : 0;

    const allScores = processedMoodData.moodEntriesData.map(
      (e) => MOOD_SCORES[e.mood] || 5
    );
    const overallAvg = avg(allScores);

    const closestMood = Object.entries(MOOD_SCORES).reduce(
      (closest, [mood, score]) =>
        Math.abs(score - overallAvg) < Math.abs(MOOD_SCORES[closest] - overallAvg)
          ? mood
          : closest,
      "neutral"
    );

    return {
      withJournaling: journalCorrelation,
      withTasks: taskCorrelation,
      averageMood: closestMood,
    };
  }, [journals, tasks, processedMoodData.moodEntriesData, dateRange]);

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

  const getTrendIcon = () => {
    if (moodTrendData.length < 2) return <Minus className="h-4 w-4 text-gray-500" />;

    const firstHalf = moodTrendData.slice(0, Math.floor(moodTrendData.length / 2));
    const secondHalf = moodTrendData.slice(Math.floor(moodTrendData.length / 2));
    const firstAvg = firstHalf.reduce((sum, d) => sum + d.moodScore, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, d) => sum + d.moodScore, 0) / secondHalf.length;

    if (secondAvg > firstAvg + 0.5) return <TrendingUp className="h-4 w-4 text-emerald-400" />;
    if (secondAvg < firstAvg - 0.5) return <TrendingDown className="h-4 w-4 text-red-400" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getTrendLabel = () => {
    if (moodTrendData.length < 2) return "Not enough data";
    const firstHalf = moodTrendData.slice(0, Math.floor(moodTrendData.length / 2));
    const secondHalf = moodTrendData.slice(Math.floor(moodTrendData.length / 2));
    const firstAvg = firstHalf.reduce((sum, d) => sum + d.moodScore, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, d) => sum + d.moodScore, 0) / secondHalf.length;

    if (secondAvg > firstAvg + 0.5) return "Trending up";
    if (secondAvg < firstAvg - 0.5) return "Trending down";
    return "Staying steady";
  };

  // Glass card base style (light mode)
  const glassCard = "rounded-2xl border border-white/60 bg-white/50 backdrop-blur-xl shadow-lg shadow-indigo-500/5";
  const glassCardInner = "rounded-xl border border-gray-200/60 bg-white/40";

  if (loading) {
    return (
      <div className={`${glassCard} p-16`}>
        <div className="text-center">
          <Loader2 className="h-10 w-10 mx-auto mb-4 animate-spin text-indigo-400" />
          <p className="text-gray-500 text-sm">Loading mood insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${glassCard} border-red-500/30 p-12`}>
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto">
            <AlertCircle className="h-7 w-7 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Failed to Load Mood Insights
            </h3>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
          <Button
            onClick={handleRetry}
            variant="outline"
            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const timeRangeOptions = [
    { value: "week", label: "7 Days" },
    { value: "month", label: "30 Days" },
    { value: "quarter", label: "90 Days" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className={`${glassCard} p-5 sm:p-6`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600"
            >
              <Activity className="h-5 w-5 text-gray-900" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Mood Trends</h2>
              <p className="text-sm text-gray-500">Your emotional wellness over time</p>
            </div>
          </div>

          {/* Time range pills */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100/80 border border-gray-200/60">
            {timeRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeRange(option.value)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  timeRange === option.value
                    ? "text-gray-900 shadow-md"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-200/60"
                }`}
                style={
                  timeRange === option.value
                    ? { background: "linear-gradient(to right, #6366f1, #8b5cf6, #a855f7)" }
                    : undefined
                }
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* This Week */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${glassCard} p-4 sm:p-5 group hover:bg-white/70 transition-colors`}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-500/20">
              <Calendar className="h-4 w-4 text-indigo-400" />
            </div>
            <span className="text-xs font-medium text-gray-500">This Week</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {weeklyMoodSummary.moodedDays}
            <span className="text-sm font-normal text-gray-500">/{weeklyMoodSummary.totalDays}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {weeklyMoodSummary.topMood ? (
              <>
                Mostly{" "}
                <span className="capitalize text-indigo-300">
                  {weeklyMoodSummary.topMood}
                </span>
                {" "}{MOOD_EMOJI[weeklyMoodSummary.topMood] || ""}
              </>
            ) : (
              "No moods logged"
            )}
          </p>
        </motion.div>

        {/* Average Mood */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`${glassCard} p-4 sm:p-5 group hover:bg-white/70 transition-colors`}
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-500/20"
            >
              <Heart className="h-4 w-4 text-purple-400" />
            </div>
            <span className="text-xs font-medium text-gray-500">Average Mood</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 capitalize">
            {moodCorrelation.averageMood || "N/A"}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            {getTrendIcon()}
            <span className="text-xs text-gray-500">{getTrendLabel()}</span>
          </div>
        </motion.div>

        {/* Current Streak */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${glassCard} p-4 sm:p-5 group hover:bg-white/70 transition-colors`}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-500/15">
              <Flame className="h-4 w-4 text-orange-400" />
            </div>
            <span className="text-xs font-medium text-gray-500">Current Streak</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {userData?.streak || 0}
            <span className="text-sm font-normal text-gray-500">
              {" "}{(userData?.streak || 0) === 1 ? "day" : "days"}
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-1">Journal entries</p>
        </motion.div>

        {/* Best Streak */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className={`${glassCard} p-4 sm:p-5 group hover:bg-white/70 transition-colors`}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-500/15">
              <Flame className="h-4 w-4 text-amber-400" />
            </div>
            <span className="text-xs font-medium text-gray-500">Best Streak</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {userData?.bestStreak || userData?.journalStats?.bestStreak || 0}
            <span className="text-sm font-normal text-gray-500">
              {" "}{(userData?.bestStreak || userData?.journalStats?.bestStreak || 0) === 1 ? "day" : "days"}
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-1">Your record</p>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-5">
        {/* Mood Trend Chart - takes 3 cols */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`${glassCard} p-5 sm:p-6 lg:col-span-3`}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Mood Over Time</h3>
              <p className="text-xs text-gray-500 mt-0.5">Daily mood score (1-10 scale)</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              {getTrendIcon()}
              <span>{getTrendLabel()}</span>
            </div>
          </div>

          {moodTrendData.filter((d) => d.moodScore > 0).length === 0 ? (
            <div className="h-[260px] flex flex-col items-center justify-center">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-indigo-500/15"
              >
                <Activity className="h-6 w-6 text-indigo-400/60" />
              </div>
              <p className="text-sm text-gray-500">No mood data yet</p>
              <p className="text-xs text-gray-600 mt-1">Start journaling with moods to see trends</p>
            </div>
          ) : (
            <div className="w-full" style={{ minHeight: 260 }}>
              <ResponsiveContainer width="100%" height={260} minWidth={100}>
                <AreaChart
                  data={moodTrendData.filter((d) => d.moodScore > 0)}
                  margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(0,0,0,0.06)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={{ stroke: "rgba(0,0,0,0.08)" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 10]}
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "12px",
                      border: "1px solid rgba(0,0,0,0.08)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                      backdropFilter: "blur(12px)",
                    }}
                    labelStyle={{ color: "#6b7280", fontSize: 12 }}
                    itemStyle={{ color: "#1f2937", fontSize: 13 }}
                    formatter={(value: number) => [value.toFixed(1), "Mood Score"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="moodScore"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    fill="url(#moodGradient)"
                    dot={{ fill: "#8b5cf6", r: 4, strokeWidth: 2, stroke: "rgba(255,255,255,0.9)" }}
                    activeDot={{ r: 6, fill: "#a78bfa", strokeWidth: 2, stroke: "#8b5cf6" }}
                    isAnimationActive={false}
                    connectNulls
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        {/* Mood Distribution - takes 2 cols */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className={`${glassCard} p-5 sm:p-6 lg:col-span-2`}
        >
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Mood Breakdown</h3>
            <p className="text-xs text-gray-500 mt-0.5">How your emotions are distributed</p>
          </div>

          {moodDistribution.length === 0 ? (
            <div className="h-[260px] flex flex-col items-center justify-center">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-purple-500/15"
              >
                <Heart className="h-6 w-6 text-purple-400/60" />
              </div>
              <p className="text-sm text-gray-500">No mood data yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Top moods list */}
              {moodDistribution.slice(0, 5).map((mood, index) => (
                <div key={mood.mood} className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{MOOD_EMOJI[mood.mood] || "😐"}</span>
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {mood.mood}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{mood.count}x</span>
                      <span className="text-xs font-semibold min-w-[2.5rem] text-right text-indigo-300">
                        {mood.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-200/50 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${mood.percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.1 * index, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: MOOD_COLORS[mood.mood] || "#9CA3AF",
                      }}
                    />
                  </div>
                </div>
              ))}

              {/* Show remaining count */}
              {moodDistribution.length > 5 && (
                <p className="text-xs text-gray-600 text-center pt-1">
                  +{moodDistribution.length - 5} more moods
                </p>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Activity Impact on Mood */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`${glassCard} p-5 sm:p-6`}
      >
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-gray-900">Activity Impact on Mood</h3>
          <p className="text-xs text-gray-500 mt-0.5">How your activities correlate with emotional well-being</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Journaling Impact */}
          <div className={`${glassCardInner} p-4`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center bg-indigo-500/[0.09]"
                >
                  <BookOpen className="h-4 w-4 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800">Journaling</h4>
                  <p className="text-xs text-gray-500">Impact on mood</p>
                </div>
              </div>
              <span
                className="text-xl font-bold"
                style={{
                  color:
                    moodCorrelation.withJournaling > 0
                      ? "#34d399"
                      : moodCorrelation.withJournaling < 0
                      ? "#f87171"
                      : "#6b7280",
                }}
              >
                {moodCorrelation.withJournaling > 0 ? "+" : ""}
                {moodCorrelation.withJournaling}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-200/50 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(Math.abs(moodCorrelation.withJournaling), 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{
                  backgroundColor:
                    moodCorrelation.withJournaling > 0
                      ? "#34d399"
                      : moodCorrelation.withJournaling < 0
                      ? "#f87171"
                      : "#6b7280",
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2.5">
              {moodCorrelation.withJournaling > 0 ? (
                <>
                  Mood is <span className="text-emerald-400 font-medium">{moodCorrelation.withJournaling}% better</span> on days you journal
                </>
              ) : moodCorrelation.withJournaling < 0 ? (
                "Mood tends to be lower on journaling days"
              ) : (
                "Not enough data to determine correlation"
              )}
            </p>
          </div>

          {/* Task Completion Impact */}
          <div className={`${glassCardInner} p-4`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-emerald-500/15">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800">Tasks</h4>
                  <p className="text-xs text-gray-500">Completion impact</p>
                </div>
              </div>
              <span
                className="text-xl font-bold"
                style={{
                  color:
                    moodCorrelation.withTasks > 0
                      ? "#34d399"
                      : moodCorrelation.withTasks < 0
                      ? "#f87171"
                      : "#6b7280",
                }}
              >
                {moodCorrelation.withTasks > 0 ? "+" : ""}
                {moodCorrelation.withTasks}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-200/50 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(Math.abs(moodCorrelation.withTasks), 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{
                  backgroundColor:
                    moodCorrelation.withTasks > 0
                      ? "#34d399"
                      : moodCorrelation.withTasks < 0
                      ? "#f87171"
                      : "#6b7280",
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2.5">
              {moodCorrelation.withTasks > 0 ? (
                <>
                  Completing tasks boosts mood by <span className="text-emerald-400 font-medium">{moodCorrelation.withTasks}%</span>
                </>
              ) : moodCorrelation.withTasks < 0 ? (
                "Task days tend to be more stressful"
              ) : (
                "Not enough data to determine correlation"
              )}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Detailed Mood Breakdown */}
      {moodDistribution.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className={`${glassCard} p-5 sm:p-6`}
        >
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">All Moods</h3>
            <p className="text-xs text-gray-500 mt-0.5">Complete breakdown of recorded moods</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {moodDistribution.map((mood, index) => (
              <motion.div
                key={mood.mood}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-indigo-50/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{MOOD_EMOJI[mood.mood] || "😐"}</span>
                  <span className="text-sm font-medium text-gray-700 capitalize group-hover:text-gray-900 transition-colors">
                    {mood.mood}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">
                    {mood.count} {mood.count === 1 ? "time" : "times"}
                  </span>
                  <span
                    className="text-xs font-bold min-w-[2.5rem] text-right px-2 py-0.5 rounded-md"
                    style={{
                      color: "#a78bfa",
                      backgroundColor: "rgba(139, 92, 246, 0.15)",
                    }}
                  >
                    {mood.percentage}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
