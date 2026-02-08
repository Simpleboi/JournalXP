import { motion } from "framer-motion";
import { Target, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { useUserData } from "@/context/UserDataContext";
import { useTheme } from "@/context/ThemeContext";

export const TaskStats = () => {
  const { userData } = useUserData();
  const { theme } = useTheme();
  if (!userData) return null;

  const stats = [
    {
      icon: Target,
      value: userData.taskStats.currentTasksCreated,
      label: "Total Tasks",
      // Theme-driven colors
      iconBg: `linear-gradient(to bottom right, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
      bgColor: theme.colors.primary + '10',
      borderColor: theme.colors.primary + '40',
      textColor: theme.colors.primaryDark,
      labelColor: theme.colors.primary,
    },
    {
      icon: CheckCircle,
      value: userData.taskStats.currentTasksCompleted,
      label: "Completed",
      // Semantic green
      iconBg: "linear-gradient(to bottom right, #22c55e, #059669)",
      bgColor: undefined,
      borderColor: undefined,
      textColor: undefined,
      labelColor: undefined,
      bgClass: "from-green-50/80 to-emerald-50/80",
      borderClass: "border-green-200/60",
      textClass: "text-green-900",
      labelClass: "text-green-600",
    },
    {
      icon: Clock,
      value: userData.taskStats.currentTasksPending,
      label: "Pending",
      // Semantic orange
      iconBg: "linear-gradient(to bottom right, #f97316, #d97706)",
      bgColor: undefined,
      borderColor: undefined,
      textColor: undefined,
      labelColor: undefined,
      bgClass: "from-orange-50/80 to-amber-50/80",
      borderClass: "border-orange-200/60",
      textClass: "text-orange-900",
      labelClass: "text-orange-600",
    },
    {
      icon: TrendingUp,
      value: `${Math.round(userData.taskStats.totalSuccessRate)}%`,
      label: "Success Rate",
      // Theme-driven secondary colors
      iconBg: `linear-gradient(to bottom right, ${theme.colors.secondary}, ${theme.colors.primary})`,
      bgColor: theme.colors.secondary + '10',
      borderColor: theme.colors.secondary + '40',
      textColor: theme.colors.primaryDark,
      labelColor: theme.colors.secondary,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {stats.map((stat, index) => {
        // Use inline theme styles for themed cards, Tailwind classes for semantic cards
        const isThemed = !!stat.bgColor;

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className={`backdrop-blur-md border-2 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow ${
              isThemed ? '' : `bg-gradient-to-br ${stat.bgClass} ${stat.borderClass}`
            }`}
            style={isThemed ? {
              backgroundColor: stat.bgColor,
              borderColor: stat.borderColor,
            } : undefined}
          >
            <div className="flex items-center gap-3">
              <div
                className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl shadow-md"
                style={{ background: stat.iconBg }}
              >
                <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <p
                  className={`text-xl sm:text-2xl font-bold ${isThemed ? '' : stat.textClass}`}
                  style={isThemed ? { color: stat.textColor } : undefined}
                >
                  {stat.value}
                </p>
                <p
                  className={`text-xs sm:text-sm ${isThemed ? '' : stat.labelClass}`}
                  style={isThemed ? { color: stat.labelColor } : undefined}
                >
                  {stat.label}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
