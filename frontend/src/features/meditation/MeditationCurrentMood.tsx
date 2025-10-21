import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { MOOD_STATES } from "@/data/MeditationData";
import { MoodState } from "@/types/Meditation";
import { FC } from "react";

interface CurrentMoodProps {
  selectedMood: MoodState;
  setSelectedMood: React.Dispatch<React.SetStateAction<MoodState>>;
}

export const CurrentMood: FC<CurrentMoodProps> = ({
  selectedMood,
  setSelectedMood,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
      {MOOD_STATES.map((mood, index) => (
        <motion.div
          key={mood.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Card
            onClick={() => setSelectedMood(mood)}
            className={`cursor-pointer transition-all duration-300 ${
              selectedMood?.id === mood.id
                ? `bg-gradient-to-br ${mood.gradient} border-2 border-gray-800 shadow-xl`
                : "bg-white hover:shadow-lg"
            }`}
          >
            <CardContent className="p-4 text-center">
              <div className="text-4xl mb-2">{mood.emoji}</div>
              <p className="text-sm font-medium text-gray-800">{mood.name}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
