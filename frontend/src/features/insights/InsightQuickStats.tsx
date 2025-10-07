import { Card, CardContent } from "@/components/ui/card";
import { PawPrint, Target, CheckCircle } from "lucide-react";
import { sampleInsightsData } from "@/data/InsightData";

export const InsightQuickStats = () => {
  const data = sampleInsightsData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Current Streak</p>
              <p className="text-2xl font-bold text-blue-900">
                {data.journalStats.streaks.currentStreak}
              </p>
              <p className="text-xs text-blue-500">days journaling</p>
            </div>
            <Target className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Habit Success</p>
              <p className="text-2xl font-bold text-green-900">
                {data.taskHabitCompletion.habits.overallCompletionRate.toFixed(
                  0
                )}
                %
              </p>
              <p className="text-xs text-green-500">completion rate</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Pet Health</p>
              <p className="text-2xl font-bold text-purple-900">
                {data.virtualPetMetrics.petStats.health.current}
              </p>
              <p className="text-xs text-purple-500">out of 100</p>
            </div>
            <PawPrint className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
