import { Flag, Target, Zap } from "lucide-react";

/**
 * @returns an icon that represents priority
 */
const getPriorityIcon = (priority: "low" | "medium" | "high") => {
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
