export type TimerPhase = "focus" | "shortBreak" | "longBreak";

export type AmbientSound =
  | "rain"
  | "brownNoise"
  | "whiteNoise"
  | "forest"
  | "ocean"
  | "cafe"
  | "fireplace"
  | "none";

export interface PomodoroPreset {
  id: string;
  name: string;
  focusDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  cyclesBeforeLongBreak: number;
  isDefault?: boolean;
}

export interface CustomPomodoroPreset extends PomodoroPreset {
  userId: string;
  soundPreference: AmbientSound;
  themeColor: string;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PomodoroSession {
  id: string;
  userId: string;
  presetId: string;
  presetName: string;
  startedAt: string;
  endedAt?: string;
  completedCycles: number;
  totalFocusMinutes: number;
  totalBreakMinutes: number;
  wasCompleted: boolean;
}

export interface PomodoroState {
  isRunning: boolean;
  isPaused: boolean;
  currentPhase: TimerPhase;
  timeRemaining: number; // in seconds
  currentCycle: number;
  totalCycles: number;
  preset: PomodoroPreset;
}

export interface PomodoroStats {
  totalFocusMinutes: number;
  totalSessions: number;
  completedCycles: number;
  currentStreak: number;
  longestStreak: number;
  averageFocusPerDay: number;
}

// Default presets
export const DEFAULT_PRESETS: PomodoroPreset[] = [
  {
    id: "classic",
    name: "Classic",
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    cyclesBeforeLongBreak: 4,
    isDefault: true,
  },
  {
    id: "extended",
    name: "Extended",
    focusDuration: 30,
    shortBreakDuration: 10,
    longBreakDuration: 20,
    cyclesBeforeLongBreak: 4,
    isDefault: true,
  },
  {
    id: "deep-work",
    name: "Deep Work",
    focusDuration: 45,
    shortBreakDuration: 15,
    longBreakDuration: 30,
    cyclesBeforeLongBreak: 3,
    isDefault: true,
  },
  {
    id: "intense",
    name: "Intense",
    focusDuration: 50,
    shortBreakDuration: 10,
    longBreakDuration: 25,
    cyclesBeforeLongBreak: 4,
    isDefault: true,
  },
  {
    id: "ultra",
    name: "Ultra Focus",
    focusDuration: 90,
    shortBreakDuration: 20,
    longBreakDuration: 45,
    cyclesBeforeLongBreak: 2,
    isDefault: true,
  },
];

export const AMBIENT_SOUNDS: {
  value: AmbientSound;
  label: string;
  icon: string;
}[] = [
  { value: "none", label: "None", icon: "🔇" },
  { value: "rain", label: "Rain", icon: "🌧️" },
  { value: "brownNoise", label: "Brown Noise", icon: "🟤" },
  { value: "whiteNoise", label: "White Noise", icon: "⚪" },
  { value: "forest", label: "Forest", icon: "🌲" },
  { value: "ocean", label: "Ocean Waves", icon: "🌊" },
  { value: "cafe", label: "Café", icon: "☕" },
  { value: "fireplace", label: "Fireplace", icon: "🔥" },
];

export const THEME_COLORS = [
  { name: "Indigo", value: "#6366f1" },
  { name: "Purple", value: "#a855f7" },
  { name: "Pink", value: "#ec4899" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Orange", value: "#f97316" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Emerald", value: "#10b981" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Blue", value: "#3b82f6" },
];

export const INSPIRATIONAL_PHRASES = [
  "Focus on progress, not perfection.",
  "One task at a time, one moment at a time.",
  "Your future self will thank you.",
  "Small steps lead to big achievements.",
  "Stay present, stay focused.",
  "You're doing great. Keep going.",
  "Deep work creates deep results.",
  "Embrace the flow state.",
  "Consistency beats intensity.",
  "This moment is all that matters.",
];
