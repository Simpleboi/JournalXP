import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { CheckCircle, Circle, RefreshCw, Trophy } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  category: "mindfulness" | "physical" | "social" | "productivity";
  points: number;
  completed: boolean;
}

interface TaskChecklistProps {
  tasks?: Task[];
  onTaskComplete?: (taskId: string) => void;
  onResetTasks?: () => void;
}

const TaskChecklist = ({
  tasks = [
    {
      id: "1",
      title: "5-Minute Meditation",
      description: "Take a short break to clear your mind",
      category: "mindfulness",
      points: 10,
      completed: false,
    },
    {
      id: "2",
      title: "Drink Water",
      description: "Stay hydrated with a glass of water",
      category: "physical",
      points: 5,
      completed: false,
    },
    {
      id: "3",
      title: "Message a Friend",
      description: "Reach out to someone you care about",
      category: "social",
      points: 15,
      completed: false,
    },
    {
      id: "4",
      title: "Set a Goal for Today",
      description: "Write down one thing you want to accomplish",
      category: "productivity",
      points: 10,
      completed: false,
    },
    {
      id: "5",
      title: "Take a Short Walk",
      description: "Get some fresh air and move your body",
      category: "physical",
      points: 15,
      completed: false,
    },
  ],
  onTaskComplete = () => {},
  onResetTasks = () => {},
}: TaskChecklistProps) => {
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);

  const handleTaskToggle = (taskId: string) => {
    setLocalTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );

    onTaskComplete(taskId);

    // Show completion animation if task is being marked as completed
    const task = localTasks.find((t) => t.id === taskId);
    if (task && !task.completed) {
      setShowCompletionAnimation(true);
      setTimeout(() => setShowCompletionAnimation(false), 1500);
    }
  };

  const completedTasksCount = localTasks.filter(
    (task) => task.completed,
  ).length;
  const totalTasksCount = localTasks.length;
  const completionPercentage = (completedTasksCount / totalTasksCount) * 100;
  const totalPointsEarned = localTasks
    .filter((task) => task.completed)
    .reduce((sum, task) => sum + task.points, 0);

  const getCategoryColor = (category: Task["category"]) => {
    switch (category) {
      case "mindfulness":
        return "bg-blue-100 text-blue-800";
      case "physical":
        return "bg-green-100 text-green-800";
      case "social":
        return "bg-purple-100 text-purple-800";
      case "productivity":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleResetTasks = () => {
    setLocalTasks((prevTasks) =>
      prevTasks.map((task) => ({ ...task, completed: false })),
    );
    onResetTasks();
  };

  return (
    <Card className="w-full max-w-md bg-white shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-gray-800">
            Daily Tasks
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetTasks}
            className="text-gray-500 hover:text-gray-700"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
        <div className="mt-2">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>
              {completedTasksCount} of {totalTasksCount} completed
            </span>
            <span>{totalPointsEarned} points earned</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {localTasks.map((task) => (
            <motion.li
              key={task.id}
              className={`flex items-start p-3 rounded-lg ${task.completed ? "bg-gray-50" : "bg-white"} border border-gray-100 transition-all duration-200`}
              whileHover={{ scale: 1.01 }}
              animate={{
                opacity: task.completed ? 0.8 : 1,
              }}
            >
              <div className="flex-shrink-0 pt-0.5">
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => handleTaskToggle(task.id)}
                />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-800"}`}
                  >
                    {task.title}
                  </label>
                  <Badge className={`${getCategoryColor(task.category)} ml-2`}>
                    +{task.points} pts
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">{task.description}</p>
              </div>
            </motion.li>
          ))}
        </ul>

        {/* Completion animation */}
        {showCompletionAnimation && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <motion.div
              className="bg-green-100 text-green-800 p-4 rounded-full shadow-lg"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 0.5 }}
            >
              <Trophy className="h-12 w-12" />
            </motion.div>
          </motion.div>
        )}

        {completedTasksCount === totalTasksCount && (
          <motion.div
            className="mt-4 p-3 bg-green-50 border border-green-100 rounded-lg text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <p className="text-green-800 font-medium">
              All tasks completed! Great job!
            </p>
            <p className="text-green-600 text-sm">
              You've earned {totalPointsEarned} points today
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskChecklist;
