import { useState, useEffect } from "react";
import { X, Info, ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const updates = [
  {
    date: "January 10th, 2026",
    content: [
      "Fixed bug issues with the weather location component. There's a setting in user settings to enable it and fixed bug issues with firebase about permissions-policy.",
      "📊 Homepage Stats Upgraded! Stats cards are now more detailed and informative, showing richer breakdowns like focus minutes today vs. this week, streak trends, completion rates, and quick-glance insights (with improved layout, labels, and readability).",
      "🎵 Ambient Sounds Now Working! All 7 ambient sounds in the Pomodoro timer are now fully functional. Enjoy Rain, Brown Noise, White Noise, Forest, Ocean, Cafe, and Fireplace sounds to enhance your focus sessions.",
      "🔊 Web Audio API Integration! Sounds are now generated programmatically in your browser using the Web Audio API, which means no external dependencies, better quality, and offline support.",
      "⏱️ Pomodoro Timer Refactor! Complete component refactoring for better code organization. The timer is now split into 8 modular components (PomoFullscreen, PomoTimerDisplay, PomoControls, PomoPresetSelector, PomoCustomBuilder, PomoAmbientSounds, PomoSettings, and pomoColors utility) making it easier to maintain and extend.",
      "🎨 Theme-Aware Clock! The live clock component on your homepage now adapts to your selected theme colors for a more cohesive visual experience.",
      "🔧 Bug Fixes: Resolved CORS and external audio file issues that prevented ambient sounds from playing, fixed clock component hardcoded colors, and corrected TypeScript errors in Pomodoro components.",
    ],
  },
];

const STORAGE_KEY = "journalxp_updates_banner_minimized";

export const UpdatesBanner = () => {
  const [isMinimized, setIsMinimized] = useState(() => {
    // Load minimized state from localStorage on mount
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "true";
  });

  // Persist minimized state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isMinimized));
  }, [isMinimized]);

  const toggleMinimized = () => {
    setIsMinimized(!isMinimized);
  };

  // Minimized view - compact bar at the top
  if (isMinimized) {
    const { theme } = useTheme();

    return (
      <div
        className="bg-gradient-to-r text-white rounded-lg shadow-md p-3 max-w-4xl mx-auto my-4 cursor-pointer hover:shadow-lg transition-all"
        style={{ background: theme.colors.gradient }}
      >
        <button
          onClick={toggleMinimized}
          className="w-full flex items-center justify-between"
          aria-label="Expand updates"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-lg p-2">
              <Info className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-sm">
                What's New in JournalXP v2.4.0
              </h3>
              <p className="text-xs text-indigo-100">
                Click to see all updates and new features
              </p>
            </div>
          </div>
          <ChevronDown className="w-5 h-5 flex-shrink-0" />
        </button>
      </div>
    );
  }

  // Expanded view - full update details
  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-lg shadow-sm p-4 max-w-4xl mx-auto my-8 relative">
      <button
        onClick={toggleMinimized}
        className="absolute top-2 right-2 text-indigo-400 hover:text-indigo-600 transition-colors"
        aria-label="Minimize updates"
      >
        <ChevronUp className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-2 mb-2">
        <Info className="text-indigo-500 w-4 h-4" />
        <h2 className="text-indigo-700 font-semibold text-sm">
          Latest Update | Version 2.4.0
        </h2>
      </div>

      <div className="space-y-3 text-sm text-indigo-800">
        {updates.map((update, index) => (
          <div key={index}>
            <p className="font-medium text-indigo-600">{update.date}</p>
            <ul className="list-disc pl-5 mt-1">
              {update.content.map((item, i) => (
                <li key={i} className="my-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

/*
"📘 Journal | Introducing the new Entry Timeline! a clean, easy-to-browse timeline that organizes all your entries across months and years. This lets you explore older entries without endless scrolling and helps you visually map your growth over time. Perfect for long-term journalers and memory keepers.",
*/
