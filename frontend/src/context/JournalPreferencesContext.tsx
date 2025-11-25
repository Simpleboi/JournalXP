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

const JournalPreferencesContext = createContext<JournalPreferencesContextType | undefined>(undefined);

export const JournalPreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<JournalPreferences>(() => {
    const saved = localStorage.getItem("journalPreferences");
    return saved ? JSON.parse(saved) : defaultPreferences;
  });

  // Save to localStorage whenever preferences change
  useEffect(() => {
    localStorage.setItem("journalPreferences", JSON.stringify(preferences));
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
