import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar, Award, Flame, CheckCircle, Lock, Infinity } from "lucide-react";
import { Habit } from "@/models/Habit";
import { Progress } from "@/components/ui/progress";
import { CalculateProgress } from "./HabitUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GetFrequencyText } from "./HabitUtils";
import { GetCategoryColor } from "./HabitUtils";
import { FC } from "react";

/**
 * Check if enough time has passed to complete the habit again based on frequency
 */
function canCompleteHabit(habit: Habit): boolean {
  if (!habit.lastCompleted) return true;

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const last = new Date(habit.lastCompleted);
  last.setHours(0, 0, 0, 0);

  const diffMs = now.getTime() - last.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  switch (habit.frequency) {
    case "daily":
      return diffDays >= 1;
    case "weekly":
      return diffDays >= 7;
    case "monthly":
      return diffDays >= 30;
    default:
      return true;
  }
}

/**
 * Get time remaining until habit can be completed again
 */
function getTimeUntilAvailable(habit: Habit): string {
  if (!habit.lastCompleted) return "";

  const now = new Date();
  const last = new Date(habit.lastCompleted);
  const nextAvailable = new Date(last);

  switch (habit.frequency) {
    case "daily":
      nextAvailable.setDate(last.getDate() + 1);
      break;
    case "weekly":
      nextAvailable.setDate(last.getDate() + 7);
      break;
    case "monthly":
      nextAvailable.setMonth(last.getMonth() + 1);
      break;
  }

  const diffMs = nextAvailable.getTime() - now.getTime();
  const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "Available soon";
  if (diffHours < 24) return `Available in ${diffHours}h`;
  const diffDays = Math.ceil(diffHours / 24);
  return `Available in ${diffDays}d`;
}

export interface HabitCardProps {
  habit: Habit;
  editHabit: (id: string) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (id: string) => void;
  isCompleted?: boolean; // If true, this is a fully completed habit
}

export const HabitCard: FC<HabitCardProps> = ({
  habit,
  editHabit,
  deleteHabit,
  toggleHabitCompletion,
  isCompleted = false,
}) => {
  const canComplete = canCompleteHabit(habit);
  const timeUntilAvailable = !canComplete ? getTimeUntilAvailable(habit) : "";

  return (
    <Card className={`h-full bg-white shadow-sm hover:shadow-md transition-shadow ${isCompleted ? 'border-2 border-green-200' : ''}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`${GetCategoryColor(habit.category)}`}>
                {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
              </Badge>
              {habit.isIndefinite && (
                <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
                  <Infinity className="h-3 w-3" /> Indefinite
                </Badge>
              )}
              {isCompleted && (
                <Badge className="bg-green-100 text-green-800">
                  ✓ Completed
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              {habit.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{habit.description}</p>
          </div>
          <div className="flex space-x-1">
            {!isCompleted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => editHabit(habit.id)}
                className="h-8 w-8 text-gray-500 hover:text-indigo-600"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteHabit(habit.id)}
              className="h-8 w-8 text-gray-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-indigo-500 mr-1" />
            <span className="text-xs text-gray-600">
              {GetFrequencyText(habit)}
            </span>
          </div>
          <div className="flex items-center">
            <Award className="h-4 w-4 text-amber-500 mr-1" />
            <span className="text-xs text-gray-600">+{habit.xpReward} XP</span>
          </div>
        </div>

        {!habit.isIndefinite && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>
                {habit.currentCompletions}/{habit.targetCompletions}
              </span>
            </div>
            <Progress value={CalculateProgress(habit)} className="h-2" />
          </div>
        )}

        {habit.isIndefinite && (
          <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Infinity className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Streak Focus</span>
              </div>
              <span className="text-sm text-purple-700">
                {habit.currentCompletions} total completions
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Flame className="h-4 w-4 text-orange-500 mr-1" />
            <span className="text-sm font-medium">{habit.streak} day streak</span>
          </div>

          {isCompleted ? (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="border-green-500 text-green-600"
            >
              <CheckCircle className="h-4 w-4 mr-1" /> Goal Achieved
            </Button>
          ) : !canComplete ? (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="cursor-not-allowed"
              title={timeUntilAvailable}
            >
              <Lock className="h-4 w-4 mr-1" /> Locked
            </Button>
          ) : habit.completed ? (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="border-green-500 text-green-600"
            >
              <CheckCircle className="h-4 w-4 mr-1" /> Done
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => toggleHabitCompletion(habit.id)}
            >
              Complete
            </Button>
          )}
        </div>

        {!canComplete && !isCompleted && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            {timeUntilAvailable}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
