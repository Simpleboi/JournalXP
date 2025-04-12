import ProgressStats from "@/components/ProgressStats";
import { Nav } from "@/components/Nav";
import { Welcome } from "@/components/Welcome";
import { Footer } from "@/components/Footer";
import { DashboardTabs } from "@/components/DashboardTabs";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Nav Bar */}
      <Nav />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Message */}
        <Welcome />

        {/* Progress Stats */}
        <section className="mb-8">
          <ProgressStats
            points={3000}
            level={4}
            streak={12}
            levelProgress={65}
            rank="Reflective Explorer"
            nextRank="Mindful Adept"
            pointsToNextRank={750}
          />
        </section>

        {/* Main Dashboard Tabs */}
        <DashboardTabs />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
