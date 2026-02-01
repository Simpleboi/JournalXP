import { BookOpen, Wind } from "lucide-react";
import { MoodState } from "@/types/Meditation";
import { FC } from "react";

interface MoodBasedQuoteProps {
  selectedMood: MoodState;
}

export const MoodBasedQuote: FC<MoodBasedQuoteProps> = ({
  selectedMood
}) => {
  return (
    <div
      className={`bg-gradient-to-br ${selectedMood.gradient} rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20`}
    >
      <div className="space-y-4 sm:space-y-6">
        <div className="text-center">
          <p className="text-lg sm:text-xl md:text-2xl font-medium text-gray-800 italic mb-4">
            "{selectedMood.quote}"
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-700">
            <span className="flex items-center gap-1">
              <Wind className="h-4 w-4" />
              Breathing: {selectedMood.breathingPattern.inhale}-
              {selectedMood.breathingPattern.hold}-
              {selectedMood.breathingPattern.exhale}-
              {selectedMood.breathingPattern.holdAfter}
            </span>
          </div>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Journal Prompt
          </h4>
          <p className="text-gray-700 italic text-sm sm:text-base">"{selectedMood.journalPrompt}"</p>
        </div>
      </div>
    </div>
  );
};
