import { useState } from "react";
import { X, Info } from "lucide-react";

let nxt = "✅ Introducing the new Habit Builder section! Start building powerful habits to strengthen your self-control. Complete them to stay consistent and earn bonus points along the way! | 🏆 New Achievements System is live! Earn badges for journaling, login streaks, and more. Track your progress, unlock milestones, and level up your mental wellness journey."

const updates = [
  {
    date: "October 17th, 2025",
    content: [
      "This is the biggest update that JournalXP has seen!",
      "🌿 Introducing the Meditation Room! Take a mindful break anytime with our brand-new Meditation Room. Choose guided sessions, breathing exercises, or calming ambient sounds to reset your focus and find peace throughout the day.",
      "📅 Updated the Daily Tasks Page! We’ve redesigned the Daily Tasks page with a cleaner UI, faster interactions, and new features like task grouping and priority markers. Staying organized is now smoother and more motivating than ever!",
      "🔥 Streak Fixes! No more lost progress, Streaks now update reliably so you can build lasting habits without worry. Keep your momentum going and celebrate every win. For more information about this, see the 'user guide' section in the 'About us' page",
      "⚡ Leveling System Update! The XP and leveling system has been rebuilt for accuracy and fairness. Progress now feels more rewarding as you grow with JournalXP.",
      "⚡ Decreased the production build time by 2 seconds. For the non-technical people, this means faster load times, which means faster journal entries :)",
    ],
  },
];

export const UpdatesBanner = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-lg shadow-sm p-4 max-w-4xl mx-auto my-8 relative">
      <button
        onClick={() => setVisible(false)}
        className="absolute top-2 right-2 text-indigo-400 hover:text-indigo-600"
        aria-label="Close updates"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-2 mb-2">
        <Info className="text-indigo-500 w-4 h-4" />
        <h2 className="text-indigo-700 font-semibold text-sm">
          Latest Update | Version 2.0.0
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
