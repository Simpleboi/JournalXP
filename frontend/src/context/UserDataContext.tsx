import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { updateUsernameApi } from "@/lib/api";
import { initSession } from "@/lib/initSession";

export interface UserClient {
  username: string;
  level: number;
  xp: number;
  totalXP: number;
  xpNeededToNextLevel: number;
  streak: number;
  rank: string;
  nextRank: string | null;
  inventory?: string[];
  profilePicture?: string;
  joinDate?: string; // ISO string
  journalStats?: {
    journalCount: number;
    totalJournalEntries: number;
    totalWordCount: number;
    averageEntryLength: number;
    mostUsedWords: string[];
  };
  taskStats?: {
    totalTasksCompleted: number;
    currentTasksCreated: number;
    currentTasksCompleted: number;
    currentTasksPending: number;
    completionRate: number;
    avgCompletionTime?: number;
    priorityCompletion: { high: number; medium: number; low: number };
  };
}

interface UserDataContextType {
  userData: UserClient | null;
  refreshUserData: () => Promise<void>;
  updateUsername: (newUsername: string) => Promise<void>;
  loading: boolean;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserClient | null>(null);
  const [loading, setLoading] = useState(true);

  // Called on login and when you explicitly refresh
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const user = await initSession(); // POST /api/session/init
      setUserData(user);
    } catch (e) {
      console.error("Failed to init session:", e);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  // Keep username changes server-authoritative
  const updateUsername = async (newUsername: string) => {
    try {
      const updated = await updateUsernameApi(newUsername); // POST /api/profile/username
      setUserData(updated); // replace local with server's source of truth
      console.log("✅ Username updated");
    } catch (e) {
      console.error("Failed to update username:", e);
    }
  };

  // React to Firebase auth state (login/logout)
  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(), async (fbUser) => {
      if (!fbUser) {
        setUserData(null);
        setLoading(false);
        return;
      }
      await fetchUserData(); // create-or-read + return clean DTO
    });
    return () => unsub();
  }, []);

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
}


export function useUserData() {
  const context = useContext(UserDataContext);
  if (!context) throw new Error("useUserData must be used within a UserDataProvider");
  return context;
}
