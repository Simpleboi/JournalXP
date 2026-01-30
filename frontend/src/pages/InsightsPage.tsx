import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InsightBannerStats } from "@/features/insights/InsightBannerStats";
import { InsightOverview } from "@/features/insights/InsightOverview";
import { InsightPatterns } from "@/features/insights/InsightPatterns";
import { InsightMoodTrends } from "@/features/insights/InsightMoodTrends";
import { InsightJournal } from "@/features/insights/InsightJournal";
import { InsightTasksAndHabits } from "@/features/insights/InsightTasksHabits";
import { InsightSelfReflection } from "@/features/insights/InsightSelfReflection";
import { Header } from "@/components/Header";
import {
  BarChart3,
  Book,
  Brain,
  CheckCircle,
  Heart,
  Sparkles,
  TrendingUp,
  Calendar,
} from "lucide-react";
import ExperimentalFeatureNotice from "@/components/Notice";

// Ambient colors for insights page
const insightAmbience = {
  primary: "rgba(99, 102, 241, 0.15)", // Indigo
  secondary: "rgba(168, 85, 247, 0.12)", // Purple
  accent: "rgba(59, 130, 246, 0.12)", // Blue
  warm: "rgba(236, 72, 153, 0.10)", // Pink
};

// Tab configuration
const tabs = [
  {
    id: "overview",
    label: "Overview",
    icon: BarChart3,
    gradient: "from-indigo-500 to-violet-600",
    bgGradient: "from-indigo-50/80 to-violet-50/80",
    borderColor: "border-indigo-200/60",
  },
  {
    id: "patterns",
    label: "Patterns",
    icon: Brain,
    gradient: "from-purple-500 to-fuchsia-600",
    bgGradient: "from-purple-50/80 to-fuchsia-50/80",
    borderColor: "border-purple-200/60",
  },
  {
    id: "mood",
    label: "Mood Trends",
    icon: Heart,
    gradient: "from-pink-500 to-rose-600",
    bgGradient: "from-pink-50/80 to-rose-50/80",
    borderColor: "border-pink-200/60",
  },
  {
    id: "journal",
    label: "Journal",
    icon: Book,
    gradient: "from-amber-500 to-orange-600",
    bgGradient: "from-amber-50/80 to-orange-50/80",
    borderColor: "border-amber-200/60",
  },
  {
    id: "tasks",
    label: "Tasks & Habits",
    icon: CheckCircle,
    gradient: "from-green-500 to-emerald-600",
    bgGradient: "from-green-50/80 to-emerald-50/80",
    borderColor: "border-green-200/60",
  },
  {
    id: "self-reflection",
    label: "Reflection",
    icon: Sparkles,
    gradient: "from-cyan-500 to-blue-600",
    bgGradient: "from-cyan-50/80 to-blue-50/80",
    borderColor: "border-cyan-200/60",
  },
];

const InsightsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState("week");
  const [activeTab, setActiveTab] = useState("overview");

  const activeTabConfig = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <div className="min-h-screen relative">
      {/* Animated ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-white to-purple-50/30" />

        {/* Floating ambient orbs */}
        <motion.div
          className="absolute top-1/4 -left-16 sm:-left-32 w-48 h-48 sm:w-96 sm:h-96 rounded-full blur-2xl sm:blur-3xl"
          style={{ background: insightAmbience.primary }}
          animate={{
            x: [0, 25, 0],
            y: [0, -20, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 -right-12 sm:-right-24 w-40 h-40 sm:w-80 sm:h-80 rounded-full blur-2xl sm:blur-3xl"
          style={{ background: insightAmbience.secondary }}
          animate={{
            x: [0, -20, 0],
            y: [0, 25, 0],
            scale: [1, 1.18, 1],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-36 h-36 sm:w-72 sm:h-72 rounded-full blur-2xl sm:blur-3xl"
          style={{ background: insightAmbience.accent }}
          animate={{
            x: [0, 20, 0],
            y: [0, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-32 h-32 sm:w-64 sm:h-64 rounded-full blur-2xl sm:blur-3xl hidden sm:block"
          style={{ background: insightAmbience.warm }}
          animate={{
            x: [0, -18, 0],
            y: [0, 18, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 7,
          }}
        />
      </div>

      <Header title="Insights & Analytics" icon={BarChart3} />

      <ExperimentalFeatureNotice />

      {/* Main Content */}
      <main className="relative container mx-auto px-2 sm:px-4 py-4 sm:py-8 pb-12">
        {/* Page Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 sm:mb-8 max-w-8xl mx-auto"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <motion.div
              className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </motion.div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-700 via-purple-600 to-fuchsia-600 pb-2 bg-clip-text text-transparent">
                Your Wellness Journey
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Track progress and discover patterns in your mental health
              </p>
            </div>
          </div>

          {/* Time Range Selector */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[160px] bg-white/70 backdrop-blur-md border-2 border-indigo-200/60 rounded-xl hover:border-indigo-300 transition-colors">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-indigo-500" />
                  <SelectValue placeholder="Select time range" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-md border-2 border-indigo-100/50 rounded-xl">
                <SelectItem value="week">Past Week</SelectItem>
                <SelectItem value="month">Past Month</SelectItem>
                <SelectItem value="quarter">Past 3 Months</SelectItem>
                <SelectItem value="year">Past Year</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        </motion.div>

        <div className="max-w-8xl mx-auto">
          {/* Banner Stats Section */}
          <InsightBannerStats timeRange={timeRange} />

          {/* Tab Selection - Mobile Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6 lg:hidden"
          >
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full bg-white/70 backdrop-blur-md border-2 border-white/50 rounded-xl shadow-sm">
                <div className="flex items-center gap-2">
                  <activeTabConfig.icon className="h-4 w-4 text-indigo-600" />
                  <SelectValue placeholder="Select view" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-md border-2 border-indigo-100/50 rounded-xl">
                {tabs.map((tab) => (
                  <SelectItem key={tab.id} value={tab.id}>
                    <div className="flex items-center gap-2">
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {/* Tab Buttons - Desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="hidden lg:block mb-6 sm:mb-8"
          >
            <div className="bg-white/60 backdrop-blur-md border-2 border-white/50 rounded-2xl p-2 shadow-lg">
              <div className="grid grid-cols-6 gap-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all
                      ${
                        activeTab === tab.id
                          ? `bg-gradient-to-r ${tab.gradient} text-white shadow-md`
                          : `bg-gradient-to-br ${tab.bgGradient} border ${tab.borderColor} text-gray-700 hover:shadow-sm`
                      }
                    `}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="hidden xl:inline">{tab.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Overview Section */}
            <div className={activeTab !== "overview" ? "hidden" : ""}>
              <InsightOverview />
            </div>

            {/* Patterns Section */}
            <div className={activeTab !== "patterns" ? "hidden" : ""}>
              <InsightPatterns />
            </div>

            {/* Mood Trends Section */}
            <div className={activeTab !== "mood" ? "hidden" : ""}>
              <InsightMoodTrends />
            </div>

            {/* Journal Insights Section */}
            <div className={activeTab !== "journal" ? "hidden" : ""}>
              <InsightJournal />
            </div>

            {/* Tasks & Habits Section */}
            <div className={activeTab !== "tasks" ? "hidden" : ""}>
              <InsightTasksAndHabits />
            </div>

            {/* Self Reflection Section */}
            <div className={activeTab !== "self-reflection" ? "hidden" : ""}>
              <InsightSelfReflection />
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default InsightsPage;
