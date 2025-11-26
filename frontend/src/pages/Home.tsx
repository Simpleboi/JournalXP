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

const Home = () => {

  const { userData } = useUserData();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <SEO
        title="JournalXP - Gamified Mental Wellness Journaling"
        description="Transform your mental wellness journey into an adventure. Gamified journaling with AI companion, habit tracking, virtual pet, and supportive community. Start free!"
        url="https://journalxp.com/"
      />
      {/* Nav Bar */}
      <Nav />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Message */}
        <Welcome />

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

        {/* For updates */}
        <UpdatesBanner />

      </main>
      
      {/* <TaskChecklist /> */}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;



