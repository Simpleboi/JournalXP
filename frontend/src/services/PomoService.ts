// Pomodoro Service - localStorage based for demo
import {
  PomodoroPreset,
  CustomPomodoroPreset,
  PomodoroSession,
  PomodoroStats,
  DEFAULT_PRESETS,
  AmbientSound,
} from "@/models/Pomo";


export const getAllPresets = (userId: string): PomodoroPreset[] => {
  const customPresets = getCustomPresets(userId);
  return [...DEFAULT_PRESETS, ...customPresets];
};

export const getCustomPresets = (userId: string): CustomPomodoroPreset[] => {
  const data = localStorage.getItem(`pomodoroPresets_${userId}`);
  if (!data) return [];
  return JSON.parse(data);
};

export const saveCustomPreset = (
  userId: string,
  preset: Omit<CustomPomodoroPreset, "id" | "userId" | "createdAt" | "updatedAt">
): CustomPomodoroPreset => {
  const now = new Date().toISOString();
  const newPreset: CustomPomodoroPreset = {
    ...preset,
    id: `custom-${Date.now()}`,
    userId,
    createdAt: now,
    updatedAt: now,
  };

  const presets = getCustomPresets(userId);
  presets.push(newPreset);
  localStorage.setItem(`pomodoroPresets_${userId}`, JSON.stringify(presets));

  return newPreset;
};

export const updateCustomPreset = (
  userId: string,
  presetId: string,
  updates: Partial<CustomPomodoroPreset>
): CustomPomodoroPreset | null => {
  const presets = getCustomPresets(userId);
  const index = presets.findIndex((p) => p.id === presetId);

  if (index === -1) return null;

  presets[index] = {
    ...presets[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(`pomodoroPresets_${userId}`, JSON.stringify(presets));
  return presets[index];
};

export const deleteCustomPreset = (userId: string, presetId: string): boolean => {
  const presets = getCustomPresets(userId);
  const filtered = presets.filter((p) => p.id !== presetId);

  if (filtered.length === presets.length) return false;

  localStorage.setItem(`pomodoroPresets_${userId}`, JSON.stringify(filtered));
  return true;
};

// ============================================================================
// SESSIONS CRUD
// ============================================================================

export const savePomodoroSession = (
  userId: string,
  session: Omit<PomodoroSession, "id">
): PomodoroSession => {
  const newSession: PomodoroSession = {
    ...session,
    id: `session-${Date.now()}`,
  };

  const sessions = getAllPomodoroSessions(userId);
  sessions.push(newSession);
  localStorage.setItem(`pomodoroSessions_${userId}`, JSON.stringify(sessions));

  return newSession;
};

export const getAllPomodoroSessions = (userId: string): PomodoroSession[] => {
  const data = localStorage.getItem(`pomodoroSessions_${userId}`);
  if (!data) return [];
  return JSON.parse(data);
};

export const getRecentPomodoroSessions = (
  userId: string,
  limit: number = 10
): PomodoroSession[] => {
  const sessions = getAllPomodoroSessions(userId);
  return sessions
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, limit);
};

// ============================================================================
// STATS
// ============================================================================

export const getPomodoroStats = (userId: string): PomodoroStats => {
  const sessions = getAllPomodoroSessions(userId);

  const totalFocusMinutes = sessions.reduce(
    (sum, s) => sum + s.totalFocusMinutes,
    0
  );
  const totalSessions = sessions.length;
  const completedCycles = sessions.reduce(
    (sum, s) => sum + s.completedCycles,
    0
  );

  // Calculate streak
  const sortedDates = [...new Set(
    sessions.map((s) => s.startedAt.split("T")[0])
  )].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let currentStreak = 0;
  let checkDate = new Date();
  checkDate.setHours(0, 0, 0, 0);

  for (const dateStr of sortedDates) {
    const sessionDate = new Date(dateStr);
    sessionDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (checkDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays <= 1) {
      currentStreak++;
      checkDate = sessionDate;
    } else {
      break;
    }
  }

  // Calculate average focus per day
  const uniqueDays = new Set(sessions.map((s) => s.startedAt.split("T")[0])).size;
  const averageFocusPerDay = uniqueDays > 0 ? totalFocusMinutes / uniqueDays : 0;

  return {
    totalFocusMinutes,
    totalSessions,
    completedCycles,
    currentStreak,
    longestStreak: currentStreak, // Simplified for now
    averageFocusPerDay,
  };
};

// ============================================================================
// SETTINGS
// ============================================================================

export interface PomodoroSettings {
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  defaultSound: AmbientSound;
  volume: number;
}

export const getDefaultSettings = (): PomodoroSettings => ({
  autoStartBreaks: false,
  autoStartFocus: false,
  soundEnabled: true,
  notificationsEnabled: true,
  defaultSound: "none",
  volume: 50,
});

export const getPomodoroSettings = (userId: string): PomodoroSettings => {
  const data = localStorage.getItem(`pomodoroSettings_${userId}`);
  if (!data) return getDefaultSettings();
  return { ...getDefaultSettings(), ...JSON.parse(data) };
};

export const savePomodoroSettings = (
  userId: string,
  settings: Partial<PomodoroSettings>
): PomodoroSettings => {
  const current = getPomodoroSettings(userId);
  const updated = { ...current, ...settings };
  localStorage.setItem(`pomodoroSettings_${userId}`, JSON.stringify(updated));
  return updated;
};

// ============================================================================
// UTILITIES
// ============================================================================

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export const calculateTotalSessionDuration = (preset: PomodoroPreset): number => {
  const focusTotal = preset.focusDuration * preset.cyclesBeforeLongBreak;
  const shortBreakTotal =
    preset.shortBreakDuration * (preset.cyclesBeforeLongBreak - 1);
  const longBreakTotal = preset.longBreakDuration;
  return focusTotal + shortBreakTotal + longBreakTotal;
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};
