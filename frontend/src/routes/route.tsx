import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { NotYet } from "@/components/NotYet";
import { Loading } from "@/components/Loading";

// Lazy loading all routes
const HomePage = lazy(() => import("@/pages/Home"));
const AboutUsPage = lazy(() => import("@/pages/AboutUs"));
const StorePage = lazy(() => import("@/pages/StorePage"));
const JournalPage = lazy(() => import("@/pages/JournalPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const HabitTrackerPage = lazy(() => import("@/pages/HabitTrackerPage"));
const InsightsPage = lazy(() => import("@/pages/InsightsPage"));
const DailyTasksPage = lazy(() => import("@/pages/DailyTasksPage"));
const DonatePage = lazy(() => import("@/pages/Donate"));
const MeetTheDevsPage = lazy(() => import("@/pages/MeetTheDevs"));
const AchievementsPage = lazy(() => import("@/pages/AchievementsPage"));
const MeditationRoomPage = lazy(() => import("@/pages/MeditationPage"));
const NotificationPage = lazy(() => import("@/pages/NotificationPage"));
const BadgeCollectionPage = lazy(() => import("@/components/BadgeCollection"));
const TermsAndConditions = lazy(() => import("@/features/footer/termsAndConditions"));
const VirtualPetPage = lazy(() => import("@/pages/PetPage"));
const SundayPage = lazy(() => import("@/pages/SundayPage"));
const BlogPage = lazy(() => import("@/pages/BlogPage"));
const BlogPostPage = lazy(() => import("@/features/blog/BlogPostCard"));
const CommunityPage = lazy(() => import("@/pages/CommunityPage"));
const NewCommunityPost = lazy(() => import("@/features/community/NewCommunityPost"));

const JournalRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/meditation" element={<MeditationRoomPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/donate" element={<DonatePage />} />
        <Route path="/team" element={<MeetTheDevsPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/habits" element={<HabitTrackerPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/badge" element={<BadgeCollectionPage />} />
        <Route path="/tasks" element={<DailyTasksPage />} />
        <Route path="/notyet" element={<NotYet />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/tac" element={<TermsAndConditions />} />
        <Route path="/pet" element={<VirtualPetPage />} />
        <Route path="/sunday" element={<SundayPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/new" element={<NewCommunityPost />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
      </Routes>
    </Suspense>
  );
};

export default JournalRoutes;
