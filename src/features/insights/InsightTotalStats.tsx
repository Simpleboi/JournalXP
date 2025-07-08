import { Card, CardContent } from "@/components/ui/card";
import { Zap, MessageSquare, CheckCircle, Heart } from "lucide-react";
import { sampleInsightsData } from "@/data/InsightData";
import { useUserData } from "@/context/UserDataContext";


export const InsightKeyMetrics = () => {
  const data = sampleInsightsData;
  const { userData } = useUserData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
            <Zap className="h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-sm text-indigo-700 font-medium">Total XP</p>
          <p className="text-2xl font-bold text-indigo-900">
            {userData.totalPoints}
          </p>
          <p className="text-xs text-indigo-600">
            Level {userData.level}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
            <MessageSquare className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-sm text-purple-700 font-medium">Total Journal Entries</p>
          <p className="text-2xl font-bold text-purple-900">
            {userData.totalJournalEntires}
          </p>
          <p className="text-xs text-purple-600">
            Avg {data.journalStats.wordCount.averageWordsPerEntry} words
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-sm text-green-700 font-medium">Task Completion</p>
          <p className="text-2xl font-bold text-green-900">
            {data.taskHabitCompletion.tasks.completionRate.toFixed(1)}%
          </p>
          <p className="text-xs text-green-600">
            {data.taskHabitCompletion.tasks.completedTasks}/
            {data.taskHabitCompletion.tasks.totalTasks} completed
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-2">
            <Heart className="h-6 w-6 text-pink-600" />
          </div>
          <p className="text-sm text-pink-700 font-medium">Average Mood</p>
          <p className="text-2xl font-bold text-pink-900">
            {data.moodTrends.monthly[0]?.averageMood.toFixed(1) || "N/A"}
          </p>
          <p className="text-xs text-pink-600">Out of 10</p>
        </CardContent>
      </Card>
    </div>
  );
};

