import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { themes, defaultTheme } from '@/data/themes';
import type { ThemeId, Theme, ThemeContextType } from '@/types/theme';
import { useUserData } from './UserDataContext';
import { authFetch } from '@/lib/authFetch';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { userData, refreshUserData } = useUserData();

  // Initialize theme from userData (Firestore) or localStorage fallback
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    // First check localStorage for immediate render (prevents flash)
    const saved = localStorage.getItem('jxp-theme');
    return (saved as ThemeId) || 'default';
  });

  const theme = themes[themeId] || defaultTheme;

  // Sync theme from Firestore when userData loads
  useEffect(() => {
    if (userData?.preferences?.theme) {
      const firestoreTheme = userData.preferences.theme as ThemeId;
      if (themes[firestoreTheme] && firestoreTheme !== themeId) {
        setThemeId(firestoreTheme);
        localStorage.setItem('jxp-theme', firestoreTheme);
      }
    }
  }, [userData?.preferences?.theme]);

  // Apply CSS variables whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });

    // Save to localStorage as cache
    localStorage.setItem('jxp-theme', themeId);

    // Add data attribute for CSS selectors
    root.setAttribute('data-theme', themeId);
  }, [themeId, theme]);

  const setTheme = useCallback(async (newThemeId: ThemeId) => {
    // Update local state immediately for responsive UI
    setThemeId(newThemeId);
    localStorage.setItem('jxp-theme', newThemeId);

    // Save to Firestore if user is authenticated
    if (userData) {
      try {
        await authFetch('/profile/preferences', {
          method: 'PATCH',
          body: JSON.stringify({ theme: newThemeId }),
        });
        // Refresh user data to sync state
        await refreshUserData();
      } catch (error) {
        console.error('Failed to save theme preference to Firestore:', error);
        // Theme is already applied locally, so user experience isn't affected
      }
    }
  }, [userData, refreshUserData]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeId,
        setTheme,
        availableThemes: Object.values(themes),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
