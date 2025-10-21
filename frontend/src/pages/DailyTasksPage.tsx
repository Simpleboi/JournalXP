import { useUserData } from "@/context/UserDataContext";
import { useState, useEffect } from "react";
import { Task } from "../.././../backend/src/models/Task";
import { CalendarCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { TaskStats } from "@/features/dailyTasks/TaskStats";
import { TaskProgress } from "@/features/dailyTasks/TaskProgress";
import { AddTask } from "@/features/dailyTasks/AddTask";
import { TaskFilter } from "@/features/dailyTasks/TaskFilter";
import { TaskList } from "../features/dailyTasks/TaskList";
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
      const today = new Date().toDateString();
      filtered = filtered.filter(
        (task) => new Date(task.createdAt).toDateString() === today
      );
    } else if (activeTab === "overdue") {
      const now = new Date();
      filtered = filtered.filter(
        (task) =>
          task.dueDate && new Date(task.dueDate) < now && !task.completed
      );
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

  const isOverdue = (task: Task) => {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
  };

  const isDueToday = (task: Task) => {
    if (!task.dueDate) return false;
    const today = new Date().toDateString();
    return new Date(task.dueDate).toDateString() === today;
  };

  const stats = getTaskStats();
  const filteredTasks = getFilteredTasks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header title="Daily Tasks" icon={CalendarCheck} />
      <div className="container mx-auto p-4 bg-white min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Daily Task Stats */}
        <TaskStats />

        {/* Progress Button */}
        <TaskProgress />

        {/* New Task Form */}
        <main className="container mx-auto px-4 py-6 max-w-8xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
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
        </main>
      </div>
    </div>
  );
}
