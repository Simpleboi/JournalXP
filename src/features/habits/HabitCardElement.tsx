import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar, Award, Flame, CheckCircle } from "lucide-react";
import { Habit } from "@/models/Habit";
import { Progress } from "@/components/ui/progress";
import { CalculateProgress } from "./HabitUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GetFrequencyText } from "./HabitUtils";
import { GetCategoryColor } from "./HabitUtils";
import { FC } from "react";

export interface HabitCardProps {
  habit: Habit;
  editHabit: (id: string) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (id: string) => void;
}

export const HabitCard: FC<HabitCardProps> = ({ 
  habit, 
  editHabit,
  deleteHabit,
  toggleHabitCompletion
}) => {
  return (
    <Card className="h-full bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Badge className={`${GetCategoryColor(habit.category)} mb-2`}>
              {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
            </Badge>
            <h3 className="text-lg font-semibold text-gray-800">
              {habit.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{habit.description}</p>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editHabit(habit.id)}
              className="h-8 w-8 text-gray-500 hover:text-indigo-600"
            >
              <Edit className="h-4 w-4" />
            </Button>
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

        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>
              {habit.currentCompletions || 0}/{habit.targetCompletions || 1}
            </span>
          </div>
          <Progress value={CalculateProgress(habit)} className="h-2" />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Flame className="h-4 w-4 text-orange-500 mr-1" />
            <span className="text-sm font-medium">{habit.streak} streak</span>
          </div>
          <Button
            variant={habit.completed ? "outline" : "default"}
            size="sm"
            onClick={() => toggleHabitCompletion(habit.id)}
            className={habit.completed ? "border-green-500 text-green-600" : ""}
          >
            {habit.completed ? (
              <>
                <CheckCircle className="h-4 w-4 mr-1" /> Completed
              </>
            ) : (
              "Complete"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
