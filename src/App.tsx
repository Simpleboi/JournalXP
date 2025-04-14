import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import StorePage from "./pages/StorePage";
import SettingsPage from "./pages/SettingsPage";
import MeditationRoom from "./components/MeditationRoom";
import DonatePage from "./pages/Donate";
import MeetTheDevelopers from "./pages/MeetTheDevs";
import routes from "tempo-routes";
import NotificationsPage from "./pages/NotificationPage";
import Signup from "./auth/signup";
import AchievementsPage from "./pages/AchievementsPage";
import JournalPage from "./pages/JournalPage";
import ProfilePage from "./pages/ProfilePage";
import { AuthProvider } from "./context/AuthContext";
import HabitBuilderPage from "./pages/HabitTracker";
import { UserDataProvider } from "./context/UserDataContext";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AuthProvider>
        <UserDataProvider>
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
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
          </>
        </UserDataProvider>
      </AuthProvider>
    </Suspense>
  );
}

export default App;
