import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

/*
This function will take the total number of tasks completed.
{completed tasks} of {total tasks}
*/
export const TaskProgress = () => {
  return (
    <Card className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-800">Today's Progress</h3>
          <span className="text-sm text-gray-600">
            1 of 2 tasks
          </span>
        </div>
        <Progress value={50} className="h-3" />
      </CardContent>
    </Card>
  );
};
