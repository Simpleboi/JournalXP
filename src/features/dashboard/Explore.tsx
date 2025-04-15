import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Book, ListChecks, Sparkles, BarChart3, User, ShoppingBag, Info, Settings, Code, Heart } from "lucide-react";
import { JournalCard } from "./JournalCard";
import { MeditationCard } from "./MeditationCard";
import { HabitCard } from "./HabitCard";
import { InsightsCard } from "./InsightsCard";
import { ProfileCard } from "./ProfileCard";
import { StoreCard } from "./RewardsCard";
import { SettingsCard } from "./SettingsCard";
import { AboutUsCard } from "./AboutUsCard";
import { MeetTheDevsCard } from "./MeetTheTeamCard";

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

        {/* Insights Card */}
        <InsightsCard />

        {/* Profile Card */}
        <ProfileCard />

        {/* Store Card */}
        <StoreCard />

        {/* Settings Card */}
        <SettingsCard />

        {/* About Us Card */}
        <AboutUsCard />

        {/* Meet the Team Card */}
        <MeetTheDevsCard />

        {/* Support Us Card */}
        <motion.div
          whileHover={{
            y: -5,
            boxShadow:
              "0 10px 25px -5px rgba(124, 58, 237, 0.1), 0 10px 10px -5px rgba(124, 58, 237, 0.04)",
          }}
          transition={{ duration: 0.2 }}
        >
          <Link to="/donate" className="block h-full">
            <Card className="overflow-hidden h-full bg-gradient-to-br from-pink-50 to-rose-50 border-pink-100 hover:border-pink-300 transition-colors">
              <CardContent className="p-6 flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Support Us
                </h3>
                <p className="text-gray-600 text-sm">
                  Help us continue our mission to improve mental health
                </p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};
