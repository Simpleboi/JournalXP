import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { UserData } from "@/types/user";

interface UserDataContextType {
  userData: UserData | null;
  refreshUserData: () => Promise<void>;
  updateUsername: (newUsername: string) => Promise<void>;
  loading: boolean;
}

const UserDataContext = createContext<UserDataContextType | undefined>(
  undefined
);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUserData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData({
          uid: user.uid,
          level: data.level || 1,
          streak: data.streak || 0,
          points: data.points || 0,
          totalPoints: data.totalPoints || 0,
          totalJournalEntries: data.totalJournalEntries || 0,
          username: data.username || "",
          rank: data.rank || "Bronze III",
          recentAchievement: data.recentAchievement || "None yet",
          joinDate: data.joinDate || new Date().toLocaleDateString(),
          totalTasksCreated: data.totalTasksCreated,
          totalTasksCompleted: data.totalTasksCompleted,
          lastActivityDate: data.lastActivityDate || "",
          profilePicture: data.profilePicture || "",
          journalCount: data.journalCount || 0,
          achievements: data.achievements || [],
          journalStats: data.journalStats ?? {
            totalWordCount: data.journalStats?.totalWordCount ?? 0,
            averageEntryLength: data.journalStats?.averageEntryLength ?? 0,
            mostUsedWords: data.journalStats?.mostUsedWords ?? [],
          },
          taskStats: data.taskStats ?? {
            currentTasksCreated: data.taskStats?.currentTasksCreated ?? 0,
            currentTasksCompleted: data.taskStats?.currentTasksCompleted ?? 0,
            currentTasksPending: data.taskStats?.currentTasksPending ?? 0,
            completionRate: data.taskStats?.completionRate ?? 0,
            avgCompletionTime: data.taskStats?.avgCompletionTime ?? 0,
          },
        });
      } else {
        console.warn("⚠️ No user document found in Firestore.");
        setUserData(null);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUsername = async (newUsername: string) => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        username: newUsername,
      });

      // Update local context immediately without refetching
      setUserData((prev) => (prev ? { ...prev, username: newUsername } : prev));
      console.log("✅ Username updated successfully!");
    } catch (error) {
      console.error("Failed to update username:", error);
    }
  };

  useEffect(() => {
    if (user) fetchUserData();
    else setUserData(null);
  }, [user]);

  return (
    <UserDataContext.Provider
      value={{
        userData,
        refreshUserData: fetchUserData,
        loading,
        updateUsername,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
};
