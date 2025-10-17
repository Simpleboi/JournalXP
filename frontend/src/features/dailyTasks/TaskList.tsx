import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Circle,
  Calendar,
  Edit,
  Timer,
  Trash,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FC } from "react";
import { Badge } from "@/components/ui/badge";
import { getPriorityColor, getPriorityIcon } from "@/utils/DailyTaskUtils";
import { Task } from "@/types/TaskType";
import {
  formatLocalDate,
  isOverdue,
  isDueToday,
  displayDate
} from "@/utils/Date";
import { EmptyTaskList } from "./EmptyTaskList";
import { EditTask } from "./EditTask";

export const categories = [
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

interface TaskListProps {
  searchQuery: string;
  filterPriority: string;
  filterStatus: string;
  editDueDate: string;
  setEditDueDate: React.Dispatch<React.SetStateAction<string>>;
  editDueTime: string;
  setEditDueTime: React.Dispatch<React.SetStateAction<string>>;
  saveEdit: (id: string) => void;
  cancelEdit: () => void;
  toggleTaskCompletion: (id: string) => Promise<void>;
  editCategory: string;
  setEditCategory: React.Dispatch<React.SetStateAction<string>>;
  editTitle: string;
  setEditTitle: React.Dispatch<React.SetStateAction<string>>;
  editDescription: string;
  setEditDescription: React.Dispatch<React.SetStateAction<string>>;
  startEditing: (task: Task) => void;
  deleteTask: (id: string) => Promise<void>;
  editPriority: string;
  setEditPriority: React.Dispatch<
    React.SetStateAction<"medium" | "high" | "low">
  >;
  editingTaskId: string;
  filteredTasks: Task[];
}

export const TaskList: FC<TaskListProps> = ({
  searchQuery,
  filterPriority,
  filterStatus,
  editDueDate,
  setEditDueDate,
  editDueTime,
  setEditDueTime,
  saveEdit,
  cancelEdit,
  toggleTaskCompletion,
  editCategory,
  setEditCategory,
  editTitle,
  setEditTitle,
  startEditing,
  deleteTask,
  editDescription,
  setEditDescription,
  editPriority,
  setEditPriority,
  editingTaskId,
  filteredTasks,
}) => {
  const getCategoryInfo = (category: string) => {
    return categories.find((cat) => cat.value === category) || categories[0];
  };

  return (
    <div className="space-y-4">
      {filteredTasks.length === 0 ? (
        <EmptyTaskList
          searchQuery={searchQuery}
          filterPriority={filterPriority}
          filterStatus={filterStatus}
        />
      ) : (
        <AnimatePresence>
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-200 ${
                  task.completed ? "opacity-75" : ""
                } ${isOverdue(task) ? "border-red-200 bg-red-50/50" : ""} ${
                  isDueToday(task) ? "border-orange-200 bg-orange-50/50" : ""
                }`}
              >
                <CardContent className="p-4">
                  {editingTaskId === task.id ? (
                    <EditTask
                      editTitle={editTitle}
                      setEditTitle={setEditTitle}
                      editDescription={editDescription}
                      setEditDescription={setEditDescription}
                      editPriority={editPriority}
                      setEditPriority={setEditPriority}
                      editCategory={editCategory}
                      setEditCategory={setEditCategory}
                      editDueTime={editDueTime}
                      setEditDueTime={setEditDueTime}
                      editDueDate={editDueDate}
                      setEditDueDate={setEditDueDate}
                      saveEdit={saveEdit}
                      cancelEdit={cancelEdit}
                      task={task}
                    />
                  ) : (
                    // Task lists are here
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <button
                          onClick={() => toggleTaskCompletion(task.id)}
                          className="mt-1 text-gray-400 hover:text-green-500 transition-colors"
                        >
                          {task.completed ? (
                            <CheckCircle className="h-6 w-6 text-green-500" />
                          ) : (
                            <Circle className="h-6 w-6" />
                          )}
                        </button>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3
                              className={`font-medium ${
                                task.completed
                                  ? "line-through text-gray-500"
                                  : "text-gray-900"
                              }`}
                            >
                              {task.title}
                            </h3>

                            {isOverdue(task) ? (
                              <Badge variant="destructive" className="text-xs">
                                Overdue
                              </Badge>
                            ) : (
                              isDueToday(task) &&
                              !task.completed && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-orange-50 text-orange-700 border-orange-200"
                                >
                                  Due Today
                                </Badge>
                              )
                            )}
                          </div>

                          {task.description && (
                            <p
                              className={`text-sm mb-2 ${
                                task.completed
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }`}
                            >
                              {task.description}
                            </p>
                          )}

                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              className={`text-xs ${getPriorityColor(
                                task.priority
                              )}`}
                            >
                              {getPriorityIcon(task.priority)}
                              <span className="ml-1 capitalize">
                                {task.priority}
                              </span>
                            </Badge>

                            {task.category && (
                              <Badge
                                className={`text-xs ${
                                  getCategoryInfo(task.category).color
                                }`}
                              >
                                {getCategoryInfo(task.category).label}
                              </Badge>
                            )}

                            <span className="text-xs text-gray-500 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Created: {displayDate(task.createdAt)}
                            </span>

                            {task.dueDate && (
                              <span
                                className={`text-xs flex items-center ${
                                  isOverdue(task)
                                    ? "text-red-600"
                                    : isDueToday(task)
                                    ? "text-orange-600"
                                    : "text-gray-500"
                                }`}
                              >
                                <Timer className="h-3 w-3 mr-1" />
                                Due: {formatLocalDate(task.dueDate)}
                                {task.dueTime && (
                                  <span className="ml-1">
                                    at{" "}
                                    {new Date(
                                      `2000-01-01T${task.dueTime}`
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-1 ml-4">
                        <Button
                          onClick={() => startEditing(task)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-blue-500"
                          disabled={task.completed}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => deleteTask(task.id)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};
