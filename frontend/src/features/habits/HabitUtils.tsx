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
      return habit.specificTime ? `Daily at ${habit.specificTime}` : "Daily";
    case "weekly":
      return "Weekly";
    case "monthly":
      return "Monthly";
    case "custom":
      if (habit.customFrequency) {
        const { interval, unit } = habit.customFrequency;
        const unitText = interval === 1 ? unit.slice(0, -1) : unit; // Remove 's' if singular
        return `Every ${interval} ${unitText}`;
      }
      return "Custom";
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

  // Handle custom frequencies
  if (habit.frequency === "custom" && habit.customFrequency) {
    const { interval, unit } = habit.customFrequency;
    const diffMs = now.getTime() - last.getTime();
    let requiredMs = 0;

    switch (unit) {
      case "minutes":
        requiredMs = interval * 60 * 1000;
        break;
      case "hours":
        requiredMs = interval * 60 * 60 * 1000;
        break;
      case "days":
        requiredMs = interval * 24 * 60 * 60 * 1000;
        break;
    }

    return diffMs >= requiredMs;
  }

  // Handle specific time for daily habits
  if (habit.specificTime && habit.frequency === "daily") {
    const [hours, minutes] = habit.specificTime.split(":").map(Number);
    const specificTimeToday = new Date();
    specificTimeToday.setHours(hours, minutes, 0, 0);

    const lastDate = new Date(last);
    lastDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // If last completed was before today, and we've passed the specific time
    if (lastDate < today && now >= specificTimeToday) {
      return true;
    }
    // If last completed was today or after, not ready yet
    if (lastDate >= today) {
      return false;
    }
  }

  // Standard frequencies
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

