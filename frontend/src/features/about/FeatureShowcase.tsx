import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Book,
  Brain,
  Target,
  CheckSquare,
  Sparkles,
  Trophy,
  ShoppingBag,
  Timer,
  Lock,
  Archive,
  Compass,
  Lightbulb,
  ArrowRight,
  Star,
  Zap,
  Clock,
  TrendingUp,
  Heart,
  MessageCircle,
  BarChart3,
  Notebook,
} from "lucide-react";
import { RankShowcase } from "./RankShowcase";

interface Feature {
  id: string;
  icon: React.ComponentType<any>;
  title: string;
  stat: string;
  route: string;
  description: string;
  whatItIs: string;
  howToUse: string[];
  tips: string[];
  color: string;
  bgColor: string;
  iconBg: string;
}

const features: Feature[] = [
  {
    id: "journaling",
    icon: Book,
    title: "Smart Journaling",
    stat: "30 XP per entry",
    route: "/journal",
    description: "Your digital journal that helps you process thoughts, track emotions, and reflect on your day. Choose from different journaling modes designed for various mental health needs.",
    whatItIs: "A private, secure space to write down your thoughts, feelings, and experiences. Unlike paper journals, this digital journal tracks your mood, counts your words, and helps you discover patterns in your mental health over time.",
    howToUse: [
      "Click 'Journal' from the main dashboard or navigation menu",
      "Choose your journaling mode: Free Writing, Guided prompts, or Templates",
      "Select your current mood from the mood selector",
      "Start typing your thoughts - there's no right or wrong way",
      "Click 'Save Entry' when finished to earn 30 XP",
    ],
    tips: [
      "Write at the same time each day to build a habit",
      "Don't worry about grammar or spelling - just let your thoughts flow",
      "Use the mood tracker consistently to identify emotional patterns",
      "Try different templates to discover what resonates with you",
      "Review past entries weekly to notice your growth",
    ],
    color: "from-purple-500 to-violet-600",
    bgColor: "from-purple-50/80 to-violet-50/80",
    iconBg: "from-purple-500 to-violet-600",
  },
  {
    id: "sunday",
    icon: MessageCircle,
    title: "Sunday AI Companion",
    stat: "24/7 Support",
    route: "/sunday",
    description: "Meet Sunday, your personal AI wellness companion. Sunday provides empathetic, thoughtful responses to help you work through challenges, celebrate wins, and maintain perspective.",
    whatItIs: "An AI chatbot specifically designed for mental wellness support. Think of Sunday as a compassionate friend who's always available to talk, offering personalized guidance based on your conversations.",
    howToUse: [
      "Click 'Sunday' from the main dashboard",
      "Type any message - share how you're feeling or ask for advice",
      "Have a natural conversation with follow-up questions",
      "Sunday remembers context within your conversation",
      "Use it for daily check-ins, not crisis situations",
    ],
    tips: [
      "Be honest and open - Sunday responds better to authentic sharing",
      "Ask specific questions to get more helpful responses",
      "Use Sunday for processing thoughts before journaling",
      "Remember: Sunday is a supportive tool, not a replacement for therapy",
      "Start conversations with how you're actually feeling today",
    ],
    color: "from-pink-500 to-rose-600",
    bgColor: "from-pink-50/80 to-rose-50/80",
    iconBg: "from-pink-500 to-rose-600",
  },
  {
    id: "guided-reflection",
    icon: Compass,
    title: "Guided Reflections",
    stat: "Structured Paths",
    route: "/guided-reflections",
    description: "Embark on structured reflection journeys designed by mental health principles. Each path guides you through meaningful self-exploration with prompts, exercises, and summaries.",
    whatItIs: "Pre-built reflection paths that take you through a series of thoughtful prompts and exercises. Unlike free journaling, these paths are structured to help you explore specific themes like self-compassion, gratitude, or processing difficult emotions.",
    howToUse: [
      "Navigate to Guided Reflections from the dashboard",
      "Browse available paths and choose one that resonates",
      "Work through each step at your own pace",
      "Complete exercises and respond to prompts thoughtfully",
      "Receive an AI-generated summary upon completion",
    ],
    tips: [
      "Choose paths based on what you're currently working through",
      "Take your time - there's no rush to complete a path",
      "Revisit completed paths periodically for deeper insights",
      "Use the summaries as conversation starters with therapists",
      "Try different paths to discover new perspectives",
    ],
    color: "from-cyan-500 to-teal-600",
    bgColor: "from-cyan-50/80 to-teal-50/80",
    iconBg: "from-cyan-500 to-teal-600",
  },
  {
    id: "habits",
    icon: Target,
    title: "Habit Tracking",
    stat: "Custom Goals",
    route: "/habits",
    description: "Build lasting positive habits with our gamified tracking system. Set custom goals, maintain streaks, earn XP rewards, and watch consistency transform your wellness journey.",
    whatItIs: "A tool that helps you build and maintain healthy habits by tracking progress over time. Each habit can be daily, weekly, or monthly, and you earn XP every time you complete one. Streak tracking motivates consistency.",
    howToUse: [
      "Click 'Habits' from the dashboard",
      "Click 'Create New Habit' to add your first habit",
      "Enter a title and choose frequency (daily/weekly/monthly)",
      "Select a category and set your goal",
      "Mark habits complete daily to earn XP and build streaks",
    ],
    tips: [
      "Start with just 2-3 habits to avoid overwhelm",
      "Stack new habits with existing routines (e.g., meditate after brushing teeth)",
      "Celebrate streak milestones to stay motivated",
      "If you miss a day, don't give up - just continue tomorrow",
      "Review and adjust habits monthly based on what's working",
    ],
    color: "from-green-500 to-emerald-600",
    bgColor: "from-green-50/80 to-emerald-50/80",
    iconBg: "from-green-500 to-emerald-600",
  },
  {
    id: "tasks",
    icon: CheckSquare,
    title: "Daily Tasks",
    stat: "20 XP per task",
    route: "/tasks",
    description: "Stay organized and productive with task management designed for mental wellness. Create, prioritize, and complete daily tasks while earning XP rewards.",
    whatItIs: "A to-do list system that gamifies productivity. Unlike regular task apps, this is designed to support mental health by preventing overwhelm - set priority levels, due dates, and earn XP for completing tasks.",
    howToUse: [
      "Click 'Tasks' from the main dashboard",
      "Click 'Add Task' to create a new task",
      "Enter title and optionally add description",
      "Set priority level (High, Medium, Low)",
      "Mark tasks complete to earn 20 XP instantly",
    ],
    tips: [
      "Break big tasks into smaller, manageable pieces",
      "Use High priority sparingly - everything can't be urgent",
      "Complete at least one task first thing in the morning for momentum",
      "Review incomplete tasks at end of day - reschedule or remove",
      "Celebrate completing your task list, even if it's small",
    ],
    color: "from-teal-500 to-cyan-600",
    bgColor: "from-teal-50/80 to-cyan-50/80",
    iconBg: "from-teal-500 to-cyan-600",
  },
  {
    id: "meditation",
    icon: Sparkles,
    title: "Meditation Room",
    stat: "Guided Practice",
    route: "/meditation",
    description: "Find calm and clarity with guided meditation exercises, breathing techniques, and mindfulness practices. Your personal sanctuary for stress relief and emotional regulation.",
    whatItIs: "A collection of meditation and mindfulness tools including breathing exercises with visual timers, daily affirmations, and emotion-specific meditation guides with journaling prompts.",
    howToUse: [
      "Click 'Meditation' from the dashboard",
      "Choose: Breathing Exercises, Daily Inspiration, or Emotional Support",
      "For Breathing: Select duration and follow the visual guide",
      "For Emotional Support: Click on your current emotion",
      "Complete guided exercises and save reflections to earn XP",
    ],
    tips: [
      "Start with just 1-3 minutes of breathing exercises",
      "Use the emotional support section when feeling overwhelmed",
      "Save favorite quotes for quick motivation boosts",
      "Practice breathing exercises before stressful situations",
      "Combine meditation with journaling for deeper reflection",
    ],
    color: "from-violet-500 to-purple-600",
    bgColor: "from-violet-50/80 to-purple-50/80",
    iconBg: "from-violet-500 to-purple-600",
  },
  {
    id: "pomodoro",
    icon: Timer,
    title: "Focus Timer",
    stat: "Pomodoro Technique",
    route: "/pomodoro",
    description: "Boost productivity with the proven Pomodoro technique. Work in focused intervals with built-in breaks to maintain energy and prevent burnout.",
    whatItIs: "A timer system based on the Pomodoro Technique - 25 minutes of focused work followed by 5-minute breaks. After 4 pomodoros, take a longer 15-30 minute break. Great for managing attention and preventing mental fatigue.",
    howToUse: [
      "Navigate to the Focus Timer from the dashboard",
      "Set your focus duration (default 25 minutes)",
      "Click Start to begin your focused work session",
      "Work until the timer ends - avoid distractions",
      "Take your break, then start another session",
    ],
    tips: [
      "Remove phone and close unnecessary tabs during focus time",
      "Use breaks for physical movement, not more screen time",
      "Track how many pomodoros different tasks take",
      "Adjust timer lengths based on your attention span",
      "Pair with tasks feature to work on specific items each session",
    ],
    color: "from-red-500 to-orange-600",
    bgColor: "from-red-50/80 to-orange-50/80",
    iconBg: "from-red-500 to-orange-600",
  },
  {
    id: "vault",
    icon: Lock,
    title: "Private Vault",
    stat: "Extra Security",
    route: "/vault",
    description: "Store your most sensitive journal entries in a password-protected vault. Perfect for thoughts you want to keep extra private or process later.",
    whatItIs: "A secure section of your journal with an additional layer of protection. Vault entries require a separate PIN to access, making them ideal for deeply personal reflections or sensitive topics.",
    howToUse: [
      "Navigate to the Vault from the dashboard",
      "Set up your vault PIN (first time only)",
      "Enter your PIN to access vault contents",
      "Create new vault entries or move existing ones",
      "Your vault entries are separate from regular journal",
    ],
    tips: [
      "Use the vault for entries you're not ready to revisit often",
      "Great for processing trauma or difficult memories safely",
      "Change your PIN periodically for extra security",
      "Don't forget your PIN - there's no recovery option",
      "Consider vault entries for therapy preparation notes",
    ],
    color: "from-amber-500 to-yellow-600",
    bgColor: "from-amber-50/80 to-yellow-50/80",
    iconBg: "from-amber-500 to-yellow-600",
  },
  {
    id: "reflection-archive",
    icon: Archive,
    title: "Reflection Archive",
    stat: "Search & Filter",
    route: "/reflection-archive",
    description: "Browse, search, and organize all your past journal entries. Use filters to find specific moods, dates, or topics, and export your data anytime.",
    whatItIs: "A searchable database of all your journal entries with powerful filtering options. View entries in list or calendar format, filter by mood or type, and export your data for backup or sharing with therapists.",
    howToUse: [
      "Click 'Archive' from the dashboard or journal page",
      "Browse entries in list view or calendar view",
      "Use search to find specific words or topics",
      "Filter by mood, entry type, or date range",
      "Export entries as PDF or text file",
    ],
    tips: [
      "Use calendar view to see journaling consistency",
      "Search for recurring themes to identify patterns",
      "Export entries before therapy sessions to share progress",
      "Star favorite entries for quick access later",
      "Review monthly to celebrate growth and insights",
    ],
    color: "from-indigo-500 to-blue-600",
    bgColor: "from-indigo-50/80 to-blue-50/80",
    iconBg: "from-indigo-500 to-blue-600",
  },
  {
    id: "achievements",
    icon: Trophy,
    title: "Achievement System",
    stat: "Unlock & Collect",
    route: "/achievements",
    description: "Unlock badges, earn achievement points, and track your wellness milestones. The achievement system recognizes progress across journaling, habits, tasks, and streaks.",
    whatItIs: "A comprehensive achievement system that tracks accomplishments across all JournalXP features. Dozens of achievements in categories like Journaling, Habits, Tasks, XP, and Streaks, each with point values.",
    howToUse: [
      "Click 'Achievements' from the dashboard",
      "Browse all achievements - locked ones show requirements",
      "Filter by category or status (locked/unlocked)",
      "Achievements unlock automatically when requirements are met",
      "Track your total achievement points and completion percentage",
    ],
    tips: [
      "Check achievements regularly to set new goals",
      "Some achievements are hidden - keep exploring to find them",
      "Focus on achievements that align with your wellness goals",
      "Share achievement milestones to celebrate progress",
      "Don't chase achievements at the expense of genuine reflection",
    ],
    color: "from-amber-500 to-orange-600",
    bgColor: "from-amber-50/80 to-orange-50/80",
    iconBg: "from-amber-500 to-orange-600",
  },
  {
    id: "store",
    icon: ShoppingBag,
    title: "Rewards Store",
    stat: "Spend XP",
    route: "/store",
    description: "Spend your hard-earned XP on themes, power-ups, and special unlocks. The store transforms your progress into tangible benefits.",
    whatItIs: "A virtual shop where you spend XP earned from journaling, tasks, and habits. Items include profile customizations, productivity boosts, and special features that enhance your JournalXP experience.",
    howToUse: [
      "Click 'Store' from the main dashboard",
      "Browse items by category",
      "View your XP balance at the top",
      "Click items to see details and price",
      "Purchase items to add them to your inventory",
    ],
    tips: [
      "Save XP for items you really want rather than impulse buying",
      "Check level requirements before setting goals for items",
      "Some items are limited time - check back for seasonal offers",
      "XP boosts can help you level up faster",
      "Customize your profile to make JournalXP feel more personal",
    ],
    color: "from-emerald-500 to-green-600",
    bgColor: "from-emerald-50/80 to-green-50/80",
    iconBg: "from-emerald-500 to-green-600",
  },
  {
    id: "insights",
    icon: BarChart3,
    title: "Insights & Analytics",
    stat: "AI-Powered",
    route: "/insights",
    description: "Unlock deep understanding of your mental health patterns with AI-powered analytics. Discover mood trends, identify triggers, and see correlations in your wellness journey.",
    whatItIs: "An intelligent dashboard that analyzes all your JournalXP data to find meaningful patterns. Think of it as a data scientist examining your mental health journey and highlighting important trends.",
    howToUse: [
      "Navigate to 'Insights' from the dashboard",
      "View your overall Wellness Score breakdown",
      "Scroll through AI-generated recommendations",
      "Check mood trends over time in the charts",
      "Review behavioral patterns and risk factors",
    ],
    tips: [
      "Journal consistently for more accurate insights",
      "Use insights to guide conversations with therapists",
      "Pay attention to correlations between habits and moods",
      "Review insights weekly to adjust your wellness routine",
      "Don't obsess over metrics - they're guides, not grades",
    ],
    color: "from-blue-500 to-indigo-600",
    bgColor: "from-blue-50/80 to-indigo-50/80",
    iconBg: "from-blue-500 to-indigo-600",
  },
  {
    id: "notebook",
    icon: Notebook,
    title: "Quick Notes",
    stat: "Capture Ideas",
    route: "/notebook",
    description: "Quickly capture thoughts, ideas, and reminders without the structure of a full journal entry. Perfect for fleeting thoughts you want to remember.",
    whatItIs: "A simple note-taking space for quick captures - thoughts that pop up during the day, ideas to explore later, or reminders for yourself. Less structured than journaling, more like a mental scratch pad.",
    howToUse: [
      "Open Notebook from the dashboard",
      "Click to add a new note",
      "Type your thought or idea quickly",
      "Notes are saved automatically",
      "Review and organize notes later",
    ],
    tips: [
      "Use for thoughts you want to journal about later",
      "Capture ideas immediately before you forget them",
      "Review notes weekly and expand interesting ones into journal entries",
      "Great for recording dreams right after waking",
      "Use tags to organize notes by theme",
    ],
    color: "from-slate-500 to-gray-600",
    bgColor: "from-slate-50/80 to-gray-50/80",
    iconBg: "from-slate-500 to-gray-600",
  },
];

// Ambient colors
const ambience = {
  primary: 'rgba(99, 102, 241, 0.15)',
  secondary: 'rgba(139, 92, 246, 0.12)',
  accent: 'rgba(236, 72, 153, 0.10)',
};

export const FeatureShowcase = () => {
  const [selectedFeature, setSelectedFeature] = useState<Feature>(features[0]);
  const [expandedSection, setExpandedSection] = useState<string | null>("tips");
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          className="absolute top-0 -left-32 w-96 h-96 rounded-full blur-3xl"
          style={{ background: ambience.primary }}
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 -right-32 w-80 h-80 rounded-full blur-3xl"
          style={{ background: ambience.secondary }}
          animate={{ x: [0, -15, 0], y: [0, 20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl"
          style={{ background: ambience.accent }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
      </div>

      <div id="get-started" className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700">Feature Guide</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 pb-2">
            Everything You Need to Thrive
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful mental health tools, gamified for engagement. Click any feature to learn more.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isSelected = selectedFeature.id === feature.id;

            return (
              <motion.button
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedFeature(feature)}
                className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? "bg-white/90 backdrop-blur-md border-indigo-400 shadow-lg shadow-indigo-100"
                    : "bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:border-indigo-200"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="selected-indicator"
                    className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 -z-10"
                  />
                )}
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.iconBg} flex items-center justify-center mb-2 shadow-sm`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-0.5 line-clamp-1">{feature.title}</h3>
                <p className="text-xs text-gray-500">{feature.stat}</p>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Selected Feature Detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedFeature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`bg-gradient-to-br ${selectedFeature.bgColor} backdrop-blur-md rounded-2xl sm:rounded-3xl border-2 border-white/50 shadow-xl overflow-hidden`}
          >
            {/* Feature Header */}
            <div className="p-6 sm:p-8 border-b border-white/30">
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${selectedFeature.iconBg} flex items-center justify-center shadow-lg flex-shrink-0`}
                >
                  {React.createElement(selectedFeature.icon, {
                    className: "h-8 w-8 sm:h-10 sm:w-10 text-white",
                  })}
                </motion.div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{selectedFeature.title}</h3>
                    <Badge className="bg-white/80 text-gray-700 border-0 shadow-sm">
                      <Zap className="w-3 h-3 mr-1" />
                      {selectedFeature.stat}
                    </Badge>
                  </div>
                  <p className="text-gray-700 text-base sm:text-lg leading-relaxed">{selectedFeature.description}</p>

                  {/* Navigate Button */}
                  <motion.div className="mt-4" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => navigate(selectedFeature.route)}
                      className={`bg-gradient-to-r ${selectedFeature.color} hover:opacity-90 text-white rounded-xl shadow-md px-6`}
                    >
                      Try {selectedFeature.title}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="p-6 sm:p-8 space-y-4">
              {/* What it is */}
              <motion.div
                className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedSection(expandedSection === "what" ? null : "what")}
                  className="w-full p-4 flex items-center justify-between hover:bg-white/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-100">
                      <Lightbulb className="w-5 h-5 text-indigo-600" />
                    </div>
                    <span className="font-semibold text-gray-900">What is it?</span>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedSection === "what" ? 180 : 0 }}
                    className="text-gray-400"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>
                <AnimatePresence>
                  {expandedSection === "what" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4">
                        <p className="text-gray-700 leading-relaxed">{selectedFeature.whatItIs}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* How to use */}
              <motion.div
                className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedSection(expandedSection === "how" ? null : "how")}
                  className="w-full p-4 flex items-center justify-between hover:bg-white/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-100">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="font-semibold text-gray-900">How to use it</span>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedSection === "how" ? 180 : 0 }}
                    className="text-gray-400"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>
                <AnimatePresence>
                  {expandedSection === "how" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-2">
                        {selectedFeature.howToUse.map((step, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br ${selectedFeature.color} text-white font-bold flex items-center justify-center text-xs`}>
                              {index + 1}
                            </div>
                            <p className="text-gray-700 text-sm pt-0.5">{step}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Tips & Tricks - Default Open */}
              <motion.div
                className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedSection(expandedSection === "tips" ? null : "tips")}
                  className="w-full p-4 flex items-center justify-between hover:bg-white/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-100">
                      <Star className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="font-semibold text-gray-900">Tips & Tricks</span>
                    <Badge className="bg-amber-100 text-amber-700 text-xs">Pro Tips</Badge>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedSection === "tips" ? 180 : 0 }}
                    className="text-gray-400"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>
                <AnimatePresence>
                  {expandedSection === "tips" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-2">
                        {selectedFeature.tips.map((tip, index) => (
                          <div key={index} className="flex items-start gap-3 bg-amber-50/50 p-3 rounded-lg">
                            <div className="flex-shrink-0 mt-0.5">
                              <Lightbulb className="w-4 h-4 text-amber-500" />
                            </div>
                            <p className="text-gray-700 text-sm">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Quick Stats Footer */}
            <div className="px-6 sm:px-8 pb-6 sm:pb-8">
              <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/50">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Quick to learn</span>
                </div>
                <div className="w-px h-4 bg-gray-300 hidden sm:block" />
                <div className="flex items-center gap-2 text-gray-600">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">Designed for wellness</span>
                </div>
                <div className="w-px h-4 bg-gray-300 hidden sm:block" />
                <div className="flex items-center gap-2 text-gray-600">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">Earn XP</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Rank Progression Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <RankShowcase />
        </motion.div>
      </div>
    </div>
  );
};
