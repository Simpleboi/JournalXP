// JournalUtils.ts
import {
  collection,
  addDoc,
  doc,
  increment,
  updateDoc,
} from "firebase/firestore";
import { analyzeSentiment } from "./JournalAnalyze";
import { checkJournalAchievements } from "../achievements/AchievementEngine";
import { db } from "@/lib/firebase";
import { JournalEntry } from "./JournalEntry";
import { UserData } from "@/types/user";

interface SubmitJournalOptions {
  user: any;
  userData: UserData;
  journalType: string;
  journalContent: string;
  mood: string;
  setEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
  setJournalContent: (val: string) => void;
  handleTypeChange: (type: string) => void;
  refreshUserData: () => Promise<void>;
  showToast: (config: { title: string; description?: string }) => void;
  onSubmit: (entry: { type: string; content: string; mood: string }) => void;
}

// When the user clicks submit
export const handleSubmitJournalEntry = async ({
  user,
  userData,
  journalType,
  journalContent,
  mood,
  setEntries,
  setJournalContent,
  handleTypeChange,
  refreshUserData,
  showToast,
  onSubmit,
}: SubmitJournalOptions) => {
  if (!journalContent.trim() || !user) return;

  const newEntry = {
    type: journalType,
    content: journalContent,
    mood,
    date: new Date().toISOString(),
    tags: [],
    isFavorite: false,
    sentiment: analyzeSentiment(journalContent),
  };

  try {
    const docRef = await addDoc(
      collection(db, "users", user.uid, "journalEntries"),
      newEntry
    );

    const savedEntry = { id: docRef.id, ...newEntry };
    setEntries((prev) => [savedEntry, ...prev]);

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      points: increment(30),
      journalCount: increment(1),
    });

    const unlocked = await checkJournalAchievements(
      {
        ...userData,
        journalCount: (userData.journalCount ?? 0) + 1,
      },
      user.uid,
      { journalCount: (userData.journalCount ?? 0) + 1 },
      refreshUserData
    );

    if (unlocked.length > 0) {
      showToast({
        title: "🎉 Achievement Unlocked!",
        description: unlocked.map((a) => a.title).join(", "),
      });

      // To delay the toast
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    setJournalContent("");
    handleTypeChange(journalType);

    onSubmit({ type: journalType, content: journalContent, mood });

    // Show the toast of the user gaining points
    showToast({
      title: "+30 Points!",
      description: "Your journal entry was saved successfully. Good Job :)",
    });

    await refreshUserData();
  } catch (error) {
    console.error("Error saving journal entry:", error);
  }
};
