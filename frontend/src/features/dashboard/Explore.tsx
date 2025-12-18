import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { JournalCard } from "./JournalCard";
import { MeditationCard } from "./MeditationCard";
import { HabitCard } from "./HabitCard";
import { InsightsCard } from "./InsightsCard";
import { ProfileCard } from "./ProfileCard";
import { StoreCard } from "./RewardsCard";
import { AboutUsCard } from "./AboutUsCard";
import { MeetTheDevsCard } from "./MeetTheTeamCard";
import { DonateCard } from "./DonateCard";
import { NotificationsCard } from "./NotificationsCard";
import { AchievementCard } from "./AchievementCard";
import { BadgesCard } from "./BadgesCard";
import { DailyTasksCard } from "./DailyTasksCard";
import { useUserData } from "@/context/UserDataContext";
import { useAuth } from "@/context/AuthContext";
import { VirtualPetCard } from "./VirtualPetCard";
import { SundayCard } from "./SundayCard";
import { BlogCard } from "./BlogCard";
import { CommunityCard } from "./CommunityCard";
import { WorkoutCard } from "./WorkoutCard";
import { PomoCard } from "../pomo/PomoCard";
import { DEFAULT_DASHBOARD_CARDS } from "@/data/dashboardCards";

// Card component mapping
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
  blog: BlogCard,
  community: CommunityCard,
  workout: WorkoutCard,
  pet: VirtualPetCard,
  team: MeetTheDevsCard,
  donate: DonateCard,
  notifications: NotificationsCard,
  badges: BadgesCard,
};

// Cards that require authentication
const authRequiredCards = ['store', 'insights', 'achievements', 'profile'];

export const ExploreJournalXP = () => {
  const { user } = useAuth();
  const { userData } = useUserData();

  // Get selected cards from user preferences or use defaults
  const selectedCards = userData?.preferences?.dashboardCards || DEFAULT_DASHBOARD_CARDS;

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
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="m-10"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Explore JournalXP
        </h2>
        <Link
          to="/all-cards"
          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
        >
          See All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {selectedCards.map(renderCard)}
      </div>
    </motion.section>
  );
};
