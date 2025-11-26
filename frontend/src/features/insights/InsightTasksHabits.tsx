import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { CheckCircle, Target, Clock, TrendingUp, TrendingDown, AlertTriangle, Flame, Trophy, Calendar, Zap, Heart, BarChart3, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUserData } from "@/context/UserDataContext";
import { fetchTasksFromServer } from "@/services/taskService";
import { getHabits } from "@/services/HabitService";
import { getJournalEntries, JournalEntryResponse } from "@/services/JournalService";
import { Task } from "@/types/TaskType";
import { Habit } from "@/models/Habit";
import { parseISO, getHours, getDay, format, startOfWeek, endOfWeek, differenceInDays, subDays, isSameDay, startOfDay } from "date-fns";

interface HeatmapCell {
  hour: number;
  day: number;
  count: number;
  rate: number;
}

interface WeeklyRhythm {
  day: string;
  dayIndex: number;
  tasksCompleted: number;
  habitsCompleted: number;
  totalProductivity: number;
}

interface SynergyData {
  tasksWithHabits: number;
  tasksWithoutHabits: number;
  avgWithHabits: number;
  avgWithoutHabits: number;
  improvement: number;
}

interface BurnoutRisk {
  level: "low" | "medium" | "high";
  score: number;
  factors: string[];
  recommendations: string[];
}

interface MoodProductivityCorrelation {
  avgMoodWithTasks: number;
  avgMoodWithoutTasks: number;
  avgMoodWithHabits: number;
  avgMoodWithoutHabits: number;
  taskCorrelation: number;
  habitCorrelation: number;
}

interface PersonalRecord {
  label: string;
  value: number | string;
  date?: string;
  icon: string;
}

export const InsightTasksAndHabits = () => {
  const { user } = useAuth();
  const { userData } = useUserData();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapCell[]>([]);
  const [weeklyRhythm, setWeeklyRhythm] = useState<WeeklyRhythm[]>([]);
  const [synergyData, setSynergyData] = useState<SynergyData | null>(null);
  const [burnoutRisk, setBurnoutRisk] = useState<BurnoutRisk | null>(null);
  const [moodCorrelation, setMoodCorrelation] = useState<MoodProductivityCorrelation | null>(null);
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([]);
  const [overcommitment, setOvercommitment] = useState<{ warning: boolean; created: number; completed: number } | null>(null);

  // Mood scoring system
  const MOOD_SCORES: { [key: string]: number } = {
    happy: 9, excited: 10, motivated: 9, grateful: 9, confident: 8,
    hopeful: 8, relaxed: 7, calm: 6, neutral: 5, tired: 4,
    anxious: 3, overwhelmed: 3, sad: 2, lonely: 2, angry: 2,
  };

  const getMoodScore = (mood: string): number => {
    return MOOD_SCORES[mood?.toLowerCase()] || 5;
  };

  useEffect(() => {
    if (!user) return;

    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [tasksData, habitsData, journalsData] = await Promise.all([
          fetchTasksFromServer(),
          getHabits(),
          getJournalEntries(),
        ]);

        setTasks(tasksData);
        setHabits(habitsData);

        // Calculate all metrics
        calculateHeatmap(tasksData);
        calculateWeeklyRhythm(tasksData, habitsData);
        calculateSynergy(tasksData, habitsData);
        calculateBurnoutRisk(tasksData, habitsData);
        calculateMoodCorrelation(tasksData, habitsData, journalsData);
        calculatePersonalRecords(tasksData, habitsData);
        calculateOvercommitment(tasksData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [user]);

  // 1. Task Completion Time Heatmap
  const calculateHeatmap = (tasksData: Task[]) => {
    const heatmap: { [key: string]: { count: number; completed: number } } = {};

    tasksData.forEach((task) => {
      if (task.createdAt && task.completed) {
        const date = parseISO(task.createdAt);
        const hour = getHours(date);
        const day = getDay(date); // 0 = Sunday, 6 = Saturday
        const key = `${day}-${hour}`;

        if (!heatmap[key]) {
          heatmap[key] = { count: 0, completed: 0 };
        }
        heatmap[key].count++;
        heatmap[key].completed++;
      }
    });

    const cells: HeatmapCell[] = [];
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        const key = `${day}-${hour}`;
        const data = heatmap[key] || { count: 0, completed: 0 };
        const rate = data.count > 0 ? (data.completed / data.count) * 100 : 0;
        cells.push({ hour, day, count: data.count, rate });
      }
    }

    setHeatmapData(cells);
  };

  // 2. Habit Consistency Calendar (last 30 days)
  const getHabitCalendarData = () => {
    const today = new Date();
    const days = [];

    for (let i = 29; i >= 0; i--) {
      const date = subDays(today, i);
      days.push(date);
    }

    return days;
  };

  // 3. Task-Habit Synergy Score
  const calculateSynergy = (tasksData: Task[], habitsData: Habit[]) => {
    const daysWithHabits = new Set<string>();
    const daysWithTasks = new Set<string>();
    const taskCountByDay: { [key: string]: number } = {};

    habitsData.forEach((habit) => {
      if (habit.lastCompleted) {
        const dateKey = format(parseISO(habit.lastCompleted), "yyyy-MM-dd");
        daysWithHabits.add(dateKey);
      }
    });

    tasksData.filter(task => task.completed).forEach((task) => {
      if (task.createdAt) {
        const dateKey = format(parseISO(task.createdAt), "yyyy-MM-dd");
        daysWithTasks.add(dateKey);
        taskCountByDay[dateKey] = (taskCountByDay[dateKey] || 0) + 1;
      }
    });

    const daysWithBoth: number[] = [];
    const daysWithoutHabits: number[] = [];

    Object.entries(taskCountByDay).forEach(([date, count]) => {
      if (daysWithHabits.has(date)) {
        daysWithBoth.push(count);
      } else {
        daysWithoutHabits.push(count);
      }
    });

    const avgWithHabits = daysWithBoth.length > 0
      ? daysWithBoth.reduce((a, b) => a + b, 0) / daysWithBoth.length
      : 0;
    const avgWithoutHabits = daysWithoutHabits.length > 0
      ? daysWithoutHabits.reduce((a, b) => a + b, 0) / daysWithoutHabits.length
      : 0;

    const improvement = avgWithoutHabits > 0
      ? Math.round(((avgWithHabits - avgWithoutHabits) / avgWithoutHabits) * 100)
      : 0;

    setSynergyData({
      tasksWithHabits: daysWithBoth.length,
      tasksWithoutHabits: daysWithoutHabits.length,
      avgWithHabits: Math.round(avgWithHabits * 10) / 10,
      avgWithoutHabits: Math.round(avgWithoutHabits * 10) / 10,
      improvement,
    });
  };

  // 5. Weekly Rhythm Analysis
  const calculateWeeklyRhythm = (tasksData: Task[], habitsData: Habit[]) => {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const rhythm: { [key: number]: { tasks: number; habits: number } } = {};

    for (let i = 0; i < 7; i++) {
      rhythm[i] = { tasks: 0, habits: 0 };
    }

    tasksData.filter(t => t.completed && t.createdAt).forEach((task) => {
      const day = getDay(parseISO(task.createdAt!));
      rhythm[day].tasks++;
    });

    habitsData.forEach((habit) => {
      if (habit.lastCompleted) {
        const day = getDay(parseISO(habit.lastCompleted));
        rhythm[day].habits++;
      }
    });

    const weeklyData: WeeklyRhythm[] = dayNames.map((name, index) => ({
      day: name,
      dayIndex: index,
      tasksCompleted: rhythm[index].tasks,
      habitsCompleted: rhythm[index].habits,
      totalProductivity: rhythm[index].tasks + rhythm[index].habits,
    }));

    setWeeklyRhythm(weeklyData);
  };

  // 6. Burnout Risk Indicator
  const calculateBurnoutRisk = (tasksData: Task[], habitsData: Habit[]) => {
    const last7Days = subDays(new Date(), 7);
    const last14Days = subDays(new Date(), 14);

    const recentTasks = tasksData.filter(t => t.createdAt && parseISO(t.createdAt) >= last7Days);
    const previousTasks = tasksData.filter(t => t.createdAt && parseISO(t.createdAt) >= last14Days && parseISO(t.createdAt) < last7Days);

    const recentCompletionRate = recentTasks.length > 0
      ? (recentTasks.filter(t => t.completed).length / recentTasks.length) * 100
      : 100;
    const previousCompletionRate = previousTasks.length > 0
      ? (previousTasks.filter(t => t.completed).length / previousTasks.length) * 100
      : 100;

    const decline = previousCompletionRate - recentCompletionRate;

    const activeHabitsWithLowStreak = habitsData.filter(h => !h.isFullyCompleted && h.streak < 3).length;
    const totalActiveHabits = habitsData.filter(h => !h.isFullyCompleted).length;

    const factors: string[] = [];
    const recommendations: string[] = [];
    let score = 0;

    if (decline > 20) {
      factors.push("Task completion dropped 20%+ this week");
      recommendations.push("Consider reducing your task load");
      score += 30;
    } else if (decline > 10) {
      factors.push("Task completion declining");
      score += 15;
    }

    if (activeHabitsWithLowStreak > totalActiveHabits * 0.5) {
      factors.push("Multiple habit streaks are struggling");
      recommendations.push("Focus on 2-3 core habits only");
      score += 25;
    }

    const pendingTasks = tasksData.filter(t => !t.completed).length;
    if (pendingTasks > 20) {
      factors.push("High number of pending tasks");
      recommendations.push("Archive or delete old tasks");
      score += 20;
    }

    if (recentTasks.length > 30) {
      factors.push("Creating tasks faster than completing");
      recommendations.push("Limit new task creation this week");
      score += 15;
    }

    const level: "low" | "medium" | "high" = score >= 50 ? "high" : score >= 25 ? "medium" : "low";

    if (level === "low") {
      recommendations.push("You're doing great! Keep up the momentum");
    }

    setBurnoutRisk({ level, score, factors, recommendations });
  };

  // 7. Productivity × Mood Correlation
  const calculateMoodCorrelation = async (tasksData: Task[], habitsData: Habit[], journalsData: JournalEntryResponse[]) => {
    const moodByDate: { [key: string]: number[] } = {};

    journalsData.forEach((entry) => {
      const dateKey = format(parseISO(entry.createdAt), "yyyy-MM-dd");
      const score = getMoodScore(entry.mood);
      if (!moodByDate[dateKey]) {
        moodByDate[dateKey] = [];
      }
      moodByDate[dateKey].push(score);
    });

    const daysWithTasks = new Set<string>();
    const daysWithHabits = new Set<string>();

    tasksData.filter(t => t.completed && t.createdAt).forEach((task) => {
      const dateKey = format(parseISO(task.createdAt!), "yyyy-MM-dd");
      daysWithTasks.add(dateKey);
    });

    habitsData.forEach((habit) => {
      if (habit.lastCompleted) {
        const dateKey = format(parseISO(habit.lastCompleted), "yyyy-MM-dd");
        daysWithHabits.add(dateKey);
      }
    });

    const moodsWithTasks: number[] = [];
    const moodsWithoutTasks: number[] = [];
    const moodsWithHabits: number[] = [];
    const moodsWithoutHabits: number[] = [];

    Object.entries(moodByDate).forEach(([date, scores]) => {
      const avgMood = scores.reduce((a, b) => a + b, 0) / scores.length;

      if (daysWithTasks.has(date)) {
        moodsWithTasks.push(avgMood);
      } else {
        moodsWithoutTasks.push(avgMood);
      }

      if (daysWithHabits.has(date)) {
        moodsWithHabits.push(avgMood);
      } else {
        moodsWithoutHabits.push(avgMood);
      }
    });

    const avgMoodWithTasks = moodsWithTasks.length > 0
      ? moodsWithTasks.reduce((a, b) => a + b, 0) / moodsWithTasks.length
      : 0;
    const avgMoodWithoutTasks = moodsWithoutTasks.length > 0
      ? moodsWithoutTasks.reduce((a, b) => a + b, 0) / moodsWithoutTasks.length
      : 0;
    const avgMoodWithHabits = moodsWithHabits.length > 0
      ? moodsWithHabits.reduce((a, b) => a + b, 0) / moodsWithHabits.length
      : 0;
    const avgMoodWithoutHabits = moodsWithoutHabits.length > 0
      ? moodsWithoutHabits.reduce((a, b) => a + b, 0) / moodsWithoutHabits.length
      : 0;

    const taskCorrelation = avgMoodWithoutTasks > 0
      ? Math.round(((avgMoodWithTasks - avgMoodWithoutTasks) / avgMoodWithoutTasks) * 100)
      : 0;
    const habitCorrelation = avgMoodWithoutHabits > 0
      ? Math.round(((avgMoodWithHabits - avgMoodWithoutHabits) / avgMoodWithoutHabits) * 100)
      : 0;

    setMoodCorrelation({
      avgMoodWithTasks,
      avgMoodWithoutTasks,
      avgMoodWithHabits,
      avgMoodWithoutHabits,
      taskCorrelation,
      habitCorrelation,
    });
  };

  // 8. Goal Achievement Projection (handled in rendering for each habit)

  // 9. Personal Records Dashboard
  const calculatePersonalRecords = (tasksData: Task[], habitsData: Habit[]) => {
    const records: PersonalRecord[] = [];

    // Most tasks completed in a day
    const tasksByDay: { [key: string]: number } = {};
    tasksData.filter(t => t.completed && t.createdAt).forEach((task) => {
      const dateKey = format(parseISO(task.createdAt!), "yyyy-MM-dd");
      tasksByDay[dateKey] = (tasksByDay[dateKey] || 0) + 1;
    });

    const maxTasks = Math.max(...Object.values(tasksByDay), 0);
    const maxTasksDate = Object.entries(tasksByDay).find(([_, count]) => count === maxTasks)?.[0];

    records.push({
      label: "Most Tasks in One Day",
      value: maxTasks,
      date: maxTasksDate ? format(parseISO(maxTasksDate), "MMM dd, yyyy") : undefined,
      icon: "🏆",
    });

    // Longest habit streak
    const maxStreak = Math.max(...habitsData.map(h => h.streak), 0);
    const maxStreakHabit = habitsData.find(h => h.streak === maxStreak);

    records.push({
      label: "Longest Habit Streak",
      value: `${maxStreak} days`,
      date: maxStreakHabit?.title,
      icon: "🔥",
    });

    // Total tasks completed
    const totalCompleted = tasksData.filter(t => t.completed).length;
    records.push({
      label: "Total Tasks Completed",
      value: totalCompleted,
      icon: "✅",
    });

    // Current active streaks
    const activeStreaks = habitsData.filter(h => h.streak > 0).length;
    records.push({
      label: "Active Habit Streaks",
      value: activeStreaks,
      icon: "⚡",
    });

    setPersonalRecords(records);
  };

  // 10. Overcommitment Detector
  const calculateOvercommitment = (tasksData: Task[]) => {
    const last7Days = subDays(new Date(), 7);
    const recentTasks = tasksData.filter(t => t.createdAt && parseISO(t.createdAt) >= last7Days);

    const created = recentTasks.length;
    const completed = recentTasks.filter(t => t.completed).length;
    const warning = created > completed * 1.5; // Creating 50% more than completing

    setOvercommitment({ warning, created, completed });
  };

  const getHeatmapColor = (count: number): string => {
    if (count === 0) return "bg-gray-100";
    if (count <= 2) return "bg-green-200";
    if (count <= 4) return "bg-green-400";
    return "bg-green-600";
  };

  const getDayName = (dayIndex: number): string => {
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayIndex];
  };

  const getBurnoutColor = (level: string) => {
    switch (level) {
      case "high": return { bg: "bg-red-50", text: "text-red-900", badge: "bg-red-500" };
      case "medium": return { bg: "bg-yellow-50", text: "text-yellow-900", badge: "bg-yellow-500" };
      default: return { bg: "bg-green-50", text: "text-green-900", badge: "bg-green-500" };
    }
  };

  if (!userData) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading productivity insights...</p>
        </div>
      </div>
    );
  }

  const burnoutColors = burnoutRisk ? getBurnoutColor(burnoutRisk.level) : getBurnoutColor("low");
  const bestDay = weeklyRhythm.length > 0 ? weeklyRhythm.reduce((best, curr) => curr.totalProductivity > best.totalProductivity ? curr : best) : null;

  return (
    <div className="space-y-6">
      {/* Burnout Risk Indicator */}
      {burnoutRisk && (
        <Card className={`border-2 ${burnoutRisk.level === "high" ? "border-red-300" : burnoutRisk.level === "medium" ? "border-yellow-300" : "border-green-300"}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Burnout Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className={`flex-1 p-4 rounded-lg ${burnoutColors.bg}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-2xl font-bold ${burnoutColors.text}`}>
                        {burnoutRisk.level.toUpperCase()} RISK
                      </p>
                      <p className="text-sm text-gray-600">Burnout Score: {burnoutRisk.score}/100</p>
                    </div>
                    <Badge className={burnoutColors.badge}>
                      {burnoutRisk.level === "low" ? "✓ Healthy" : burnoutRisk.level === "medium" ? "⚠ Caution" : "⛔ Alert"}
                    </Badge>
                  </div>
                  <Progress value={burnoutRisk.score} className="h-2 mt-3" />
                </div>
              </div>
              {burnoutRisk.factors.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Risk Factors:</h4>
                  <div className="space-y-1">
                    {burnoutRisk.factors.map((factor, index) => (
                      <p key={index} className="text-sm text-gray-700 flex items-center gap-2">
                        <span className="text-orange-500">•</span> {factor}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              {burnoutRisk.recommendations.length > 0 && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-sm text-blue-900 mb-2">💡 Recommendations:</h4>
                  <div className="space-y-1">
                    {burnoutRisk.recommendations.map((rec, index) => (
                      <p key={index} className="text-sm text-blue-800">
                        {rec}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Personal Records Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Personal Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {personalRecords.map((record, index) => (
              <div key={index} className="text-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg">
                <p className="text-3xl mb-2">{record.icon}</p>
                <p className="text-2xl font-bold text-indigo-900">{record.value}</p>
                <p className="text-xs text-gray-600 mt-1">{record.label}</p>
                {record.date && (
                  <p className="text-xs text-gray-500 mt-1">{record.date}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Overcommitment Detector */}
      {overcommitment && overcommitment.warning && (
        <Card className="border-2 border-orange-300 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <AlertTriangle className="h-5 w-5" />
              Overcommitment Warning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-orange-800">
                ⚠️ You're creating tasks faster than completing them. This can lead to overwhelm.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-2xl font-bold text-orange-900">{overcommitment.created}</p>
                  <p className="text-xs text-gray-600">Tasks Created (7 days)</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-2xl font-bold text-green-900">{overcommitment.completed}</p>
                  <p className="text-xs text-gray-600">Tasks Completed (7 days)</p>
                </div>
              </div>
              <p className="text-sm text-orange-700 bg-white p-3 rounded-lg">
                💡 Try limiting yourself to {Math.max(3, overcommitment.completed)} new tasks per day this week.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task-Habit Synergy Score */}
      {synergyData && (
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              Task-Habit Synergy Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <p className="text-5xl font-bold text-purple-600 mb-2">
                  {synergyData.improvement > 0 ? "+" : ""}{synergyData.improvement}%
                </p>
                <p className="text-sm text-gray-700">
                  More tasks completed on days you complete habits
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <p className="text-sm font-medium">With Habits</p>
                  </div>
                  <p className="text-3xl font-bold text-green-600">{synergyData.avgWithHabits}</p>
                  <p className="text-xs text-gray-500">avg tasks/day</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-gray-400" />
                    <p className="text-sm font-medium">Without Habits</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-600">{synergyData.avgWithoutHabits}</p>
                  <p className="text-xs text-gray-500">avg tasks/day</p>
                </div>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg">
                <p className="text-sm text-purple-900 text-center">
                  💪 <strong>Insight:</strong> Your habits are boosting your productivity! Completing habits helps you finish {synergyData.improvement}% more tasks.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Productivity × Mood Correlation */}
      {moodCorrelation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-500" />
              Productivity × Mood Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Task Impact on Mood</h4>
                  <p className="text-3xl font-bold text-green-600 mb-1">
                    {moodCorrelation.taskCorrelation > 0 ? "+" : ""}{moodCorrelation.taskCorrelation}%
                  </p>
                  <p className="text-xs text-gray-600">
                    Mood improvement on days with completed tasks
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Habit Impact on Mood</h4>
                  <p className="text-3xl font-bold text-purple-600 mb-1">
                    {moodCorrelation.habitCorrelation > 0 ? "+" : ""}{moodCorrelation.habitCorrelation}%
                  </p>
                  <p className="text-xs text-gray-600">
                    Mood improvement on days with habit completion
                  </p>
                </div>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-900 text-center">
                  ❤️ <strong>Mental Health Benefit:</strong> Staying productive directly improves your emotional well-being by {Math.max(moodCorrelation.taskCorrelation, moodCorrelation.habitCorrelation)}%!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task Completion Time Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Task Completion Time Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Shows when you complete tasks most successfully</p>
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                <div className="flex gap-1 mb-2">
                  <div className="w-12"></div>
                  {[...Array(24)].map((_, hour) => (
                    <div key={hour} className="w-6 text-xs text-center text-gray-500">
                      {hour % 3 === 0 ? hour : ""}
                    </div>
                  ))}
                </div>
                {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                  <div key={day} className="flex gap-1 mb-1">
                    <div className="w-12 text-xs flex items-center text-gray-600">
                      {getDayName(day)}
                    </div>
                    {[...Array(24)].map((_, hour) => {
                      const cell = heatmapData.find(c => c.day === day && c.hour === hour);
                      return (
                        <div
                          key={hour}
                          className={`w-6 h-6 rounded-sm ${getHeatmapColor(cell?.count || 0)} hover:ring-2 hover:ring-indigo-400 transition-all cursor-pointer`}
                          title={`${getDayName(day)} ${hour}:00 - ${cell?.count || 0} tasks completed`}
                        ></div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-4 h-4 rounded-sm bg-gray-100"></div>
                <div className="w-4 h-4 rounded-sm bg-green-200"></div>
                <div className="w-4 h-4 rounded-sm bg-green-400"></div>
                <div className="w-4 h-4 rounded-sm bg-green-600"></div>
              </div>
              <span>More</span>
            </div>
            {bestDay && (
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-800 text-center">
                  ⚡ <strong>Peak Day:</strong> {bestDay.day}s are your most productive day!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Habit Consistency Calendar & Best Streak Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Habit Consistency (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {habits.slice(0, 3).map((habit) => (
                <div key={habit.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{habit.title}</p>
                    <Badge variant="outline">{habit.streak} day streak</Badge>
                  </div>
                  <div className="flex gap-1">
                    {getHabitCalendarData().map((date, index) => {
                      const isCompleted = habit.lastCompleted && isSameDay(parseISO(habit.lastCompleted), date);
                      return (
                        <div
                          key={index}
                          className={`w-2 h-6 rounded-sm ${isCompleted ? "bg-green-500" : "bg-gray-200"}`}
                          title={format(date, "MMM dd")}
                        ></div>
                      );
                    })}
                  </div>
                </div>
              ))}
              {habits.length === 0 && (
                <p className="text-center text-gray-500 py-8">Create habits to see consistency tracking!</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Best Streak Tracker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {habits.filter(h => h.streak > 0).slice(0, 5).map((habit) => (
                <div key={habit.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{habit.title}</p>
                    <p className="text-xs text-gray-600">Current streak</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-orange-600">{habit.streak}</p>
                    <p className="text-xs text-gray-500">days</p>
                  </div>
                </div>
              ))}
              {habits.filter(h => h.streak > 0).length === 0 && (
                <p className="text-center text-gray-500 py-8">Complete habits to start building streaks!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Rhythm Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Weekly Rhythm Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2">
              {weeklyRhythm.map((day) => {
                const maxProductivity = Math.max(...weeklyRhythm.map(d => d.totalProductivity), 1);
                const height = Math.max((day.totalProductivity / maxProductivity) * 100, 5);
                const isBest = bestDay && day.day === bestDay.day;

                return (
                  <div key={day.day} className="text-center">
                    <div className="relative h-32 flex items-end justify-center mb-2">
                      <div
                        className={`w-full rounded-t-lg ${isBest ? "bg-gradient-to-t from-purple-500 to-indigo-500" : "bg-gradient-to-t from-blue-400 to-blue-300"}`}
                        style={{ height: `${height}%` }}
                      ></div>
                      <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                        <p className="text-xs font-bold text-white">{day.totalProductivity}</p>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-gray-700">{day.day.slice(0, 3)}</p>
                    <div className="text-xs text-gray-500 mt-1">
                      <p>T: {day.tasksCompleted}</p>
                      <p>H: {day.habitsCompleted}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            {bestDay && (
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-900 text-center">
                  📊 <strong>Your Weekly Pattern:</strong> {bestDay.day}s are your power days! Consider scheduling important tasks then.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Goal Achievement Projection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Goal Achievement Projection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {habits.filter(h => !h.isFullyCompleted && h.targetCompletions > 0).slice(0, 5).map((habit) => {
              const progress = (habit.currentCompletions / habit.targetCompletions) * 100;
              const remaining = habit.targetCompletions - habit.currentCompletions;
              const daysPerCompletion = habit.frequency === "daily" ? 1 : habit.frequency === "weekly" ? 7 : 30;
              const estimatedDays = remaining * daysPerCompletion;

              return (
                <div key={habit.id} className="space-y-2 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{habit.title}</p>
                      <p className="text-xs text-gray-600">
                        {habit.currentCompletions} / {habit.targetCompletions} completions
                      </p>
                    </div>
                    <Badge className={progress >= 75 ? "bg-green-500" : progress >= 50 ? "bg-yellow-500" : "bg-blue-500"}>
                      {Math.round(progress)}%
                    </Badge>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-gray-600">
                    🎯 Est. completion: <strong>{estimatedDays} days</strong> ({remaining} {habit.frequency} sessions)
                  </p>
                  {progress >= 90 && (
                    <p className="text-xs text-green-600 font-medium">
                      🌟 Almost there! Just {remaining} more to go!
                    </p>
                  )}
                </div>
              );
            })}
            {habits.filter(h => !h.isFullyCompleted && h.targetCompletions > 0).length === 0 && (
              <p className="text-center text-gray-500 py-8">Create habits with target completions to see projections!</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
