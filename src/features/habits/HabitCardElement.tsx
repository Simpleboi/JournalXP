import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar, Award } from "lucide-react";
import { Habit } from "@/models/Habit";
import { Progress } from "@/components/ui/progress";
import { calculateProgress } from "./HabitUtils";

const HabitCard = ({ habit }: { habit: Habit }) => {
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <div className="flex justify-between">
        <div>
          <h3 className="font-bold">{habit.title}</h3>
          <p className="text-sm text-gray-500">{habit.description}</p>
        </div>
        <div className="space-x-1">
          <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
        </div>
      </div>
      <div className="mt-4">
        <Progress value={calculateProgress(habit)} />
      </div>
    </div>
  );
};

export default HabitCard;
