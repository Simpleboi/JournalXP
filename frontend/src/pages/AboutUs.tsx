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
import { FeedbackForm } from "@/components/Feedback";
import { Info } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <Header title="About JournalXP" icon={Info} />

      {/* Hero Section */}
      <AboutHero />

      {/* Main Content Sections */}
      <main className="space-y-24 pb-24">
        {/* Crisis Resources - Prominent placement */}
        <section className="container mx-auto px-4 -mt-12 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <CrisisResources />
          </motion.div>
        </section>

        {/* Founder Story Timeline */}
        <section className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <FounderStoryTimeline />
          </motion.div>
        </section>

        {/* Social Proof */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SocialProof />
            </motion.div>
          </div>
        </section>

        {/* Feature Showcase */}
        <section className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <FeatureShowcase />
          </motion.div>
        </section>

        {/* Comparison Table */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <ComparisonTable />
            </motion.div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Roadmap />
          </motion.div>
        </section>

        {/* Support Section */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SupportSection />
            </motion.div>
          </div>
        </section>

        {/* Contributors */}
        <section className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
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
            </div>
          </motion.div>
        </section>

        {/* Feedback Form */}
        <section className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
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
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-3xl p-12 shadow-2xl">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform Your Mental Health?
              </h2>
              <p className="text-xl mb-8 text-purple-100">
                Join 4,000+ users who level up their wellness every day
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
        </section>
      </main>
    </div>
  );
};

export default AboutUs;
