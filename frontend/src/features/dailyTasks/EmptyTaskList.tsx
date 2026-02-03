import { CheckCircle, ListTodo } from "lucide-react";
import { FC } from "react";
import { motion } from "framer-motion";

interface EmptyTaskListProps {
  searchQuery: string;
  filterPriority: string;
  filterStatus: string;
}

export const EmptyTaskList: FC<EmptyTaskListProps> = ({
  searchQuery,
  filterPriority,
  filterStatus,
}) => {
  const hasFilters = searchQuery || filterPriority !== "all" || filterStatus !== "all";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-sm border-2 border-gray-200/80 rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center shadow-md"
    >
      <div className="flex flex-col items-center">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 mb-4">
          {hasFilters ? (
            <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-500" />
          ) : (
            <ListTodo className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-500" />
          )}
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
          {hasFilters ? "No matching tasks" : "No tasks yet"}
        </h3>
        <p className="text-gray-600 text-sm sm:text-base max-w-sm">
          {hasFilters
            ? "Try adjusting your filters or search query to find your tasks."
            : "Add your first task using the form on the left to get started!"}
        </p>
      </div>
    </motion.div>
  );
};
