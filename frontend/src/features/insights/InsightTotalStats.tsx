import { Card, CardContent } from "@/components/ui/card";
import { Zap, MessageSquare, CheckCircle, Heart } from "lucide-react";
import { sampleInsightsData } from "@/data/InsightData";
import { useUserData } from "@/context/UserDataContext";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getJournalEntries } from "@/services/JournalService";
import { fetchTasksFromServer } from "@/services/taskService";

export const InsightKeyMetrics = () => {
  const data = sampleInsightsData;
  const { userData } = useUserData();
  const { user } = useAuth();
  const [journalStats, setJournalStats] = useState({ count: 0, avgWords: 0 });
  const [taskStats, setTaskStats] = useState({ completionRate: 0, completed: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch journal and task data in parallel
        const [journals, tasks] = await Promise.all([
          getJournalEntries(),
          fetchTasksFromServer(),
        ]);

        // Calculate journal stats
        const totalWords = journals.reduce((sum, entry) => sum + (entry.wordCount || 0), 0);
        const avgWords = journals.length > 0 ? totalWords / journals.length : 0;

        setJournalStats({
          count: journals.length,
          avgWords: avgWords,
        });

        // Calculate task stats
        const completedTasks = tasks.filter((task) => task.completed).length;
        const totalTasks = tasks.length;
        const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        setTaskStats({
          completionRate: completionRate,
          completed: completedTasks,
          total: totalTasks,
        });
      } catch (error) {
        console.error("Error fetching key metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (!userData) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
            <Zap className="h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-md text-indigo-700 font-medium">Total XP</p>
          <p className="text-2xl font-bold text-indigo-900">
            {userData.totalXP}
          </p>
          <p className="text-sm text-indigo-600">Level {userData.level}</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
            <MessageSquare className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-md text-purple-700 font-medium">
            Total Journal Entries
          </p>
          {loading ? (
            <p className="text-2xl font-bold text-purple-900">...</p>
          ) : (
            <>
              <p className="text-2xl font-bold text-purple-900">
                {journalStats.count}
              </p>
              <p className="text-sm text-purple-600">
                Avg {journalStats.avgWords.toFixed(0)} words
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-md text-green-700 font-medium">Task Completion</p>
          {loading ? (
            <p className="text-2xl font-bold text-green-900">...</p>
          ) : (
            <>
              <p className="text-2xl font-bold text-green-900">
                {taskStats.completionRate.toFixed(1)}%
              </p>
              <p className="text-sm text-green-600">
                {taskStats.completed}/{taskStats.total} completed
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-2">
            <Heart className="h-6 w-6 text-pink-600" />
          </div>
          <p className="text-md text-pink-700 font-medium">Average Mood</p>
          <p className="text-2xl font-bold text-pink-900">
            {data.moodTrends.monthly[0]?.averageMood.toFixed(1) || "N/A"}
          </p>
          <p className="text-sm text-pink-600">Out of 10</p>
        </CardContent>
      </Card>
    </div>
  );
};
