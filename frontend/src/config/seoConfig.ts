// SEO configuration for all pages in JournalXP
// This centralizes meta descriptions, titles, and OG tags for easier maintenance

export interface PageSEO {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: string;
}

export const seoConfig: Record<string, PageSEO> = {
  home: {
    title: "JournalXP - Gamified Mental Wellness Journaling",
    description: "Transform your mental wellness journey into an adventure. Gamified journaling with AI companion, habit tracking, virtual pet, and supportive community. Start free!",
    url: "https://journalxp.com/",
  },
  journal: {
    title: "Mental Health Journaling - Track Moods & Earn XP",
    description: "Express yourself freely with JournalXP's guided journaling. Track moods, reflect on your day, and earn 30 XP per entry. Free writing, gratitude, and prompted journaling modes available.",
    url: "https://journalxp.com/journal",
  },
  sunday: {
    title: "AI Wellness Companion - 24/7 Emotional Support",
    description: "Meet Sunday, your empathetic AI wellness companion. Get personalized mental health support, emotional guidance, and a safe space to explore your thoughts 24/7. Not a replacement for therapy.",
    url: "https://journalxp.com/sunday",
  },
  habits: {
    title: "Gamified Habit Tracker - Build Lasting Change",
    description: "Build healthy habits that stick with JournalXP's gamified habit tracker. Daily, weekly, and monthly tracking with streak counters and XP rewards. Mindfulness, physical, social, and productivity habits.",
    url: "https://journalxp.com/habits",
  },
  tasks: {
    title: "Daily Task Manager - Complete Goals & Earn XP",
    description: "Organize your day with JournalXP's gamified task manager. Set priorities, due dates, and earn 20 XP per completed task. Track progress and build productivity habits.",
    url: "https://journalxp.com/tasks",
  },
  pet: {
    title: "Virtual Pet Companion - Wellness Motivation",
    description: "Care for your virtual companion while caring for yourself. Choose from 5 pet types and keep them happy by maintaining your wellness habits. Feed, play, and grow together!",
    url: "https://journalxp.com/pet",
  },
  community: {
    title: "Anonymous Wellness Community - Share & Support",
    description: "Join a supportive anonymous community of people on their mental wellness journey. Share reflections, offer support, and connect with others in a safe, moderated space.",
    url: "https://journalxp.com/community",
  },
  achievements: {
    title: "Unlock Achievements - Celebrate Your Progress",
    description: "Track your mental wellness achievements across journaling, habits, tasks, streaks, and XP. Unlock 50+ achievements and earn points for reaching milestones on your wellness journey.",
    url: "https://journalxp.com/achievements",
  },
  insights: {
    title: "Wellness Analytics - Track Your Mental Health Journey",
    description: "Get AI-powered insights into your mental wellness patterns. Analyze mood trends, productivity correlations, journaling habits, and behavioral patterns to optimize your wellbeing.",
    url: "https://journalxp.com/insights",
  },
  meditation: {
    title: "Guided Meditation & Breathing Exercises",
    description: "Practice mindfulness with guided meditation, breathing exercises, and daily affirmations. Choose from 1 to 10-minute sessions with visual guides and calming sounds.",
    url: "https://journalxp.com/meditation",
  },
  profile: {
    title: "Your Wellness Profile & Progress",
    description: "View your JournalXP profile with level, rank, XP progress, achievements, and inventory. Manage settings, track your wellness journey, and celebrate your growth.",
    url: "https://journalxp.com/profile",
  },
  about: {
    title: "About JournalXP - Mental Wellness Through Gamification",
    description: "Learn about JournalXP's mission to make mental wellness engaging through gamification. Discover how we combine journaling, AI support, and game mechanics to help you thrive.",
    url: "https://journalxp.com/about",
  },
  team: {
    title: "Meet the Developers - The JournalXP Team",
    description: "Meet the team behind JournalXP. Learn about the developers and contributors building a better mental wellness platform. Open source and community-driven.",
    url: "https://journalxp.com/team",
  },
  blog: {
    title: "Mental Wellness Blog - Tips, Guides & Research",
    description: "Read articles about mental health, journaling techniques, habit formation, gamification psychology, and wellness tips. Evidence-based guidance for your mental health journey.",
    url: "https://journalxp.com/blog",
  },
  donate: {
    title: "Support JournalXP - Keep Mental Wellness Free",
    description: "Help keep JournalXP free and accessible for everyone. Support our mission to provide mental wellness tools without paywalls or premium tiers. Every contribution helps.",
    url: "https://journalxp.com/donate",
  },
  store: {
    title: "JournalXP Store - Badges, Themes & Customization",
    description: "Customize your JournalXP experience with badges, themes, and pet accessories. Spend earned points or support development while personalizing your wellness journey.",
    url: "https://journalxp.com/store",
  },
  privacy: {
    title: "Privacy Policy - Your Data Security",
    description: "Learn how JournalXP protects your privacy. We never sell your data, use encryption for storage, and give you full control over your mental health information. GDPR compliant.",
    url: "https://journalxp.com/privacy",
  },
  terms: {
    title: "Terms of Service - JournalXP Usage Agreement",
    description: "Review JournalXP's terms of service. Understand your rights, our responsibilities, and guidelines for using our mental wellness platform safely and effectively.",
    url: "https://journalxp.com/tac",
  },
  login: {
    title: "Log In to JournalXP",
    description: "Log in to your JournalXP account to continue your mental wellness journey. Track your progress, journal entries, habits, and connect with your AI companion Sunday.",
    url: "https://journalxp.com/login",
  },
  signup: {
    title: "Sign Up for JournalXP - Start Your Wellness Journey",
    description: "Create your free JournalXP account and start your gamified mental wellness journey today. No credit card required. Begin journaling, building habits, and leveling up your life.",
    url: "https://journalxp.com/signup",
  },
  notifications: {
    title: "Notifications - Stay Updated",
    description: "View your JournalXP notifications, achievement unlocks, streak reminders, and community interactions. Stay connected to your wellness journey.",
    url: "https://journalxp.com/notifications",
  },
};

// Helper function to get SEO config for a page
export const getPageSEO = (page: keyof typeof seoConfig): PageSEO => {
  return seoConfig[page] || seoConfig.home;
};
