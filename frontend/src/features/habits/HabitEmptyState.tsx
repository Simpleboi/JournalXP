// components/EmptyState.tsx
import { Button } from "@/components/ui/button";
import { Plus, Target, Sparkles } from "lucide-react";
import { FC } from "react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  setIsAddDialogOpen: (open: boolean) => void;
}

export const HabitEmptyState: FC<EmptyStateProps> = ({ setIsAddDialogOpen}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/60 backdrop-blur-md border-2 border-dashed border-green-200/60 rounded-2xl shadow-lg"
    >
      <div className="p-8 sm:p-12 text-center">
        <div className="flex flex-col items-center justify-center">
          {/* Animated Icon */}
          <motion.div
            className="p-5 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 mb-6 shadow-md"
            whileHover={{ scale: 1.05, rotate: 5 }}
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              y: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            <Target className="h-10 w-10 text-green-600" />
          </motion.div>

          <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-3">
            No Habits Yet
          </h3>
          <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
            Start building positive routines by adding your first habit.
            Track your progress and earn XP rewards!
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <span className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200/60">
              Daily Tracking
            </span>
            <span className="px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-200/60">
              Earn XP
            </span>
            <span className="px-3 py-1.5 bg-orange-50 text-orange-700 text-xs font-medium rounded-full border border-orange-200/60">
              Build Streaks
            </span>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all px-6 py-3"
            >
              <Plus className="h-5 w-5 mr-2" /> Add Your First Habit
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
