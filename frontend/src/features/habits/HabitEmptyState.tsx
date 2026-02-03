// components/EmptyState.tsx
import { Button } from "@/components/ui/button";
import { Plus, Target, Sparkles } from "lucide-react";
import { FC } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

// Helper to convert hex to rgba
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

interface EmptyStateProps {
  setIsAddDialogOpen: (open: boolean) => void;
}

export const HabitEmptyState: FC<EmptyStateProps> = ({ setIsAddDialogOpen}) => {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-sm border-2 border-dashed rounded-2xl shadow-md"
      style={{ borderColor: hexToRgba(theme.colors.primary, 0.4) }}
    >
      <div className="p-8 sm:p-12 text-center">
        <div className="flex flex-col items-center justify-center">
          {/* Animated Icon */}
          <motion.div
            className="p-5 rounded-2xl mb-6 shadow-md"
            style={{
              background: `linear-gradient(to bottom right, ${hexToRgba(theme.colors.primary, 0.2)}, ${hexToRgba(theme.colors.secondary, 0.2)})`
            }}
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
            <Target className="h-10 w-10" style={{ color: theme.colors.primary }} />
          </motion.div>

          <h3
            className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent mb-3"
            style={{ backgroundImage: theme.colors.gradient }}
          >
            No Habits Yet
          </h3>
          <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
            Start building positive routines by adding your first habit.
            Track your progress and earn XP rewards!
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <span
              className="px-3 py-1.5 text-xs font-medium rounded-full border"
              style={{
                backgroundColor: hexToRgba(theme.colors.primary, 0.1),
                color: theme.colors.primary,
                borderColor: hexToRgba(theme.colors.primary, 0.3)
              }}
            >
              Daily Tracking
            </span>
            <span
              className="px-3 py-1.5 text-xs font-medium rounded-full border"
              style={{
                backgroundColor: hexToRgba(theme.colors.secondary, 0.1),
                color: theme.colors.secondary,
                borderColor: hexToRgba(theme.colors.secondary, 0.3)
              }}
            >
              Earn XP
            </span>
            <span
              className="px-3 py-1.5 text-xs font-medium rounded-full border"
              style={{
                backgroundColor: hexToRgba(theme.colors.accent, 0.1),
                color: theme.colors.accent,
                borderColor: hexToRgba(theme.colors.accent, 0.3)
              }}
            >
              Build Streaks
            </span>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="text-white rounded-xl shadow-lg hover:shadow-xl transition-all px-6 py-3 hover:opacity-90"
              style={{ background: theme.colors.gradient }}
            >
              <Plus className="h-5 w-5 mr-2" /> Add Your First Habit
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
