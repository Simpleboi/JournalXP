import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "recharts";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { getJournalEntries, JournalEntryResponse } from "@/services/JournalService";
import { fetchTasksFromServer } from "@/services/taskService";
import { getHabits } from "@/services/HabitService";
import { Task } from "@/types/TaskType";
import { Habit } from "@/models/Habit";
import { format, subDays, subMonths, startOfDay, isSameDay, parseISO } from "date-fns";

interface MentalHealthTrendsProps {
  moodData?: Array<{
    date: string;
    mood: number;
    energy: number;
    anxiety: number;
  }>;
  activityData?: Array<{
    date: string;
    journalEntries: number;
    tasksCompleted: number;
    pointsEarned: number;
  }>;
  achievementData?: Array<{
    name: string;
    progress: number;
    total: number;
  }>;
}

export const InsightMoodTrends: React.FC<MentalHealthTrendsProps> = ({
  moodData = [
    { date: "Mon", mood: 7, energy: 6, anxiety: 4 },
    { date: "Tue", mood: 6, energy: 5, anxiety: 5 },
    { date: "Wed", mood: 8, energy: 7, anxiety: 3 },
    { date: "Thu", mood: 7, energy: 6, anxiety: 4 },
    { date: "Fri", mood: 9, energy: 8, anxiety: 2 },
    { date: "Sat", mood: 8, energy: 7, anxiety: 3 },
    { date: "Sun", mood: 7, energy: 6, anxiety: 4 },
  ],
  achievementData = [
    { name: "Journal Streak", progress: 7, total: 10 },
    { name: "Task Master", progress: 22, total: 30 },
    { name: "Mood Tracker", progress: 14, total: 20 },
    { name: "Self-Care Pro", progress: 5, total: 15 },
    { name: "Reflection Guru", progress: 3, total: 10 },
  ],
}) => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("week");
  const [activityData, setActivityData] = useState<Array<{
    date: string;
    journalEntries: number;
    tasksCompleted: number;
    pointsEarned: number;
  }>>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get date range based on timeRange
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
      return format(date, "EEE"); // Mon, Tue, Wed, etc.
    } else if (range === "month") {
      return format(date, "MMM d"); // Jan 1, Jan 2, etc.
    } else {
      return format(date, "MMM d"); // Jan 1, Jan 2, etc.
    }
  };

  useEffect(() => {
    if (!user) return;

    const fetchActivityData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [journals, tasks, habits] = await Promise.all([
          getJournalEntries(),
          fetchTasksFromServer(),
          getHabits(),
        ]);

        // Get date range based on selected timeRange
        const dateRange = getDateRange(timeRange);

        // Initialize data structure for each day
        const activityByDate = dateRange.map(date => ({
          date: formatDateForDisplay(date, timeRange),
          dateObj: date,
          journalEntries: 0,
          tasksCompleted: 0,
          pointsEarned: 0,
        }));

        // Process journal entries
        journals.forEach((entry: JournalEntryResponse) => {
          const entryDate = startOfDay(parseISO(entry.createdAt));
          const dayIndex = activityByDate.findIndex(day =>
            isSameDay(day.dateObj, entryDate)
          );

          if (dayIndex !== -1) {
            activityByDate[dayIndex].journalEntries += 1;
            activityByDate[dayIndex].pointsEarned += 30; // 30 XP per journal
          }
        });

        // Process completed tasks
        tasks.forEach((task: Task) => {
          if (task.completed && task.createdAt) {
            const taskDate = startOfDay(parseISO(task.createdAt));
            const dayIndex = activityByDate.findIndex(day =>
              isSameDay(day.dateObj, taskDate)
            );

            if (dayIndex !== -1) {
              activityByDate[dayIndex].tasksCompleted += 1;
              activityByDate[dayIndex].pointsEarned += 20; // 20 XP per task
            }
          }
        });

        // Process habits - check lastCompleted date
        habits.forEach((habit: Habit) => {
          if (habit.lastCompleted) {
            const habitDate = startOfDay(parseISO(habit.lastCompleted));
            const dayIndex = activityByDate.findIndex(day =>
              isSameDay(day.dateObj, habitDate)
            );

            if (dayIndex !== -1) {
              activityByDate[dayIndex].pointsEarned += habit.xpReward;
            }
          }
        });

        // Remove dateObj before setting state
        const formattedData = activityByDate.map(({ dateObj, ...rest }) => rest);
        setActivityData(formattedData);
      } catch (error) {
        console.error("Error fetching activity data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityData();
  }, [user, timeRange]);

  return (
    <TabsContent value="mood">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-white rounded-xl shadow-sm"
      >
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl text-primary">
                  Mental Health Insights
                </CardTitle>
                <CardDescription>
                  Track your progress and patterns over time
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
          <CardContent>
            <Tabs defaultValue="mood" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="mood">Mood Trends</TabsTrigger>
                <TabsTrigger value="activity">Activity Patterns</TabsTrigger>
                <TabsTrigger value="achievements">
                  Achievement Progress
                </TabsTrigger>
              </TabsList>

              <TabsContent value="mood" className="space-y-4">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={moodData}
                      margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                        labelStyle={{ fontWeight: "bold" }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="mood"
                        stroke="#8884d8"
                        strokeWidth={2}
                        name="Mood"
                      />
                      <Line
                        type="monotone"
                        dataKey="energy"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        name="Energy"
                      />
                      <Line
                        type="monotone"
                        dataKey="anxiety"
                        stroke="#ffc658"
                        strokeWidth={2}
                        name="Anxiety"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Mood and energy levels are scored from 1-10, with 10 being the
                  highest
                </p>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                {loading ? (
                  <div className="h-[300px] w-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                      <p className="text-gray-500">Loading activity data...</p>
                    </div>
                  </div>
                ) : activityData.length === 0 ? (
                  <div className="h-[300px] w-full flex items-center justify-center">
                    <p className="text-gray-500">No activity data available for this time period</p>
                  </div>
                ) : (
                  <>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={activityData}
                          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="date" />
                          <YAxis yAxisId="left" orientation="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#fff",
                              borderRadius: "8px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            }}
                            labelStyle={{ fontWeight: "bold" }}
                          />
                          <Legend />
                          <Bar
                            yAxisId="left"
                            dataKey="journalEntries"
                            fill="#8884d8"
                            name="Journal Entries"
                          />
                          <Bar
                            yAxisId="left"
                            dataKey="tasksCompleted"
                            fill="#82ca9d"
                            name="Tasks Completed"
                          />
                          <Bar
                            yAxisId="right"
                            dataKey="pointsEarned"
                            fill="#ffc658"
                            name="Points Earned"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Your activity patterns help identify what days you're most
                      productive
                    </p>
                  </>
                )}
              </TabsContent>

              <TabsContent value="achievements" className="space-y-4">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={achievementData}
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis type="number" domain={[0, "dataMax"]} />
                      <YAxis type="category" dataKey="name" width={80} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                        labelStyle={{ fontWeight: "bold" }}
                        formatter={(value, name, props) => [
                          `${value}/${props.payload.total}`,
                          name,
                        ]}
                      />
                      <Legend />
                      <Bar
                        dataKey="progress"
                        fill="#8884d8"
                        name="Current Progress"
                      >
                        {achievementData.map((entry, index) => (
                          <motion.rect
                            key={`rect-${index}`}
                            initial={{ width: 0 }}
                            animate={{
                              width: (entry.progress / entry.total) * 100 + "%",
                            }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Track your progress towards earning achievements and badges
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </TabsContent>
  );
};
