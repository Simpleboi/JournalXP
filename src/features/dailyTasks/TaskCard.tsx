// TaskCard.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle, Circle, Edit, Save, Trash, X } from "lucide-react";
import { Task } from "@/models/Task";

interface TaskCardProps {
  task: Task;
  editingTaskId: string | null;
  editTitle: string;
  editDescription: string;
  editPriority: "low" | "medium" | "high";
  toggleTaskCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
  startEditing: (task: Task) => void;
  saveEdit: (id: string) => void;
  cancelEdit: () => void;
  setEditTitle: (value: string) => void;
  setEditDescription: (value: string) => void;
  setEditPriority: (value: "low" | "medium" | "high") => void;
}

const getPriorityColor = (priority: "low" | "medium" | "high") => {
  switch (priority) {
    case "low":
      return "bg-blue-100 text-blue-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "high":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const TaskCard = ({
  task,
  editingTaskId,
  editTitle,
  editDescription,
  editPriority,
  toggleTaskCompletion,
  deleteTask,
  startEditing,
  saveEdit,
  cancelEdit,
  setEditTitle,
  setEditDescription,
  setEditPriority,
}: TaskCardProps) => {
  return (
    <Card className={`${task.completed ? "bg-gray-50" : "bg-white"}`}>
      <CardContent className="p-4">
        {editingTaskId === task.id ? (
          <div className="space-y-3">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="font-medium"
            />
            <Input
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
            <div className="flex space-x-2">
              {(["low", "medium", "high"] as const).map((priority) => (
                <Button
                  key={priority}
                  variant={editPriority === priority ? "default" : "outline"}
                  onClick={() => setEditPriority(priority)}
                  className={
                    editPriority === priority
                      ? priority === "low"
                        ? "bg-blue-500"
                        : priority === "medium"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                      : ""
                  }
                  size="sm"
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Button>
              ))}
            </div>
            <div className="flex space-x-2 mt-2">
              <Button
                onClick={() => saveEdit(task.id)}
                variant="default"
                size="sm"
              >
                <Save className="mr-1 h-4 w-4" /> Save
              </Button>
              <Button onClick={cancelEdit} variant="outline" size="sm">
                <X className="mr-1 h-4 w-4" /> Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center">
                <button
                  onClick={() => toggleTaskCompletion(task.id)}
                  className="mr-2 text-gray-500 hover:text-green-500 transition-colors"
                >
                  {task.completed ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <Circle className="h-6 w-6" />
                  )}
                </button>
                <div>
                  <h3
                    className={`font-medium ${
                      task.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {task.title}
                  </h3>
                  <p
                    className={`text-sm ${
                      task.completed ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {task.description}
                  </p>
                  <div className="flex items-center mt-1">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority.charAt(0).toUpperCase() +
                        task.priority.slice(1)}{" "}
                      Priority
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-1">
              <Button
                onClick={() => startEditing(task)}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={task.completed}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => deleteTask(task.id)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;
