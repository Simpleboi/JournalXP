import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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
    <div className="lg:col-span-1">
      <Card className="sticky top-24 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add New Task
          </CardTitle>
          <CardDescription className="text-indigo-100">
            Create a new task to stay organized
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Task Title *
            </label>
            <Input
              type="text"
              placeholder="What needs to be done?"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Description
            </label>
            <Textarea
              placeholder="Add more details..."
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Priority
              </label>
              <Select
                value={newTaskPriority}
                onValueChange={(value: any) => setNewTaskPriority(value)}
              >
                <SelectTrigger>
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
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Category
              </label>
              <Select
                value={newTaskCategory}
                onValueChange={setNewTaskCategory}
              >
                <SelectTrigger>
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

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Due Date (Optional)
            </label>
            <Input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Due Time (Optional)
            </label>
            <Input
              type="time"
              value={newTaskDueTime}
              onChange={(e) => setNewTaskDueTime(e.target.value)}
              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              disabled={!newTaskDueDate}
            />
            {!newTaskDueDate && (
              <p className="text-xs text-gray-500 mt-1">
                Select a date first to set a time
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={addTask}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            disabled={!newTaskTitle.trim()}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
