import { useState } from "react";
import { X, Info } from "lucide-react";

let nxt = "✅ Introducing the new Habit Builder section! Start building powerful habits to strengthen your self-control. Complete them to stay consistent and earn bonus points along the way! | 🏆 New Achievements System is live! Earn badges for journaling, login streaks, and more. Track your progress, unlock milestones, and level up your mental wellness journey."

const updates = [
  {
    date: "July 14th, 2025",
    content: [
      "✅ Introducing the new Habit Builder section! Start building powerful habits to strengthen your self-control. Complete them to stay consistent and earn bonus points along the way!",
      "🎖️ Introducing the New Rank System! Your journey now includes tiers like Bronze, Silver, Gold, Platinum, and more, each with unique icons and milestones. Level up to climb the ranks and show off your progress!",
      "🔥 Introducing the new Streak System! Stay consistent and earn streak bonuses! Streaks showcase motivational messages and unlock hidden achievements as you maintain your journaling habit.",
      "🌐 Improved SignUp/Login data and enhanced security. Also added navigation links for desktop users. ",
      "⚙️ Major fixes and improved performance across the app, including habit syncing, task tracking consistency and optimized data for Desktop and Mobile users. Also the footer links don't work yet, but no one reads them besides lawyers so it doesn't matter that much. It'll be fixed soon",
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
          Latest Update | Version 1.3.0
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
