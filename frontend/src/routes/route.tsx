import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { NotYet } from "@/components/NotYet";
import { Loading } from "@/components/Loading";

// Lazy loading all routes
const LandingPage = lazy(() => import("@/pages/LandingPage"));
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
const PomodomoPage = lazy(() => import("@/pages/PomoTimerPage"));
const TermsAndConditions = lazy(
  () => import("@/features/footer/termsAndConditions")
);
const VirtualPetPage = lazy(() => import("@/pages/PetPage"));
const SundayPage = lazy(() => import("@/pages/SundayPage"));
const BlogPage = lazy(() => import("@/pages/BlogPage"));
const BlogPostPage = lazy(() => import("@/features/blog/BlogPostCard"));
const CommunityPage = lazy(() => import("@/pages/CommunityPage"));
const NewCommunityPost = lazy(
  () => import("@/features/community/NewCommunityPost")
);
const PrivacyPolicyPage = lazy(() => import("@/features/legal/PrivacyPolicy"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const SignupPage = lazy(() => import("@/pages/SignupPage"));
const AllCardsPage = lazy(() => import("@/pages/AllCardsPage"));
const VaultPage = lazy(() => import("@/pages/VaultPage"));
const ReflectionArchivePage = lazy(() => import("@/pages/ReflectionArchivePage"));
const FocusTapPage = lazy(() => import("@/pages/FocusTapPage"));
const NotebookPage = lazy(() => import("@/pages/NotebookPage"));
const GuidedReflectionPage = lazy(() => import("@/pages/GuidedReflectionPage"));
const GuidedReflectionPathPage = lazy(() => import("@/pages/GuidedReflectionPathPage"));
const HelpOpportunitiesPage = lazy(() => import("@/pages/HelpOpportunitiesPage"));


const JournalRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
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
        <Route path="/pomo" element={<PomodomoPage />} />
        <Route path="/tac" element={<TermsAndConditions />} />
        <Route path="/pet" element={<VirtualPetPage />} />
        <Route path="/sunday" element={<SundayPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/new" element={<NewCommunityPost />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/all-cards" element={<AllCardsPage />} />
        <Route path="/vault" element={<VaultPage />} />
        <Route path="/reflection-archive" element={<ReflectionArchivePage />} />
        <Route path="/focus-tap" element={<FocusTapPage />} />
        <Route path="/notebook" element={<NotebookPage />} />
        <Route path="/guided-reflection" element={<GuidedReflectionPage />} />
        <Route path="/guided-reflection/:pathId" element={<GuidedReflectionPathPage />} />
        <Route path="/help-opportunities" element={<HelpOpportunitiesPage />} />
      </Routes>
    </Suspense>
  );
};

export default JournalRoutes;
