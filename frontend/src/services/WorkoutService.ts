import {
  WorkoutSession,
  WorkoutExercise,
  ExerciseSummary,
  ExerciseHistoryEntry,
  WorkoutStats,
  WorkoutMoodCorrelation,
} from "@/models/Workout";

// ============================================================================
// WORKOUT SESSIONS CRUD
// ============================================================================

export const saveWorkoutSession = async (
  userId: string,
  session: Omit<WorkoutSession, "id" | "createdAt" | "updatedAt">
): Promise<WorkoutSession> => {
  const now = new Date().toISOString();
  const sessionId = session.date + "-" + Date.now();

  const fullSession: WorkoutSession = {
    ...session,
    id: sessionId,
    userId,
    createdAt: now,
    updatedAt: now,
    totalVolume: calculateSessionVolume(session.exercises),
  };

  // Save to localStorage (replace with Firestore)
  const sessions = getAllWorkoutSessions(userId);
  sessions.push(fullSession);
  localStorage.setItem(`workoutSessions_${userId}`, JSON.stringify(sessions));

  // Update exercise summaries
  await updateExerciseSummaries(userId, fullSession);

  return fullSession;
};

export const updateWorkoutSession = async (
  userId: string,
  sessionId: string,
  updates: Partial<WorkoutSession>
): Promise<WorkoutSession> => {
  const sessions = getAllWorkoutSessions(userId);
  const index = sessions.findIndex((s) => s.id === sessionId);

  if (index === -1) {
    throw new Error("Session not found");
  }

  const updatedSession: WorkoutSession = {
    ...sessions[index],
    ...updates,
    updatedAt: new Date().toISOString(),
    totalVolume: updates.exercises
      ? calculateSessionVolume(updates.exercises)
      : sessions[index].totalVolume,
  };

  sessions[index] = updatedSession;
  localStorage.setItem(`workoutSessions_${userId}`, JSON.stringify(sessions));

  // Update exercise summaries
  await updateExerciseSummaries(userId, updatedSession);

  return updatedSession;
};

export const deleteWorkoutSession = async (
  userId: string,
  sessionId: string
): Promise<void> => {
  const sessions = getAllWorkoutSessions(userId);
  const filtered = sessions.filter((s) => s.id !== sessionId);
  localStorage.setItem(`workoutSessions_${userId}`, JSON.stringify(filtered));
};

export const getWorkoutSession = (
  userId: string,
  sessionId: string
): WorkoutSession | null => {
  const sessions = getAllWorkoutSessions(userId);
  return sessions.find((s) => s.id === sessionId) || null;
};

export const getAllWorkoutSessions = (userId: string): WorkoutSession[] => {
  const data = localStorage.getItem(`workoutSessions_${userId}`);
  if (!data) return [];
  return JSON.parse(data);
};

export const getRecentWorkoutSessions = (
  userId: string,
  limit: number = 10
): WorkoutSession[] => {
  const sessions = getAllWorkoutSessions(userId);
  return sessions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};

// ============================================================================
// EXERCISE SUMMARIES
// ============================================================================

const updateExerciseSummaries = async (
  userId: string,
  session: WorkoutSession
): Promise<void> => {
  for (const exercise of session.exercises) {
    await updateExerciseSummary(userId, exercise.name, session);
  }
};

const updateExerciseSummary = async (
  userId: string,
  exerciseName: string,
  session: WorkoutSession
): Promise<void> => {
  const summaries = getAllExerciseSummaries(userId);
  let summary = summaries.find((s) => s.exerciseName === exerciseName);

  const exercise = session.exercises.find((e) => e.name === exerciseName);
  if (!exercise) return;

  const maxWeight = Math.max(...exercise.sets.map((s) => s.weight));
  const totalVolume = exercise.sets.reduce(
    (sum, set) => sum + set.weight * set.reps,
    0
  );
  const totalSets = exercise.sets.length;
  const totalReps = exercise.sets.reduce((sum, set) => sum + set.reps, 0);

  const historyEntry: ExerciseHistoryEntry = {
    date: session.date,
    maxWeight,
    totalVolume,
    totalSets,
    totalReps,
  };

  if (!summary) {
    summary = {
      userId,
      exerciseName,
      history: [historyEntry],
      prWeight: maxWeight,
      lastTrainedAt: session.date,
      totalSessions: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    summaries.push(summary);
  } else {
    // Update existing summary
    const existingIndex = summary.history.findIndex(
      (h) => h.date === session.date
    );
    if (existingIndex >= 0) {
      summary.history[existingIndex] = historyEntry;
    } else {
      summary.history.push(historyEntry);
    }

    summary.history.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    summary.prWeight = Math.max(summary.prWeight, maxWeight);
    summary.lastTrainedAt = session.date;
    summary.totalSessions = summary.history.length;
    summary.updatedAt = new Date().toISOString();
  }

  localStorage.setItem(
    `exerciseSummaries_${userId}`,
    JSON.stringify(summaries)
  );
};

export const getExerciseSummary = (
  userId: string,
  exerciseName: string
): ExerciseSummary | null => {
  const summaries = getAllExerciseSummaries(userId);
  return summaries.find((s) => s.exerciseName === exerciseName) || null;
};

export const getAllExerciseSummaries = (userId: string): ExerciseSummary[] => {
  const data = localStorage.getItem(`exerciseSummaries_${userId}`);
  if (!data) return [];
  return JSON.parse(data);
};

export const getAllExerciseNames = (userId: string): string[] => {
  const summaries = getAllExerciseSummaries(userId);
  return summaries.map((s) => s.exerciseName).sort();
};

// ============================================================================
// ANALYTICS & STATS
// ============================================================================

export const calculateSessionVolume = (
  exercises: WorkoutExercise[]
): number => {
  return exercises.reduce((total, exercise) => {
    const exerciseVolume = exercise.sets.reduce(
      (sum, set) => sum + set.weight * set.reps,
      0
    );
    return total + exerciseVolume;
  }, 0);
};

export const getWorkoutStats = (userId: string): WorkoutStats => {
  const sessions = getAllWorkoutSessions(userId);
  const now = new Date();

  // Get start of week (Sunday)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  // Get start of month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const sessionsThisWeek = sessions.filter(
    (s) => new Date(s.date) >= startOfWeek
  );
  const sessionsThisMonth = sessions.filter(
    (s) => new Date(s.date) >= startOfMonth
  );

  const totalVolumeThisWeek = sessionsThisWeek.reduce(
    (sum, s) => sum + (s.totalVolume || 0),
    0
  );
  const totalVolumeThisMonth = sessionsThisMonth.reduce(
    (sum, s) => sum + (s.totalVolume || 0),
    0
  );

  // Calculate streak
  const sortedSessions = sessions
    .map((s) => s.date)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let currentStreak = 0;
  let checkDate = new Date();
  checkDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedSessions.length; i++) {
    const sessionDate = new Date(sortedSessions[i]);
    sessionDate.setHours(0, 0, 0, 0);

    if (sessionDate.getTime() === checkDate.getTime()) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (sessionDate.getTime() < checkDate.getTime()) {
      break;
    }
  }

  const averageDifficulty =
    sessions.length > 0
      ? sessions.reduce((sum, s) => sum + s.perceivedDifficulty, 0) /
        sessions.length
      : 0;

  return {
    workoutsThisWeek: sessionsThisWeek.length,
    workoutsThisMonth: sessionsThisMonth.length,
    totalVolumeThisWeek,
    totalVolumeThisMonth,
    currentStreak,
    averageDifficulty,
  };
};

// ============================================================================
// MOOD CORRELATION
// ============================================================================

export const calculateWorkoutMoodCorrelation = (
  userId: string
): WorkoutMoodCorrelation => {
  // Get workout sessions
  const sessions = getAllWorkoutSessions(userId);
  const workoutDates = new Set(sessions.map((s) => s.date));

  // Get journal entries (assuming they exist in localStorage)
  const journalEntriesData = localStorage.getItem("journalEntries");
  if (!journalEntriesData) {
    return {
      averageMoodOnWorkoutDays: 0,
      averageMoodOnRestDays: 0,
      workoutDaysCount: 0,
      restDaysCount: 0,
    };
  }

  const journalEntries = JSON.parse(journalEntriesData);

  // Map mood strings to numbers
  const moodValues: Record<string, number> = {
    amazing: 5,
    good: 4,
    okay: 3,
    bad: 2,
    terrible: 1,
  };

  let workoutDaysMoodSum = 0;
  let workoutDaysCount = 0;
  let restDaysMoodSum = 0;
  let restDaysCount = 0;

  Object.entries(journalEntries).forEach(([date, entry]: [string, any]) => {
    if (entry.mood) {
      const moodValue = moodValues[entry.mood] || 3;
      if (workoutDates.has(date)) {
        workoutDaysMoodSum += moodValue;
        workoutDaysCount++;
      } else {
        restDaysMoodSum += moodValue;
        restDaysCount++;
      }
    }
  });

  const averageMoodOnWorkoutDays =
    workoutDaysCount > 0 ? workoutDaysMoodSum / workoutDaysCount : 0;
  const averageMoodOnRestDays =
    restDaysCount > 0 ? restDaysMoodSum / restDaysCount : 0;

  return {
    averageMoodOnWorkoutDays,
    averageMoodOnRestDays,
    workoutDaysCount,
    restDaysCount,
  };
};
