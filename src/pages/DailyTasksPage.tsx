import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Nav } from "@/components/Nav";
import { Task } from "../models/Task";
import { CheckCircle, Circle, Edit, Plus, Save, Trash, X } from "lucide-react";

export default function DailyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<
    "low" | "medium" | "high"
  >("medium");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState<"low" | "medium" | "high">(
    "medium"
  );

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("dailyTasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("dailyTasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTaskTitle.trim() === "") return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: newTaskDescription,
      completed: false,
      createdAt: new Date().toISOString(),
      priority: newTaskPriority,
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskPriority("medium");
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            completed: !task.completed,
            completedAt: !task.completed ? new Date().toISOString() : undefined,
          };
        }
        return task;
      })
    );
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditPriority(task.priority);
  };

  const saveEdit = (id: string) => {
    if (editTitle.trim() === "") return;

    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            title: editTitle,
            description: editDescription,
            priority: editPriority,
          };
        }
        return task;
      })
    );

    setEditingTaskId(null);
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
  };

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

  return (
    <>
      <Nav />
      <div className="container mx-auto p-4 bg-white min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Daily Tasks</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
            <CardDescription>Create a new task for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Task Title
                </label>
                <Input
                  type="text"
                  placeholder="Enter task title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Input
                  type="text"
                  placeholder="Enter task description"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Priority
                </label>
                <div className="flex space-x-2">
                  <Button
                    variant={newTaskPriority === "low" ? "default" : "outline"}
                    onClick={() => setNewTaskPriority("low")}
                    className={newTaskPriority === "low" ? "bg-blue-500" : ""}
                  >
                    Low
                  </Button>
                  <Button
                    variant={
                      newTaskPriority === "medium" ? "default" : "outline"
                    }
                    onClick={() => setNewTaskPriority("medium")}
                    className={
                      newTaskPriority === "medium" ? "bg-yellow-500" : ""
                    }
                  >
                    Medium
                  </Button>
                  <Button
                    variant={newTaskPriority === "high" ? "default" : "outline"}
                    onClick={() => setNewTaskPriority("high")}
                    className={newTaskPriority === "high" ? "bg-red-500" : ""}
                  >
                    High
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={addTask} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Your Tasks</h2>

          {tasks.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                No tasks yet. Add your first task above!
              </CardContent>
            </Card>
          ) : (
            tasks.map((task) => (
              <Card
                key={task.id}
                className={`${task.completed ? "bg-gray-50" : "bg-white"}`}
              >
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
                        <Button
                          variant={
                            editPriority === "low" ? "default" : "outline"
                          }
                          onClick={() => setEditPriority("low")}
                          className={
                            editPriority === "low" ? "bg-blue-500" : ""
                          }
                          size="sm"
                        >
                          Low
                        </Button>
                        <Button
                          variant={
                            editPriority === "medium" ? "default" : "outline"
                          }
                          onClick={() => setEditPriority("medium")}
                          className={
                            editPriority === "medium" ? "bg-yellow-500" : ""
                          }
                          size="sm"
                        >
                          Medium
                        </Button>
                        <Button
                          variant={
                            editPriority === "high" ? "default" : "outline"
                          }
                          onClick={() => setEditPriority("high")}
                          className={
                            editPriority === "high" ? "bg-red-500" : ""
                          }
                          size="sm"
                        >
                          High
                        </Button>
                      </div>
                      <div className="flex space-x-2 mt-2">
                        <Button
                          onClick={() => saveEdit(task.id)}
                          variant="default"
                          size="sm"
                        >
                          <Save className="mr-1 h-4 w-4" /> Save
                        </Button>
                        <Button
                          onClick={cancelEdit}
                          variant="outline"
                          size="sm"
                        >
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
                                task.completed
                                  ? "line-through text-gray-500"
                                  : ""
                              }`}
                            >
                              {task.title}
                            </h3>
                            <p
                              className={`text-sm ${
                                task.completed
                                  ? "text-gray-400"
                                  : "text-gray-600"
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
            ))
          )}
        </div>
      </div>
    </>
  );
}
