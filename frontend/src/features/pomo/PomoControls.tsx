import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { PhaseColors } from "./utils/pomoColors";

interface PomoControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  currentColors: PhaseColors;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

export const PomoControls: FC<PomoControlsProps> = ({
  isRunning,
  isPaused,
  currentColors,
  onStart,
  onPause,
  onResume,
  onReset,
}) => {
  return (
    <div className="flex items-center gap-4 mt-8">
      {!isRunning || isPaused ? (
        <Button
          size="lg"
          onClick={isPaused ? onResume : onStart}
          className={
            currentColors.customColor
              ? "hover:opacity-90"
              : `bg-gradient-to-r ${currentColors.bg} hover:opacity-90`
          }
          style={
            currentColors.customColor
              ? { backgroundColor: currentColors.customColor, color: "white" }
              : undefined
          }
        >
          <Play className="h-5 w-5 mr-2" />
          {isPaused ? "Resume" : "Start"}
        </Button>
      ) : (
        <Button
          size="lg"
          onClick={onPause}
          variant="outline"
          className={!currentColors.customColor ? currentColors.text : ""}
          style={
            currentColors.customColor
              ? {
                  borderColor: currentColors.customColor,
                  color: currentColors.customColor,
                }
              : undefined
          }
        >
          <Pause className="h-5 w-5 mr-2" />
          Pause
        </Button>
      )}
      <Button
        size="lg"
        variant="ghost"
        onClick={onReset}
        className="text-gray-600 hover:text-gray-800"
      >
        <RotateCcw className="h-5 w-5" />
      </Button>
    </div>
  );
};
