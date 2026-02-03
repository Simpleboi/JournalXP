import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import {
  Sun,
  Heart,
  Moon,
  Sparkles,
  PenLine,
  Target,
  ListChecks,
  MessageCircle,
  Leaf,
  Timer,
  ShoppingBag,
  BarChart3,
  Trophy,
  User,
  Info,
  Lock,
  Archive,
  BookOpen,
  Compass,
  Users,
  LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/example.scss";
import { welcomeQuotes } from "@/data/welcomeQuotes";
import { useUserData } from "@/context/UserDataContext";
import { useTheme } from "@/context/ThemeContext";
import { AVAILABLE_CARDS, DEFAULT_WELCOME_BUTTONS } from "@/data/dashboardCards";

// Icon mapping for dynamic button rendering
const iconMap: Record<string, LucideIcon> = {
  PenLine,
  Target,
  ListChecks,
  MessageCircle,
  Leaf,
  Timer,
  ShoppingBag,
  BarChart3,
  Trophy,
  User,
  Info,
  Lock,
  Archive,
  BookOpen,
  Compass,
  Users,
};

// For switching out quotes on the home page
export const QuoteBanner = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % welcomeQuotes.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div className="pr-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6 }}
          className="text-white/90 text-base sm:text-lg mb-6"
        >
          <p>{welcomeQuotes[index]}</p>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export const Welcome = () => {
  // load the user data
  const { userData } = useUserData();
  const { theme } = useTheme();

  // Get user's preferred welcome buttons or use defaults
  const welcomeButtons = userData?.preferences?.welcomeButtons ?? DEFAULT_WELCOME_BUTTONS;

  // Get card info for each button
  const buttonConfigs = welcomeButtons
    .map((cardId: string) => AVAILABLE_CARDS.find((card) => card.id === cardId))
    .filter(Boolean)
    .slice(0, 3); // Ensure max 3 buttons

  return (
    <div className="mb-6 sm:mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl"
      >
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 z-10"
          style={{ background: theme.colors.gradient }}
        />

        {/* Background image */}
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?w=1200&q=80')] bg-cover bg-center opacity-30"
        />

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 z-10" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 z-10" />

        {/* Content */}
        <div className="relative z-20 py-10 sm:py-16 px-6 sm:px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left side - Text content */}
          <div className="text-center md:text-left md:max-w-lg">
            {/* Idk how to feel about this right now */}
            {/* <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4"
            >
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span className="text-white/90 text-sm font-medium">Your wellness journey awaits</span>
            </motion.div> */}

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              {userData?.username ? `Welcome back, ${userData.username}!` : "Welcome To JournalXP!"}
            </motion.h2>

            <QuoteBanner />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-wrap gap-3 justify-center md:justify-start"
            >
              {buttonConfigs.map((card, index) => {
                const IconComponent = iconMap[card.icon] || PenLine;
                const isFirst = index === 0;

                return (
                  <motion.div
                    key={card.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant={isFirst ? "default" : "outline"}
                      className={
                        isFirst
                          ? "bg-white shadow-lg hover:bg-white/90 rounded-xl px-5"
                          : "bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 rounded-xl"
                      }
                      style={isFirst ? { color: theme.colors.primary } : undefined}
                      asChild
                    >
                      <Link to={card.route} className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        {card.name}
                      </Link>
                    </Button>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Right side - Feature cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex gap-3 sm:gap-4"
          >
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-white/20 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-lg border border-white/20"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-3 shadow-lg">
                <Sun className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <p className="text-white text-center font-medium text-sm sm:text-base">
                Morning
                <br />
                <span className="text-white/70 text-xs sm:text-sm">Routine</span>
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-white/20 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-lg border border-white/20"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center mb-3 shadow-lg">
                <Heart className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <p className="text-white text-center font-medium text-sm sm:text-base">
                Self
                <br />
                <span className="text-white/70 text-xs sm:text-sm">Care</span>
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-white/20 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-lg border border-white/20"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center mb-3 shadow-lg">
                <Moon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <p className="text-white text-center font-medium text-sm sm:text-base">
                Evening
                <br />
                <span className="text-white/70 text-xs sm:text-sm">Calm</span>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
