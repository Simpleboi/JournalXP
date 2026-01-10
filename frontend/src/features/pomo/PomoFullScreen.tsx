import { motion, AnimatePresence } from "framer-motion";
import { FC } from "react";
import { TimerPhase, PomodoroPreset } from "@/models/Pomo";
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";

interface PomoFullscreenProps {
  currentPhase: TimerPhase;
  selectedPreset: PomodoroPreset;
  setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>
}

export const PomoFullscreen: FC<PomoFullscreenProps> = ({
  currentPhase,
  selectedPreset,
  setIsFullscreen
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

  // Phase colors
  const getPhaseColors = () => {
    const customColor = (selectedPreset as any).themeColor;

    if (customColor) {
      // Use custom color for all phases
      return {
        bg: "from-indigo-500 to-purple-600",
        ring: customColor,
        text: "text-gray-800",
        badge: "bg-gray-100 text-gray-700",
        customColor: customColor,
      };
    }

    // Default phase colors
    const phaseColors = {
      focus: {
        bg: "from-indigo-500 to-purple-600",
        ring: "stroke-indigo-500",
        text: "text-indigo-600",
        badge: "bg-indigo-100 text-indigo-700",
        customColor: undefined,
      },
      shortBreak: {
        bg: "from-emerald-500 to-teal-600",
        ring: "stroke-emerald-500",
        text: "text-emerald-600",
        badge: "bg-emerald-100 text-emerald-700",
        customColor: undefined,
      },
      longBreak: {
        bg: "from-amber-500 to-orange-600",
        ring: "stroke-amber-500",
        text: "text-amber-600",
        badge: "bg-amber-100 text-amber-700",
        customColor: undefined,
      },
    };

    return phaseColors[currentPhase];
  };

  const currentColors = getPhaseColors();

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
            onClick={isPaused ? handleResume : handleStart}
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
            onClick={handlePause}
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
          onClick={handleReset}
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
