import { useAuth } from "@/context/AuthContext";
import { Loading } from "@/components/Loading";
import { lazy, Suspense } from "react";

const HomePage = lazy(() => import("@/pages/Home"));
const AboutUsPage = lazy(() => import("@/pages/AboutUs"));

const LandingPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      {user ? <HomePage /> : <AboutUsPage />}
    </Suspense>
  );
};

export default LandingPage;
