import { useState } from "react";
import { X, Info } from "lucide-react";

let nxt = "✅ Introducing the new Habit Builder section! Start building powerful habits to strengthen your self-control. Complete them to stay consistent and earn bonus points along the way! | 🏆 New Achievements System is live! Earn badges for journaling, login streaks, and more. Track your progress, unlock milestones, and level up your mental wellness journey."

const NextUpdate = [
  {
    date: "October 27th, 2025",
    content: [
      "🌿 Introducing the Meditation Room! Take a mindful break anytime with our brand-new Meditation Room. Choose guided sessions, breathing exercises, or calming ambient sounds to reset your focus and find peace throughout the day.",
      "📅 Updated the Daily Tasks Page! We’ve redesigned the Daily Tasks page with a cleaner UI, faster interactions, and new features like task grouping and priority markers. Staying organized is now smoother and more motivating than ever!",
      "🔥 Streak Fixes! No more lost progress, Streaks now update reliably so you can build lasting habits without worry. Keep your momentum going and celebrate every win. For more information about this, see the 'user guide' section in the 'About us' page",
      "⚡ Leveling System Update! The XP and leveling system has been rebuilt for accuracy and fairness. Progress now feels more rewarding as you grow with JournalXP.",
    ],
  },
];

const updates = [
  {
    date: "November 14th, 2025",
    content: [
      "🔒 Major Security & Privacy Upgrade! Your data is now more secure than ever. We've migrated from client-side SDK to server-side SDK architecture, meaning your sensitive data is now processed on our secure servers instead of your browser. Think of it like moving from sending postcards (anyone can read them) to sealed, encrypted letters. We've also implemented:\n   • Enhanced Authentication - Your login credentials are verified through multiple secure layers, like having both a key and a security code to enter your home\n   • End-to-End Encryption - Your journal entries and personal data are encrypted from the moment you type them until they're safely stored, so even if someone intercepts the data, they can't read it\n   • Server-Side Validation - All requests are now verified on our secure backend servers before processing, preventing unauthorized access\n   • Session Security - Improved token management and automatic session timeouts to protect your account if you forget to log out\n   What this means for you: Your mental health data, journal entries, and personal information are protected with bank-level security. Only you can access your content, and we've made it nearly impossible for unauthorized parties to intercept or read your private thoughts.",

      "📱 Mobile App Support is Here! JournalXP is now available as a native iOS and Android app! Download on your phone for a seamless mobile experience with offline support, push notifications for daily journaling reminders, and native performance. Built with Capacitor for the best of both web and mobile.",

      "🎨 Redesigned About Us Page! We've completely overhauled the About Us page with modern, visually stunning card-based tabs. Each section (About, Features, Roadmap, Community) now has its own unique gradient color scheme with smooth animations, hover effects, and improved accessibility.",

      "🌿 Meditation Room Major Upgrade! The Meditation Room has received massive enhancements:\n   • Save Your Favorite Quotes - Daily inspiration quotes can now be saved and persist between sessions using localStorage\n   • Emotion-Based Guided Meditation - Click on emotions like Anger, Sadness, or Anxiety to get specific breathing techniques, grounding exercises, and body awareness tips\n   • Journal Prompt Carousel - Browse through multiple guided prompts using arrow navigation and dot indicators. Save only the prompt you're responding to\n   • Direct Journal Integration - Write reflections directly in the meditation room and save to Firebase as 'guided' entries, earning 30 XP instantly",

      "📚 New Feature Tutorials Added! The Features tab in About Us now includes comprehensive step-by-step guides for:\n   • Daily Tasks - Learn how to create, prioritize, and complete tasks to earn 20 XP\n   • Meditation Room - Complete walkthrough of breathing exercises, affirmations, and emotional support features\n   • Each tutorial includes 'What it is' and 'How to use it' sections with numbered steps",

      "📊 Enhanced User Statistics System! We've added extensive lifetime stats tracking to enrich your profile:\n   • Meditation Stats - Track total sessions, minutes, longest session, streaks, and favorite meditation type\n   • Community Stats - Monitor reflections posted, comments given, support given/received\n   • Pet Stats - Track interactions, days with pet, revivals, quests completed, items collected\n   • Achievement Stats - See total unlocked, completion percentage, rarest achievement\n   • Milestones - Record important dates like first journal, first task completed, first meditation\n   • Progression Insights - Analyze total level-ups, highest rank reached, XP breakdown by source\n   • Wellness Patterns - Discover your most productive day, preferred journaling time, consistency score, and mood trends",

      "🗳️ Roadmap Voting Fixed! The roadmap feature voting system had a backend type error that caused 500 errors. This has been resolved - you can now vote on your favorite upcoming features without issues!",

      "⚠️ Feature Status Notices! Added a new FeatureNotice component that can be placed throughout the app to inform users about:\n   • Features in development\n   • Known issues or limitations\n   • Coming soon features\n   • Important announcements\n   Available in 4 styles: info (blue), warning (amber), development (purple), and coming-soon (indigo)",

      "📅 Updated the Daily Tasks Page! We've redesigned the Daily Tasks page with a cleaner UI, faster interactions, and new features like task grouping and priority markers. Staying organized is now smoother and more motivating than ever!",

      "🔥 Streak Fixes! No more lost progress. Streaks now update reliably across all features (journaling, habits, login) so you can build lasting habits without worry. Keep your momentum going and celebrate every win. For more information, see the 'Features' section in the 'About Us' page.",

      "⚡ Leveling System Update! The XP and leveling system has been rebuilt for accuracy and fairness. Progress now feels more rewarding as you grow with JournalXP. All XP awards are properly tracked and stats are updated in real-time.",
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
          Latest Update | Version 2.1.0 - Major Feature Update
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
