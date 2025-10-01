import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { CheckCircle, Target, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { sampleInsightsData } from "@/data/InsightData";
import { Badge } from "@/components/ui/badge";

export const InsightTasksAndHabits = () => {
  const data = sampleInsightsData;

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
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-900">
                {data.taskHabitCompletion.tasks.completionRate.toFixed(1)}%
              </p>
              <p className="text-sm text-green-600">Overall Completion Rate</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-sm">By Priority:</h4>
              {Object.entries(data.taskHabitCompletion.tasks.byPriority).map(
                ([priority, stats]) => (
                  <div
                    key={priority}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm capitalize">
                      {priority} Priority
                    </span>
                    <div className="flex items-center gap-2">
                      <Progress value={stats.rate} className="w-20" />
                      <span className="text-sm font-medium w-12">
                        {stats.rate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
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
