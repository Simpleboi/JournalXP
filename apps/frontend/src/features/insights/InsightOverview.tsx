import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Award, Target, CheckCircle, PawPrint } from "lucide-react";
import { sampleInsightsData } from "@/data/InsightData";
import { InsightKeyMetrics } from "./InsightTotalStats";
import { Progress } from "@/components/ui/progress";
import { getMoodColorInsight } from "@/utils/InsightUtils";

// Overview Section
export const InsightOverview = () => {
  const data = sampleInsightsData;

  return (
    <TabsContent value="overview" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Distribution */}
        <MoodDistribution />

        {/* XP Breakdown */}
        <XPOverview />
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-md text-blue-600">Current Streak</p>
                <p className="text-2xl font-bold text-blue-900">
                  {data.journalStats.streaks.currentStreak}
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
                <p className="text-2xl font-bold text-green-900">
                  {data.taskHabitCompletion.habits.overallCompletionRate.toFixed(
                    0
                  )}
                  %
                </p>
                <p className="text-sm text-green-500">completion rate</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-md text-purple-600">Pet Health</p>
                <p className="text-2xl font-bold text-purple-900">
                  {data.virtualPetMetrics.petStats.health.current}
                </p>
                <p className="text-sm text-purple-500">out of 100</p>
              </div>
              <PawPrint className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Key Metrics for User Data */}
      <InsightKeyMetrics />
    </TabsContent>
  );
};

const sampleMoodData = [
  { mood: "happy", percentage: 10 },
  { mood: "neutral", percentage: 60 },
  { mood: "sad", percentage: 40 },
  { mood: "anxious", percentage: 70 },
  { mood: "grateful", percentage: 60 },
  { mood: "calm", percentage: 90 },
  { mood: "angry", percentage: 85 },
  { mood: "excited", percentage: 20 },
  { mood: "lonely", percentage: 50 },
  { mood: "motivated", percentage: 20 },
  { mood: "overwhelmed", percentage: 80 },
  { mood: "confident", percentage: 30 },
  { mood: "tired", percentage: 60 },
  { mood: "relaxed", percentage: 95 },
  { mood: "positive", percentage: 60 },
  { mood: "negative", percentage: 60 },
];

const MoodDistribution = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          Mood Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-64 overflow-y-auto">
        {sampleMoodData.map(({ mood, percentage }) => (
          <div key={mood} className="flex items-center justify-between">
            {/* Label + color dot */}
            <div className="flex items-center gap-2">
              <span className={`w-4 h-4 rounded-full ${getMoodColorInsight(mood)}`} />
              <span className="capitalize">{mood.replace("_", " ")}</span>
            </div>

            {/* Bar + percentage */}
            <div className="flex items-center gap-2">
              <Progress
                value={percentage}
                max={100}
                className={`w-24 h-2 ${getMoodColorInsight(mood)} rounded-full overflow-hidden`}
              ></Progress>
              <span className="text-sm font-medium w-10 text-right">
                {percentage}%
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// XP Sources Section
const XPOverview = () => {
  const data = sampleInsightsData;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          XP Sources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(data.xpProgress.xpBreakdown).map(([source, data]) => (
            <div key={source} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400"></div>
                <span className="capitalize">{source}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400"
                    style={{ width: `${data.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium w-16 text-right">
                  {data.total} XP
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
