import { useState, useEffect } from "react";
import { X, Info, ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const updates = [
  {
    date: "November 16th, 2025",
    content: [
      "🔒 Habit Builder | You can now set a habit to be infinite ♾️. This option removes the need for a weekly or monthly frequency and allows you to practice ongoing habits at your own pace. Perfect for long-term disciplines, lifestyle choices, and personal growth routines that don’t fit into rigid schedules.",
      "📘 Journal | When viewing entries in the Reflection Archive, tapping an entry now displays both the exact date and timestamp. This gives you clearer context around when you wrote it and helps track emotional patterns, breakthroughs, and life events with more precision.",
      "📘 Journal | Introducing the new Entry Timeline! a clean, easy-to-browse timeline that organizes all your entries across months and years. This lets you explore older entries without endless scrolling and helps you visually map your growth over time. Perfect for long-term journalers and memory keepers.",
      "🛍️ Rewards Shop | New feature unlocked! The Rewards Shop is now live! You can earn points through journaling, habits, and daily tasks, then spend them on special items. Themes are currently the first available reward, with more rewards coming soon.",
      "🎨 Themes | Theme customization is here! You can now personalize your JournalXP experience with three starter themes: Default, Ocean, and Sunset. Change your theme anytime from your Profile Settings to match your mood, aesthetic, or time of day. More themes will be added as the Rewards Shop grows",
      "🏆 Achievements | Achievements are officially live! Start completing milestones across journaling, tasks, habits, and more to earn badges. Each achievement is designed to celebrate your consistency, growth, and engagement. The real question is, can you unlock them all?",
      "✨ Welcome Banner | We added a fresh set of inspiring quotes across the welcome banner and homepage quotes section. These messages are designed to motivate you, comfort you, or remind you to slow down. Expect gentle encouragement each time you open JournalXP."
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
      <div className="bg-gradient-to-r text-white rounded-lg shadow-md p-3 max-w-4xl mx-auto my-4 cursor-pointer hover:shadow-lg transition-all"
      style={{ background: theme.colors.gradient}}>
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
                What's New in JournalXP v2.1.4
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
          Latest Update | Version 2.1.4
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
