import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar, Award, Flame, CheckCircle, Lock, Infinity, Sparkles } from "lucide-react";
import { Habit } from "@/models/Habit";
import { Progress } from "@/components/ui/progress";
import { CalculateProgress } from "./HabitUtils";
import { Badge } from "@/components/ui/badge";
import { GetFrequencyText } from "./HabitUtils";
import { GetCategoryColor } from "./HabitUtils";
import { FC } from "react";
import { motion } from "framer-motion";

/**
 * Check if enough time has passed to complete the habit again based on frequency
 */
function canCompleteHabit(habit: Habit): boolean {
  if (!habit.lastCompleted) return true;

  const now = new Date();
  const last = new Date(habit.lastCompleted);

  // Handle custom frequencies
  if (habit.frequency === "custom" && habit.customFrequency) {
    const { interval, unit } = habit.customFrequency;
    const diffMs = now.getTime() - last.getTime();
    let requiredMs = 0;

    switch (unit) {
      case "minutes":
        requiredMs = interval * 60 * 1000;
        break;
      case "hours":
        requiredMs = interval * 60 * 60 * 1000;
        break;
      case "days":
        requiredMs = interval * 24 * 60 * 60 * 1000;
        break;
    }

    return diffMs >= requiredMs;
  }

  // Handle specific time for daily habits
  if (habit.specificTime && habit.frequency === "daily") {
    const [hours, minutes] = habit.specificTime.split(":").map(Number);
    const specificTimeToday = new Date();
    specificTimeToday.setHours(hours, minutes, 0, 0);

    const lastDate = new Date(last);
    lastDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // If last completed was before today, and we've passed the specific time
    if (lastDate < today && now >= specificTimeToday) {
      return true;
    }
    // If last completed was today or after, not ready yet
    if (lastDate >= today) {
      return false;
    }
  }

  // Standard frequencies (use day-based comparison)
  now.setHours(0, 0, 0, 0);
  last.setHours(0, 0, 0, 0);

  const diffMs = now.getTime() - last.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  switch (habit.frequency) {
    case "daily":
      return diffDays >= 1;
    case "weekly":
      return diffDays >= 7;
    case "monthly":
      return diffDays >= 30;
    default:
      return true;
  }
}

/**
 * Get time remaining until habit can be completed again
 */
function getTimeUntilAvailable(habit: Habit): string {
  if (!habit.lastCompleted) return "";

  const now = new Date();
  const last = new Date(habit.lastCompleted);
  let nextAvailable = new Date(last);

  // Handle custom frequencies
  if (habit.frequency === "custom" && habit.customFrequency) {
    const { interval, unit } = habit.customFrequency;

    switch (unit) {
      case "minutes":
        nextAvailable.setMinutes(last.getMinutes() + interval);
        break;
      case "hours":
        nextAvailable.setHours(last.getHours() + interval);
        break;
      case "days":
        nextAvailable.setDate(last.getDate() + interval);
        break;
    }

    const diffMs = nextAvailable.getTime() - now.getTime();
    const diffMinutes = Math.ceil(diffMs / (1000 * 60));
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Available soon";
    if (diffMinutes < 60) return `Available in ${diffMinutes}m`;
    if (diffHours < 24) return `Available in ${diffHours}h`;
    return `Available in ${diffDays}d`;
  }

  // Handle specific time for daily habits
  if (habit.specificTime && habit.frequency === "daily") {
    const [hours, minutes] = habit.specificTime.split(":").map(Number);
    const specificTimeToday = new Date();
    specificTimeToday.setHours(hours, minutes, 0, 0);

    const lastDate = new Date(last);
    lastDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // If last completed today, wait until tomorrow's specific time
    if (lastDate >= today) {
      const tomorrow = new Date(specificTimeToday);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const diffMs = tomorrow.getTime() - now.getTime();
      const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
      if (diffHours < 24) return `Available in ${diffHours}h`;
      return "Available tomorrow";
    }

    // If last completed before today, check if specific time has passed
    if (now < specificTimeToday) {
      const diffMs = specificTimeToday.getTime() - now.getTime();
      const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
      if (diffHours < 1) return "Available soon";
      return `Available in ${diffHours}h`;
    }
  }

  // Standard frequencies
  switch (habit.frequency) {
    case "daily":
      nextAvailable.setDate(last.getDate() + 1);
      break;
    case "weekly":
      nextAvailable.setDate(last.getDate() + 7);
      break;
    case "monthly":
      nextAvailable.setMonth(last.getMonth() + 1);
      break;
  }

  const diffMs = nextAvailable.getTime() - now.getTime();
  const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "Available soon";
  if (diffHours < 24) return `Available in ${diffHours}h`;
  const diffDays = Math.ceil(diffHours / 24);
  return `Available in ${diffDays}d`;
}

export interface HabitCardProps {
  habit: Habit;
  editHabit: (id: string) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (id: string) => void;
  isCompleted?: boolean; // If true, this is a fully completed habit
}

export const HabitCard: FC<HabitCardProps> = ({
  habit,
  editHabit,
  deleteHabit,
  toggleHabitCompletion,
  isCompleted = false,
}) => {
  const canComplete = canCompleteHabit(habit);
  const timeUntilAvailable = !canComplete ? getTimeUntilAvailable(habit) : "";

  return (
    <motion.div
      className={`h-full bg-white/70 backdrop-blur-md border-2 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
        isCompleted
          ? 'border-green-300/60 bg-gradient-to-br from-green-50/80 to-emerald-50/80'
          : 'border-white/50 hover:border-green-200/60'
      }`}
      whileHover={{ y: -2 }}
    >
      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {habit.category && (
                <Badge className={`${GetCategoryColor(habit.category)} shadow-sm`}>
                  {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
                </Badge>
              )}
              {habit.isIndefinite && (
                <Badge className="bg-purple-100/80 text-purple-800 flex items-center gap-1 shadow-sm">
                  <Infinity className="h-3 w-3" /> Indefinite
                </Badge>
              )}
              {isCompleted && (
                <Badge className="bg-green-100/80 text-green-800 shadow-sm">
                  <Sparkles className="h-3 w-3 mr-1" /> Completed
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              {habit.title}
            </h3>
            {habit.description && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{habit.description}</p>
            )}
          </div>
          <div className="flex space-x-1 ml-2">
            {!isCompleted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => editHabit(habit.id)}
                className="h-8 w-8 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteHabit(habit.id)}
              className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between mb-4 p-3 bg-white/50 rounded-xl border border-white/60">
          <div className="flex items-center gap-1.5">
            <div className="p-1.5 rounded-lg bg-indigo-100/80">
              <Calendar className="h-3.5 w-3.5 text-indigo-600" />
            </div>
            <span className="text-xs font-medium text-gray-600">
              {GetFrequencyText(habit)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="p-1.5 rounded-lg bg-amber-100/80">
              <Award className="h-3.5 w-3.5 text-amber-600" />
            </div>
            <span className="text-xs font-medium text-amber-700">+{habit.xpReward} XP</span>
          </div>
        </div>

        {/* Progress Section */}
        {!habit.isIndefinite && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span className="font-medium">Progress</span>
              <span className="font-semibold text-emerald-600">
                {habit.currentCompletions}/{habit.targetCompletions}
              </span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${CalculateProgress(habit)}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* Indefinite Habit Section */}
        {habit.isIndefinite && (
          <div className="mb-4 p-3 bg-gradient-to-br from-purple-50/80 to-violet-50/80 backdrop-blur-sm rounded-xl border border-purple-200/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-200/80">
                  <Infinity className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-purple-900">Streak Focus</span>
              </div>
              <span className="text-sm font-semibold text-purple-700">
                {habit.currentCompletions} total
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200/60">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-semibold text-orange-700">{habit.streak} day streak</span>
          </div>

          {isCompleted ? (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="border-green-400 bg-green-50 text-green-700 rounded-xl"
            >
              <CheckCircle className="h-4 w-4 mr-1" /> Achieved
            </Button>
          ) : canComplete ? (
            <Button
              size="sm"
              onClick={() => toggleHabitCompletion(habit.id)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <CheckCircle className="h-4 w-4 mr-1" /> Complete
            </Button>
          ) : habit.completed ? (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="border-green-400 bg-green-50 text-green-700 rounded-xl"
            >
              <CheckCircle className="h-4 w-4 mr-1" /> Done
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="cursor-not-allowed rounded-xl border-gray-200 text-gray-400"
              title={timeUntilAvailable}
            >
              <Lock className="h-4 w-4 mr-1" /> Locked
            </Button>
          )}
        </div>

        {/* Time Until Available */}
        {!canComplete && !isCompleted && (
          <p className="text-xs text-gray-500 mt-3 text-center py-1.5 bg-gray-50/80 rounded-lg">
            {timeUntilAvailable}
          </p>
        )}
      </div>
    </motion.div>
  );
};
