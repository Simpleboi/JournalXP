import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { JournalCard } from "@/features/dashboard/JournalCard";
import { MeditationCard } from "@/features/dashboard/MeditationCard";
import { HabitCard } from "@/features/dashboard/HabitCard";
import { InsightsCard } from "@/features/dashboard/InsightsCard";
import { ProfileCard } from "@/features/dashboard/ProfileCard";
import { StoreCard } from "@/features/dashboard/RewardsCard";
import { AboutUsCard } from "@/features/dashboard/AboutUsCard";
import { MeetTheDevsCard } from "@/features/dashboard/MeetTheTeamCard";
import { DonateCard } from "@/features/dashboard/DonateCard";
import { NotificationsCard } from "@/features/dashboard/NotificationsCard";
import { AchievementCard } from "@/features/dashboard/AchievementCard";
import { BadgesCard } from "@/features/dashboard/BadgesCard";
import { DailyTasksCard } from "@/features/dashboard/DailyTasksCard";
import { VirtualPetCard } from "@/features/dashboard/VirtualPetCard";
import { SundayCard } from "@/features/dashboard/SundayCard";
import { BlogCard } from "@/features/dashboard/BlogCard";
import { CommunityCard } from "@/features/dashboard/CommunityCard";
import { WorkoutCard } from "@/features/dashboard/WorkoutCard";
import { PomoCard } from "@/features/pomo/PomoCard";
import { VaultCard } from "@/features/dashboard/VaultCard";
import { ReflectionArchiveCard } from "@/features/dashboard/ReflectionArchiveCard";
import { FocusTapCard } from "@/features/dashboard/FocusTapCard";
import { useAuth } from "@/context/AuthContext";
import { SEO } from "@/components/SEO";

// Card component mapping (add in the other cards when they're ready)
const cardComponents: { [key: string]: React.ComponentType } = {
  journal: JournalCard,
  sunday: SundayCard,
  tasks: DailyTasksCard,
  habits: HabitCard,
  meditation: MeditationCard,
  pomodoro: PomoCard,
  store: StoreCard,
  insights: InsightsCard,
  achievements: AchievementCard,
  profile: ProfileCard,
  about: AboutUsCard,
  vault: VaultCard,
  "reflection-archive": ReflectionArchiveCard,
  "focus-tap": FocusTapCard,
  // blog: BlogCard,
  // community: CommunityCard,
  // workout: WorkoutCard,
  pet: VirtualPetCard,
  // team: MeetTheDevsCard,
  // donate: DonateCard,
  // notifications: NotificationsCard,
  // badges: BadgesCard,
};

// Cards that require authentication
const authRequiredCards = ['store', 'insights', 'achievements', 'profile'];

// All card IDs in display order
const allCardIds = [
  'journal',
  'vault',
  'reflection-archive',
  'focus-tap',
  'sunday',
  'tasks',
  'habits',
  'meditation',
  'pomodoro',
  'store',
  'insights',
  'achievements',
  'profile',
  'about',
  'blog',
  'community',
  'workout',
  'pet',
  'team',
  'donate',
  'notifications',
  'badges',
];

const AllCardsPage = () => {
  const { user } = useAuth();

  const renderCard = (cardId: string) => {
    const CardComponent = cardComponents[cardId];

    if (!CardComponent) return null;

    // Skip cards that require auth if user is not logged in
    if (authRequiredCards.includes(cardId) && !user) {
      return null;
    }

    return <CardComponent key={cardId} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <SEO
        title="All Features - JournalXP"
        description="Explore all JournalXP features including journaling, meditation, habit tracking, AI companion, and more."
        url="https://journalxp.com/all-cards"
      />

      {/* Header */}
      <Header title="All Features" />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Explore All Features
            </h2>
            <p className="text-gray-600">
              Discover everything JournalXP has to offer. Customize your home
              page in{" "}
              <a
                href="/profile"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Settings
              </a>
              .
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allCardIds.map(renderCard)}
          </div>

          {!user && (
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-center">
                🔒 Some features require you to be{" "}
                <a
                  href="/login"
                  className="font-semibold underline hover:text-blue-900"
                >
                  logged in
                </a>
                .
              </p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default AllCardsPage;
