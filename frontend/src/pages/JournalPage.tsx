import ReflectionArchive from "@/features/journal/ReflectionArchive";
import { Journal } from "@/features/journal/Journal";
import { TemplatedJournal } from "@/features/journal/TemplatedJournal";
import { VaultSection } from "@/features/journal/VaultSection";
import { useState } from "react";
import { JournalEntry } from "@/features/journal/JournalEntry";
import { Header } from "@/components/Header";
import { Book, Sparkles, Lock, Archive, PenLine, LayoutTemplate } from "lucide-react";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { useTheme } from "@/context/ThemeContext";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useUserData } from "@/context/UserDataContext";
import { FeatureNotice } from "@/components/FeatureNotice";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

// Floating shape component for the background
const FloatingShape = ({
  className,
  delay = 0,
  duration = 20
}: {
  className: string;
  delay?: number;
  duration?: number;
}) => (
  <motion.div
    className={className}
    animate={{
      y: [0, -20, 0],
      x: [0, 10, 0],
      rotate: [0, 5, 0],
      scale: [1, 1.05, 1],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  />
);

type ViewType = 'journal' | 'templates';

const JournalPage = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeView, setActiveView] = useState<ViewType>('journal');
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { userData } = useUserData();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <SEO
        title="Mental Health Journaling - Track Moods & Earn XP"
        description="Express yourself freely with JournalXP's guided journaling. Track moods, reflect on your day, and earn 30 XP per entry. Free writing, gratitude, and prompted journaling modes available."
        url="https://journalxp.com/journal"
      />
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link sr-only-focusable">
        Skip to main content
      </a>

      {/* Header */}
      <Header title="Journal & Reflection" icon={Book} />

      {/* Animated Background with Glass Morphism */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-purple-50/30 to-pink-50/40" />

        {/* Animated mesh gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-60"
          animate={{
            background: [
              'radial-gradient(ellipse at 20% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(236, 72, 153, 0.2) 0%, transparent 50%)',
              'radial-gradient(ellipse at 40% 40%, rgba(147, 51, 234, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 60% 60%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)',
              'radial-gradient(ellipse at 20% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(236, 72, 153, 0.2) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating decorative shapes */}
        <FloatingShape
          className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-gradient-to-br from-blue-200/40 to-indigo-300/30 blur-3xl"
          delay={0}
          duration={15}
        />
        <FloatingShape
          className="absolute top-40 right-[15%] w-48 h-48 rounded-full bg-gradient-to-br from-purple-200/40 to-pink-300/30 blur-3xl"
          delay={2}
          duration={18}
        />
        <FloatingShape
          className="absolute bottom-20 left-[30%] w-56 h-56 rounded-full bg-gradient-to-br from-pink-200/40 to-rose-300/30 blur-3xl"
          delay={4}
          duration={20}
        />
        <FloatingShape
          className="absolute bottom-40 right-[25%] w-40 h-40 rounded-full bg-gradient-to-br from-indigo-200/40 to-purple-300/30 blur-3xl"
          delay={1}
          duration={16}
        />
      </div>

      {/* Main Content */}
      <main id="main-content" className="relative container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* View Switcher Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap justify-center gap-4 mb-8 max-w-5xl mx-auto"
        >
          {/* Journal Button */}
          <motion.button
            onClick={() => setActiveView('journal')}
            className={`group relative flex items-center gap-4 px-6 py-4 rounded-2xl backdrop-blur-sm border-2 shadow-sm transition-all duration-300 ${
              activeView === 'journal'
                ? 'bg-gradient-to-br from-blue-100/95 to-indigo-100/95 border-blue-300 shadow-lg shadow-blue-200/50'
                : 'bg-white/70 border-white/50 hover:border-blue-200 hover:bg-blue-50/50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-pressed={activeView === 'journal'}
            aria-label="Switch to Journal view"
          >
            {/* Active indicator */}
            {activeView === 'journal' && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/10 to-indigo-400/10"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <div className={`p-3 rounded-xl shadow-md transition-all duration-300 ${
              activeView === 'journal'
                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 scale-110'
                : 'bg-gradient-to-br from-blue-400 to-indigo-500 group-hover:scale-105'
            }`}>
              <PenLine className="h-5 w-5 text-white" />
            </div>
            <div className="text-left relative z-10">
              <p className={`font-semibold transition-colors ${
                activeView === 'journal' ? 'text-blue-900' : 'text-gray-700 group-hover:text-blue-800'
              }`}>
                Journal
              </p>
              <p className={`text-xs transition-colors ${
                activeView === 'journal' ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-500'
              }`}>
                Free writing & prompts
              </p>
            </div>
            {activeView === 'journal' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 shadow-md"
              />
            )}
          </motion.button>

          {/* Templates Button */}
          <motion.button
            onClick={() => setActiveView('templates')}
            className={`group relative flex items-center gap-4 px-6 py-4 rounded-2xl backdrop-blur-sm border-2 shadow-sm transition-all duration-300 ${
              activeView === 'templates'
                ? 'bg-gradient-to-br from-purple-100/95 to-violet-100/95 border-purple-300 shadow-lg shadow-purple-200/50'
                : 'bg-white/70 border-white/50 hover:border-purple-200 hover:bg-purple-50/50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-pressed={activeView === 'templates'}
            aria-label="Switch to Templates view"
          >
            {/* Active indicator */}
            {activeView === 'templates' && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400/10 to-violet-400/10"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <div className={`p-3 rounded-xl shadow-md transition-all duration-300 ${
              activeView === 'templates'
                ? 'bg-gradient-to-br from-purple-500 to-violet-600 scale-110'
                : 'bg-gradient-to-br from-purple-400 to-violet-500 group-hover:scale-105'
            }`}>
              <LayoutTemplate className="h-5 w-5 text-white" />
            </div>
            <div className="text-left relative z-10">
              <p className={`font-semibold transition-colors ${
                activeView === 'templates' ? 'text-purple-900' : 'text-gray-700 group-hover:text-purple-800'
              }`}>
                Templates
              </p>
              <p className={`text-xs transition-colors ${
                activeView === 'templates' ? 'text-purple-600' : 'text-gray-500 group-hover:text-purple-500'
              }`}>
                Guided structures
              </p>
            </div>
            {activeView === 'templates' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-br from-purple-400 to-violet-500 shadow-md"
              />
            )}
          </motion.button>
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeView === 'journal' && (
            <motion.div
              key="journal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Promotional Card for Self-Reflection */}
              {userData && userData.journalStats?.totalJournalEntries && userData.journalStats.totalJournalEntries >= 15 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <Card className="w-full max-w-5xl mx-auto mb-4 border-2 border-purple-200/40 bg-white/70 backdrop-blur-md shadow-lg rounded-2xl overflow-hidden">
                    <CardContent className="py-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 shadow-md">
                            <Sparkles className="h-5 w-5 text-white flex-shrink-0" />
                          </div>
                          <div>
                            <p className="font-medium text-purple-900">
                              See what your journals reveal about you
                            </p>
                            <p className="text-sm text-purple-700">
                              Get AI-powered insights into your emotional patterns and growth
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => navigate('/insights?tab=self-reflection')}
                          className="whitespace-nowrap bg-white/80 hover:bg-white border-purple-200 hover:border-purple-300 text-purple-700 hover:text-purple-800 rounded-xl shadow-sm hover:shadow-md transition-all"
                        >
                          View Insights
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Feature Notice */}
              {!user ? <FeatureNotice
                type="info"
                title="You're in preview mode"
                message="Feel free to explore and write, but sign in to keep your entries safe and saved."
                className="max-w-5xl mx-auto"
              /> : ""}

              {/* Journal Component */}
              <Journal entries={entries} setEntries={setEntries} />

              {/* Quick Navigation */}
              <div className="flex flex-wrap justify-center gap-4 mt-8 max-w-5xl mx-auto">
                <motion.button
                  onClick={() => navigate('/vault')}
                  className="group flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-br from-amber-50/90 to-orange-50/90 backdrop-blur-sm border-2 border-amber-200/60 hover:border-amber-300 shadow-sm transition-all duration-300"
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(251, 191, 36, 0.2)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md group-hover:scale-105 transition-transform">
                    <Lock className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-amber-900">Vault</p>
                    <p className="text-xs text-amber-600/80">Secure entries</p>
                  </div>
                </motion.button>
                <motion.button
                  onClick={() => navigate('/reflection-archive')}
                  className="group flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-br from-indigo-50/90 to-purple-50/90 backdrop-blur-sm border-2 border-indigo-200/60 hover:border-indigo-300 shadow-sm transition-all duration-300"
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.2)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 shadow-md group-hover:scale-105 transition-transform">
                    <Archive className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-indigo-900">Reflection Archive</p>
                    <p className="text-xs text-indigo-600/80">Past reflections</p>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}

          {activeView === 'templates' && (
            <motion.div
              key="templates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Templated Journal Component */}
              <TemplatedJournal entries={entries} setEntries={setEntries} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Offline Indicator */}
      <OfflineIndicator />
    </div>
  );
};

export default JournalPage;
