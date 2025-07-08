import { useUserData } from "@/context/UserDataContext";
import { useState, useEffect } from "react";
import { Task } from "../models/Task";
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
import { Plus, ArrowLeft, CalendarCheck } from "lucide-react";
import TaskList from "@/features/dailyTasks/TaskList";
import { saveTaskToFirestore, completeTask } from "@/services/taskService";
import { useAuth } from "@/context/AuthContext";
import {
  fetchTasksFromFirestore,
  deleteTaskFromFirestore,
} from "@/services/taskService";
import { levelData } from "@/data/levels";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getRank } from "@/utils/rankUtils";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";

export default function DailyTasksPage() {
  // For auth context
  const { user } = useAuth();
  const { userData, refreshUserData } = useUserData();
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
    const loadTasks = async () => {
      if (!user) return;

      const firestoreTasks = await fetchTasksFromFirestore(user.uid);
      setTasks(firestoreTasks);
    };

    loadTasks();
  }, [user]);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("dailyTasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = async () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: newTaskDescription,
      completed: false,
      createdAt: new Date().toISOString(),
      priority: newTaskPriority,
    };

    await saveTaskToFirestore(user.uid, newTask);

    setTasks((prev) => [...prev, newTask]);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskPriority("medium");
  };

  // To handle updating a task
  const updateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  // To handle deleting a task
  const deleteTask = async (id: string) => {
    if (!user) return;

    // Remove from Firestore
    await deleteTaskFromFirestore(user.uid, id);

    // Update local state
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // To handle completing a task
  const toggleTaskCompletion = async (id: string) => {
    if (!user) return;

    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        const updated = {
          ...task,
          completed: !task.completed,
          completedAt: !task.completed ? new Date().toISOString() : undefined,
        };
        if (!task.completed) {
          completeTask(user.uid, task.id).then(async () => {
            // 🔄 Refresh user data to get updated points
            await refreshUserData();

            // 🎯 After refreshing, check if user levels up
            const currentPoints = userData?.points || 0;
            const currentLevel = userData?.level || 1;
            const currentLevelData = levelData.find(
              (l) => l.level === currentLevel
            );
            const nextLevelData = levelData.find(
              (l) => l.level === currentLevel + 1
            );

            if (
              nextLevelData &&
              currentPoints >= nextLevelData.totalPointsRequired
            ) {
              const userRef = doc(db, "users", user.uid);

              await updateDoc(userRef, {
                level: currentLevel + 1,
                rank: getRank(currentLevel + 1), // Optional: define a rank system
                pointsToNextRank: nextLevelData.pointsRequired,
                levelProgress:
                  ((currentPoints -
                    nextLevelData.totalPointsRequired +
                    nextLevelData.pointsRequired) /
                    nextLevelData.pointsRequired) *
                  100,
              });

              await refreshUserData(); // Update again after leveling up
            }
          });
        }
        return updated;
      }
      return task;
    });

    setTasks(updatedTasks);
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
      <Header title="Daily Tasks" icon={CalendarCheck} />
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
