import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { CheckCircle, Target, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { sampleInsightsData } from "@/data/InsightData";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchTasksFromServer } from "@/services/taskService";
import { Task } from "@/types/TaskType";

export const InsightTasksAndHabits = () => {
  const data = sampleInsightsData;
  const { user } = useAuth();
  const [taskStats, setTaskStats] = useState({
    completionRate: 0,
    byPriority: {
      high: { completed: 0, total: 0, rate: 0 },
      medium: { completed: 0, total: 0, rate: 0 },
      low: { completed: 0, total: 0, rate: 0 },
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchTaskStats = async () => {
      try {
        setLoading(true);
        const tasks = await fetchTasksFromServer();

        // Calculate overall completion rate
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter((task: Task) => task.completed).length;
        const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        // Calculate by priority
        const priorityStats = {
          high: { completed: 0, total: 0, rate: 0 },
          medium: { completed: 0, total: 0, rate: 0 },
          low: { completed: 0, total: 0, rate: 0 },
        };

        tasks.forEach((task: Task) => {
          const priority = task.priority || "medium";
          if (priorityStats[priority as keyof typeof priorityStats]) {
            priorityStats[priority as keyof typeof priorityStats].total += 1;
            if (task.completed) {
              priorityStats[priority as keyof typeof priorityStats].completed += 1;
            }
          }
        });

        // Calculate rates for each priority
        Object.keys(priorityStats).forEach((priority) => {
          const stats = priorityStats[priority as keyof typeof priorityStats];
          stats.rate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
        });

        setTaskStats({
          completionRate,
          byPriority: priorityStats,
        });
      } catch (error) {
        console.error("Error fetching task stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskStats();
  }, [user]);

  // Helper function to get color classes based on completion rate
  const getColorClasses = (rate: number) => {
    if (rate >= 75) {
      return {
        bg: "bg-green-50",
        text: "text-green-900",
        subtext: "text-green-600",
      };
    } else if (rate >= 50) {
      return {
        bg: "bg-yellow-50",
        text: "text-yellow-900",
        subtext: "text-yellow-600",
      };
    } else {
      return {
        bg: "bg-red-50",
        text: "text-red-900",
        subtext: "text-red-600",
      };
    }
  };

  // Helper function to get progress bar color based on rate
  const getProgressColor = (rate: number) => {
    if (rate >= 75) return "bg-green-500";
    if (rate >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const colors = getColorClasses(taskStats.completionRate);

  return (
    <TabsContent value="tasks" className="space-y-4">
      {/* Task & Habit Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Task Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Loading...</p>
              </div>
            ) : (
              <>
                <div className={`text-center p-4 ${colors.bg} rounded-lg`}>
                  <p className={`text-3xl font-bold ${colors.text}`}>
                    {taskStats.completionRate.toFixed(1)}%
                  </p>
                  <p className={`text-sm ${colors.subtext}`}>Overall Completion Rate</p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">By Priority:</h4>
                  {Object.entries(taskStats.byPriority).map(([priority, stats]) => {
                    const priorityColors = getColorClasses(stats.rate);
                    return (
                      <div
                        key={priority}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm capitalize">
                          {priority} Priority
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getProgressColor(stats.rate)}`}
                              style={{ width: `${stats.rate}%` }}
                            ></div>
                          </div>
                          <span className={`text-sm font-medium w-16 text-right ${priorityColors.text}`}>
                            {stats.rate.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Habit Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-900">
                  {data.taskHabitCompletion.habits.activeHabits}
                </p>
                <p className="text-xs text-blue-600">Active Habits</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-900">
                  {data.taskHabitCompletion.habits.overallCompletionRate.toFixed(
                    0
                  )}
                  %
                </p>
                <p className="text-xs text-purple-600">Success Rate</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Top Performing Habits:</h4>
              {data.taskHabitCompletion.habits.habitPerformance
                .slice(0, 3)
                .map((habit) => (
                  <div
                    key={habit.habitId}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div>
                      <p className="text-sm font-medium">{habit.name}</p>
                      <p className="text-xs text-gray-600">
                        {habit.currentStreak} day streak
                      </p>
                    </div>
                    <Badge
                      className={
                        habit.completionRate >= 80
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {habit.completionRate.toFixed(0)}%
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Productivity Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Best Days of Week:</h4>
              <div className="space-y-2">
                {data.taskHabitCompletion.tasks.timePatterns.dayOfWeek.map(
                  (day) => (
                    <div
                      key={day.day}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{day.day}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
                            style={{ width: `${day.completionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium w-10">
                          {day.completionRate.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Peak Hours:</h4>
              <div className="space-y-2">
                {data.taskHabitCompletion.tasks.timePatterns.hourOfDay.map(
                  (hour) => (
                    <div
                      key={hour.hour}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{hour.hour}:00</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-400"
                            style={{ width: `${hour.completionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium w-10">
                          {hour.completionRate.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
