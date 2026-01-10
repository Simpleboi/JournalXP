import { TimerPhase, PomodoroPreset } from "@/models/Pomo";

export interface PhaseColors {
  bg: string;
  ring: string;
  text: string;
  badge: string;
  customColor?: string;
}

export const getPhaseColors = (
  currentPhase: TimerPhase,
  selectedPreset: PomodoroPreset
): PhaseColors => {
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
