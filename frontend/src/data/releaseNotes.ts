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
    date: "2025-11-21",
    title: "Authentication & UX Improvements",
    highlights: [
      "Password reset functionality",
      "Fixed authentication flow issues",
      "Release notes history added to About page",
    ],
    features: [
      "Password reset dialog with email verification",
      "Release notes component in Roadmap section",
      "Profile picture upload support with Firestore rules",
    ],
    improvements: [
      "Fixed React hook ordering in navigation components",
      "Enhanced email/password authentication flow",
      "Auto-login after account creation",
      "Better error handling in login/signup",
    ],
    bugFixes: [
      "Fixed signup authentication issue preventing auto-login",
      "Resolved nested form issue in password reset dialog",
      "Fixed React hook call order in UserAvatarLoggedIn",
    ],
  },
  {
    version: "2.1.0",
    date: "2025-11-16",
    title: "Mobile Apps Implementation & Feature Expansion",
    highlights: [
      "iOS and Android mobile apps via Capacitor",
      "Expo React Native mobile development",
      "Custom habit frequencies",
    ],
    features: [
      "Capacitor integration for native iOS and Android apps",
      "Expo React Native standalone mobile app",
      "Custom frequency options for habits (daily, weekly, monthly, custom)",
      "Indefinite habit support (habits without target completions)",
      "Enhanced achievements page with better UI",
      "Workout dashboard and data models",
    ],
    improvements: [
      "Updated theme placement in Habit and Daily Tasks pages",
      "Fixed habit completion button issues",
      "Refactored legacy code across the codebase",
      "Added new feature cards to home page",
    ],
    bugFixes: [
      "Fixed meditation room entries not saving to database",
      "Resolved delete progress button to correctly remove tasks and habits",
      "Fixed habit builder page frequency selection",
    ],
  },
  {
    version: "2.0.0",
    date: "2025-11-07",
    title: "Full Backend Integration & Major App Changes",
    highlights: [
      "Migrated backend to Firebase Cloud Functions",
      "Daily Tasks Page UI Improved",
    ],
    features: [
      "Complete backend migration from /backend to /functions directory",
      "User creation via Cloud Functions",
    ],
    improvements: [
      "Updated authentication deployment process",
      "Added production API configuration for Vite preview",
      "Refactored community comment section",
      "Migrated user fields to new schema with lifetime stats",
    ],
    bugFixes: [
      "Fixed Sunday's rate limit errors",
      "Resolved session and authentication issues",
      "Fixed journal entry database routing",
      "Corrected daily task and habit logic migration",
    ],
  },
  {
    version: "1.3.0",
    date: "2025-10-12",
    title: "Task Management & Backend Integration",
    highlights: [
      "Connected task backend to frontend",
      "Firebase Functions initialization",
      "Enhanced data persistence",
    ],
    features: [
      "Task backend API integration",
      "Firebase Cloud Functions setup",
      "Server-side task management",
      "Default user creation on backend",
    ],
    improvements: [
      "Implemented require auth middleware",
      "Refactored admin library structure",
      "Updated user data schema",
      "Enhanced API routing",
    ],
  },
  {
    version: "1.2.5",
    date: "2025-06-28",
    title: "Production Optimization",
    highlights: [
      "Better production build process",
      "Performance improvements",
      "Mobile UI enhancements",
    ],
    improvements: [
      "Optimized production build configuration",
      "Improved mobile navigation performance",
      "Enhanced build process efficiency",
    ],
  },
  {
    version: "1.2.0",
    date: "2025-07-02",
    title: "Rank System & Streak Progression",
    highlights: [
      "Infinite exponential leveling system",
      "Rank progression with 8 tiers",
      "Streak system with motivational messages",
    ],
    features: [
      "Introducing the New Rank System! Your journey now includes tiers like Bronze, Silver, Gold, Platinum, Diamond, Mythic, Legend, and Ascended (100+ levels)",
      "Dynamic rank badges with unique icons for each tier",
      "XP rewards for journaling, tasks, and habits",
      "Introducing the new Streak System! Stay consistent and earn streak bonuses",
      "Streaks showcase motivational messages and unlock hidden achievements",
    ],
    improvements: [
      "Optimized XP calculation algorithms",
      "Better rank badge visuals",
      "Enhanced progress tracking",
      "Improved mobile performance",
    ],
  },
  {
    version: "1.1.0",
    date: "2025-06-27",
    title: "Habit Builder & Performance Boost",
    highlights: [
      "Habit Builder Page launched",
      "Massive build time improvement (8 seconds faster)",
      "Package optimization",
    ],
    features: [
      "New Habit Builder section! Create custom habits to build stronger self-control",
      "Habit tracking with daily, weekly, and monthly frequencies",
      "Navigation links in banner for desktop users",
      "Category-based habit organization (mindfulness, physical, social, productivity)",
    ],
    improvements: [
      "Removed deprecated radix-icons in favor of lucide-react",
      "Decreased production bundle time from 17s to 9.41s (46% faster!)",
      "Improved SignUp/Login data flow and enhanced security",
      "Added desktop navigation links for better UX",
    ],
    bugFixes: [
      "Fixed bugs in Journal section",
      "Journal Entry cards now reflect properly in both List View and Calendar View",
      "More mobile-friendly UI across the app",
      "Fixed navigation mobile issues",
    ],
  },
  {
    version: "1.0.1",
    date: "2025-06-25",
    title: "Production Polish",
    highlights: [
      "First production deployment",
      "Bug fixes and stability improvements",
    ],
    improvements: [
      "Fixed up application for production environment",
      "Improved stability and performance",
      "Enhanced error handling",
    ],
    bugFixes: [
      "Fixed navigation bugs",
      "Resolved production build issues",
    ],
  },
  {
    version: "1.0.0",
    date: "2025-04-14",
    title: "Initial Public Release",
    highlights: [
      "First public release of JournalXP",
      "Core journaling functionality",
      "Firebase authentication and database",
    ],
    features: [
      "User authentication (Email/Password and Google)",
      "Basic journaling with entries",
      "Journal entry archive with calendar view",
      "User profiles with stats tracking",
      "Dashboard with journal and meditation cards",
      "Firebase Cloud Firestore integration",
      "Responsive web design",
      "Welcome banner with rotating motivational quotes",
      "Achievements and streaks tracking",
      "User data context for global state management",
    ],
    improvements: [
      "Modularized component structure (header, footer, pages)",
      "Profile modularity for better code organization",
      "Setup backend logic structure",
    ],
  },
  {
    version: "0.1.0",
    date: "2025-04-03",
    title: "Initial Project Setup",
    highlights: [
      "Initial commit and project setup",
      "Foundation architecture established",
      "Basic page structure created",
    ],
    features: [
      "Initial project structure with React + TypeScript",
      "Basic routing setup",
      "About Us page framework",
      "Store page foundation",
      "Entry archive skeleton",
      "Support and donate sections",
      "Meet the team page",
    ],
  },
];
