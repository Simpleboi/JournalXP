import { useState, useEffect } from "react";
import { X, Info, ChevronDown, ChevronUp } from "lucide-react";

const updates = [
  {
    date: "November 14th, 2025",
    content: [
      "🔒 Major Security & Privacy Upgrade! Your data is now more secure than ever. We’ve migrated from a client-side SDK to a server-side SDK, meaning all sensitive information is processed on our protected servers instead of your browser, like switching from open postcards to sealed, encrypted letters.",
      "🔑 Enhanced Authentication ensures your login is verified through multiple secure layers, similar to needing both a key and a security code to enter your home.",
      "🛡️ End-to-End Encryption protects your journal entries and personal data from the moment you type them until the moment they’re stored, making intercepted data completely unreadable.",
      "✔️ Server-Side Validation now verifies every request on our secure backend before processing, preventing unauthorized access.",
      "⏱️ Session Security has been upgraded with improved token management and automatic timeouts to keep your account safe even if you forget to log out.",
      "💙 What this means for you: Your mental health data, journal entries, and personal information are now protected with bank-level security. Only you can access your content, we’ve made it extremely difficult for anyone else to intercept or read your private thoughts.",
      "🎨 Redesigned About Us Page! We've completely overhauled the About Us page with modern, visually stunning card-based tabs. Each section (About, Features, Roadmap, Community) now has its own unique gradient color scheme with smooth animations, hover effects, and improved accessibility.",
      "🌿 Meditation Room Major Upgrade! The Meditation Room has received massive enhancements:\n   • Save Your Favorite Quotes, Daily inspiration quotes can now be saved and persist between sessions\n   • Emotion-Based Guided Meditation - Click on emotions like Anger, Sadness, or Anxiety to get specific breathing techniques, grounding exercises, and body awareness tips\n   • Journal Prompt Carousel - Browse through multiple guided prompts using arrow navigation and dot indicators. Save only the prompt you're responding to\n   • Direct Journal Integration - Write reflections directly in the meditation room and save to your account, earning 30 XP instantly",
      "📅 Updated the Daily Tasks Page! We've redesigned the Daily Tasks page with a cleaner UI, faster interactions, and new features like task grouping and priority markers. Staying organized is now smoother and more motivating than ever!",

      "🔥 Streak Fixes! No more lost progress. Streaks now update reliably across all features (journaling, habits, login) so you can build lasting habits without worry. Keep your momentum going and celebrate every win. For more information, see the 'Features' section in the 'About Us' page.",

      "⚡ Leveling System Update! The XP and leveling system has been rebuilt for accuracy and fairness. Progress now feels more rewarding as you grow with JournalXP. All XP awards are properly tracked and stats are updated in real-time.",
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
    return (
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-md p-3 max-w-4xl mx-auto my-4 cursor-pointer hover:shadow-lg transition-all">
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
                What's New in JournalXP v2.0.0
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
          Latest Update | Version 2.0.0 - Major Feature Update
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
