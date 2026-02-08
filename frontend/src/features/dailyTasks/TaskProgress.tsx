import { Task } from "@/types/TaskType";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface TaskProgressProps {
  tasks: Task[];
}

export const TaskProgress = ({ tasks }: TaskProgressProps) => {
  const { theme } = useTheme();
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const value = total > 0 ? Math.round(Math.min((completed / total) * 100, 100)) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-6 sm:mb-8 bg-white/90 backdrop-blur-sm border-2 border-gray-200/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="p-1.5 sm:p-2 rounded-lg"
            style={{ background: theme.colors.gradient }}
          >
            <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Today's Progress</h3>
        </div>
        <span
          className="text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full"
          style={{
            color: theme.colors.primary,
            backgroundColor: theme.colors.primary + '15',
          }}
        >
          {completed} of {total} tasks
        </span>
      </div>
      <div className="relative">
        <div
          className="relative h-3 sm:h-4 w-full overflow-hidden rounded-full"
          style={{ backgroundColor: theme.colors.primary + '18' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${value}%`,
              background: theme.colors.gradient,
            }}
          />
        </div>
        {value > 0 && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs font-bold text-white"
          >
            {value}%
          </motion.span>
        )}
      </div>
    </motion.div>
  );
};


