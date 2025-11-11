import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Award,
  Target,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Flame,
  Zap,
  AlertCircle,
  Trophy,
  Brain,
  Calendar,
  ArrowUp,
  ArrowDown,
  ChevronRight,
} from "lucide-react";
import { InsightKeyMetrics } from "./InsightTotalStats";
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
  format,
  parseISO,
  subDays,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  isSameDay,
  eachDayOfInterval,
  getDay,
  getHours,
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

interface WellnessScore {
  overall: number;
  mentalHealth: number;
  productivity: number;
  consistency: number;
  selfCare: number;
  trend: number[]; // 7-day scores
  weeklyChange: number;
}

interface WeeklySnapshot {
  thisWeek: {
    journals: number;
    tasks: number;
    habits: number;
    avgMood: number;
    xp: number;
    streakMaintained: boolean;
  };
  lastWeek: {
    journals: number;
    tasks: number;
    habits: number;
    avgMood: number;
    xp: number;
    streakMaintained: boolean;
  };
  changes: {
    journals: number;
    tasks: number;
    habits: number;
    avgMood: number;
    xp: number;
  };
}

interface HeatmapDay {
  date: Date;
  count: number;
  journals: number;
  tasks: number;
  habits: number;
}

interface MoodTrend {
  direction: "up" | "down" | "stable";
  change: number;
  currentAvg: number;
  previousAvg: number;
}

interface GoalProgress {
  journals: { current: number; target: number; percentage: number };
  tasks: { current: number; target: number; percentage: number };
  habits: { current: number; target: number; percentage: number };
  xp: { current: number; target: number; percentage: number };
}

interface Achievement {
  id: string;
  text: string;
  icon: string;
  date?: string;
}

interface QuickWin {
  text: string;
  icon: string;
  action?: string;
  impact: "high" | "medium" | "low";
}

interface TodayFocus {
  title: string;
  description: string;
  reason: string;
  action: string;
  icon: string;
  priority: "critical" | "high" | "medium";
}

// Overview Section
export const InsightOverview = () => {
  return (
    <TabsContent value="overview" className="space-y-6">
      {/* Wellness Score Dashboard */}
      <WellnessScoreDashboard />

      {/* Today's Focus Card */}
      <TodaysFocusCard />

      {/* Weekly Snapshot Comparison */}
      <WeeklySnapshotComparison />

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Trajectory */}
        <MoodTrajectoryArrow />

        {/* Quick Win Suggestions */}
        <QuickWinSuggestions />
      </div>

      {/* Goal Progress Rings */}
      <GoalProgressRings />

      {/* Streak Heatmap Calendar */}
      <StreakHeatmapCalendar />

      {/* Achievement Ticker */}
      <AchievementTicker />

      {/* Original sections */}
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

// 1. Wellness Score Dashboard
const WellnessScoreDashboard = () => {
  const { user } = useAuth();
  const { userData } = useUserData();
  const [wellnessScore, setWellnessScore] = useState<WellnessScore | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const calculateWellnessScore = async () => {
      try {
        setLoading(true);

        const [journals, tasks, habits] = await Promise.all([
          getJournalEntries(),
          fetchTasksFromServer(),
          getHabits(),
        ]);

        // Calculate scores for each dimension (0-100)

        // Mental Health: Based on mood scores from journals
        const last7DaysJournals = journals.filter((j) => {
          const date = parseISO(j.date);
          return date >= subDays(new Date(), 7);
        });

        const moodScores = last7DaysJournals.map((j) => getMoodScore(j.mood));
        const avgMood =
          moodScores.length > 0
            ? moodScores.reduce((a, b) => a + b, 0) / moodScores.length
            : 5;
        const mentalHealth = (avgMood / 10) * 100;

        // Productivity: Task completion rate + recent activity
        const completedTasks = tasks.filter((t) => t.completed).length;
        const totalTasks = tasks.length;
        const taskRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        const recentTasks = tasks.filter((t) => {
          if (!t.createdAt) return false;
          const date = parseISO(t.createdAt);
          return date >= subDays(new Date(), 7);
        });
        const recentActivity = Math.min((recentTasks.length / 20) * 100, 100);
        const productivity = (taskRate * 0.6 + recentActivity * 0.4);

        // Consistency: Streak + habit completion
        const currentStreak = userData?.streak || 0;
        const streakScore = Math.min((currentStreak / 30) * 100, 100);

        const activeHabits = habits.filter((h) => !h.isFullyCompleted);
        const habitsWithStreak = activeHabits.filter((h) => h.streak >= 3).length;
        const habitConsistency =
          activeHabits.length > 0
            ? (habitsWithStreak / activeHabits.length) * 100
            : 0;
        const consistency = (streakScore * 0.5 + habitConsistency * 0.5);

        // Self-Care: Journal frequency + meditation/habits
        const journalsLast7 = last7DaysJournals.length;
        const journalFrequency = (journalsLast7 / 7) * 100;

        const habitsCompleted = habits.reduce(
          (sum, h) => sum + h.currentCompletions,
          0
        );
        const habitActivity = Math.min((habitsCompleted / 30) * 100, 100);
        const selfCare = (journalFrequency * 0.6 + habitActivity * 0.4);

        // Overall weighted score
        const overall =
          mentalHealth * 0.3 +
          productivity * 0.25 +
          consistency * 0.25 +
          selfCare * 0.2;

        // Calculate 7-day trend
        const trend: number[] = [];
        for (let i = 6; i >= 0; i--) {
          const targetDate = subDays(new Date(), i);
          const dayJournals = journals.filter((j) =>
            isSameDay(parseISO(j.date), targetDate)
          );
          const dayMood =
            dayJournals.length > 0
              ? dayJournals.reduce((sum, j) => sum + getMoodScore(j.mood), 0) /
                dayJournals.length
              : 5;
          const dayScore = (dayMood / 10) * 100;
          trend.push(dayScore);
        }

        const weeklyChange = trend.length >= 2 ? trend[6] - trend[0] : 0;

        setWellnessScore({
          overall: Math.round(overall),
          mentalHealth: Math.round(mentalHealth),
          productivity: Math.round(productivity),
          consistency: Math.round(consistency),
          selfCare: Math.round(selfCare),
          trend,
          weeklyChange: Math.round(weeklyChange),
        });
      } catch (error) {
        console.error("Error calculating wellness score:", error);
      } finally {
        setLoading(false);
      }
    };

    calculateWellnessScore();
  }, [user, userData]);

  if (loading || !wellnessScore) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Calculating your wellness score...</p>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 40) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getScoreColorBar = (score: number) => {
    if (score >= 70) return "bg-green-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getWeakestDimension = () => {
    const dimensions = [
      { name: "Mental Health", score: wellnessScore.mentalHealth, tip: "Try journaling about your feelings today" },
      { name: "Productivity", score: wellnessScore.productivity, tip: "Complete 3 small tasks to build momentum" },
      { name: "Consistency", score: wellnessScore.consistency, tip: "Focus on maintaining your daily habits" },
      { name: "Self-Care", score: wellnessScore.selfCare, tip: "Schedule 10 minutes for meditation or reflection" },
    ];
    return dimensions.sort((a, b) => a.score - b.score)[0];
  };

  const weakest = getWeakestDimension();

  return (
    <Card className={`border-2 ${getScoreColor(wellnessScore.overall)}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Overall Wellness Score
          </div>
          <div className="flex items-center gap-2">
            {wellnessScore.weeklyChange > 0 ? (
              <Badge className="bg-green-100 text-green-700">
                <TrendingUp className="h-3 w-3 mr-1" />+
                {wellnessScore.weeklyChange}
              </Badge>
            ) : wellnessScore.weeklyChange < 0 ? (
              <Badge className="bg-red-100 text-red-700">
                <TrendingDown className="h-3 w-3 mr-1" />
                {wellnessScore.weeklyChange}
              </Badge>
            ) : (
              <Badge className="bg-gray-100 text-gray-700">
                <Minus className="h-3 w-3 mr-1" />
                Stable
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Score */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-6xl font-bold mb-2">
              {wellnessScore.overall}
            </div>
            <p className="text-sm text-gray-600 mb-4">out of 100</p>
            {/* Mini sparkline */}
            <div className="flex items-end gap-1 h-12">
              {wellnessScore.trend.map((score, i) => (
                <div
                  key={i}
                  className={`w-2 ${getScoreColorBar(score)} rounded-t`}
                  style={{ height: `${(score / 100) * 100}%` }}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">7-day trend</p>
          </div>

          {/* Dimension Breakdown */}
          <div className="lg:col-span-2 space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Mental Health (30%)</span>
                <span className="text-sm font-medium">
                  {wellnessScore.mentalHealth}%
                </span>
              </div>
              <Progress
                value={wellnessScore.mentalHealth}
                className={`h-2 ${getScoreColorBar(wellnessScore.mentalHealth)}`}
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Productivity (25%)</span>
                <span className="text-sm font-medium">
                  {wellnessScore.productivity}%
                </span>
              </div>
              <Progress
                value={wellnessScore.productivity}
                className={`h-2 ${getScoreColorBar(wellnessScore.productivity)}`}
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Consistency (25%)</span>
                <span className="text-sm font-medium">
                  {wellnessScore.consistency}%
                </span>
              </div>
              <Progress
                value={wellnessScore.consistency}
                className={`h-2 ${getScoreColorBar(wellnessScore.consistency)}`}
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Self-Care (20%)</span>
                <span className="text-sm font-medium">
                  {wellnessScore.selfCare}%
                </span>
              </div>
              <Progress
                value={wellnessScore.selfCare}
                className={`h-2 ${getScoreColorBar(wellnessScore.selfCare)}`}
              />
            </div>

            {/* Personalized Tip */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-900 mb-1">
                💡 Focus Area: {weakest.name}
              </p>
              <p className="text-sm text-blue-700">{weakest.tip}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// 2. Today's Focus Card
const TodaysFocusCard = () => {
  const { user } = useAuth();
  const { userData } = useUserData();
  const [todayFocus, setTodayFocus] = useState<TodayFocus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const generateTodayFocus = async () => {
      try {
        setLoading(true);

        const [journals, tasks, habits] = await Promise.all([
          getJournalEntries(),
          fetchTasksFromServer(),
          getHabits(),
        ]);

        const today = new Date();
        const todayJournals = journals.filter((j) =>
          isSameDay(parseISO(j.date), today)
        );

        // Priority 1: Streak at risk
        if (
          userData &&
          userData.streak > 0 &&
          todayJournals.length === 0 &&
          getHours(today) >= 18
        ) {
          setTodayFocus({
            title: "Protect Your Streak!",
            description: `Don't break your ${userData.streak}-day streak`,
            reason: "You haven't journaled today yet",
            action: "Write a quick journal entry",
            icon: "🔥",
            priority: "critical",
          });
          setLoading(false);
          return;
        }

        // Priority 2: Anxious mood yesterday - process it
        const yesterday = subDays(today, 1);
        const yesterdayJournals = journals.filter((j) =>
          isSameDay(parseISO(j.date), yesterday)
        );
        const anxiousMood = yesterdayJournals.find(
          (j) =>
            j.mood === "anxious" || j.mood === "overwhelmed" || j.mood === "sad"
        );

        if (anxiousMood && todayJournals.length === 0) {
          setTodayFocus({
            title: "Process Yesterday's Feelings",
            description: `You felt ${anxiousMood.mood} yesterday`,
            reason: "Reflection helps process difficult emotions",
            action: "Journal about how you're feeling now",
            icon: "💭",
            priority: "high",
          });
          setLoading(false);
          return;
        }

        // Priority 3: Day-of-week productivity pattern
        const dayOfWeek = getDay(today);
        const dayName = format(today, "EEEE");

        // Check if this is a historically high-productivity day
        const sameDayJournals = journals.filter(
          (j) => getDay(parseISO(j.date)) === dayOfWeek
        );
        const sameDayAvgMood =
          sameDayJournals.length > 0
            ? sameDayJournals.reduce((sum, j) => sum + getMoodScore(j.mood), 0) /
              sameDayJournals.length
            : 5;

        if (sameDayAvgMood >= 7 && tasks.filter((t) => !t.completed).length > 0) {
          setTodayFocus({
            title: `${dayName}s Are Your Power Day`,
            description: `Your ${dayName} mood is usually ${sameDayAvgMood.toFixed(1)}/10`,
            reason: "Use this high-energy day wisely",
            action: "Tackle your hardest task first",
            icon: "⚡",
            priority: "high",
          });
          setLoading(false);
          return;
        }

        // Priority 4: Habit reminder
        const habitsNeedingAttention = habits.filter(
          (h) => !h.isFullyCompleted && (!h.lastCompleted || !isSameDay(parseISO(h.lastCompleted), today))
        );

        if (habitsNeedingAttention.length > 0) {
          const habit = habitsNeedingAttention[0];
          setTodayFocus({
            title: "Build Your Habit",
            description: `"${habit.title}" needs attention`,
            reason: `Current streak: ${habit.streak} days`,
            action: "Complete this habit now",
            icon: "🎯",
            priority: "medium",
          });
          setLoading(false);
          return;
        }

        // Default: General encouragement
        setTodayFocus({
          title: "Make Today Count",
          description: "You're on a great wellness journey",
          reason: "Small steps lead to big changes",
          action: "Choose any wellness activity",
          icon: "✨",
          priority: "medium",
        });
      } catch (error) {
        console.error("Error generating today's focus:", error);
      } finally {
        setLoading(false);
      }
    };

    generateTodayFocus();
  }, [user, userData]);

  if (loading || !todayFocus) {
    return null;
  }

  const getPriorityColor = (priority: string) => {
    if (priority === "critical") return "bg-red-50 border-red-300";
    if (priority === "high") return "bg-orange-50 border-orange-300";
    return "bg-blue-50 border-blue-300";
  };

  const getPriorityTextColor = (priority: string) => {
    if (priority === "critical") return "text-red-900";
    if (priority === "high") return "text-orange-900";
    return "text-blue-900";
  };

  return (
    <Card className={`border-2 ${getPriorityColor(todayFocus.priority)}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Today's Focus
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4">
          <div className="text-4xl">{todayFocus.icon}</div>
          <div className="flex-1">
            <h3 className={`text-xl font-bold mb-1 ${getPriorityTextColor(todayFocus.priority)}`}>
              {todayFocus.title}
            </h3>
            <p className="text-gray-700 mb-2">{todayFocus.description}</p>
            <p className="text-sm text-gray-600 mb-3">
              <span className="font-medium">Why:</span> {todayFocus.reason}
            </p>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
              {todayFocus.action}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// 3. Weekly Snapshot Comparison
const WeeklySnapshotComparison = () => {
  const { user } = useAuth();
  const { userData } = useUserData();
  const [snapshot, setSnapshot] = useState<WeeklySnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const calculateSnapshot = async () => {
      try {
        setLoading(true);

        const [journals, tasks, habits] = await Promise.all([
          getJournalEntries(),
          fetchTasksFromServer(),
          getHabits(),
        ]);

        const today = new Date();
        const thisWeekStart = startOfWeek(today, { weekStartsOn: 0 });
        const thisWeekEnd = endOfWeek(today, { weekStartsOn: 0 });
        const lastWeekStart = startOfWeek(subDays(today, 7), { weekStartsOn: 0 });
        const lastWeekEnd = endOfWeek(subDays(today, 7), { weekStartsOn: 0 });

        // This week data
        const thisWeekJournals = journals.filter((j) =>
          isWithinInterval(parseISO(j.date), {
            start: thisWeekStart,
            end: thisWeekEnd,
          })
        );
        const thisWeekTasks = tasks.filter(
          (t) =>
            t.completed &&
            t.createdAt &&
            isWithinInterval(parseISO(t.createdAt), {
              start: thisWeekStart,
              end: thisWeekEnd,
            })
        );
        const thisWeekHabits = habits.reduce((sum, h) => {
          // Count completions this week
          if (!h.lastCompleted) return sum;
          const lastCompleted = parseISO(h.lastCompleted);
          if (isWithinInterval(lastCompleted, { start: thisWeekStart, end: thisWeekEnd })) {
            return sum + 1;
          }
          return sum;
        }, 0);

        const thisWeekMoodScores = thisWeekJournals.map((j) => getMoodScore(j.mood));
        const thisWeekAvgMood =
          thisWeekMoodScores.length > 0
            ? thisWeekMoodScores.reduce((a, b) => a + b, 0) / thisWeekMoodScores.length
            : 0;

        const thisWeekXP =
          thisWeekJournals.length * 30 +
          thisWeekTasks.length * 20 +
          thisWeekHabits * 10;

        // Last week data
        const lastWeekJournals = journals.filter((j) =>
          isWithinInterval(parseISO(j.date), {
            start: lastWeekStart,
            end: lastWeekEnd,
          })
        );
        const lastWeekTasks = tasks.filter(
          (t) =>
            t.completed &&
            t.createdAt &&
            isWithinInterval(parseISO(t.createdAt), {
              start: lastWeekStart,
              end: lastWeekEnd,
            })
        );
        const lastWeekHabits = habits.reduce((sum, h) => {
          if (!h.lastCompleted) return sum;
          const lastCompleted = parseISO(h.lastCompleted);
          const oneWeekBefore = subDays(lastCompleted, 7);
          if (isWithinInterval(oneWeekBefore, { start: lastWeekStart, end: lastWeekEnd })) {
            return sum + 1;
          }
          return sum;
        }, 0);

        const lastWeekMoodScores = lastWeekJournals.map((j) => getMoodScore(j.mood));
        const lastWeekAvgMood =
          lastWeekMoodScores.length > 0
            ? lastWeekMoodScores.reduce((a, b) => a + b, 0) / lastWeekMoodScores.length
            : 0;

        const lastWeekXP =
          lastWeekJournals.length * 30 +
          lastWeekTasks.length * 20 +
          lastWeekHabits * 10;

        // Calculate changes
        const changes = {
          journals:
            lastWeekJournals.length > 0
              ? Math.round(
                  ((thisWeekJournals.length - lastWeekJournals.length) /
                    lastWeekJournals.length) *
                    100
                )
              : thisWeekJournals.length > 0
              ? 100
              : 0,
          tasks:
            lastWeekTasks.length > 0
              ? Math.round(
                  ((thisWeekTasks.length - lastWeekTasks.length) /
                    lastWeekTasks.length) *
                    100
                )
              : thisWeekTasks.length > 0
              ? 100
              : 0,
          habits:
            lastWeekHabits > 0
              ? Math.round(((thisWeekHabits - lastWeekHabits) / lastWeekHabits) * 100)
              : thisWeekHabits > 0
              ? 100
              : 0,
          avgMood: lastWeekAvgMood > 0 ? thisWeekAvgMood - lastWeekAvgMood : 0,
          xp:
            lastWeekXP > 0
              ? Math.round(((thisWeekXP - lastWeekXP) / lastWeekXP) * 100)
              : thisWeekXP > 0
              ? 100
              : 0,
        };

        setSnapshot({
          thisWeek: {
            journals: thisWeekJournals.length,
            tasks: thisWeekTasks.length,
            habits: thisWeekHabits,
            avgMood: thisWeekAvgMood,
            xp: thisWeekXP,
            streakMaintained: userData?.streak ? userData.streak > 0 : false,
          },
          lastWeek: {
            journals: lastWeekJournals.length,
            tasks: lastWeekTasks.length,
            habits: lastWeekHabits,
            avgMood: lastWeekAvgMood,
            xp: lastWeekXP,
            streakMaintained: true, // Simplified assumption
          },
          changes,
        });
      } catch (error) {
        console.error("Error calculating weekly snapshot:", error);
      } finally {
        setLoading(false);
      }
    };

    calculateSnapshot();
  }, [user, userData]);

  if (loading || !snapshot) {
    return null;
  }

  const renderChange = (value: number, isPositive: boolean = true) => {
    if (value > 0) {
      return (
        <Badge className="bg-green-100 text-green-700">
          <ArrowUp className="h-3 w-3 mr-1" />+{value}
          {typeof value === "number" && !Number.isInteger(value) ? "" : "%"}
        </Badge>
      );
    } else if (value < 0) {
      return (
        <Badge className="bg-red-100 text-red-700">
          <ArrowDown className="h-3 w-3 mr-1" />
          {value}
          {typeof value === "number" && !Number.isInteger(value) ? "" : "%"}
        </Badge>
      );
    }
    return (
      <Badge className="bg-gray-100 text-gray-700">
        <Minus className="h-3 w-3 mr-1" />
        0%
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Weekly Snapshot
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Journals</p>
            <p className="text-2xl font-bold">{snapshot.thisWeek.journals}</p>
            <p className="text-xs text-gray-500 mb-2">
              vs {snapshot.lastWeek.journals} last week
            </p>
            {renderChange(snapshot.changes.journals)}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Tasks</p>
            <p className="text-2xl font-bold">{snapshot.thisWeek.tasks}</p>
            <p className="text-xs text-gray-500 mb-2">
              vs {snapshot.lastWeek.tasks} last week
            </p>
            {renderChange(snapshot.changes.tasks)}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Habits</p>
            <p className="text-2xl font-bold">{snapshot.thisWeek.habits}</p>
            <p className="text-xs text-gray-500 mb-2">
              vs {snapshot.lastWeek.habits} last week
            </p>
            {renderChange(snapshot.changes.habits)}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Avg Mood</p>
            <p className="text-2xl font-bold">
              {snapshot.thisWeek.avgMood.toFixed(1)}
            </p>
            <p className="text-xs text-gray-500 mb-2">
              vs {snapshot.lastWeek.avgMood.toFixed(1)} last week
            </p>
            {renderChange(
              Math.round(snapshot.changes.avgMood * 10) / 10,
              snapshot.changes.avgMood >= 0
            )}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total XP</p>
            <p className="text-2xl font-bold">{snapshot.thisWeek.xp}</p>
            <p className="text-xs text-gray-500 mb-2">
              vs {snapshot.lastWeek.xp} last week
            </p>
            {renderChange(snapshot.changes.xp)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// 4. Mood Trajectory Arrow
const MoodTrajectoryArrow = () => {
  const { user } = useAuth();
  const [moodTrend, setMoodTrend] = useState<MoodTrend | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const calculateMoodTrend = async () => {
      try {
        setLoading(true);
        const journals = await getJournalEntries();

        const today = new Date();
        const last7Days = subDays(today, 7);
        const previous7Days = subDays(today, 14);

        const currentWeek = journals.filter((j) => {
          const date = parseISO(j.date);
          return date >= last7Days;
        });

        const previousWeek = journals.filter((j) => {
          const date = parseISO(j.date);
          return date >= previous7Days && date < last7Days;
        });

        const currentAvg =
          currentWeek.length > 0
            ? currentWeek.reduce((sum, j) => sum + getMoodScore(j.mood), 0) /
              currentWeek.length
            : 5;

        const previousAvg =
          previousWeek.length > 0
            ? previousWeek.reduce((sum, j) => sum + getMoodScore(j.mood), 0) /
              previousWeek.length
            : 5;

        const change = currentAvg - previousAvg;
        const direction: "up" | "down" | "stable" =
          change > 0.5 ? "up" : change < -0.5 ? "down" : "stable";

        setMoodTrend({
          direction,
          change: Math.round(change * 10) / 10,
          currentAvg: Math.round(currentAvg * 10) / 10,
          previousAvg: Math.round(previousAvg * 10) / 10,
        });
      } catch (error) {
        console.error("Error calculating mood trend:", error);
      } finally {
        setLoading(false);
      }
    };

    calculateMoodTrend();
  }, [user]);

  if (loading || !moodTrend) {
    return null;
  }

  const getBackgroundColor = () => {
    if (moodTrend.direction === "up") return "bg-gradient-to-br from-green-50 to-green-100 border-green-200";
    if (moodTrend.direction === "down") return "bg-gradient-to-br from-red-50 to-red-100 border-red-200";
    return "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200";
  };

  const getIcon = () => {
    if (moodTrend.direction === "up") return <TrendingUp className="h-16 w-16 text-green-600" />;
    if (moodTrend.direction === "down") return <TrendingDown className="h-16 w-16 text-red-600" />;
    return <Minus className="h-16 w-16 text-gray-600" />;
  };

  const getTitle = () => {
    if (moodTrend.direction === "up") return "Mood Improving";
    if (moodTrend.direction === "down") return "Mood Declining";
    return "Mood Stable";
  };

  const getMessage = () => {
    if (moodTrend.direction === "up") {
      return "Keep up the great work! Your mental health is trending positive.";
    } else if (moodTrend.direction === "down") {
      if (moodTrend.change < -2) {
        return "Consider reaching out to support resources if you need help.";
      }
      return "It's okay to have tough weeks. Try self-care activities.";
    }
    return "Your mood has been consistent this week.";
  };

  return (
    <Card className={`border-2 ${getBackgroundColor()}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Mood Trajectory
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div>{getIcon()}</div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">{getTitle()}</h3>
            <p className="text-gray-700 mb-2">
              Current: <span className="font-semibold">{moodTrend.currentAvg}/10</span>
              {" · "}
              Previous: <span className="font-semibold">{moodTrend.previousAvg}/10</span>
            </p>
            <p className="text-sm text-gray-600 mb-3">
              {moodTrend.change > 0 ? "+" : ""}
              {moodTrend.change} points this week
            </p>
            <p className="text-sm text-gray-700">{getMessage()}</p>
            {moodTrend.direction === "down" && moodTrend.change < -2 && (
              <div className="mt-3 p-2 bg-red-100 rounded border border-red-300">
                <p className="text-xs text-red-800 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  If you're in crisis, call 988 (Suicide & Crisis Lifeline)
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// 5. Quick Win Suggestions
const QuickWinSuggestions = () => {
  const { user } = useAuth();
  const { userData } = useUserData();
  const [quickWins, setQuickWins] = useState<QuickWin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !userData) return;

    const generateQuickWins = async () => {
      try {
        setLoading(true);

        const [journals, tasks, habits] = await Promise.all([
          getJournalEntries(),
          fetchTasksFromServer(),
          getHabits(),
        ]);

        const wins: QuickWin[] = [];

        // Check if close to 80% task completion
        const completedTasks = tasks.filter((t) => t.completed).length;
        const totalTasks = tasks.length;
        const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        if (completionRate >= 75 && completionRate < 80) {
          const needed = Math.ceil((totalTasks * 0.8) - completedTasks);
          wins.push({
            text: `${needed} more task${needed > 1 ? 's' : ''} = 80% completion rate`,
            icon: "🎯",
            impact: "high",
          });
        }

        // Check journal records
        const thisWeek = journals.filter((j) => {
          const date = parseISO(j.date);
          return date >= startOfWeek(new Date(), { weekStartsOn: 0 });
        });

        if (thisWeek.length === 6) {
          wins.push({
            text: "One more journal = new weekly record!",
            icon: "📝",
            impact: "high",
          });
        }

        // Check habit streaks
        habits.forEach((h) => {
          if (h.streak > 0 && h.streak % 7 === 6) {
            wins.push({
              text: `"${h.title}" is 1 day from a new week streak`,
              icon: "🔥",
              impact: "medium",
            });
          }
        });

        // Check level progress
        if (userData.xpNeededToNextLevel && userData.xpNeededToNextLevel <= 100) {
          wins.push({
            text: `${userData.xpNeededToNextLevel} XP to level ${userData.level + 1}!`,
            icon: "⭐",
            impact: "high",
          });
        }

        // Add default suggestion if no wins
        if (wins.length === 0) {
          wins.push({
            text: "Complete any task to build momentum",
            icon: "✨",
            impact: "low",
          });
        }

        setQuickWins(wins.slice(0, 4)); // Max 4 suggestions
      } catch (error) {
        console.error("Error generating quick wins:", error);
      } finally {
        setLoading(false);
      }
    };

    generateQuickWins();
  }, [user, userData]);

  if (loading) {
    return null;
  }

  const getImpactColor = (impact: string) => {
    if (impact === "high") return "border-l-green-500";
    if (impact === "medium") return "border-l-yellow-500";
    return "border-l-gray-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Quick Wins
        </CardTitle>
      </CardHeader>
      <CardContent>
        {quickWins.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            You're crushing it! No quick wins needed.
          </p>
        ) : (
          <div className="space-y-3">
            {quickWins.map((win, i) => (
              <div
                key={i}
                className={`p-3 bg-gray-50 rounded-lg border-l-4 ${getImpactColor(win.impact)}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{win.icon}</span>
                  <p className="text-sm font-medium text-gray-800">{win.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// 6. Goal Progress Rings
const GoalProgressRings = () => {
  const { user } = useAuth();
  const { userData } = useUserData();
  const [goalProgress, setGoalProgress] = useState<GoalProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const calculateGoals = async () => {
      try {
        setLoading(true);

        const [journals, tasks, habits] = await Promise.all([
          getJournalEntries(),
          fetchTasksFromServer(),
          getHabits(),
        ]);

        const thisWeekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
        const thisWeekEnd = endOfWeek(new Date(), { weekStartsOn: 0 });

        // Journal goal: 20 entries per month (5 per week)
        const thisWeekJournals = journals.filter((j) =>
          isWithinInterval(parseISO(j.date), {
            start: thisWeekStart,
            end: thisWeekEnd,
          })
        ).length;
        const journalTarget = 5;
        const journalPercentage = Math.min((thisWeekJournals / journalTarget) * 100, 100);

        // Task completion goal: 80%
        const completedTasks = tasks.filter((t) => t.completed).length;
        const totalTasks = tasks.length;
        const taskPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        // Habit consistency: Complete 5/7 days
        const activeHabits = habits.filter((h) => !h.isFullyCompleted);
        const habitsWithRecentActivity = activeHabits.filter((h) => h.streak >= 1).length;
        const habitTarget = Math.max(activeHabits.length, 1);
        const habitPercentage = (habitsWithRecentActivity / habitTarget) * 100;

        // XP goal: 1000 XP per week
        const thisWeekXP =
          thisWeekJournals * 30 +
          tasks.filter(
            (t) =>
              t.completed &&
              t.createdAt &&
              isWithinInterval(parseISO(t.createdAt), {
                start: thisWeekStart,
                end: thisWeekEnd,
              })
          ).length *
            20;
        const xpTarget = 1000;
        const xpPercentage = Math.min((thisWeekXP / xpTarget) * 100, 100);

        setGoalProgress({
          journals: {
            current: thisWeekJournals,
            target: journalTarget,
            percentage: journalPercentage,
          },
          tasks: {
            current: Math.round(taskPercentage),
            target: 80,
            percentage: Math.min(taskPercentage, 100),
          },
          habits: {
            current: habitsWithRecentActivity,
            target: habitTarget,
            percentage: habitPercentage,
          },
          xp: {
            current: thisWeekXP,
            target: xpTarget,
            percentage: xpPercentage,
          },
        });
      } catch (error) {
        console.error("Error calculating goal progress:", error);
      } finally {
        setLoading(false);
      }
    };

    calculateGoals();
  }, [user]);

  if (loading || !goalProgress) {
    return null;
  }

  const RingProgress = ({
    percentage,
    color,
    label,
    current,
    target,
  }: {
    percentage: number;
    color: string;
    label: string;
    current: number;
    target: number;
  }) => {
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke={color}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.round(percentage)}%</div>
            </div>
          </div>
        </div>
        <p className="text-sm font-medium mt-2">{label}</p>
        <p className="text-xs text-gray-500">
          {current}/{target}
        </p>
      </div>
    );
  };

  const allRingsClosed =
    goalProgress.journals.percentage >= 100 &&
    goalProgress.tasks.percentage >= 100 &&
    goalProgress.habits.percentage >= 100 &&
    goalProgress.xp.percentage >= 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Weekly Goals
          </div>
          {allRingsClosed && (
            <Badge className="bg-yellow-100 text-yellow-800">
              All Rings Closed! 🎉
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <RingProgress
            percentage={goalProgress.journals.percentage}
            color="#8b5cf6"
            label="Journals"
            current={goalProgress.journals.current}
            target={goalProgress.journals.target}
          />
          <RingProgress
            percentage={goalProgress.tasks.percentage}
            color="#3b82f6"
            label="Tasks"
            current={goalProgress.tasks.current}
            target={goalProgress.tasks.target}
          />
          <RingProgress
            percentage={goalProgress.habits.percentage}
            color="#10b981"
            label="Habits"
            current={goalProgress.habits.current}
            target={goalProgress.habits.target}
          />
          <RingProgress
            percentage={goalProgress.xp.percentage}
            color="#f59e0b"
            label="XP"
            current={goalProgress.xp.current}
            target={goalProgress.xp.target}
          />
        </div>
      </CardContent>
    </Card>
  );
};

// 7. Streak Heatmap Calendar (30-day version)
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

// 8. Achievement Ticker
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
            <p className="text-sm font-medium text-gray-700">Recent Achievement</p>
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
    </div>
  );
};

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
