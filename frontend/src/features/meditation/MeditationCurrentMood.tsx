import { motion } from "framer-motion";
import { MOOD_STATES } from "@/data/MeditationData";
import { MoodState } from "@/types/Meditation";
import { FC } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Check } from "lucide-react";

interface CurrentMoodProps {
  selectedMood: MoodState;
  setSelectedMood: React.Dispatch<React.SetStateAction<MoodState>>;
}

export const CurrentMood: FC<CurrentMoodProps> = ({
  selectedMood,
  setSelectedMood,
}) => {
  const { theme } = useTheme();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
      {MOOD_STATES.map((mood, index) => {
        const isSelected = selectedMood?.id === mood.id;

        return (
          <motion.div
            key={mood.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={() => setSelectedMood(mood)}
              className="w-full relative rounded-2xl p-5 transition-all duration-300 backdrop-blur-md border group overflow-hidden"
              style={{
                background: isSelected
                  ? `linear-gradient(135deg, ${theme.colors.primary}40, ${theme.colors.secondary}30)`
                  : `${theme.colors.surfaceLight}50`,
                borderColor: isSelected
                  ? theme.colors.primary
                  : `${theme.colors.border}50`,
                boxShadow: isSelected
                  ? `0 8px 32px ${theme.colors.primary}30, inset 0 1px 0 ${theme.colors.primary}20`
                  : `0 4px 16px ${theme.colors.background}40`,
              }}
            >
              {/* Glow effect on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${theme.colors.primary}20, transparent 70%)`,
                }}
              />

              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: theme.colors.primary }}
                >
                  <Check className="w-3 h-3" style={{ color: theme.colors.background }} />
                </motion.div>
              )}

              <div className="relative z-10 text-center">
                <motion.div
                  className="text-4xl mb-3"
                  animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {mood.emoji}
                </motion.div>
                <p
                  className="text-sm font-medium"
                  style={{ color: theme.colors.text }}
                >
                  {mood.name}
                </p>
              </div>
            </button>
          </motion.div>
        );
      })}
    </div>
  );
};
