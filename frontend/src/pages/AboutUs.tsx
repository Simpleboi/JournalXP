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

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <Header title="About JournalXP" icon={Info} />

      {/* Hero Section - Always visible */}
      <AboutHero />

      {/* Tabbed Content */}
      <main className="container mx-auto px-4 py-12">
        <Tabs defaultValue="about" className="w-full">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8 h-auto bg-white shadow-md p-2">
            <TabsTrigger
              value="about"
              className="flex items-center gap-2 py-3 text-base data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700"
            >
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">About</span>
            </TabsTrigger>
            <TabsTrigger
              value="features"
              className="flex items-center gap-2 py-3 text-base data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Features Guide</span>
            </TabsTrigger>
            <TabsTrigger
              value="roadmap"
              className="flex items-center gap-2 py-3 text-base data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700"
            >
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Roadmap</span>
            </TabsTrigger>
            <TabsTrigger
              value="community"
              className="flex items-center gap-2 py-3 text-base data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Get Involved</span>
            </TabsTrigger>
          </TabsList>

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
          </TabsContent>

          {/* Features Guide Tab */}
          <TabsContent value="features">
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

        {/* Final CTA - Always visible below tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-24"
        >
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Mental Health?
            </h2>
            <p className="text-xl mb-8 text-purple-100">
              Join the many users who level up their wellness every day
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/signup"
                className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
              >
                Start Your Journey (Free) →
              </a>
              <a
                href="/journal"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-indigo-600 transition-all"
              >
                Try Demo
              </a>
            </div>
            <p className="text-sm text-purple-200 mt-6">
              No credit card required • Forever free • Your data stays private
            </p>
          </div>
        </motion.div>

        {/* Crisis Resources - Always visible at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <CrisisResources />
        </motion.div>
      </main>
    </div>
  );
};

export default AboutUs;
