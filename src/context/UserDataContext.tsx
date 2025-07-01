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
  userData: UserData;
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
          inventory: data.inventory || [],
          level: data.level || 1,
          streak: data.streak || 0,
          points: data.points || 0,
          username: data.username || "",
          rank: data.rank || "Bronze III",
          nextRank: data.nextRank || "Bronze II",
          pointsToNextRank: data.pointsToNextRank || 100,
          levelProgress: data.levelProgress || 0,
          recentAchievement: data.recentAchievement || "None yet",
          joinDate: data.joinDate || new Date().toLocaleDateString(),
          lastActivityDate:
            typeof data.lastActivityDate === "number"
              ? data.lastActivityDate
              : Date.now(),
          profilePicture: data.profilePicture || "",
          journalCount: data.journalCount || 0,
          loginStreak: data.loginStreak || 0,
          achievements: data.achievements || [],
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
