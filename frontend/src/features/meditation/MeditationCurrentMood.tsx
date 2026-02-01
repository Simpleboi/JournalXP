import { motion } from "framer-motion";
import { MOOD_STATES } from "@/data/MeditationData";
import { MoodState } from "@/types/Meditation";
import { FC } from "react";
import { Check } from "lucide-react";

interface CurrentMoodProps {
  selectedMood: MoodState;
  setSelectedMood: React.Dispatch<React.SetStateAction<MoodState>>;
}

export const CurrentMood: FC<CurrentMoodProps> = ({
  selectedMood,
  setSelectedMood,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 max-w-5xl mx-auto">
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
              className={`w-full relative rounded-xl sm:rounded-2xl p-4 sm:p-5 transition-all duration-300 backdrop-blur-sm border-2 group overflow-hidden ${
                isSelected
                  ? `bg-gradient-to-br ${mood.gradient} border-gray-700 shadow-xl`
                  : "bg-white/80 border-white/50 hover:border-gray-200 hover:shadow-lg"
              }`}
            >
              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center bg-gray-800 shadow-md"
                >
                  <Check className="w-3 h-3 text-white" />
                </motion.div>
              )}

              <div className="relative z-10 text-center">
                <motion.div
                  className="text-3xl sm:text-4xl mb-2 sm:mb-3"
                  animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {mood.emoji}
                </motion.div>
                <p className="text-xs sm:text-sm font-medium text-gray-800">
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
