import { useEffect, useMemo } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { ACHIEVEMENTS } from "@/data/achievementData";
import { useUserData } from "@/context/UserDataContext";
import { db } from "@/lib/firebase";

export function useAchievementSync() {
  const { userData } = useUserData();

  const evaluated = useMemo(() => {
    if (!userData) return [];
    return ACHIEVEMENTS.map((cfg) => {
      const progress = {
        entries: userData.totalJournalEntries,
        streak: userData.streak,
        xp: userData.xp,
      } as const;
      const hasMet = progress[cfg.requirementType] >= cfg.requirementValue;
      const already = userData.achievements[cfg.id]?.unlocked;
      return {
        ...cfg,
        unlocked: already || hasMet,
        dateUnlocked:
          already || !hasMet
            ? userData.achievements[cfg.id]?.dateUnlocked
            : new Date().toISOString(),
      };
    });
  }, [userData]);

  // Whenever we detect a new unlock, push it to firestore
  useEffect(() => {
    if (!userData) return;
    const updates: Record<string, any> = {};
    evaluated.forEach((ach) => {
      const prev = userData.achievements[ach.id];
      if (ach.unlocked && (!prev || !prev.dateUnlocked)) {
        updates[`achivements.${ach.id}`] = {
          unlocked: true,
          dateUnlocked: ach.dateUnlocked,
        };
      }
    });
    if (Object.keys(updates).length > 0) {
      updateDoc(doc(db, "users", userData.uid), updates).catch(console.error);
    }
  }, [evaluated, userData]);
  return evaluated;
}
