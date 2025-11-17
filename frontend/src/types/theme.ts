// Theme type definitions for JournalXP
export type ThemeId =
  | "default"
  | "ocean"
  | "sunset"
  | "forest"
  | "lavender"
  | "midnight"
  | "crimsonDawn"
  | "arcticFrost"
  | "peachSorbet"
  | "galaxyCore"
  | "emeraldTide"
  | "rubyOrchid"
  | "goldenHorizon"
  | "arcticAurora"
  | "coralReef"
  | "deepPlum"
  | "cyberLime"
  | "steelMatrix"
  | "infernoCore"
  | "pinkMirage"
  | "blueberryMist";

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    surfaceLight: string;
    text: string;
    textSecondary: string;
    border: string;
    gradient: string;
  };
}

export interface ThemeContextType {
  theme: Theme;
  themeId: ThemeId;
  setTheme: (themeId: ThemeId) => void;
  availableThemes: Theme[];
}
