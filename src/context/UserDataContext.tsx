import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { UserData } from "@/types/user";

interface UserDataContextType {
  userData: UserData;
  refreshUserData: () => Promise<void>;
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
          username: data.username || "",
          rank: data.rank || "Newcomer",
          nextRank: data.nextRank || "Mindful Beginner",
          pointsToNextRank: data.pointsToNextRank || 100,
          levelProgress: data.levelProgress || 0,
          recentAchievement: data.recentAchievement || "None yet",
          joinDate: data.joinDate || new Date().toLocaleDateString(),
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

  useEffect(() => {
    if (user) fetchUserData();
    else setUserData(null);
  }, [user]);

  return (
    <UserDataContext.Provider
    value={{ userData, refreshUserData: fetchUserData, loading }}
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
