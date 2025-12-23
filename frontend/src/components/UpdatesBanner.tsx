import { useState, useEffect } from "react";
import { X, Info, ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const updates = [
  {
    date: "December 22nd, 2025",
    content: [
      "🤖 Sunday AI has been completely refactored! Your AI wellness companion now features improved conversation flow, auto-scroll for seamless chat, and better response generation for more natural and helpful interactions.",
      "🎨 Customizable Homepage! Personalize your JournalXP experience by choosing which cards appear on your homepage. Select your favorite 6 features from 19 available options and arrange them in your preferred order via drag-and-drop in Profile Settings.",
      "📱 Mobile-Responsive Profile Settings! The Settings and Account tabs now convert to a sleek dropdown menu on mobile devices for easier navigation on smaller screens.",
      "⚡ React 18.3.1 Update! Upgraded to the latest stable version of React with improved performance, better security, and enhanced developer experience.",
      "🔧 Bug Fixes: Fixed dashboard card preference saving, improved session management to preserve user settings, and enhanced backend API validation for better reliability.",
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
                What's New in JournalXP v2.3.0
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
          Latest Update | Version 2.3.0
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
