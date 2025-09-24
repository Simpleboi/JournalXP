import { Flag, Target, Zap } from "lucide-react";

/**
 * @returns an icon that represents priority
 */
export const getPriorityIcon = (priority: "low" | "medium" | "high") => {
  switch (priority) {
    case "low":
      return <Flag className="h-3 w-3" />;
    case "medium":
      return <Target className="h-3 w-3" />;
    case "high":
      return <Zap className="h-3 w-3" />;
    default:
      return <Flag className="h-3 w-3" />;
  }
};

/**
 * @returns a color based on priority
 */
export const getPriorityColor = (priority: "low" | "medium" | "high") => {
  switch (priority) {
    case "low":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

//
// export const getCategoryInfo = (category: string) => {
//     return categories.find(cat => cat.value === category) || categories[0];
//   };

/**
 * @param tasksCreated - a number to represent the total number of tasks the user completed.
 * @param totalTasks - a number to represent the total number of tasks the user made
 * @returns a percentage value of the completion rate
 */
export const CompletionRate = (
  tasksCreated: number,
  tasksCompleted: number
): number => {
  if (tasksCreated === 0) return 0; 
  return (tasksCompleted / tasksCreated) * 100;
};
