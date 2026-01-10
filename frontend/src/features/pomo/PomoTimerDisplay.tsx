import { FC } from "react";
import { motion } from "framer-motion";
import { TimerPhase, PomodoroPreset } from "@/models/Pomo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Coffee } from "lucide-react";
import { formatTime } from "@/services/PomoService";
import { getPhaseColors } from "./utils/pomoColors";
import { PomoControls } from "./PomoControls";

interface PomoTimerDisplayProps {
  currentPhase: TimerPhase;
  selectedPreset: PomodoroPreset;
  timeRemaining: number;
  progress: number;
  currentCycle: number;
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

export const PomoTimerDisplay: FC<PomoTimerDisplayProps> = ({
  currentPhase,
  selectedPreset,
  timeRemaining,
  progress,
  currentCycle,
  isRunning,
  isPaused,
  onStart,
  onPause,
  onResume,
  onReset,
}) => {
  const currentColors = getPhaseColors(currentPhase, selectedPreset);

  return (
    <Card className="shadow-xl overflow-hidden">
      <CardHeader
        className={
          currentColors.customColor
            ? "text-white"
            : `bg-gradient-to-r ${currentColors.bg} text-white`
        }
        style={
          currentColors.customColor
            ? {
                background: `linear-gradient(to right, ${currentColors.customColor}, ${currentColors.customColor}dd)`,
              }
            : undefined
        }
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentPhase === "focus" ? (
              <Brain className="h-6 w-6" />
            ) : (
              <Coffee className="h-6 w-6" />
            )}
            <div>
              <CardTitle className="text-white">
                {currentPhase === "focus"
                  ? "Focus Time"
                  : currentPhase === "shortBreak"
                  ? "Short Break"
                  : "Long Break"}
              </CardTitle>
              <p className="text-white/80 text-sm">
                Cycle {currentCycle} of {selectedPreset.cyclesBeforeLongBreak}
              </p>
            </div>
          </div>
          <Badge className="bg-white/20 text-white border-0">
            {selectedPreset.name}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        {/* Circular Timer */}
        <div className="flex flex-col items-center">
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 200 200"
            >
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="12"
              />
              <motion.circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke={currentColors.customColor || undefined}
                className={
                  !currentColors.customColor ? currentColors.ring : undefined
                }
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 90}
                strokeDashoffset={2 * Math.PI * 90 * (1 - progress / 100)}
                transition={{ duration: 1, ease: "linear" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={`text-5xl md:text-6xl font-bold ${currentColors.text}`}
              >
                {formatTime(timeRemaining)}
              </span>
              <span className="text-gray-500 mt-2">
                {Math.floor(timeRemaining / 60)} min remaining
              </span>
            </div>
          </div>

          {/* Controls */}
          <PomoControls
            isRunning={isRunning}
            isPaused={isPaused}
            currentColors={currentColors}
            onStart={onStart}
            onPause={onPause}
            onResume={onResume}
            onReset={onReset}
          />

          {/* Cycle dots */}
          <div className="flex items-center gap-2 mt-6">
            {Array.from({ length: selectedPreset.cyclesBeforeLongBreak }).map(
              (_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i < currentCycle && !currentColors.customColor
                      ? currentPhase === "focus"
                        ? "bg-indigo-500"
                        : currentPhase === "shortBreak"
                        ? "bg-emerald-500"
                        : "bg-amber-500"
                      : i < currentCycle
                      ? ""
                      : "bg-gray-200"
                  }`}
                  style={
                    currentColors.customColor && i < currentCycle
                      ? { backgroundColor: currentColors.customColor }
                      : undefined
                  }
                />
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
