import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { AboutHero } from "@/features/about/AboutHero";
import { CrisisResources } from "@/features/about/CrisisResources";
import { FounderStoryTimeline } from "@/features/about/FounderStoryTimeline";
import { SocialProof } from "@/features/about/SocialProof";
import { ComparisonTable } from "@/features/about/ComparisonTable";
import { FeatureShowcase } from "@/features/about/FeatureShowcase";
import { Roadmap } from "@/features/about/Roadmap";
import { SupportSection } from "@/features/about/SupportSection";
import { AboutContribute } from "@/features/about/aboutContribute";
import { PersonalShoutOut } from "@/features/about/PersonalShoutOut";
import { FeedbackForm } from "@/components/Feedback";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, BookOpen, Map, Users, Lightbulb } from "lucide-react";
import { AboutCTA } from "@/features/about/AboutCTA";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";

const AboutUs = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("about");
  const { theme } = useTheme(); 

  // Handle hash-based tab switching
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash && ["about", "features", "roadmap", "community"].includes(hash)) {
      setActiveTab(hash);
    }
  }, [location.hash]);

  // Also listen for native hashchange events (for same-page hash changes)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && ["about", "features", "roadmap", "community"].includes(hash)) {
        setActiveTab(hash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []); 
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <Header title="About JournalXP" icon={Info} />

      {/* Hero Section - Always visible */}
      <AboutHero />

      {/* Tabbed Content */}
      <main className="container mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Navigation - Enhanced Design */}
          <div className="mb-12">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-3 h-auto bg-transparent p-0">
              <TabsTrigger
                value="about"
                className="group relative flex flex-col items-center justify-center gap-2 py-6 px-4 text-base font-medium transition-all duration-300 bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 data-[state=active]:bg-gradient-to-br data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:scale-105 border-2 border-transparent data-[state=active]:border-indigo-300"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 group-data-[state=active]:bg-white/20 transition-all duration-300">
                  <Info className="h-6 w-6 text-indigo-600 group-data-[state=active]:text-white transition-colors" />
                </div>
                <span className="text-sm font-semibold text-gray-700 group-data-[state=active]:text-white">
                  About
                </span>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300 group-data-[state=active]:w-3/4"></div>
              </TabsTrigger>

              <TabsTrigger
                value="features"
                className="group relative flex flex-col items-center justify-center gap-2 py-6 px-4 text-base font-medium transition-all duration-300 bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:scale-105 border-2 border-transparent data-[state=active]:border-blue-300"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 group-data-[state=active]:bg-white/20 transition-all duration-300">
                  <BookOpen className="h-6 w-6 text-blue-600 group-data-[state=active]:text-white transition-colors" />
                </div>
                <span className="text-sm font-semibold text-gray-700 group-data-[state=active]:text-white">
                  Features
                </span>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full transition-all duration-300 group-data-[state=active]:w-3/4"></div>
              </TabsTrigger>

              <TabsTrigger
                value="roadmap"
                className="group relative flex flex-col items-center justify-center gap-2 py-6 px-4 text-base font-medium transition-all duration-300 bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 data-[state=active]:bg-gradient-to-br data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:scale-105 border-2 border-transparent data-[state=active]:border-emerald-300"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 group-data-[state=active]:bg-white/20 transition-all duration-300">
                  <Map className="h-6 w-6 text-emerald-600 group-data-[state=active]:text-white transition-colors" />
                </div>
                <span className="text-sm font-semibold text-gray-700 group-data-[state=active]:text-white">
                  Roadmap
                </span>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-300 group-data-[state=active]:w-3/4"></div>
              </TabsTrigger>

              <TabsTrigger
                value="community"
                className="group relative flex flex-col items-center justify-center gap-2 py-6 px-4 text-base font-medium transition-all duration-300 bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 data-[state=active]:bg-gradient-to-br data-[state=active]:from-pink-500 data-[state=active]:to-rose-600 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:scale-105 border-2 border-transparent data-[state=active]:border-pink-300"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 group-data-[state=active]:bg-white/20 transition-all duration-300">
                  <Users className="h-6 w-6 text-pink-600 group-data-[state=active]:text-white transition-colors" />
                </div>
                <span className="text-sm font-semibold text-gray-700 group-data-[state=active]:text-white">
                  Community
                </span>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full transition-all duration-300 group-data-[state=active]:w-3/4"></div>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FounderStoryTimeline />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ComparisonTable />
            </motion.div>

            {/* About CTA */}
            <AboutCTA />

            {/* Crisis Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12"
            >
              <CrisisResources />
            </motion.div>
          </TabsContent>

          {/* Features Guide Tab */}
          <TabsContent value="features" id="features-section">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FeatureShowcase />
            </motion.div>
          </TabsContent>

          {/* Roadmap Tab */}
          <TabsContent value="roadmap">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Roadmap />
            </motion.div>
          </TabsContent>

          {/* Get Involved Tab */}
          <TabsContent value="community" className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Special Thanks
                  </h2>
                  <p className="text-xl text-gray-600">
                    JournalXP wouldn't exist without these amazing people
                  </p>
                </div>
                <AboutContribute />

                {/* Personal Shout-out */}
                <div className="mt-8">
                  <PersonalShoutOut />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Your Voice Matters
                  </h2>
                  <p className="text-xl text-gray-600">
                    Help shape the future of JournalXP with your feedback
                  </p>
                </div>
                <FeedbackForm />
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AboutUs;
