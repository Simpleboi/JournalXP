// Dashboard card definitions

export interface DashboardCardDefinition {
  id: string;
  name: string;
  description: string;
  requiresAuth: boolean;
  component: string; // Component name for reference
}

export const AVAILABLE_CARDS: DashboardCardDefinition[] = [
  {
    id: 'journal',
    name: 'Journal',
    description: 'Write and reflect on your thoughts',
    requiresAuth: false,
    component: 'JournalCard',
  },
  {
    id: 'sunday',
    name: 'Chat with Sunday',
    description: 'Talk to your AI wellness companion',
    requiresAuth: false,
    component: 'SundayCard',
  },
  {
    id: 'tasks',
    name: 'Daily Tasks',
    description: 'Manage your to-do list',
    requiresAuth: false,
    component: 'DailyTasksCard',
  },
  {
    id: 'habits',
    name: 'Habit Tracker',
    description: 'Build and track healthy habits',
    requiresAuth: false,
    component: 'HabitCard',
  },
  {
    id: 'meditation',
    name: 'Meditation',
    description: 'Mindfulness and breathing exercises',
    requiresAuth: false,
    component: 'MeditationCard',
  },
  {
    id: 'pomodoro',
    name: 'Pomodoro Timer',
    description: 'Focus timer for productivity',
    requiresAuth: false,
    component: 'PomoCard',
  },
  {
    id: 'store',
    name: 'Store',
    description: 'Spend your XP on rewards',
    requiresAuth: true,
    component: 'StoreCard',
  },
  {
    id: 'insights',
    name: 'Insights',
    description: 'View your analytics and patterns',
    requiresAuth: true,
    component: 'InsightsCard',
  },
  {
    id: 'achievements',
    name: 'Achievements',
    description: 'Track your accomplishments',
    requiresAuth: true,
    component: 'AchievementCard',
  },
  {
    id: 'profile',
    name: 'Profile',
    description: 'View and edit your profile',
    requiresAuth: true,
    component: 'ProfileCard',
  },
  {
    id: 'about',
    name: 'About Us',
    description: 'Learn about JournalXP',
    requiresAuth: false,
    component: 'AboutUsCard',
  },
  {
    id: 'vault',
    name: 'Vault',
    description: 'Secure password-protected entries',
    requiresAuth: false,
    component: 'VaultCard',
  },
  {
    id: 'reflection-archive',
    name: 'Reflection Archive',
    description: 'Browse and search past entries',
    requiresAuth: false,
    component: 'ReflectionArchiveCard',
  },
  // {
  //   id: 'focus-tap',
  //   name: 'Focus Tap',
  //   description: 'Focus training mini-game',
  //   requiresAuth: false,
  //   component: 'FocusTapCard',
  // },
  {
    id: 'notebook',
    name: 'Notebook',
    description: 'Quick thoughts & mental scratchpad',
    requiresAuth: false,
    component: 'NotebookCard',
  },
  {
    id: 'guided-reflection',
    name: 'Guided Reflection',
    description: 'Gentle self-exploration paths',
    requiresAuth: false,
    component: 'GuidedReflectionCard',
  },
  // {
  //   id: 'blog',
  //   name: 'Blog',
  //   description: 'Read wellness articles',
  //   requiresAuth: false,
  //   component: 'BlogCard',
  // },
  {
    id: 'community',
    name: 'Community',
    description: 'Connect with others',
    requiresAuth: false,
    component: 'CommunityCard',
  },
  // {
  //   id: 'workout',
  //   name: 'Workout',
  //   description: 'Track your fitness',
  //   requiresAuth: false,
  //   component: 'WorkoutCard',
  // },
  // {
  //   id: 'pet',
  //   name: 'Virtual Pet',
  //   description: 'Care for your companion',
  //   requiresAuth: false,
  //   component: 'VirtualPetCard',
  // },
  {
    id: 'team',
    name: 'Meet the Team',
    description: 'Meet the developers',
    requiresAuth: false,
    component: 'MeetTheDevsCard',
  },
  // {
  //   id: 'donate',
  //   name: 'Support Us',
  //   description: 'Help us grow',
  //   requiresAuth: false,
  //   component: 'DonateCard',
  // },
  // {
  //   id: 'notifications',
  //   name: 'Notifications',
  //   description: 'View your notifications',
  //   requiresAuth: false,
  //   component: 'NotificationsCard',
  // },
  // {
  //   id: 'badges',
  //   name: 'Badges',
  //   description: 'View your badge collection',
  //   requiresAuth: false,
  //   component: 'BadgesCard',
  // },
];

// Default cards shown on home page (first 6)
export const DEFAULT_DASHBOARD_CARDS = [
  'journal',
  'sunday',
  'tasks',
  'habits',
  'meditation',
  'insights',
];
