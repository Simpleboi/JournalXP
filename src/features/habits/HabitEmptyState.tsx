// components/EmptyState.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Target } from "lucide-react";

interface EmptyStateProps {
  onAddHabit: () => void;
}

export const EmptyState = ({ onAddHabit }: EmptyStateProps) => {
  return (
    <Card className="bg-white shadow-sm border-dashed border-2 border-gray-200">
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center justify-center py-8">
          <Target className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Habits Yet</h3>
          <p className="text-gray-500 mb-4 max-w-md">
            Start building positive routines by adding your first habit. Click the button below.
          </p>
          <Button
            onClick={onAddHabit}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            <Plus className="h-5 w-5 mr-2" /> Add Your First Habit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};



