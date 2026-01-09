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

const Home = () => {
  const { userData } = useUserData();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <SEO
        title="JournalXP - Mental Wellness Journaling"
        description="Transform your mental wellness journey into an adventure. Gamified journaling with AI companion, habit tracking, virtual pet, and supportive community. Start free!"
        url="https://journalxp.com/"
      />
      {/* Nav Bar */}
      <Nav />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
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
        {/* <TestingXP/> */}

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
