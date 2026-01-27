import { motion } from "framer-motion";
import { Target, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { useUserData } from "@/context/UserDataContext";

export const TaskStats = () => {
  const { userData } = useUserData();
  if (!userData) return null;

  const stats = [
    {
      icon: Target,
      value: userData.taskStats.currentTasksCreated,
      label: "Total Tasks",
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50/80 to-indigo-50/80",
      borderColor: "border-blue-200/60",
      textColor: "text-blue-900",
      labelColor: "text-blue-600",
    },
    {
      icon: CheckCircle,
      value: userData.taskStats.currentTasksCompleted,
      label: "Completed",
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50/80 to-emerald-50/80",
      borderColor: "border-green-200/60",
      textColor: "text-green-900",
      labelColor: "text-green-600",
    },
    {
      icon: Clock,
      value: userData.taskStats.currentTasksPending,
      label: "Pending",
      gradient: "from-orange-500 to-amber-600",
      bgGradient: "from-orange-50/80 to-amber-50/80",
      borderColor: "border-orange-200/60",
      textColor: "text-orange-900",
      labelColor: "text-orange-600",
    },
    {
      icon: TrendingUp,
      value: `${Math.round(userData.taskStats.totalSuccessRate)}%`,
      label: "Success Rate",
      gradient: "from-purple-500 to-violet-600",
      bgGradient: "from-purple-50/80 to-violet-50/80",
      borderColor: "border-purple-200/60",
      textColor: "text-purple-900",
      labelColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + index * 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className={`bg-gradient-to-br ${stat.bgGradient} backdrop-blur-md border-2 ${stat.borderColor} rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-gradient-to-br ${stat.gradient} shadow-md`}>
              <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div>
              <p className={`text-xl sm:text-2xl font-bold ${stat.textColor}`}>
                {stat.value}
              </p>
              <p className={`text-xs sm:text-sm ${stat.labelColor}`}>{stat.label}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
