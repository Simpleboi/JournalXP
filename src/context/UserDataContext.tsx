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

interface UserData {
  level: number;
  streak: number;
  points: number;
  username: string;
  rank: string;
  nextRank: string;
  pointsToNextRank: number;
  levelProgress: number;
  recentAchievement: string;
  joinDate: string;
}

interface UserDataContextType {
  userData: UserData;
  refreshUserData: () => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(
  undefined
);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  const [userData, setUserData] = useState<UserData>({
    level: 1,
    streak: 0,
    points: 0,
    username: "",
    rank: "Newcomer",
    nextRank: "Mindful Beginner",
    pointsToNextRank: 100,
    levelProgress: 0,
    recentAchievement: "None yet",
    joinDate: new Date().toLocaleDateString(),
  });

  const fetchUserData = async () => {
    if (!user) return;

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setUserData({
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
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  return (
    <UserDataContext.Provider
      value={{ userData, refreshUserData: fetchUserData }}
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
