import { motion } from "framer-motion";
import { JournalCard } from "./JournalCard";
import { MeditationCard } from "./MeditationCard";
import { HabitCard } from "./HabitCard";
import { InsightsCard } from "./InsightsCard";
import { ProfileCard } from "./ProfileCard";
import { StoreCard } from "./RewardsCard";
import { SettingsCard } from "./SettingsCard";
import { AboutUsCard } from "./AboutUsCard";
import { MeetTheDevsCard } from "./MeetTheTeamCard";
import { DonateCard } from "./DonateCard";
import { NotificationsCard } from "./NotificationsCard";
import { AchievementCard } from "./AchievementCard";

export const ExploreJournalXP = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Explore JournalXP
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {/* Journal Card */}
        <JournalCard />

        {/* Habit Builder Card */}
        <HabitCard />

        {/* Meditation Room Card */}
        <MeditationCard />

        {/* Store Card */}
        <StoreCard />

        {/* Insights Card */}
        <InsightsCard />

        {/* About Us Card */}
        <AboutUsCard />

        {/* Meet the Team Card */}
        <MeetTheDevsCard />

        {/* Support Us Card */}
        <DonateCard />

        {/* Notifications Card */}
        <NotificationsCard />

        {/* Achievement Card */}
        <AchievementCard />

        {/* Profile Card */}
        <ProfileCard />

        {/* Settings Card */}
        <SettingsCard />

      </div>
    </motion.section>
  );
};
