import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MessageSquare,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Award,
  Users,
  Target,
  Zap,
  BookOpen,
  Flame,
  Trophy,
  Star,
  Crown,
  Medal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUserData } from "@/context/UserDataContext";
import { useEffect, useState } from "react";
import {
  getJournalEntries,
  JournalEntryResponse,
} from "@/services/JournalService";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  subMonths,
  eachDayOfInterval,
  isSameDay,
  getHours,
  startOfWeek,
  endOfWeek,
  differenceInCalendarDays,
  subDays,
} from "date-fns";
import { Progress } from "@/components/ui/progress";

interface TimeSlotData {
  hour: number;
  label: string;
  count: number;
  avgMoodScore: number;
}

interface MonthComparison {
  thisMonth: {
    count: number;
    totalWords: number;
    avgWords: number;
    uniqueMoods: number;
    streak: number;
  };
  lastMonth: {
    count: number;
    totalWords: number;
    avgWords: number;
    uniqueMoods: number;
    streak: number;
  };
  changes: {
    countChange: number;
    wordsChange: number;
    avgWordsChange: number;
    moodsChange: number;
    streakChange: number;
  };
}

interface JournalTypeStats {
  type: string;
  count: number;
  avgWords: number;
  avgMoodScore: number;
  percentage: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  achieved: boolean;
  progress?: number;
  target?: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export const InsightJournal = () => {
  const { userData } = useUserData();
  const [entries, setEntries] = useState<JournalEntryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [heatmapData, setHeatmapData] = useState<
    { date: Date; count: number }[]
  >([]);
  const [optimalTime, setOptimalTime] = useState<TimeSlotData | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlotData[]>([]);
  const [monthComparison, setMonthComparison] =
    useState<MonthComparison | null>(null);
  const [typeStats, setTypeStats] = useState<JournalTypeStats[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [journalGoal, setJournalGoal] = useState({ target: 20, current: 0 }); // 20 entries per month goal

  // Mood scoring system (same as InsightMoodTrends)
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

  const getMoodScore = (mood: string): number => {
    return MOOD_SCORES[mood?.toLowerCase()] || 5;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getJournalEntries();
        setEntries(data);
        calculateHeatmapData(data);
        calculateOptimalTime(data);
        calculateMonthComparison(data);
        calculateTypeEffectiveness(data);
        calculateGoalProgress(data);
      } catch (error) {
        console.error("Error fetching journal entries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateHeatmapData = (data: JournalEntryResponse[]) => {
    const today = new Date();
    const startDate = subDays(today, 364); // Last 365 days
    const days = eachDayOfInterval({ start: startDate, end: today });

    const heatmap = days.map((day) => {
      const count = data.filter((entry) =>
        isSameDay(parseISO(entry.createdAt), day)
      ).length;
      return { date: day, count };
    });

    setHeatmapData(heatmap);
  };

  const calculateOptimalTime = (data: JournalEntryResponse[]) => {
    // Group entries by hour of day
    const timeSlotMap: {
      [hour: number]: { count: number; totalMoodScore: number };
    } = {};

    data.forEach((entry) => {
      if (entry.createdAt) {
        const hour = getHours(parseISO(entry.createdAt));
        if (!timeSlotMap[hour]) {
          timeSlotMap[hour] = { count: 0, totalMoodScore: 0 };
        }
        timeSlotMap[hour].count++;
        timeSlotMap[hour].totalMoodScore += getMoodScore(entry.mood);
      }
    });

    // Create time slots with labels
    const slots: TimeSlotData[] = Object.entries(timeSlotMap).map(
      ([hour, data]) => {
        const hourNum = parseInt(hour);
        let label = "";
        if (hourNum >= 5 && hourNum < 12) label = "Morning";
        else if (hourNum >= 12 && hourNum < 17) label = "Afternoon";
        else if (hourNum >= 17 && hourNum < 21) label = "Evening";
        else label = "Night";

        return {
          hour: hourNum,
          label,
          count: data.count,
          avgMoodScore: data.count > 0 ? data.totalMoodScore / data.count : 0,
        };
      }
    );

    slots.sort((a, b) => b.avgMoodScore - a.avgMoodScore);
    setTimeSlots(slots);
    setOptimalTime(slots[0] || null);
  };

  const calculateMonthComparison = (data: JournalEntryResponse[]) => {
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const thisMonthEntries = data.filter((entry) => {
      const date = parseISO(entry.createdAt);
      return date >= thisMonthStart && date <= thisMonthEnd;
    });

    const lastMonthEntries = data.filter((entry) => {
      const date = parseISO(entry.createdAt);
      return date >= lastMonthStart && date <= lastMonthEnd;
    });

    const calculateStats = (entries: JournalEntryResponse[]) => {
      const count = entries.length;
      const totalWords = entries.reduce(
        (sum, e) => sum + (e.wordCount || 0),
        0
      );
      const avgWords = count > 0 ? Math.round(totalWords / count) : 0;
      const uniqueMoods = new Set(entries.map((e) => e.mood)).size;

      // Calculate streak for the month
      const sortedDates = entries
        .map((e) => parseISO(e.createdAt))
        .sort((a, b) => a.getTime() - b.getTime());
      let streak = 0;
      let currentStreak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const daysDiff = differenceInCalendarDays(
          sortedDates[i],
          sortedDates[i - 1]
        );
        if (daysDiff === 1) {
          currentStreak++;
        } else if (daysDiff > 1) {
          streak = Math.max(streak, currentStreak);
          currentStreak = 1;
        }
      }
      streak = Math.max(streak, currentStreak);

      return { count, totalWords, avgWords, uniqueMoods, streak };
    };

    const thisMonth = calculateStats(thisMonthEntries);
    const lastMonth = calculateStats(lastMonthEntries);

    const changes = {
      countChange:
        lastMonth.count > 0
          ? Math.round(
              ((thisMonth.count - lastMonth.count) / lastMonth.count) * 100
            )
          : 0,
      wordsChange:
        lastMonth.totalWords > 0
          ? Math.round(
              ((thisMonth.totalWords - lastMonth.totalWords) /
                lastMonth.totalWords) *
                100
            )
          : 0,
      avgWordsChange:
        lastMonth.avgWords > 0
          ? Math.round(
              ((thisMonth.avgWords - lastMonth.avgWords) / lastMonth.avgWords) *
                100
            )
          : 0,
      moodsChange: thisMonth.uniqueMoods - lastMonth.uniqueMoods,
      streakChange: thisMonth.streak - lastMonth.streak,
    };

    setMonthComparison({ thisMonth, lastMonth, changes });
  };

  const calculateTypeEffectiveness = (data: JournalEntryResponse[]) => {
    const typeMap: {
      [type: string]: {
        count: number;
        totalWords: number;
        totalMoodScore: number;
      };
    } = {};

    data.forEach((entry) => {
      const type = entry.type || "free-writing";
      if (!typeMap[type]) {
        typeMap[type] = { count: 0, totalWords: 0, totalMoodScore: 0 };
      }
      typeMap[type].count++;
      typeMap[type].totalWords += entry.wordCount || 0;
      typeMap[type].totalMoodScore += getMoodScore(entry.mood);
    });

    const total = data.length;
    const stats: JournalTypeStats[] = Object.entries(typeMap).map(
      ([type, data]) => ({
        type,
        count: data.count,
        avgWords: Math.round(data.totalWords / data.count),
        avgMoodScore: data.totalMoodScore / data.count,
        percentage: Math.round((data.count / total) * 100),
      })
    );

    stats.sort((a, b) => b.avgMoodScore - a.avgMoodScore);
    setTypeStats(stats);
  };

  const calculateGoalProgress = (data: JournalEntryResponse[]) => {
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);

    const thisMonthCount = data.filter((entry) => {
      const date = parseISO(entry.createdAt);
      return date >= thisMonthStart && date <= thisMonthEnd;
    }).length;

    setJournalGoal({ target: 20, current: thisMonthCount });
  };

  const getHeatmapColor = (count: number): string => {
    if (count === 0) return "bg-gray-100";
    if (count === 1) return "bg-indigo-200";
    if (count === 2) return "bg-indigo-400";
    if (count >= 3) return "bg-indigo-600";
    return "bg-gray-100";
  };

  const getRarityColor = (rarity: string): string => {
    switch (rarity) {
      case "common":
        return "border-gray-400 bg-gray-50";
      case "rare":
        return "border-blue-400 bg-blue-50";
      case "epic":
        return "border-purple-400 bg-purple-50";
      case "legendary":
        return "border-yellow-400 bg-yellow-50";
      default:
        return "border-gray-400 bg-gray-50";
    }
  };

  const getRarityBadgeColor = (rarity: string): string => {
    switch (rarity) {
      case "common":
        return "bg-gray-500";
      case "rare":
        return "bg-blue-500";
      case "epic":
        return "bg-purple-500";
      case "legendary":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  // Community benchmarks (anonymous aggregated data)
  const communityBenchmarks = {
    avgEntriesPerMonth: 15,
    avgWordsPerEntry: 180,
    avgStreak: 4.2,
    topPercentileEntries: 25, // Top 10% users write 25+ entries/month
    topPercentileWords: 300, // Top 10% users average 300+ words/entry
  };

  const getUserPercentile = (
    userValue: number,
    avgValue: number,
    topValue: number
  ): number => {
    if (userValue >= topValue) return 90;
    if (userValue >= avgValue)
      return 50 + ((userValue - avgValue) / (topValue - avgValue)) * 40;
    return (userValue / avgValue) * 50;
  };

  if (!userData) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading journal insights...</p>
        </div>
      </div>
    );
  }

  const thisMonthCount = monthComparison?.thisMonth.count || 0;
  const avgWords = userData.journalStats?.averageEntryLength || 0;
  const userStreak = userData.streak || 0;

  const entriesPercentile = Math.round(
    getUserPercentile(
      thisMonthCount,
      communityBenchmarks.avgEntriesPerMonth,
      communityBenchmarks.topPercentileEntries
    )
  );
  const wordsPercentile = Math.round(
    getUserPercentile(
      avgWords,
      communityBenchmarks.avgWordsPerEntry,
      communityBenchmarks.topPercentileWords
    )
  );
  const streakPercentile = Math.round(
    getUserPercentile(userStreak, communityBenchmarks.avgStreak, 14)
  );

  return (
    <div className="space-y-6">
      {/* Goal Tracking Dashboard */}
      <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-600" />
            Monthly Goal Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-indigo-600">
                  {journalGoal.current} / {journalGoal.target}
                </p>
                <p className="text-sm text-gray-600">Entries this month</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round((journalGoal.current / journalGoal.target) * 100)}
                  %
                </p>
                <p className="text-sm text-gray-600">Complete</p>
              </div>
            </div>
            <Progress
              value={(journalGoal.current / journalGoal.target) * 100}
              className="h-3"
            />
            {journalGoal.current >= journalGoal.target ? (
              <p className="text-sm text-green-600 font-medium flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Goal achieved! You're on fire this month! 🎉
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                {journalGoal.target - journalGoal.current} more entries to reach
                your goal
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* This Month vs Last Month */}
      {monthComparison && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Month-Over-Month Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <p className="text-2xl font-bold text-indigo-900">
                  {monthComparison.thisMonth.count}
                </p>
                <p className="text-xs text-gray-600 mb-1">Entries</p>
                {monthComparison.changes.countChange !== 0 && (
                  <Badge
                    className={
                      monthComparison.changes.countChange > 0
                        ? "bg-green-500"
                        : "bg-red-500"
                    }
                  >
                    {monthComparison.changes.countChange > 0 ? "+" : ""}
                    {monthComparison.changes.countChange}%
                  </Badge>
                )}
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-900">
                  {monthComparison.thisMonth.totalWords.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600 mb-1">Total Words</p>
                {monthComparison.changes.wordsChange !== 0 && (
                  <Badge
                    className={
                      monthComparison.changes.wordsChange > 0
                        ? "bg-green-500"
                        : "bg-red-500"
                    }
                  >
                    {monthComparison.changes.wordsChange > 0 ? "+" : ""}
                    {monthComparison.changes.wordsChange}%
                  </Badge>
                )}
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-900">
                  {monthComparison.thisMonth.avgWords}
                </p>
                <p className="text-xs text-gray-600 mb-1">Avg Words</p>
                {monthComparison.changes.avgWordsChange !== 0 && (
                  <Badge
                    className={
                      monthComparison.changes.avgWordsChange > 0
                        ? "bg-green-500"
                        : "bg-red-500"
                    }
                  >
                    {monthComparison.changes.avgWordsChange > 0 ? "+" : ""}
                    {monthComparison.changes.avgWordsChange}%
                  </Badge>
                )}
              </div>
              <div className="text-center p-4 bg-teal-50 rounded-lg">
                <p className="text-2xl font-bold text-teal-900">
                  {monthComparison.thisMonth.uniqueMoods}
                </p>
                <p className="text-xs text-gray-600 mb-1">Unique Moods</p>
                {monthComparison.changes.moodsChange !== 0 && (
                  <Badge
                    className={
                      monthComparison.changes.moodsChange > 0
                        ? "bg-green-500"
                        : "bg-red-500"
                    }
                  >
                    {monthComparison.changes.moodsChange > 0 ? "+" : ""}
                    {monthComparison.changes.moodsChange}
                  </Badge>
                )}
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-900">
                  {monthComparison.thisMonth.streak}
                </p>
                <p className="text-xs text-gray-600 mb-1">Best Streak</p>
                {monthComparison.changes.streakChange !== 0 && (
                  <Badge
                    className={
                      monthComparison.changes.streakChange > 0
                        ? "bg-green-500"
                        : "bg-red-500"
                    }
                  >
                    {monthComparison.changes.streakChange > 0 ? "+" : ""}
                    {monthComparison.changes.streakChange}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar Heat Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Journaling Activity - Last 12 Months
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {heatmapData.length > 0 ? (
              <>
                <div className="overflow-x-auto pb-4">
                  <div
                    className="grid grid-flow-col gap-1"
                    style={{
                      gridTemplateRows: "repeat(7, minmax(0, 1fr))",
                      gridAutoColumns: "12px",
                    }}
                  >
                    {heatmapData.map((day, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-sm ${getHeatmapColor(
                          day.count
                        )} hover:ring-2 hover:ring-indigo-400 transition-all cursor-pointer`}
                        title={`${format(day.date, "MMM dd, yyyy")}: ${
                          day.count
                        } ${day.count === 1 ? "entry" : "entries"}`}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span>Less</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-gray-100"></div>
                    <div className="w-3 h-3 rounded-sm bg-indigo-200"></div>
                    <div className="w-3 h-3 rounded-sm bg-indigo-400"></div>
                    <div className="w-3 h-3 rounded-sm bg-indigo-600"></div>
                  </div>
                  <span>More</span>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No journaling data yet. Start writing to see your activity!
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Optimal Journaling Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Optimal Journaling Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            {optimalTime ? (
              <div className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg">
                  <p className="text-4xl mb-2">⏰</p>
                  <p className="text-2xl font-bold text-indigo-900">
                    {optimalTime.label}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {optimalTime.hour}:00 - {optimalTime.hour + 1}:00
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Best mood score: {optimalTime.avgMoodScore.toFixed(1)}/10
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Your writing patterns:
                  </p>
                  {timeSlots.slice(0, 3).map((slot) => (
                    <div
                      key={slot.hour}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm">
                        {slot.label} ({slot.hour}:00)
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {slot.count} entries
                        </span>
                        <Badge variant="outline">
                          {slot.avgMoodScore.toFixed(1)}/10
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-indigo-600 bg-indigo-50 p-3 rounded-lg">
                  💡 You feel best when journaling in the{" "}
                  <strong>{optimalTime.label.toLowerCase()}</strong>. Try to
                  write during this time more often!
                </p>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                Write more entries to discover your optimal journaling time!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Journal Type Effectiveness */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Journal Type Effectiveness
            </CardTitle>
          </CardHeader>
          <CardContent>
            {typeStats.length > 0 ? (
              <div className="space-y-4">
                {typeStats.map((stat, index) => (
                  <div key={stat.type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {index === 0 && (
                          <Crown className="h-4 w-4 text-yellow-500" />
                        )}
                        <span className="text-sm font-medium capitalize">
                          {stat.type.replace("-", " ")}
                        </span>
                      </div>
                      <Badge variant="outline">{stat.percentage}%</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-blue-50 p-2 rounded text-center">
                        <p className="font-semibold text-blue-900">
                          {stat.count}
                        </p>
                        <p className="text-gray-600">entries</p>
                      </div>
                      <div className="bg-purple-50 p-2 rounded text-center">
                        <p className="font-semibold text-purple-900">
                          {stat.avgWords}
                        </p>
                        <p className="text-gray-600">avg words</p>
                      </div>
                      <div className="bg-green-50 p-2 rounded text-center">
                        <p className="font-semibold text-green-900">
                          {stat.avgMoodScore.toFixed(1)}
                        </p>
                        <p className="text-gray-600">mood score</p>
                      </div>
                    </div>
                    <Progress value={stat.avgMoodScore * 10} className="h-2" />
                  </div>
                ))}
                {typeStats[0] && (
                  <p className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                    ⭐ <strong>{typeStats[0].type.replace("-", " ")}</strong>{" "}
                    journaling works best for you with a mood score of{" "}
                    {typeStats[0].avgMoodScore.toFixed(1)}/10!
                  </p>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                Write entries of different types to see which works best for
                you!
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Word Cloud Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Most Used Words
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userData.journalStats?.mostUsedWords &&
          userData.journalStats.mostUsedWords.length > 0 ? (
            <div className="flex flex-wrap gap-2 justify-center py-6">
              {userData.journalStats.mostUsedWords
                .slice(0, 20)
                .map((word, index) => {
                  const size = Math.max(12, 24 - index * 0.5);
                  const opacity = Math.max(0.4, 1 - index * 0.03);
                  return (
                    <span
                      key={index}
                      className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors cursor-default"
                      style={{
                        fontSize: `${size}px`,
                        opacity: opacity,
                      }}
                    >
                      {word}
                    </span>
                  );
                })}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              Write more entries to see your most used words!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Community Benchmarks */}
      {/* TODO: implement this soon */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Community Benchmarks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Monthly Entries</span>
                <span className="text-sm text-gray-600">
                  You: {thisMonthCount} | Avg: {communityBenchmarks.avgEntriesPerMonth}
                </span>
              </div>
              <Progress value={entriesPercentile} className="h-2" />
              <p className="text-xs text-gray-500">
                {entriesPercentile >= 90 ? (
                  <span className="text-green-600 font-medium">🎉 You're in the top 10%!</span>
                ) : entriesPercentile >= 50 ? (
                  <span className="text-blue-600">You're above average! Keep it up!</span>
                ) : (
                  <span>You're at the {entriesPercentile}th percentile</span>
                )}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Words Per Entry</span>
                <span className="text-sm text-gray-600">
                  You: {avgWords} | Avg: {communityBenchmarks.avgWordsPerEntry}
                </span>
              </div>
              <Progress value={wordsPercentile} className="h-2" />
              <p className="text-xs text-gray-500">
                {wordsPercentile >= 90 ? (
                  <span className="text-green-600 font-medium">🎉 You're in the top 10%!</span>
                ) : wordsPercentile >= 50 ? (
                  <span className="text-blue-600">You write more than average!</span>
                ) : (
                  <span>You're at the {wordsPercentile}th percentile</span>
                )}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Streak</span>
                <span className="text-sm text-gray-600">
                  You: {userStreak} days | Avg: {communityBenchmarks.avgStreak} days
                </span>
              </div>
              <Progress value={streakPercentile} className="h-2" />
              <p className="text-xs text-gray-500">
                {streakPercentile >= 90 ? (
                  <span className="text-green-600 font-medium">🔥 Outstanding consistency!</span>
                ) : streakPercentile >= 50 ? (
                  <span className="text-blue-600">You're more consistent than most!</span>
                ) : (
                  <span>You're at the {streakPercentile}th percentile</span>
                )}
              </p>
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg text-center">
              <p className="text-sm text-indigo-900">
                <strong>Overall:</strong> You journal{" "}
                {thisMonthCount >= communityBenchmarks.avgEntriesPerMonth * 2
                  ? "2x more"
                  : thisMonthCount >= communityBenchmarks.avgEntriesPerMonth * 1.5
                  ? "1.5x more"
                  : thisMonthCount >= communityBenchmarks.avgEntriesPerMonth
                  ? "more"
                  : "about the same"}{" "}
                than the average user! 🌟
              </p>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};
