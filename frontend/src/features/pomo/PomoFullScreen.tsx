import { motion } from "framer-motion";
import { FC } from "react";
import { TimerPhase, PomodoroPreset } from "@/models/Pomo";
import { Button } from "@/components/ui/button";
import { Maximize2, Play, Pause, RotateCcw } from "lucide-react";
import { formatTime } from "@/services/PomoService";
import { getPhaseColors } from "./utils/pomoColors";

interface PomoFullscreenProps {
  currentPhase: TimerPhase;
  selectedPreset: PomodoroPreset;
  setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
  timeRemaining: number;
  progress: number;
  inspirationalPhrase: string;
  isRunning: boolean;
  isPaused: boolean;
  currentCycle: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

export const PomoFullscreen: FC<PomoFullscreenProps> = ({
  currentPhase,
  selectedPreset,
  setIsFullscreen,
  timeRemaining,
  progress,
  inspirationalPhrase,
  isRunning,
  isPaused,
  currentCycle,
  onStart,
  onPause,
  onResume,
  onReset,
}) => {
  // Function to toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const currentColors = getPhaseColors(currentPhase, selectedPreset);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={
        currentColors.customColor
          ? "fixed inset-0 z-50 flex flex-col items-center justify-center"
          : `fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br ${currentColors.bg}`
      }
      style={
        currentColors.customColor
          ? {
              background: `linear-gradient(to bottom right, ${currentColors.customColor}, ${currentColors.customColor}cc)`,
            }
          : undefined
      }
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10"
      >
        <Maximize2 className="h-6 w-6" />
      </Button>

      {/* Giant Timer */}
      <div className="relative w-80 h-80 md:w-96 md:h-96">
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 200 200"
        >
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="8"
          />
          <motion.circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke={currentColors.customColor || "white"}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 90}
            strokeDashoffset={2 * Math.PI * 90 * (1 - progress / 100)}
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl md:text-8xl font-bold text-white">
            {formatTime(timeRemaining)}
          </span>
          <span className="text-xl text-white/80 mt-2 capitalize">
            {currentPhase === "shortBreak"
              ? "Short Break"
              : currentPhase === "longBreak"
              ? "Long Break"
              : "Focus"}
          </span>
        </div>
      </div>

      {/* Inspirational phrase */}
      <motion.p
        key={inspirationalPhrase}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-white/70 text-lg mt-8 text-center px-4 max-w-md"
      >
        "{inspirationalPhrase}"
      </motion.p>

      {/* Minimal controls */}
      <div className="flex items-center gap-4 mt-8">
        {!isRunning || isPaused ? (
          <Button
            size="lg"
            onClick={isPaused ? onResume : onStart}
            className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
            style={
              currentColors.customColor
                ? {
                    backgroundColor: `${currentColors.customColor}40`,
                    backdropFilter: "blur(12px)",
                  }
                : undefined
            }
          >
            <Play className="h-6 w-6 mr-2" />
            {isPaused ? "Resume" : "Start"}
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={onPause}
            className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
            style={
              currentColors.customColor
                ? {
                    backgroundColor: `${currentColors.customColor}40`,
                    backdropFilter: "blur(12px)",
                  }
                : undefined
            }
          >
            <Pause className="h-6 w-6 mr-2" />
            Pause
          </Button>
        )}
        <Button
          size="lg"
          variant="ghost"
          onClick={onReset}
          className="text-white/80 hover:text-white hover:bg-white/10"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>

      {/* Cycle indicator */}
      <div className="flex items-center gap-2 mt-6">
        {Array.from({ length: selectedPreset.cyclesBeforeLongBreak }).map(
          (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < currentCycle ? "bg-white" : "bg-white/30"
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
    </motion.div>
  );
};
