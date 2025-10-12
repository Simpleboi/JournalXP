import { useUserData } from "@/context/UserDataContext";
import { useState, useEffect } from "react";
import { Task } from "../.././../backend/src/models/Task";
import { CalendarCheck } from "lucide-react";
// import { completeTask } from "@/services/taskService";
import { useAuth } from "@/context/AuthContext";
// import { awardNewTaskCreation } from "@/services/taskService";
import { levelData } from "@/data/levels";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getRank } from "@/utils/rankUtils";
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
  completeTaskInServer
} from "@/services/taskService";

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

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: newTaskDescription,
      completed: false,
      createdAt: new Date().toISOString(),
      priority: newTaskPriority,
      category: newTaskCategory,
      dueDate: newTaskDueDate || undefined,
      dueTime: newTaskDueTime || undefined,
    };

    await saveTaskToServer(newTask)
    // await awardNewTaskCreation(user.uid);

    setTasks((prev) => [...prev, newTask]);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskPriority("medium");
    setNewTaskCategory("personal");
    setNewTaskDueDate("");
    setNewTaskDueTime("");
  };

  // To handle updating a task
  const updateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
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
          completeTaskInServer(task.id).then(async () => {
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

    // Show the toast of the user gaining points
    showToast({
      title: "+20 Points!",
      description: "Your task was successfully completed! Good Job :)",
    });

    setTasks(updatedTasks);
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
            category: editCategory,
            dueDate: editDueDate || undefined,
            dueTime: editDueTime || undefined,
          };
        }
        return task;
      })
    );

    setEditingTaskId(null);
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
                isOverdue={isOverdue}
                isDueToday={isDueToday}
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
