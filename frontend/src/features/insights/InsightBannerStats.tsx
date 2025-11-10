import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, LineChart, PieChart, Calendar } from "lucide-react";
import { FC } from "react";
import { activitySummary } from "@/data/InsightData";
import { useUserData } from "@/context/UserDataContext";

interface InsightBannerStatsProps {
  timeRange: string;
}

export const InsightBannerStats: FC<InsightBannerStatsProps> = ({
  timeRange,
}) => {
  const { userData } = useUserData();
  if (!userData) return;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
            <BarChart3 className="h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-sm text-indigo-700 font-medium">Total Points</p>
          <p className="text-2xl font-bold text-indigo-900">
            {userData.totalXP}
          </p>
          <p className="text-xs text-indigo-600">This {timeRange}</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
            <LineChart className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-sm text-purple-700 font-medium">Journal Entries</p>
          <p className="text-2xl font-bold text-purple-900">
            {activitySummary.journalEntries}
          </p>
          <p className="text-xs text-purple-600">This {timeRange}</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-2">
            <PieChart className="h-6 w-6 text-pink-600" />
          </div>
          <p className="text-sm text-pink-700 font-medium">Tasks Completed</p>
          <p className="text-2xl font-bold text-pink-900">
            {activitySummary.tasksCompleted}
          </p>
          <p className="text-xs text-pink-600">This {timeRange}</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-sm text-blue-700 font-medium">
            Meditation Minutes
          </p>
          <p className="text-2xl font-bold text-blue-900">
            {activitySummary.meditationMinutes}
          </p>
          <p className="text-xs text-blue-600">This {timeRange}</p>
        </CardContent>
      </Card>
    </div>
  );
};
