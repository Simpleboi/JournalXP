import { useUserData } from "@/context/UserDataContext";
import { useState, useEffect } from "react";
import { Task } from "@/types/TaskType";
import { CalendarCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { TaskStats } from "@/features/dailyTasks/TaskStats";
import { TaskProgress } from "@/features/dailyTasks/TaskProgress";
import { AddTask } from "@/features/dailyTasks/AddTask";
import { TaskFilter } from "@/features/dailyTasks/TaskFilter";
import { TaskList } from "@/features/dailyTasks/TaskList";
import { TaskTabs } from "@/features/dailyTasks/TaskTabs";
import { useToast } from "@/hooks/useToast";
import {
  fetchTasksFromServer,
  deleteTaskInServer,
  saveTaskToServer,
  completeTaskInServer,
  updateTaskInServer,
} from "@/services/taskService";
import { NewTaskPayload } from "@/types/TaskType";
import { FeatureNotice } from "@/components/FeatureNotice";
import { motion } from "framer-motion";

// Ambient colors for the tasks page
const taskAmbience = {
  primary: 'rgba(99, 102, 241, 0.18)',     // Indigo
  secondary: 'rgba(139, 92, 246, 0.15)',   // Violet
  accent: 'rgba(59, 130, 246, 0.15)',      // Blue
  warm: 'rgba(236, 72, 153, 0.10)',        // Pink
};

interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
  streak: number;
}

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
  const [newTaskCategory, setNewTaskCategory] = useState("personal");
  const [editCategory, setEditCategory] = useState("personal");
  const [editDueDate, setEditDueDate] = useState("");
  const [editDueTime, setEditDueTime] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("created");
  const [activeTab, setActiveTab] = useState("all");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskDueTime, setNewTaskDueTime] = useState("");
  const { showToast } = useToast();

  // Load tasks from firestore on mount
  useEffect(() => {
    const loadTasks = async () => {
      if (!user) return;

      const firestoreTasks = await fetchTasksFromServer();
      setTasks(firestoreTasks);
    };

    loadTasks();
  }, [user]);

  // function to add and save a task
  const addTask = async () => {
    if (!newTaskTitle.trim()) return;

    // 1) Create the new Task
    const payload: NewTaskPayload = {
      title: newTaskTitle,
      description: newTaskDescription,
      priority: newTaskPriority,
      category: newTaskCategory,
      dueDate: newTaskDueDate || undefined,
      dueTime: newTaskDueTime || undefined,
    };

    const created = await saveTaskToServer(payload);
    setTasks((prev) => [...prev, created]);

    // 2) Reset the task form
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskPriority("medium");
    setNewTaskCategory("personal");
    setNewTaskDueDate("");
    setNewTaskDueTime("");
    await refreshUserData();
  };

  // To handle completing a task
  const toggleTaskCompletion = async (id: string) => {
    if (!user) return;
    const task = tasks.find((t) => t.id === id);
    if (!task || task.completed) return; // already done → no-op

    // optimistic UI
    const optimistic = tasks.map((t) =>
      t.id === id
        ? { ...t, completed: true, completedAt: new Date().toISOString() }
        : t
    );
    setTasks(optimistic);

    try {
      await completeTaskInServer(id);
      await refreshUserData();
      showToast({
        title: "+20 Points!",
        description: "Your task was successfully completed! Good job 🙂",
      });
    } catch (e) {
      // rollback on failure
      setTasks(tasks);
      showToast({
        title: "Oops",
        description: "Couldn’t complete the task. Please try again.",
      });
    }
  };

  // This function edits a task when the user clicks on 'edit'
  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditPriority(task.priority);
    setEditCategory(task.category || "personal");
    setEditDueDate(task.dueDate || "");
    setEditDueTime(task.dueTime || "");
  };

  // To handle deleting a task
  const deleteTask = async (id: string) => {
    if (!user) return;
    await deleteTaskInServer(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // This save's the edit to the task
  const saveEdit = async (id: string) => {
    if (editTitle.trim() === "") return;

    const originalTask = tasks.find((task) => task.id === id);
    if (!originalTask) return;

    const patch = {
      title: editTitle,
      description: editDescription,
      priority: editPriority,
      category: editCategory,
      dueDate: editDueDate || undefined,
      dueTime: editDueTime || undefined,
    };

    const updatePromise = updateTaskInServer(id, patch);

    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? {
            ...task,
            ...patch,
          }
          : task
      )
    );

    try {
      const updatedTask = await updatePromise;
      setTasks((current) =>
        current.map((task) => (task.id === id ? updatedTask : task))
      );
      setEditingTaskId(null);
    } catch (error: any) {
      setTasks((current) =>
        current.map((task) => (task.id === id ? originalTask : task))
      );
      setEditingTaskId(id);
      setEditTitle(originalTask.title);
      setEditDescription(originalTask.description);
      setEditPriority(originalTask.priority);
      setEditCategory(originalTask.category || "personal");
      setEditDueDate(originalTask.dueDate || "");
      setEditDueTime(originalTask.dueTime || "");
      // Rollback error message
      showToast({
        title: "Update failed",
        description:
          error?.message || "Couldn’t update the task. Please try again.",
      });
    }
  };

  // this cancel's the task edit
  const cancelEdit = () => {
    setEditingTaskId(null);
  };

  const getFilteredTasks = () => {
    let filtered = tasks;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by priority
    if (filterPriority !== "all") {
      filtered = filtered.filter((task) => task.priority === filterPriority);
    }

    // Filter by status
    if (filterStatus === "completed") {
      filtered = filtered.filter((task) => task.completed);
    } else if (filterStatus === "pending") {
      filtered = filtered.filter((task) => !task.completed);
    }

    // Filter by category
    if (filterCategory !== "all") {
      filtered = filtered.filter((task) => task.category === filterCategory);
    }

    // Filter by active tab
    if (activeTab === "today") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      filtered = filtered.filter((task) => {
        if (!task.dueDate) return false;
        const taskDueDate = new Date(task.dueDate);
        taskDueDate.setHours(0, 0, 0, 0);
        return taskDueDate >= today && taskDueDate < tomorrow;
      });
    } else if (activeTab === "overdue") {
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      filtered = filtered.filter((task) => {
        if (!task.dueDate || task.completed) return false;
        const taskDueDate = new Date(task.dueDate);
        taskDueDate.setHours(0, 0, 0, 0);
        return taskDueDate < now;
      });
    } else if (activeTab === "completed") {
      filtered = filtered.filter((task) => task.completed);
    }

    // Sort tasks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "dueDate":
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case "created":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

    return filtered;
  };

  // Return a value based on Stats
  const getTaskStats = (): TaskStats => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = total - completed;
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    // Calculate streak (consecutive days with completed tasks)
    const today = new Date().toDateString();
    const todayTasks = tasks.filter(
      (task) => new Date(task.createdAt).toDateString() === today
    );
    const todayCompleted = todayTasks.filter((task) => task.completed).length;
    const streak = todayCompleted > 0 ? 7 : 0; // Simplified streak calculation

    return { total, completed, pending, completionRate, streak };
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="min-h-screen relative">
      {/* Animated ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />

        {/* Floating ambient orbs */}
        <motion.div
          className="absolute top-1/4 -left-16 sm:-left-32 w-48 h-48 sm:w-96 sm:h-96 rounded-full blur-2xl sm:blur-3xl"
          style={{ background: taskAmbience.primary }}
          animate={{
            x: [0, 20, 0],
            y: [0, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 -right-12 sm:-right-24 w-40 h-40 sm:w-80 sm:h-80 rounded-full blur-2xl sm:blur-3xl"
          style={{ background: taskAmbience.secondary }}
          animate={{
            x: [0, -15, 0],
            y: [0, 20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-36 h-36 sm:w-72 sm:h-72 rounded-full blur-2xl sm:blur-3xl"
          style={{ background: taskAmbience.accent }}
          animate={{
            x: [0, 25, 0],
            y: [0, -12, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-32 h-32 sm:w-64 sm:h-64 rounded-full blur-2xl sm:blur-3xl hidden sm:block"
          style={{ background: taskAmbience.warm }}
          animate={{
            x: [0, -18, 0],
            y: [0, 18, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 8,
          }}
        />
      </div>

      <Header title="Daily Tasks" icon={CalendarCheck} />

      <main className="relative container mx-auto px-2 sm:px-4 py-4 sm:py-8 pb-12">
        {/* Page Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 sm:mb-8 max-w-6xl mx-auto"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <motion.div
              className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <CalendarCheck className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </motion.div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-700 via-purple-600 to-violet-600 pb-2 bg-clip-text text-transparent">
                Daily Tasks
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Stay organized and accomplish your goals
              </p>
            </div>
          </div>
          <motion.div
            className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 backdrop-blur-sm border-2 border-indigo-200/60 rounded-xl sm:rounded-2xl shadow-sm"
            whileHover={{ scale: 1.02 }}
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />
            <span className="font-semibold text-indigo-700 text-sm sm:text-base">+20 XP per task</span>
          </motion.div>
        </motion.div>

        {/* Daily Task Stats */}
        <div className="max-w-6xl mx-auto">
          <TaskStats />
        </div>

        {/* Progress */}
        <div className="max-w-6xl mx-auto">
          <TaskProgress tasks={tasks} />
        </div>

        {/* Preview if user not logged in */}
        {!user && (
          <div className="max-w-6xl mx-auto mb-6">
            <FeatureNotice
              title="You're in preview mode"
              message="Log in to add tasks, track progress, and save your day."
            />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
            <AddTask
              newTaskCategory={newTaskCategory}
              setNewTaskCategory={setNewTaskCategory}
              newTaskDescription={newTaskDescription}
              setNewTaskDescription={setNewTaskDescription}
              newTaskPriority={newTaskPriority}
              setNewTaskPriority={setNewTaskPriority}
              newTaskDueDate={newTaskDueDate}
              setNewTaskDueDate={setNewTaskDueDate}
              newTaskDueTime={newTaskDueTime}
              setNewTaskDueTime={setNewTaskDueTime}
              newTaskTitle={newTaskTitle}
              setNewTaskTitle={setNewTaskTitle}
              addTask={addTask}
            />
            <div className="lg:col-span-2">
              {/* Task Filter */}
              <TaskFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterPriority={filterPriority}
                setFilterPriority={setFilterPriority}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />

              {/* To filter between tasks */}
              <TaskTabs activeTab={activeTab} setActiveTab={setActiveTab} />

              {/* To display the tasks */}
              <TaskList
                searchQuery={searchQuery}
                filterPriority={filterPriority}
                filterStatus={filterStatus}
                editDueDate={editDueDate}
                setEditDueDate={setEditDueDate}
                editDueTime={editDueTime}
                setEditDueTime={setEditDueTime}
                saveEdit={saveEdit}
                cancelEdit={cancelEdit}
                toggleTaskCompletion={toggleTaskCompletion}
                editCategory={editCategory}
                setEditCategory={setEditCategory}
                editTitle={editTitle}
                setEditTitle={setEditTitle}
                editDescription={editDescription}
                setEditDescription={setEditDescription}
                startEditing={startEditing}
                deleteTask={deleteTask}
                editPriority={editPriority}
                setEditPriority={setEditPriority}
                editingTaskId={editingTaskId}
                filteredTasks={filteredTasks}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
