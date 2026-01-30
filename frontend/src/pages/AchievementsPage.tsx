import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Lock,
  CheckCircle,
  Loader2,
  Sparkles,
  Star,
  Award,
  Flame,
  Zap,
  BookOpen,
  ListChecks,
  Heart,
  Crown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import {
  getAchievements,
  Achievement,
  AchievementStats,
} from "@/services/achievementService";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";

// Ambient colors for achievements page
const achievementAmbience = {
  primary: "rgba(234, 179, 8, 0.15)", // Gold/yellow
  secondary: "rgba(168, 85, 247, 0.12)", // Purple
  accent: "rgba(34, 197, 94, 0.12)", // Green
  warm: "rgba(251, 146, 60, 0.10)", // Orange
};

const AchievementsPage = () => {
  const [filter, setFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<AchievementStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user && !loading) {
      navigate("/login");
    }
  }, [user, navigate, loading]);

  // Fetch achievements on mount
  useEffect(() => {
    if (user) {
      fetchAchievements();
    }
  }, [user]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const data = await getAchievements();
      setAchievements(data.achievements);
      setStats(data.stats);
    } catch (error: any) {
      console.error("Error fetching achievements:", error);
      showToast({
        title: "Error",
        description: "Failed to load achievements. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Apply both status filter and category filter
  const filteredAchievements = achievements
    .filter((a) => {
      if (filter === "unlocked") return a.unlocked;
      if (filter === "locked") return !a.unlocked;
      return true;
    })
    .filter((a) => {
      if (categoryFilter === "all") return true;
      return a.category === categoryFilter;
    });

  // Show loading state
  if (loading || !user) {
    return (
      <div className="min-h-screen relative">
        {/* Ambient background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 via-white to-purple-50/30" />
        </div>
        <div className="relative flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-white/60 backdrop-blur-md border-2 border-white/50 rounded-2xl p-8 shadow-xl"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            </motion.div>
            <p className="text-gray-600 font-medium">
              {!user ? "Checking authentication..." : "Loading achievements..."}
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Animated ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 via-white to-purple-50/30" />

        {/* Floating ambient orbs */}
        <motion.div
          className="absolute top-1/4 -left-16 sm:-left-32 w-48 h-48 sm:w-96 sm:h-96 rounded-full blur-2xl sm:blur-3xl"
          style={{ background: achievementAmbience.primary }}
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 -right-12 sm:-right-24 w-40 h-40 sm:w-80 sm:h-80 rounded-full blur-2xl sm:blur-3xl"
          style={{ background: achievementAmbience.secondary }}
          animate={{
            x: [0, -20, 0],
            y: [0, 25, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-36 h-36 sm:w-72 sm:h-72 rounded-full blur-2xl sm:blur-3xl"
          style={{ background: achievementAmbience.accent }}
          animate={{
            x: [0, 25, 0],
            y: [0, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-32 h-32 sm:w-64 sm:h-64 rounded-full blur-2xl sm:blur-3xl hidden sm:block"
          style={{ background: achievementAmbience.warm }}
          animate={{
            x: [0, -20, 0],
            y: [0, 20, 0],
            scale: [1, 1.18, 1],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6,
          }}
        />
      </div>

      <Header title="Achievements" icon={Trophy} />

      {/* Main Content */}
      <main className="relative container mx-auto px-2 sm:px-4 py-4 sm:py-8 pb-12">
        {/* Page Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 sm:mb-8 max-w-6xl mx-auto"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <motion.div
              className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </motion.div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-600 via-orange-500 to-yellow-500 pb-2 bg-clip-text text-transparent">
                Achievements
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Track your progress and unlock rewards
              </p>
            </div>
          </div>
          <motion.div
            className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-amber-50 to-orange-50 backdrop-blur-sm border-2 border-amber-200/60 rounded-xl sm:rounded-2xl shadow-sm"
            whileHover={{ scale: 1.02 }}
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
            <span className="font-semibold text-amber-700 text-sm sm:text-base">
              {stats?.unlockedCount || 0} / {stats?.totalAchievements || 0}{" "}
              Unlocked
            </span>
          </motion.div>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Achievement Stats */}
          <AchievementStatsGrid stats={stats} />

          {/* Filter Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/60 backdrop-blur-md border-2 border-white/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg mb-6 sm:mb-8"
          >
            {/* Status Filter */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                Filter by Status
              </h3>
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  active={filter === "all"}
                  onClick={() => setFilter("all")}
                  gradient="from-gray-500 to-slate-600"
                  bgGradient="from-gray-50/80 to-slate-50/80"
                  borderColor="border-gray-200/60"
                >
                  All ({achievements.length})
                </FilterButton>
                <FilterButton
                  active={filter === "unlocked"}
                  onClick={() => setFilter("unlocked")}
                  gradient="from-green-500 to-emerald-600"
                  bgGradient="from-green-50/80 to-emerald-50/80"
                  borderColor="border-green-200/60"
                  icon={<CheckCircle className="h-4 w-4" />}
                >
                  Unlocked ({achievements.filter((a) => a.unlocked).length})
                </FilterButton>
                <FilterButton
                  active={filter === "locked"}
                  onClick={() => setFilter("locked")}
                  gradient="from-gray-400 to-gray-500"
                  bgGradient="from-gray-50/80 to-gray-100/80"
                  borderColor="border-gray-200/60"
                  icon={<Lock className="h-4 w-4" />}
                >
                  Locked ({achievements.filter((a) => !a.unlocked).length})
                </FilterButton>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-500" />
                Filter by Category
              </h3>
              <div className="flex flex-wrap gap-2">
                {categoryFilters.map((cat) => (
                  <FilterButton
                    key={cat.value}
                    active={categoryFilter === cat.value}
                    onClick={() => setCategoryFilter(cat.value)}
                    gradient={cat.gradient}
                    bgGradient={cat.bgGradient}
                    borderColor={cat.borderColor}
                    icon={cat.icon}
                  >
                    {cat.label}
                  </FilterButton>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Achievement Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredAchievements.map((achievement, index) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                index={index}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredAchievements.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 bg-white/60 backdrop-blur-md border-2 border-white/50 rounded-2xl shadow-lg"
            >
              <motion.div
                className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-4 shadow-md"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy className="h-10 w-10 text-amber-400" />
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No achievements found
              </h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                Try a different filter to see more achievements, or keep working
                to unlock new ones!
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

// Stats Grid Component
const AchievementStatsGrid = ({
  stats,
}: {
  stats: AchievementStats | null;
}) => {
  const statItems = [
    {
      icon: Trophy,
      value: stats?.totalAchievements || 0,
      label: "Total",
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-50/80 to-orange-50/80",
      borderColor: "border-amber-200/60",
      textColor: "text-amber-900",
      labelColor: "text-amber-600",
    },
    {
      icon: CheckCircle,
      value: stats?.unlockedCount || 0,
      label: "Unlocked",
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50/80 to-emerald-50/80",
      borderColor: "border-green-200/60",
      textColor: "text-green-900",
      labelColor: "text-green-600",
    },
    {
      icon: Star,
      value: stats?.totalPoints || 0,
      label: "Points",
      gradient: "from-purple-500 to-violet-600",
      bgGradient: "from-purple-50/80 to-violet-50/80",
      borderColor: "border-purple-200/60",
      textColor: "text-purple-900",
      labelColor: "text-purple-600",
    },
    {
      icon: Crown,
      value: stats
        ? `${Math.round(
            (stats.unlockedCount / stats.totalAchievements) * 100
          )}%`
        : "0%",
      label: "Complete",
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50/80 to-indigo-50/80",
      borderColor: "border-blue-200/60",
      textColor: "text-blue-900",
      labelColor: "text-blue-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {statItems.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + index * 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className={`bg-gradient-to-br ${stat.bgGradient} backdrop-blur-md border-2 ${stat.borderColor} rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-gradient-to-br ${stat.gradient} shadow-md`}
            >
              <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div>
              <p className={`text-xl sm:text-2xl font-bold ${stat.textColor}`}>
                {stat.value}
              </p>
              <p className={`text-xs sm:text-sm ${stat.labelColor}`}>
                {stat.label}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Filter Button Component
const FilterButton = ({
  active,
  onClick,
  gradient,
  bgGradient,
  borderColor,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  gradient: string;
  bgGradient: string;
  borderColor: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all
        ${
          active
            ? `bg-gradient-to-r ${gradient} text-white shadow-md`
            : `bg-gradient-to-br ${bgGradient} border ${borderColor} text-gray-700 hover:shadow-sm`
        }
      `}
    >
      {icon}
      {children}
    </motion.button>
  );
};

// Category filter configuration
const categoryFilters = [
  {
    value: "all",
    label: "All",
    gradient: "from-gray-500 to-slate-600",
    bgGradient: "from-gray-50/80 to-slate-50/80",
    borderColor: "border-gray-200/60",
    icon: <Award className="h-4 w-4" />,
  },
  {
    value: "journaling",
    label: "Journaling",
    gradient: "from-purple-500 to-violet-600",
    bgGradient: "from-purple-50/80 to-violet-50/80",
    borderColor: "border-purple-200/60",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    value: "tasks",
    label: "Tasks",
    gradient: "from-blue-500 to-indigo-600",
    bgGradient: "from-blue-50/80 to-indigo-50/80",
    borderColor: "border-blue-200/60",
    icon: <ListChecks className="h-4 w-4" />,
  },
  {
    value: "habits",
    label: "Habits",
    gradient: "from-green-500 to-emerald-600",
    bgGradient: "from-green-50/80 to-emerald-50/80",
    borderColor: "border-green-200/60",
    icon: <Heart className="h-4 w-4" />,
  },
  {
    value: "streak",
    label: "Streak",
    gradient: "from-orange-500 to-amber-600",
    bgGradient: "from-orange-50/80 to-amber-50/80",
    borderColor: "border-orange-200/60",
    icon: <Flame className="h-4 w-4" />,
  },
  {
    value: "xp",
    label: "XP",
    gradient: "from-yellow-500 to-amber-600",
    bgGradient: "from-yellow-50/80 to-amber-50/80",
    borderColor: "border-yellow-200/60",
    icon: <Zap className="h-4 w-4" />,
  },
  {
    value: "general",
    label: "General",
    gradient: "from-pink-500 to-rose-600",
    bgGradient: "from-pink-50/80 to-rose-50/80",
    borderColor: "border-pink-200/60",
    icon: <Star className="h-4 w-4" />,
  },
];

// Achievement Card Component
const AchievementCard = ({
  achievement,
  index,
}: {
  achievement: Achievement;
  index: number;
}) => {
  const getCategoryConfig = (category: string) => {
    const config = categoryFilters.find((c) => c.value === category);
    return (
      config || {
        gradient: "from-gray-500 to-slate-600",
        bgGradient: "from-gray-50/80 to-slate-50/80",
        borderColor: "border-gray-200/60",
        icon: <Award className="h-4 w-4" />,
      }
    );
  };

  const categoryConfig = getCategoryConfig(achievement.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.3 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="group"
    >
      <div
        className={`
          relative overflow-hidden bg-white/70 backdrop-blur-md border-2 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300
          ${
            achievement.unlocked
              ? "border-green-200/60 hover:border-green-300/80"
              : "border-gray-200/50 hover:border-gray-300/70"
          }
        `}
      >
        {/* Unlocked glow effect */}
        {achievement.unlocked && (
          <div className="absolute inset-0 bg-gradient-to-br from-green-100/30 to-emerald-100/20 pointer-events-none" />
        )}

        {/* Card Content */}
        <div className="relative p-4 sm:p-5">
          <div className="flex items-start gap-3 sm:gap-4">
            {/* Icon */}
            <motion.div
              className={`
                flex-shrink-0 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-md
                ${
                  achievement.unlocked
                    ? "bg-gradient-to-br from-green-400 to-emerald-500"
                    : "bg-gradient-to-br from-gray-300 to-gray-400"
                }
              `}
              whileHover={{ rotate: achievement.unlocked ? 10 : 0 }}
            >
              {achievement.unlocked ? (
                <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              ) : (
                <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-white/80" />
              )}
            </motion.div>

            {/* Content */}
            <div className="flex-grow min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
                <h3
                  className={`font-semibold text-base sm:text-lg leading-tight ${
                    achievement.unlocked ? "text-gray-900" : "text-gray-600"
                  }`}
                >
                  {achievement.title}
                </h3>
                <Badge
                  className={`
                    text-xs px-2 py-0.5 rounded-md font-medium shrink-0
                    bg-gradient-to-r ${categoryConfig.gradient} text-white border-0 shadow-sm
                  `}
                >
                  {achievement.category.charAt(0).toUpperCase() +
                    achievement.category.slice(1)}
                </Badge>
              </div>

              <p
                className={`text-sm leading-relaxed mb-3 ${
                  achievement.unlocked ? "text-gray-600" : "text-gray-500"
                }`}
              >
                {achievement.description}
              </p>

              {/* Status info */}
              {achievement.unlocked ? (
                <div className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                  <CheckCircle className="h-4 w-4" />
                  <span>
                    Unlocked
                    {achievement.dateUnlocked &&
                      ` on ${new Date(
                        achievement.dateUnlocked
                      ).toLocaleDateString()}`}
                  </span>
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-600">How to unlock:</span>{" "}
                  {achievement.requirement}
                </div>
              )}
            </div>
          </div>

          {/* Points Badge */}
          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
            <motion.div
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold
                ${
                  achievement.unlocked
                    ? "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700"
                    : "bg-gray-100 text-gray-500"
                }
              `}
              whileHover={{ scale: 1.05 }}
            >
              <Star
                className={`h-4 w-4 ${
                  achievement.unlocked ? "text-amber-500" : "text-gray-400"
                }`}
              />
              {achievement.points} points
            </motion.div>

            {achievement.unlocked && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 text-xs text-green-500 font-medium"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Earned
              </motion.div>
            )}
          </div>
        </div>

        {/* Locked overlay effect */}
        {!achievement.unlocked && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/20 to-gray-100/10 pointer-events-none" />
        )}
      </div>
    </motion.div>
  );
};

export default AchievementsPage;
