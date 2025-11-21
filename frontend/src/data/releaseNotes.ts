export interface ReleaseNote {
  version: string;
  date: string;
  title: string;
  highlights: string[];
  features?: string[];
  improvements?: string[];
  bugFixes?: string[];
  breaking?: string[];
}

export const releaseNotes: ReleaseNote[] = [
  {
    version: "2.1.4",
    date: "2025-01-15",
    title: "Monorepo Restructure & Performance Updates",
    highlights: [
      "Restructured project to monorepo architecture",
      "Improved build performance and type safety",
      "Enhanced shared utilities across frontend and backend",
    ],
    improvements: [
      "Moved backend logic from /backend to /functions for Cloud Functions",
      "Added shared TypeScript types and utilities",
      "Updated theme system with dynamic color schemes",
      "Improved level and rank calculation system",
    ],
  },
  {
    version: "2.1.0",
    date: "2024-11-17",
    title: "Profile & Achievement System",
    highlights: [
      "New achievements system with unlockable badges",
      "Enhanced profile management",
      "Theme customization support",
    ],
    features: [
      "Achievement tracking with categories (Journaling, Habits, Tasks, XP, Streaks)",
      "Profile picture upload with Firebase Storage",
      "Username management with validation",
      "Theme selection and customization",
    ],
    improvements: [
      "Updated user schema with achievement fields",
      "Better profile header design",
      "Improved authentication flow",
    ],
  },
  {
    version: "2.0.0",
    date: "2024-11-16",
    title: "Major UI Overhaul & Community Features",
    highlights: [
      "Complete UI redesign with Radix UI components",
      "Community reflections system",
      "Mobile app support via Capacitor",
    ],
    features: [
      "Anonymous community posting with mood filtering",
      "59 new shadcn-style UI components",
      "Capacitor integration for iOS and Android",
      "Sunday AI wellness companion",
    ],
    improvements: [
      "Migrated to TailwindCSS 3.4.1",
      "Added Framer Motion animations",
      "Enhanced navigation with mobile support",
      "Improved accessibility with Radix UI primitives",
    ],
    breaking: [
      "Complete UI component library migration",
      "Updated routing structure",
    ],
  },
  {
    version: "1.3.1",
    date: "2024-11-09",
    title: "Habit Tracker & Task Management",
    highlights: [
      "Custom habit tracking with frequency options",
      "Daily tasks with priority levels",
      "XP rewards system expansion",
    ],
    features: [
      "Habit tracker with daily, weekly, and monthly frequencies",
      "Task management with due dates and priorities",
      "Streak tracking for habits",
      "Category-based organization (mindfulness, physical, social, productivity)",
    ],
    improvements: [
      "Enhanced XP calculation system",
      "Better progress visualization",
      "Improved statistics tracking",
    ],
  },
  {
    version: "1.2.0",
    date: "2024-11-07",
    title: "Level System & Rank Progression",
    highlights: [
      "Infinite exponential leveling system",
      "Rank progression with 8 tiers",
      "Visual XP progress indicators",
    ],
    features: [
      "Dynamic level calculation based on total XP",
      "Rank system: Bronze through Ascended (100+ levels)",
      "XP rewards for journaling, tasks, and habits",
      "Level-up animations and notifications",
    ],
    improvements: [
      "Optimized XP calculation algorithms",
      "Better rank badge visuals",
      "Enhanced progress tracking",
    ],
  },
  {
    version: "1.1.0",
    date: "2024-10-15",
    title: "Journal & Meditation Features",
    highlights: [
      "Free writing, guided prompts, and gratitude journaling",
      "Meditation room with breathing exercises",
      "Mood tracking per entry",
    ],
    features: [
      "Three journal modes: Free Writing, Guided, Gratitude",
      "Mood selection and tracking",
      "Meditation exercises with visual guides",
      "Affirmations and daily challenges",
      "Journal entry archive with calendar view",
    ],
    improvements: [
      "Word count tracking for entries",
      "Enhanced editor experience",
      "Better mood analytics",
    ],
  },
  {
    version: "1.0.0",
    date: "2024-09-20",
    title: "Initial Public Release",
    highlights: [
      "First public release of JournalXP",
      "Core journaling functionality",
      "Firebase authentication and database",
    ],
    features: [
      "User authentication (Email/Password and Google)",
      "Basic journaling with entries",
      "User profiles with stats",
      "Firebase Cloud Functions backend",
      "Responsive web design",
    ],
  },
];
