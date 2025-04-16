import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import AboutUs from "@/pages/AboutUs";
import StorePage from "@/pages/StorePage";
import SettingsPage from "@/pages/SettingsPage";
import MeditationRoom from "@/components/MeditationRoom";
import DonatePage from "@/pages/Donate";
import MeetTheDevelopers from "@/pages/MeetTheDevs";
import NotificationsPage from "@/pages/NotificationPage";
import Signup from "@/auth/signup";
import AchievementsPage from "@/pages/AchievementsPage";
import JournalPage from "@/pages/JournalPage";
import ProfilePage from "@/pages/ProfilePage";
import HabitBuilderPage from "@/pages/HabitTracker";
import InsightsPage from "@/pages/InsightsPage";
import routes from "tempo-routes";
import BadgeCollection from "@/components/BadgeCollection";
import DailyTasksPage from "@/pages/DailyTasksPage";

export const JournalRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/meditation" element={<MeditationRoom />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/donate" element={<DonatePage />} />
        <Route path="/team" element={<MeetTheDevelopers />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/habits" element={<HabitBuilderPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/badge" element={<BadgeCollection />} />
        <Route path="/tasks" element={<DailyTasksPage />} />
      </Routes>
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
    </>
  );
};
