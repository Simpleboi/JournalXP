import { Habit } from "@/models/Habit";
import { db } from "@/lib/firebase";
import { doc, setDoc, deleteDoc } from "firebase/firestore";

/**
 * Calculates the progress of a habit as a percentage.
 * @param habit The habit object to calculate progress for.
 * @returns A number between 0 and 100 representing percent complete.
 */
export const CalculateProgress = (habit: Habit): number => {
  const target = habit.targetCompletions || 1;
  const current = habit.currentCompletions || 0;
  return Math.min(100, Math.round((current / target) * 100));
};

/**
 * This function is used to color the habit when it displays on the page.
 * @param category | The type of category for the habit
 * @returns a color to represent the habit
 *
 */
export const GetCategoryColor = (category: Habit["category"]) => {
  switch (category) {
    case "mindfulness":
      return "bg-blue-100 text-blue-800";
    case "physical":
      return "bg-green-100 text-green-800";
    case "social":
      return "bg-purple-100 text-purple-800";
    case "productivity":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

/**
 * This function is used to get the type of frequency on a habit
 * @param frequency: string
 * @returns a string for the frequency of said habit
 */
export const GetFrequencyText = (habit: Habit) => {
  switch (habit.frequency) {
    case "daily":
      return "Daily";
    case "weekly":
      return "Weekly";
    case "monthly":
      return "Monthly";
    default:
      return "";
  }
};

// Save a habit in firestore
export async function saveHabit(userId: string, habit: Habit): Promise<void> {
  const habitRef = doc(db, "users", userId, "habits", habit.id);
  await setDoc(habitRef, habit);
}

/**
 * Delete a habit from Firestore
 */
export async function deleteHabitFromFirestore(
  userId: string,
  habitId: string
): Promise<void> {
  const habitRef = doc(db, "users", userId, "habits", habitId);
  await deleteDoc(habitRef);
}

/**
 * Checks if a habit has been completed or not. 
 */

export function canCompleteHabit(habit: Habit): boolean {
  if (!habit.lastCompleted) return true;

  const now = new Date();
  const last = new Date(habit.lastCompleted);
  let nextAvailable = new Date(last);

  switch (habit.frequency) {
    case "daily":
      nextAvailable.setDate(last.getDate() + 1);
      break;
    case "weekly":
      nextAvailable.setDate(last.getDate() + 7);
      break;
    case "monthly":
      nextAvailable.setMonth(last.getMonth() + 1);
      break;
  }

  return now >= nextAvailable;
}
