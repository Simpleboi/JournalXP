import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        {/* Journal */}
        <div className="space-y-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl mb-2">📝</div>
            <h3 className="font-semibold text-blue-700 mb-1">Journal Entry</h3>
            <p className="text-sm text-blue-600">+10 Happiness</p>
            <p className="text-xs text-gray-600 mt-1">
              Write about your thoughts and sync emotions
            </p>
            <Button size="sm" className="mt-2 bg-blue-500 hover:bg-blue-600">
              Journal Now
            </Button>
          </div>

          {/* Daily Tasks */}
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl mb-2">✅</div>
            <h3 className="font-semibold text-green-700 mb-1">Complete Task</h3>
            <p className="text-sm text-green-600">+5 Health</p>
            <p className="text-xs text-gray-600 mt-1">
              Finish your daily wellness tasks
            </p>
            <Button size="sm" className="mt-2 bg-green-500 hover:bg-green-600">
              Daily Task
            </Button>
          </div>

          {/* Build Habits */}
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-semibold text-purple-700 mb-1">Build Habit</h3>
            <p className="text-sm text-purple-600">+5 Health & Happiness</p>
            <p className="text-xs text-gray-600 mt-1">
              Maintain your positive habits
            </p>
            <Button
              size="sm"
              className="mt-2 bg-purple-500 hover:bg-purple-600"
            >
              Build Habit
            </Button>
          </div>

          {/* Streak Counter */}
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-3xl mb-2">🔥</div>
            <h3 className="font-semibold text-orange-700 mb-1">
              Update Streak
            </h3>
            <p className="text-sm text-orange-600">Bonding & Accessories</p>
            <p className="text-xs text-gray-600 mt-1">
              Simulate wellness streak progress
            </p>
            <Button
              size="sm"
              className="mt-2 bg-orange-500 hover:bg-orange-600"
            >
              +1 Streak Day
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
