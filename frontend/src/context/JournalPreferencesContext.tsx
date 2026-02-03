import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useUserData } from "./UserDataContext";
import { authFetch } from "@/lib/authFetch";

export interface JournalPreferences {
  wordCountGoal: number;
}

interface JournalPreferencesContextType {
  preferences: JournalPreferences;
  updateWordCountGoal: (goal: number) => Promise<void>;
  resetPreferences: () => Promise<void>;
  isLoading: boolean;
}

const defaultPreferences: JournalPreferences = {
  wordCountGoal: 250,
};

const JournalPreferencesContext = createContext<JournalPreferencesContextType | undefined>(undefined);

export const JournalPreferencesProvider = ({ children }: { children: ReactNode }) => {
  const { userData, refreshUserData } = useUserData();
  const [preferences, setPreferences] = useState<JournalPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(false);

  // Sync preferences from userData when it changes
  useEffect(() => {
    if (userData?.preferences?.journalWordCountGoal !== undefined) {
      const wordCount = Math.max(50, Math.min(1000, userData.preferences.journalWordCountGoal));
      setPreferences({ wordCountGoal: wordCount });
    } else {
      setPreferences(defaultPreferences);
    }
  }, [userData?.preferences?.journalWordCountGoal]);

  const updateWordCountGoal = useCallback(async (goal: number) => {
    // Validate range
    const validGoal = Math.max(50, Math.min(1000, goal));

    // Optimistic update
    setPreferences((prev) => ({ ...prev, wordCountGoal: validGoal }));
    setIsLoading(true);

    try {
      await authFetch("/profile/preferences", {
        method: "PATCH",
        body: JSON.stringify({ journalWordCountGoal: validGoal }),
      });

      // Refresh user data to stay in sync
      await refreshUserData();
    } catch (error) {
      console.error("Failed to save journal word count goal:", error);
      // Revert on error
      if (userData?.preferences?.journalWordCountGoal !== undefined) {
        setPreferences({ wordCountGoal: userData.preferences.journalWordCountGoal });
      } else {
        setPreferences(defaultPreferences);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [userData, refreshUserData]);

  const resetPreferences = useCallback(async () => {
    setIsLoading(true);

    try {
      await authFetch("/profile/preferences", {
        method: "PATCH",
        body: JSON.stringify({ journalWordCountGoal: defaultPreferences.wordCountGoal }),
      });

      setPreferences(defaultPreferences);
      await refreshUserData();
    } catch (error) {
      console.error("Failed to reset journal preferences:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [refreshUserData]);

  return (
    <JournalPreferencesContext.Provider
      value={{
        preferences,
        updateWordCountGoal,
        resetPreferences,
        isLoading,
      }}
    >
      {children}
    </JournalPreferencesContext.Provider>
  );
};

export const useJournalPreferences = () => {
  const context = useContext(JournalPreferencesContext);
  if (!context) {
    throw new Error("useJournalPreferences must be used within JournalPreferencesProvider");
  }
  return context;
};
