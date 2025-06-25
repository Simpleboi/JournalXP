import { useState } from "react";
import { X, Info } from "lucide-react";

const updates = [
  {
    date: "June 24, 2025",
    content: [
      "🧠 Mood and corresponding emoji now show correctly in the list view. When you make an entry and select a mood, it'll reflect on the list view in the reflection archive.",
      "📖 Added a pop-up that displays after you've made a journal entry, and increased journal entry points from +10 to +20. All points gained before this update will remain the same.",
      "🔘 Added a button in the welcome banner that leads to the Daily Tasks section.",
      "❎ Feel free to close out this updates tab in the top right corner!"
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
          Latest Updates | Version 1.0.2
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
