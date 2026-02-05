import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { updateUsernameApi } from "@/lib/api";
import { initSession } from "@/lib/initSession";
import type { UserClient } from "@shared/types/user";

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
  const fetchUserData = useCallback(async () => {
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
  }, []);

  // Keep username changes server-authoritative
  const updateUsername = useCallback(async (newUsername: string) => {
    try {
      const updated = await updateUsernameApi(newUsername); // POST /api/profile/username
      setUserData(updated); // replace local with server's source of truth
      console.log("✅ Username updated");
    } catch (e) {
      console.error("Failed to update username:", e);
    }
  }, []);

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
  }, [fetchUserData]);

  const value = useMemo(
    () => ({
      userData,
      refreshUserData: fetchUserData,
      loading,
      updateUsername,
    }),
    [userData, loading, fetchUserData, updateUsername]
  );

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}


export function useUserData() {
  const context = useContext(UserDataContext);
  if (!context) throw new Error("useUserData must be used within a UserDataProvider");
  return context;
}
