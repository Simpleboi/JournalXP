import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  Sun,
  Moon,
  Cloud,
  Heart,
  Sparkles,
  Coffee,
  Battery,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  Check,
  Plus,
  Trash2,
  Feather,
  Star,
  BookHeart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  category: "must" | "nice" | "selfcare";
}

interface TimeBlock {
  id: string;
  time: string;
  activity: string;
  category?: "focus" | "break" | "meeting" | "selfcare";
}

export default function DayPlannerPage() {
  const [intention, setIntention] = useState("");
  const [energyLevel, setEnergyLevel] = useState(50);
  const [reflection, setReflection] = useState("");
  
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", text: "Review study notes", completed: false, category: "must" },
    { id: "2", text: "Submit assignment", completed: true, category: "must" },
    { id: "3", text: "Organize desk", completed: false, category: "nice" },
    { id: "4", text: "Call a friend", completed: false, category: "nice" },
    { id: "5", text: "10-minute meditation", completed: false, category: "selfcare" },
    { id: "6", text: "Evening walk", completed: false, category: "selfcare" },
  ]);

  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([
    { id: "1", time: "8:00 AM", activity: "Morning routine & breakfast", category: "selfcare" },
    { id: "2", time: "9:00 AM", activity: "Deep focus work", category: "focus" },
    { id: "3", time: "10:00 AM", activity: "", category: undefined },
    { id: "4", time: "11:00 AM", activity: "Study session", category: "focus" },
    { id: "5", time: "12:00 PM", activity: "Lunch break", category: "break" },
    { id: "6", time: "1:00 PM", activity: "", category: undefined },
    { id: "7", time: "2:00 PM", activity: "Class / Meeting", category: "meeting" },
    { id: "8", time: "3:00 PM", activity: "", category: undefined },
    { id: "9", time: "4:00 PM", activity: "Light tasks", category: "focus" },
    { id: "10", time: "5:00 PM", activity: "Exercise or walk", category: "selfcare" },
  ]);

  const [newTask, setNewTask] = useState({ must: "", nice: "", selfcare: "" });

  // Get current date formatted nicely
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);
  
  // Get greeting based on time
  const hour = today.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const greetingIcon = hour < 12 ? <Sun className="h-5 w-5" /> : hour < 17 ? <Cloud className="h-5 w-5" /> : <Moon className="h-5 w-5" />;

  // Energy level labels and suggestions
  const getEnergyLabel = () => {
    if (energyLevel < 33) return { label: "Low energy", suggestion: "Focus on essentials only. Be gentle with yourself.", icon: <BatteryLow className="h-4 w-4" /> };
    if (energyLevel < 66) return { label: "Medium energy", suggestion: "A balanced day ahead. Pace yourself.", icon: <BatteryMedium className="h-4 w-4" /> };
    return { label: "High energy", suggestion: "Great day for tackling bigger tasks!", icon: <BatteryFull className="h-4 w-4" /> };
  };

  const energyInfo = getEnergyLabel();

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = (category: "must" | "nice" | "selfcare") => {
    if (!newTask[category].trim()) return;
    
    setTasks([...tasks, {
      id: Date.now().toString(),
      text: newTask[category],
      completed: false,
      category,
    }]);
    setNewTask({ ...newTask, [category]: "" });
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const updateTimeBlock = (blockId: string, activity: string) => {
    setTimeBlocks(timeBlocks.map(block =>
      block.id === blockId ? { ...block, activity } : block
    ));
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "focus": return "bg-indigo-100 border-indigo-200 text-indigo-700";
      case "break": return "bg-emerald-100 border-emerald-200 text-emerald-700";
      case "meeting": return "bg-amber-100 border-amber-200 text-amber-700";
      case "selfcare": return "bg-rose-100 border-rose-200 text-rose-700";
      default: return "bg-gray-50 border-gray-100 text-gray-500";
    }
  };

  const mustDoTasks = tasks.filter(t => t.category === "must");
  const niceDoTasks = tasks.filter(t => t.category === "nice");
  const selfCareTasks = tasks.filter(t => t.category === "selfcare");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" asChild className="text-indigo-600 hover:bg-indigo-50">
                <Link to="/">
                  <ChevronLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <div className="flex items-center gap-2 text-indigo-600">
                  {greetingIcon}
                  <span className="text-sm font-medium">{greeting}</span>
                </div>
                <h1 className="text-xl font-semibold text-gray-800">
                  {formattedDate}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-indigo-200">
                <Sparkles className="h-3 w-3 mr-1" />
                Day Planner
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Today's Intention */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 backdrop-blur-sm border-indigo-100 shadow-lg shadow-indigo-100/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-indigo-700">
                <Feather className="h-5 w-5" />
                Today's Intention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="What's your focus for today? (e.g., 'Stay present and kind to myself')"
                className="bg-white/80 border-indigo-100 focus:border-indigo-300 focus:ring-indigo-200 text-gray-700 placeholder:text-gray-400"
              />
              <p className="text-xs text-indigo-500 mt-2 italic">
                Set a gentle intention to guide your day with purpose.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Energy Level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-teal-100 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-teal-700 text-base">
                <Battery className="h-5 w-5" />
                How's your energy today?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500 w-12">Low</span>
                  <Slider
                    value={[energyLevel]}
                    onValueChange={(v) => setEnergyLevel(v[0])}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500 w-12 text-right">High</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-teal-50 to-cyan-50">
                  {energyInfo.icon}
                  <span className="font-medium text-teal-700">{energyInfo.label}</span>
                  <span className="text-sm text-teal-600">— {energyInfo.suggestion}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Time-Blocked Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-md h-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Coffee className="h-5 w-5" />
                  Daily Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {timeBlocks.map((block) => (
                  <motion.div
                    key={block.id}
                    whileHover={{ scale: 1.01 }}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${getCategoryColor(block.category)}`}
                  >
                    <span className="text-xs font-medium w-16 opacity-70">
                      {block.time}
                    </span>
                    <div className="w-px h-6 bg-current opacity-20" />
                    <Input
                      value={block.activity}
                      onChange={(e) => updateTimeBlock(block.id, e.target.value)}
                      placeholder="What's happening?"
                      className="flex-1 bg-transparent border-0 shadow-none focus:ring-0 text-sm placeholder:opacity-50"
                    />
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Flexible Task Lists */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Must Do */}
            <Card className="bg-gradient-to-br from-indigo-50/80 to-blue-50/80 backdrop-blur-sm border-indigo-100 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-indigo-700 text-base">
                  <Star className="h-4 w-4" />
                  Must Do
                  <Badge variant="secondary" className="ml-auto bg-indigo-100 text-indigo-600">
                    {mustDoTasks.filter(t => t.completed).length}/{mustDoTasks.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {mustDoTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                      task.completed ? "opacity-50" : ""
                    }`}
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="border-indigo-300 data-[state=checked]:bg-indigo-500"
                    />
                    <span className={`flex-1 text-sm ${task.completed ? "line-through text-gray-400" : "text-gray-700"}`}>
                      {task.text}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTask(task.id)}
                      className="h-6 w-6 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2 mt-3">
                  <Input
                    value={newTask.must}
                    onChange={(e) => setNewTask({ ...newTask, must: e.target.value })}
                    placeholder="Add a task..."
                    className="text-sm bg-white/60"
                    onKeyPress={(e) => e.key === "Enter" && addTask("must")}
                  />
                  <Button
                    size="icon"
                    onClick={() => addTask("must")}
                    className="bg-indigo-500 hover:bg-indigo-600"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Nice To Do */}
            <Card className="bg-gradient-to-br from-teal-50/80 to-emerald-50/80 backdrop-blur-sm border-teal-100 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-teal-700 text-base">
                  <Sparkles className="h-4 w-4" />
                  Nice to Do
                  <Badge variant="secondary" className="ml-auto bg-teal-100 text-teal-600">
                    {niceDoTasks.filter(t => t.completed).length}/{niceDoTasks.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {niceDoTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                      task.completed ? "opacity-50" : ""
                    }`}
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="border-teal-300 data-[state=checked]:bg-teal-500"
                    />
                    <span className={`flex-1 text-sm ${task.completed ? "line-through text-gray-400" : "text-gray-700"}`}>
                      {task.text}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTask(task.id)}
                      className="h-6 w-6 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2 mt-3">
                  <Input
                    value={newTask.nice}
                    onChange={(e) => setNewTask({ ...newTask, nice: e.target.value })}
                    placeholder="Add a task..."
                    className="text-sm bg-white/60"
                    onKeyPress={(e) => e.key === "Enter" && addTask("nice")}
                  />
                  <Button
                    size="icon"
                    onClick={() => addTask("nice")}
                    className="bg-teal-500 hover:bg-teal-600"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Self-Care */}
            <Card className="bg-gradient-to-br from-rose-50/80 to-pink-50/80 backdrop-blur-sm border-rose-100 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-rose-700 text-base">
                  <Heart className="h-4 w-4" />
                  Self-Care
                  <Badge variant="secondary" className="ml-auto bg-rose-100 text-rose-600">
                    {selfCareTasks.filter(t => t.completed).length}/{selfCareTasks.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {selfCareTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                      task.completed ? "opacity-50" : ""
                    }`}
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="border-rose-300 data-[state=checked]:bg-rose-500"
                    />
                    <span className={`flex-1 text-sm ${task.completed ? "line-through text-gray-400" : "text-gray-700"}`}>
                      {task.text}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTask(task.id)}
                      className="h-6 w-6 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2 mt-3">
                  <Input
                    value={newTask.selfcare}
                    onChange={(e) => setNewTask({ ...newTask, selfcare: e.target.value })}
                    placeholder="Add a self-care activity..."
                    className="text-sm bg-white/60"
                    onKeyPress={(e) => e.key === "Enter" && addTask("selfcare")}
                  />
                  <Button
                    size="icon"
                    onClick={() => addTask("selfcare")}
                    className="bg-rose-500 hover:bg-rose-600"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* End-of-Day Reflection Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-purple-50/80 via-indigo-50/80 to-teal-50/80 backdrop-blur-sm border-purple-100 shadow-lg shadow-purple-100/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <BookHeart className="h-5 w-5" />
                End-of-Day Reflection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white/60 border border-purple-100">
                    <p className="text-sm font-medium text-purple-600 mb-2">What went well?</p>
                    <Textarea
                      placeholder="Celebrate your wins, big or small..."
                      className="bg-transparent border-0 shadow-none resize-none text-sm placeholder:text-purple-300"
                      rows={3}
                    />
                  </div>
                  <div className="p-4 rounded-xl bg-white/60 border border-indigo-100">
                    <p className="text-sm font-medium text-indigo-600 mb-2">What did I learn?</p>
                    <Textarea
                      placeholder="Insights and growth moments..."
                      className="bg-transparent border-0 shadow-none resize-none text-sm placeholder:text-indigo-300"
                      rows={3}
                    />
                  </div>
                  <div className="p-4 rounded-xl bg-white/60 border border-teal-100">
                    <p className="text-sm font-medium text-teal-600 mb-2">Gratitude</p>
                    <Textarea
                      placeholder="Three things I'm grateful for..."
                      className="bg-transparent border-0 shadow-none resize-none text-sm placeholder:text-teal-300"
                      rows={3}
                    />
                  </div>
                </div>
                <p className="text-xs text-center text-purple-500 italic">
                  "Every day is a fresh start. You're doing your best, and that's enough." 💜
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
