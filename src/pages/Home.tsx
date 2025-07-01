import ProgressStats from "@/components/ProgressStats";
import { Nav } from "@/components/Nav";
import { Welcome } from "@/components/Welcome";
import { Footer } from "@/components/Footer";
import { Blockquote } from "@/components/Quote";
import { ExploreJournalXP } from "@/features/dashboard/Explore";
import { NewUserMsg } from "@/components/NewUserMsg";
import { useUserData } from "@/context/UserDataContext";
import { UpdatesBanner } from "@/components/UpdatesBanner";

const Home = () => {

  const { userData } = useUserData();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
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

        {/* Displays a Random Quote */}
        <Blockquote />

        {/* Main Dashboard Tabs */}
        <ExploreJournalXP />

        {/* For updates */}
        <UpdatesBanner />

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
