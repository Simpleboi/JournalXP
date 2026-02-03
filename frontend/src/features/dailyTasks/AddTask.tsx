import { Plus, Flag, Target, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FC } from "react";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";

interface AddTaskProps {
  newTaskTitle: string;
  setNewTaskTitle: React.Dispatch<React.SetStateAction<string>>;
  newTaskDescription: string;
  setNewTaskDescription: React.Dispatch<React.SetStateAction<string>>;
  newTaskPriority: string;
  setNewTaskPriority: React.Dispatch<
    React.SetStateAction<"high" | "low" | "medium">
  >;
  newTaskCategory: string;
  setNewTaskCategory: React.Dispatch<React.SetStateAction<string>>;
  newTaskDueDate: string;
  setNewTaskDueDate: React.Dispatch<React.SetStateAction<string>>;
  newTaskDueTime: string;
  setNewTaskDueTime: React.Dispatch<React.SetStateAction<string>>;
  addTask: () => Promise<void>
}

export const AddTask: FC<AddTaskProps> = ({
  newTaskTitle,
  setNewTaskTitle,
  newTaskDescription,
  setNewTaskDescription,
  newTaskPriority,
  setNewTaskPriority,
  newTaskCategory,
  setNewTaskCategory,
  newTaskDueDate,
  setNewTaskDueDate,
  newTaskDueTime,
  setNewTaskDueTime,
  addTask
}) => {
  const { theme } = useTheme();

  const categories = [
    {
      value: "personal",
      label: "Personal",
      color: "bg-blue-100 text-blue-800",
    },
    { value: "work", label: "Work", color: "bg-purple-100 text-purple-800" },
    { value: "health", label: "Health", color: "bg-green-100 text-green-800" },
    {
      value: "learning",
      label: "Learning",
      color: "bg-orange-100 text-orange-800",
    },
    { value: "social", label: "Social", color: "bg-pink-100 text-pink-800" },
    {
      value: "finance",
      label: "Finance",
      color: "bg-yellow-100 text-yellow-800",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="lg:col-span-1"
    >
      <div className="sticky top-24 bg-white/90 backdrop-blur-sm border-2 border-gray-200/80 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div
          className="p-4 sm:p-5 text-white"
          style={{ background: theme.colors.gradient }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <h3 className="font-semibold text-base sm:text-lg">Add New Task</h3>
          </div>
          <p className="text-white/80 text-xs sm:text-sm">
            Create a new task to stay organized
          </p>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700">
              Task Title *
            </label>
            <Input
              type="text"
              placeholder="What needs to be done?"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="bg-white/70 border-gray-200/60 focus:border-indigo-300 focus:ring-indigo-200 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700">
              Description
            </label>
            <Textarea
              placeholder="Add more details..."
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className="bg-white/70 border-gray-200/60 focus:border-indigo-300 focus:ring-indigo-200 text-sm"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700">
                Priority
              </label>
              <Select
                value={newTaskPriority}
                onValueChange={(value: any) => setNewTaskPriority(value)}
              >
                <SelectTrigger className="bg-white/70 border-gray-200/60 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center">
                      <Flag className="h-3 w-3 text-blue-500 mr-2" />
                      Low
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center">
                      <Target className="h-3 w-3 text-yellow-500 mr-2" />
                      Medium
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center">
                      <Zap className="h-3 w-3 text-red-500 mr-2" />
                      High
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700">
                Category
              </label>
              <Select
                value={newTaskCategory}
                onValueChange={setNewTaskCategory}
              >
                <SelectTrigger className="bg-white/70 border-gray-200/60 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700">
                Due Date
              </label>
              <Input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="bg-white/70 border-gray-200/60 focus:border-indigo-300 focus:ring-indigo-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700">
                Due Time
              </label>
              <Input
                type="time"
                value={newTaskDueTime}
                onChange={(e) => setNewTaskDueTime(e.target.value)}
                className="bg-white/70 border-gray-200/60 focus:border-indigo-300 focus:ring-indigo-200 text-sm"
                disabled={!newTaskDueDate}
              />
            </div>
          </div>
          {!newTaskDueDate && (
            <p className="text-xs text-gray-500 -mt-2">
              Select a date to enable time selection
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 pt-0">
          <Button
            onClick={addTask}
            className="w-full shadow-lg hover:shadow-xl transition-shadow text-sm sm:text-base"
            disabled={!newTaskTitle.trim()}
            style={{ background: theme.colors.gradient }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
