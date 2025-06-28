import { Achievement } from "@/models/Achievement";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { achievements as allAchievements } from "@/data/achievementData";
import { UserData } from "@/types/user";

export const checkJournalAchievements = async (
  userData: UserData,
  userId: string,
  payload: { journalCount: number },
  refreshUserData: () => Promise<void>
) => {
  const alreadyUnlocked = new Set(userData.achievements || []);
  const newlyUnlocked: Achievement[] = [];

  const journalingAchievements = allAchievements.filter(
    (a) => a.category === "journaling"
  );

  for (const achievement of journalingAchievements) {
    const alreadyHasIt = alreadyUnlocked.has(achievement.id.toString());
    if (alreadyHasIt) continue;

    if (payload.journalCount >= achievement.milestone) {
      newlyUnlocked.push(achievement);
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

  return newlyUnlocked;
};
