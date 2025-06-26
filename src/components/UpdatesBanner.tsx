import { useState } from "react";
import { X, Info } from "lucide-react";

const updates = [
  {
    date: "June 25, 2025",
    content: [
      "⚙️ Decreased production bundle time from 17s to 14s, Removed deprecated packages in replace for lucide-react. For the non-nerds reading this, This means faster page loads for you! Which means faster journal entries :D",
      "✅ New Habit Builder section! Create new habits to help build stronger self control.",
      "🔗 Added Navigation links in the banner for Desktop users.",
      "🔗 Decreased production bundle time from 14s to 13.81s",
      "⚙️ Decreased production bundle time from 13.81s to 11.83s",
      "⚙️ Decreased production bundle time from 11.83s to 9.41s",
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
          Latest Update | Version 1.3.5
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
