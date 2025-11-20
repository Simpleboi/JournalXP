// Workout Data Models
export type ExerciseType = "strength" | "hypertrophy" | "cardio" | "mobility";

export interface WorkoutSet {
  setNumber: number;
  weight: number; // in lbs or kg
  reps: number;
  rir?: number; // Reps in reserve (0-5)
  rpe?: number; // Rate of perceived exertion (1-10)
  notes?: string;
}

export interface WorkoutExercise {
  id: string; // unique ID for this exercise instance
  name: string; // e.g., "Bench Press"
  muscleGroup?: string; // e.g., "Chest", "Legs", "Back"
  type: ExerciseType;
  order: number; // order in the workout
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id: string;
  userId: string;
  date: string; // ISO string (YYYY-MM-DD)
  startedAt?: string; // ISO timestamp
  endedAt?: string; // ISO timestamp
  perceivedDifficulty: number; // 1-10
  notes?: string;
  exercises: WorkoutExercise[];
  totalVolume?: number; // sum of all weight * reps
  journalEntryId?: string; // optional link to journal entry
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

// For analytics and progression tracking
export interface ExerciseHistoryEntry {
  date: string; // ISO string (YYYY-MM-DD)
  maxWeight: number;
  totalVolume: number;
  totalSets: number;
  totalReps: number;
}

export interface ExerciseSummary {
  userId: string;
  exerciseName: string;
  history: ExerciseHistoryEntry[];
  prWeight: number; // Personal record
  lastTrainedAt: string; // ISO string
  totalSessions: number;
  createdAt: string;
  updatedAt: string;
}

// For weekly/monthly stats
export interface WorkoutStats {
  workoutsThisWeek: number;
  workoutsThisMonth: number;
  totalVolumeThisWeek: number;
  totalVolumeThisMonth: number;
  currentStreak: number; // consecutive days with workouts
  averageDifficulty: number;
}

// For mood correlation
export interface WorkoutMoodCorrelation {
  averageMoodOnWorkoutDays: number;
  averageMoodOnRestDays: number;
  workoutDaysCount: number;
  restDaysCount: number;
  correlationStrength?: number; // -1 to 1
}
