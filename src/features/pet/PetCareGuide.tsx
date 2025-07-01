import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";

export const PetWellnesSGuide = () => {
  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-purple-700 flex items-center">
          <Activity className="h-6 w-6 mr-2" />
          Wellness Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl mb-2">📝</div>
            <h3 className="font-semibold text-blue-700 mb-1">Journal Entry</h3>
            <p className="text-sm text-blue-600">+10 Happiness</p>
            <p className="text-xs text-gray-600 mt-1">
              Write about your thoughts and feelings
            </p>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl mb-2">✅</div>
            <h3 className="font-semibold text-green-700 mb-1">Complete Task</h3>
            <p className="text-sm text-green-600">+5 Health</p>
            <p className="text-xs text-gray-600 mt-1">
              Finish your daily wellness tasks
            </p>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-semibold text-purple-700 mb-1">Build Habit</h3>
            <p className="text-sm text-purple-600">+5 Health & Happiness</p>
            <p className="text-xs text-gray-600 mt-1">
              Maintain your positive habits
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
