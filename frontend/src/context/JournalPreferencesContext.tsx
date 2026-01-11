import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface JournalPreferences {
  wordCountGoal: number;
}

interface JournalPreferencesContextType {
  preferences: JournalPreferences;
  updateWordCountGoal: (goal: number) => void;
  resetPreferences: () => void;
}

const defaultPreferences: JournalPreferences = {
  wordCountGoal: 250,
};

const STORAGE_KEY = "journalxp_journal_preferences";

// Helper function to load preferences from localStorage with validation
const loadPreferences = (): JournalPreferences => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);

      // Validate that the parsed data has the correct structure
      if (parsed && typeof parsed.wordCountGoal === "number") {
        // Ensure word count is within valid range
        const wordCount = Math.max(50, Math.min(1000, parsed.wordCountGoal));
        return {
          ...defaultPreferences,
          ...parsed,
          wordCountGoal: wordCount,
        };
      }
    }
  } catch (error) {
    console.warn("Failed to load journal preferences from localStorage:", error);
  }

  // Return default if loading failed or data was invalid
  return defaultPreferences;
};

// Helper function to save preferences to localStorage
const savePreferences = (preferences: JournalPreferences): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error("Failed to save journal preferences to localStorage:", error);
  }
};

const JournalPreferencesContext = createContext<JournalPreferencesContextType | undefined>(undefined);

export const JournalPreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<JournalPreferences>(loadPreferences);

  // Save to localStorage whenever preferences change
  useEffect(() => {
    savePreferences(preferences);
  }, [preferences]);

  const updateWordCountGoal = (goal: number) => {
    setPreferences((prev) => ({ ...prev, wordCountGoal: goal }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  return (
    <JournalPreferencesContext.Provider
      value={{
        preferences,
        updateWordCountGoal,
        resetPreferences,
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
