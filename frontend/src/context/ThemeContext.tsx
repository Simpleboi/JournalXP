import React, { createContext, useContext, useState, useEffect } from 'react';
import { themes, defaultTheme } from '@/data/themes';
import type { ThemeId, Theme, ThemeContextType } from '@/types/theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    // Load from localStorage
    const saved = localStorage.getItem('jxp-theme');
    return (saved as ThemeId) || 'default';
  });

  const theme = themes[themeId] || defaultTheme;

  useEffect(() => {
    // Apply CSS variables to :root
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });

    // Save to localStorage
    localStorage.setItem('jxp-theme', themeId);

    // Add a data attribute for potential CSS selectors
    root.setAttribute('data-theme', themeId);
  }, [themeId, theme]);

  const setTheme = (newThemeId: ThemeId) => {
    setThemeId(newThemeId);

    // Optional: Save to backend in the future
    // This would require a new endpoint like PUT /api/user/preferences
    // try {
    //   await authFetch('/user/preferences', {
    //     method: 'PUT',
    //     body: JSON.stringify({ theme: newThemeId }),
    //   });
    // } catch (error) {
    //   console.error('Failed to save theme preference:', error);
    // }
  };

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
