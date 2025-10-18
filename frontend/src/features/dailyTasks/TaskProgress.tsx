import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useUserData } from "@/context/UserDataContext";

/*
This function will take the total number of tasks completed.
*/
export const TaskProgress = () => {
  const { userData } = useUserData();
  if (!userData) return;

  const completed = userData?.taskStats?.currentTasksCompleted ?? 0;
  const total = userData?.taskStats?.currentTasksCreated ?? 0;
  const value = total > 0 ? Math.min((completed / total) * 100, 100) : 0;

  return (
    <Card className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-800">Today's Progress</h3>
          <span className="text-sm text-gray-600">
            {completed} of{" "}
            {total} tasks
          </span>
        </div>
        <Progress value={value} className="h-3" />
      </CardContent>
    </Card>
  );
};


