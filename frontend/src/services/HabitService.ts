// src/services/HabitService.ts (frontend)
import { authFetch } from "@/lib/authFetch";
import { Habit } from "@/models/Habit";

export interface CreateHabitPayload {
  title: string;
  description?: string;
  frequency?: "daily" | "weekly" | "monthly";
  xpReward?: number;
  category?: "mindfulness" | "physical" | "social" | "productivity" | "custom";
  targetCompletions?: number;
}

export interface UpdateHabitPayload {
  title?: string;
  description?: string;
  frequency?: "daily" | "weekly" | "monthly";
  xpReward?: number;
  category?: "mindfulness" | "physical" | "social" | "productivity" | "custom";
  targetCompletions?: number;
}

/**
 * Fetch all habits for the authenticated user
 */
export async function getHabits(): Promise<Habit[]> {
  return authFetch("/habits");
}

/**
 * Fetch all fully completed habits for the authenticated user
 */
export async function getCompletedHabits(): Promise<Habit[]> {
  return authFetch("/habits/completed");
}

/**
 * Create a new habit
 * @param habit - Habit data (title, description, frequency, etc.)
 * @returns The created habit with id and timestamps
 */
export async function createHabit(habit: CreateHabitPayload): Promise<Habit> {
  console.log("➡️ POST /habits payload:", habit);
  return authFetch("/habits", {
    method: "POST",
    body: JSON.stringify(habit),
  });
}

/**
 * Update an existing habit
 * @param id - The ID of the habit to update
 * @param updates - Partial habit data to update
 * @returns The updated habit
 */
export async function updateHabit(id: string, updates: UpdateHabitPayload): Promise<Habit> {
  console.log(`➡️ PUT /habits/${id} payload:`, updates);
  return authFetch(`/habits/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

/**
 * Mark a habit as completed for the current period
 * This will award XP and increment streak
 * @param id - The ID of the habit to complete
 * @returns The updated habit
 */
export async function completeHabit(id: string): Promise<Habit> {
  console.log(`➡️ POST /habits/${id}/complete`);
  return authFetch(`/habits/${id}/complete`, {
    method: "POST",
  });
}

/**
 * Delete a habit
 * @param id - The ID of the habit to delete
 */
export async function deleteHabit(id: string): Promise<void> {
  await authFetch(`/habits/${id}`, { method: "DELETE" });
}
