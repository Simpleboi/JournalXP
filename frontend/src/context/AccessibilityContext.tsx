import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface AccessibilitySettings {
  // Font settings
  dyslexiaFont: boolean;
  fontSize: "small" | "medium" | "large" | "x-large";

  // Contrast settings
  highContrast: boolean;

  // Voice settings
  voiceNavigation: boolean;
  screenReaderOptimized: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (updates: Partial<AccessibilitySettings>) => void;
  toggleDyslexiaFont: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  toggleHighContrast: () => void;
  toggleVoiceNavigation: () => void;
  toggleScreenReaderMode: () => void;
  resetSettings: () => void;
}

const defaultSettings: AccessibilitySettings = {
  dyslexiaFont: false,
  fontSize: "medium",
  highContrast: false,
  voiceNavigation: false,
  screenReaderOptimized: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem("accessibilitySettings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  // Save to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem("accessibilitySettings", JSON.stringify(settings));
    applyAccessibilitySettings(settings);
  }, [settings]);

  const updateSettings = (updates: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const toggleDyslexiaFont = () => {
    setSettings((prev) => ({ ...prev, dyslexiaFont: !prev.dyslexiaFont }));
  };

  // Function to increase the font size
  const increaseFontSize = () => {
    setSettings((prev) => {
      const sizes: AccessibilitySettings["fontSize"][] = ["small", "medium", "large", "x-large"];
      const currentIndex = sizes.indexOf(prev.fontSize);
      const nextIndex = Math.min(currentIndex + 1, sizes.length - 1);
      return { ...prev, fontSize: sizes[nextIndex] };
    });
  };

  // Function to decrease the font size
  const decreaseFontSize = () => {
    setSettings((prev) => {
      const sizes: AccessibilitySettings["fontSize"][] = ["small", "medium", "large", "x-large"];
      const currentIndex = sizes.indexOf(prev.fontSize);
      const nextIndex = Math.max(currentIndex - 1, 0);
      return { ...prev, fontSize: sizes[nextIndex] };
    });
  };

  const toggleHighContrast = () => {
    setSettings((prev) => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const toggleVoiceNavigation = () => {
    setSettings((prev) => ({ ...prev, voiceNavigation: !prev.voiceNavigation }));
  };

  const toggleScreenReaderMode = () => {
    setSettings((prev) => ({ ...prev, screenReaderOptimized: !prev.screenReaderOptimized }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSettings,
        toggleDyslexiaFont,
        increaseFontSize,
        decreaseFontSize,
        toggleHighContrast,
        toggleVoiceNavigation,
        toggleScreenReaderMode,
        resetSettings,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within AccessibilityProvider");
  }
  return context;
};

// Apply accessibility settings to document
function applyAccessibilitySettings(settings: AccessibilitySettings) {
  const root = document.documentElement;

  // Apply dyslexia-friendly font
  if (settings.dyslexiaFont) {
    root.style.setProperty("--font-family", "'OpenDyslexic', 'Comic Sans MS', sans-serif");
  } else {
    root.style.removeProperty("--font-family");
  }

  // Apply font size
  const fontSizeMap = {
    small: "14px",
    medium: "16px",
    large: "18px",
    "x-large": "20px",
  };
  root.style.setProperty("--base-font-size", fontSizeMap[settings.fontSize]);

  // Apply high contrast
  if (settings.highContrast) {
    root.classList.add("high-contrast");
  } else {
    root.classList.remove("high-contrast");
  }

  // Screen reader optimizations
  if (settings.screenReaderOptimized) {
    root.classList.add("screen-reader-optimized");
  } else {
    root.classList.remove("screen-reader-optimized");
  }
}
