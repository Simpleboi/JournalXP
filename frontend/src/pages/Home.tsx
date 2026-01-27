import { motion } from "framer-motion";
import ProgressStats from "@/components/ProgressStats";
import { Nav } from "@/components/Nav";
import { Welcome } from "@/components/Welcome";
import { Footer } from "@/components/Footer";
import { Blockquote } from "@/components/Quote";
import { ExploreJournalXP } from "@/features/dashboard/Explore";
import { NewUserMsg } from "@/components/NewUserMsg";
import { useUserData } from "@/context/UserDataContext";
import { UpdatesBanner } from "@/components/UpdatesBanner";
import TaskChecklist from "@/components/TaskChecklist";
import { TestingXP } from "@/components/TestingXP";
import { SEO } from "@/components/SEO";
import { LiveClock } from "@/components/Clock";
import { LiveWeather } from "@/components/Weather";

// Ambient colors for the home page
const homeAmbience = {
  primary: 'rgba(99, 102, 241, 0.18)',     // Indigo
  secondary: 'rgba(139, 92, 246, 0.15)',   // Purple
  accent: 'rgba(59, 130, 246, 0.12)',      // Blue
  warm: 'rgba(236, 72, 153, 0.10)',        // Pink
};

const Home = () => {
  const { userData } = useUserData();

  return (
    <div className="min-h-screen relative">
      {/* Animated ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />

        {/* Floating ambient orbs */}
        <motion.div
          className="absolute top-1/4 -left-16 sm:-left-32 w-48 h-48 sm:w-96 sm:h-96 rounded-full blur-2xl sm:blur-3xl"
          style={{ background: homeAmbience.primary }}
          animate={{
            x: [0, 20, 0],
            y: [0, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 -right-12 sm:-right-24 w-40 h-40 sm:w-80 sm:h-80 rounded-full blur-2xl sm:blur-3xl"
          style={{ background: homeAmbience.secondary }}
          animate={{
            x: [0, -15, 0],
            y: [0, 20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-36 h-36 sm:w-72 sm:h-72 rounded-full blur-2xl sm:blur-3xl"
          style={{ background: homeAmbience.accent }}
          animate={{
            x: [0, 25, 0],
            y: [0, -12, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-32 h-32 sm:w-64 sm:h-64 rounded-full blur-2xl sm:blur-3xl hidden sm:block"
          style={{ background: homeAmbience.warm }}
          animate={{
            x: [0, -18, 0],
            y: [0, 18, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 8,
          }}
        />
      </div>
      <SEO
        title="JournalXP - Mental Wellness Journaling"
        description="Transform your mental wellness journey into an adventure. Gamified journaling with AI companion, habit tracking, virtual pet, and supportive community. Start free!"
        url="https://journalxp.com/"
      />
      {/* Nav Bar */}
      <Nav />

      {/* Main Content */}
      <main className="relative container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Welcome Message */}
        <Welcome />

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Live Clock Card */}
            <LiveClock />

            {/* Weather Card */}
            <LiveWeather />
          </div>
        </motion.section>

        {/* To display if the user isn't live */}
        {!userData ? <NewUserMsg /> : ""}

        {/* Progress Stats */}
        <section className="mb-8">
          <ProgressStats />
        </section>

        {/* A testing component to award points */}
        <TestingXP/>

        {/* Displays a Random Quote */}
        <Blockquote />

        {/* Main Dashboard Tabs */}
        <ExploreJournalXP />
        
        {/* For updates - conditionally rendered based on user preference */}
        {(userData?.preferences?.showUpdatesBanner ?? true) && (
          <UpdatesBanner />
        )}
      </main>

      {/* <TaskChecklist /> */}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
