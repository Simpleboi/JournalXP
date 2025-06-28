import { Achievement } from "@/models/Achievement";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { achievements as allAchievements } from "@/data/achievementData";
import { UserData } from "@/types/user";

interface JournalPayload {
  journalCount: number;
}

export const checkJournalAchievements = async (
  userData: UserData,
  userId: string,
  payload: JournalPayload,
  refreshUserData: () => Promise<void>
) => {
  const alreadyUnlocked = new Set(userData.achievements || []);
  const newlyUnlocked: Achievement[] = [];

  // Filter journaling-related achievements
  const journalingAchievements = allAchievements.filter(
    (a) => a.category === "journaling"
  );

  for (const ach of journalingAchievements) {
    if (alreadyUnlocked.has(ach.id.toString())) continue;

    // Match by requirement description
    const count = payload.journalCount;
    const requirement = ach.requirement.toLowerCase();

    const shouldUnlock =
      (requirement.includes("first") && count >= 1) ||
      (requirement.includes("10") && count >= 10) ||
      (requirement.includes("20") && count >= 20);

    if (shouldUnlock) {
      newlyUnlocked.push(ach);
    }
  }

  if (newlyUnlocked.length > 0) {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      achievements: [
        ...(userData.achievements || []),
        ...newlyUnlocked.map((a) => a.id.toString()),
      ],
      points: increment(newlyUnlocked.reduce((sum, a) => sum + a.points, 0)),
    });

    await refreshUserData();
  }
};