import { useState, useEffect } from "react";
import { Task } from "../models/Task";
import { Nav } from "@/components/Nav";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TaskList from "@/features/dailyTasks/TaskList";
import { defaultTasks } from "@/data/defaultTasks";

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

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("dailyTasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  6;


  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("dailyTasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: newTaskDescription,
      completed: false,
      createdAt: new Date().toISOString(),
      priority: newTaskPriority,
    };

    setTasks((prev) => [...prev, newTask]);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskPriority("medium");
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed
                ? new Date().toISOString()
                : undefined,
            }
          : task
      )
    );
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditPriority(task.priority);
  };

  const saveEdit = (id: string) => {
    if (!editTitle.trim()) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              title: editTitle,
              description: editDescription,
              priority: editPriority,
            }
          : task
      )
    );

    setEditingTaskId(null);
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
  };

  return (
    <>
      <Nav />
      <div className="container mx-auto p-4 bg-white min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Daily Tasks</h1>

        {/* New Task Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
            <CardDescription>Create a task to complete today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Task Title
              </label>
              <Input
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
                placeholder="Enter task description"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              {["low", "medium", "high"].map((priority) => (
                <Button
                  key={priority}
                  variant={newTaskPriority === priority ? "default" : "outline"}
                  className={
                    newTaskPriority === priority
                      ? priority === "low"
                        ? "bg-blue-500"
                        : priority === "medium"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                      : ""
                  }
                  onClick={() =>
                    setNewTaskPriority(priority as "low" | "medium" | "high")
                  }
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Button>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={addTask} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </CardFooter>
        </Card>

        {/* Task List */}
        <TaskList
          tasks={tasks}
          editingTaskId={editingTaskId}
          editTitle={editTitle}
          editDescription={editDescription}
          editPriority={editPriority}
          toggleTaskCompletion={toggleTaskCompletion}
          deleteTask={deleteTask}
          startEditing={startEditing}
          saveEdit={saveEdit}
          cancelEdit={cancelEdit}
          setEditTitle={setEditTitle}
          setEditDescription={setEditDescription}
          setEditPriority={setEditPriority}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      </div>
    </>
  );
}
