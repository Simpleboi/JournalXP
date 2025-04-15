import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Book, ListChecks, Sparkles, BarChart3, User, ShoppingBag, Info, Settings, Code, Heart } from "lucide-react";
import { JournalCard } from "./JournalCard";
import { MeditationCard } from "./MeditationCard";
import { HabitCard } from "./HabitCard";
import { InsightsCard } from "./InsightsCard";

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
        <motion.div
          whileHover={{
            y: -5,
            boxShadow:
              "0 10px 25px -5px rgba(124, 58, 237, 0.1), 0 10px 10px -5px rgba(124, 58, 237, 0.04)",
          }}
          transition={{ duration: 0.2 }}
        >
          <Link to="/profile" className="block h-full">
            <Card className="overflow-hidden h-full bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100 hover:border-amber-300 transition-colors">
              <CardContent className="p-6 flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <User className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Profile
                </h3>
                <p className="text-gray-600 text-sm">
                  Manage your account and view achievements
                </p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        {/* Store Card */}
        <motion.div
          whileHover={{
            y: -5,
            boxShadow:
              "0 10px 25px -5px rgba(124, 58, 237, 0.1), 0 10px 10px -5px rgba(124, 58, 237, 0.04)",
          }}
          transition={{ duration: 0.2 }}
        >
          <Link to="/store" className="block h-full">
            <Card className="overflow-hidden h-full bg-gradient-to-br from-rose-50 to-red-50 border-rose-100 hover:border-rose-300 transition-colors">
              <CardContent className="p-6 flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-4">
                  <ShoppingBag className="h-8 w-8 text-rose-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Rewards Shop
                </h3>
                <p className="text-gray-600 text-sm">
                  Spend your points on rewards and customizations
                </p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        {/* Settings Card */}
        <motion.div
          whileHover={{
            y: -5,
            boxShadow:
              "0 10px 25px -5px rgba(124, 58, 237, 0.1), 0 10px 10px -5px rgba(124, 58, 237, 0.04)",
          }}
          transition={{ duration: 0.2 }}
        >
          <Link to="/settings" className="block h-full">
            <Card className="overflow-hidden h-full bg-gradient-to-br from-slate-50 to-gray-50 border-slate-100 hover:border-slate-300 transition-colors">
              <CardContent className="p-6 flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <Settings className="h-8 w-8 text-slate-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Settings
                </h3>
                <p className="text-gray-600 text-sm">
                  Customize your app experience and notifications
                </p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        {/* About Us Card */}
        <motion.div
          whileHover={{
            y: -5,
            boxShadow:
              "0 10px 25px -5px rgba(124, 58, 237, 0.1), 0 10px 10px -5px rgba(124, 58, 237, 0.04)",
          }}
          transition={{ duration: 0.2 }}
        >
          <Link to="/about" className="block h-full">
            <Card className="overflow-hidden h-full bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-100 hover:border-teal-300 transition-colors">
              <CardContent className="p-6 flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <Info className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  About Us
                </h3>
                <p className="text-gray-600 text-sm">
                  Learn about our mission and mental health resources
                </p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        {/* Meet the Team Card */}
        <motion.div
          whileHover={{
            y: -5,
            boxShadow:
              "0 10px 25px -5px rgba(124, 58, 237, 0.1), 0 10px 10px -5px rgba(124, 58, 237, 0.04)",
          }}
          transition={{ duration: 0.2 }}
        >
          <Link to="/team" className="block h-full">
            <Card className="overflow-hidden h-full bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100 hover:border-violet-300 transition-colors">
              <CardContent className="p-6 flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mb-4">
                  <Code className="h-8 w-8 text-violet-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Meet the Team
                </h3>
                <p className="text-gray-600 text-sm">
                  Get to know the developers behind WellPoint
                </p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

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
