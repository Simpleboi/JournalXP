import ReflectionArchive from "@/features/journal/ReflectionArchive";
import { useState, useEffect } from "react";
import { JournalEntry } from "@/features/journal/JournalEntry";
import { Header } from "@/components/Header";
import { Archive, Lock, Book, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { SEO } from "@/components/SEO";
import { getJournalEntries } from "@/services/JournalService";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

// Ambient colors for the archive page - calm indigo/purple tones
const archiveAmbience = {
  primary: 'rgba(99, 102, 241, 0.22)',     // Indigo
  secondary: 'rgba(139, 92, 246, 0.18)',   // Purple
  accent: 'rgba(79, 70, 229, 0.15)',       // Deep indigo
  warm: 'rgba(167, 139, 250, 0.12)',       // Light purple
};

const ReflectionArchivePage = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntries = async () => {
      if (user) {
        try {
          const fetchedEntries = await getJournalEntries();
          setEntries(fetchedEntries);
        } catch (error) {
          console.error("Failed to fetch journal entries:", error);
        }
      }
    };

    fetchEntries();
  }, [user]);

  return (
    <div className="min-h-screen relative">
      {/* Animated ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 via-white to-purple-50" />

        {/* Floating ambient orbs */}
        <motion.div
          className="absolute top-1/4 -left-16 sm:-left-32 w-48 h-48 sm:w-96 sm:h-96 rounded-full blur-2xl sm:blur-3xl"
          style={{ background: archiveAmbience.primary }}
          animate={{
            x: [0, 20, 0],
            y: [0, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 -right-12 sm:-right-24 w-40 h-40 sm:w-80 sm:h-80 rounded-full blur-2xl sm:blur-3xl"
          style={{ background: archiveAmbience.secondary }}
          animate={{
            x: [0, -15, 0],
            y: [0, 20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-36 h-36 sm:w-72 sm:h-72 rounded-full blur-2xl sm:blur-3xl"
          style={{ background: archiveAmbience.accent }}
          animate={{
            x: [0, 25, 0],
            y: [0, -12, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-32 h-32 sm:w-64 sm:h-64 rounded-full blur-2xl sm:blur-3xl hidden sm:block"
          style={{ background: archiveAmbience.warm }}
          animate={{
            x: [0, -18, 0],
            y: [0, 18, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 8,
          }}
        />
      </div>

      <SEO
        title="Reflection Archive - Browse Past Journal Entries"
        description="Browse, search, and export your journal entries. View your thoughts in list or calendar format with powerful filtering options."
        url="https://journalxp.com/reflection-archive"
      />

      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link sr-only-focusable">
        Skip to main content
      </a>

      {/* Header */}
      <Header title="Reflection Archive" icon={Archive} />

      {/* Main Content */}
      <main id="main-content" className="relative container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 max-w-5xl mx-auto"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <motion.div
              className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200/50"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Archive className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </motion.div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-700 via-purple-600 to-violet-600 pb-2 bg-clip-text text-transparent">
                Reflection Archive
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Browse and revisit your past journal entries
              </p>
            </div>
          </div>
          <motion.div
            className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 backdrop-blur-sm border-2 border-indigo-200/60 rounded-xl sm:rounded-2xl shadow-sm"
            whileHover={{ scale: 1.02 }}
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />
            <span className="font-medium text-indigo-700 text-sm sm:text-base">{entries.length} entries saved</span>
          </motion.div>
        </motion.div>

        {/* Archive Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ReflectionArchive entries={entries} setEntries={setEntries} />
        </motion.div>

        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 max-w-5xl mx-auto"
        >
          <motion.button
            onClick={() => navigate('/vault')}
            className="group flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-50/90 to-orange-50/90 backdrop-blur-sm border-2 border-amber-200/60 hover:border-amber-300 shadow-sm transition-all duration-300"
            whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(251, 191, 36, 0.2)" }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md group-hover:scale-105 transition-transform">
              <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm sm:text-base text-amber-900">Vault</p>
              <p className="text-[10px] sm:text-xs text-amber-600/80">Secure entries</p>
            </div>
          </motion.button>
          <motion.button
            onClick={() => navigate('/journal')}
            className="group flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-50/90 to-teal-50/90 backdrop-blur-sm border-2 border-emerald-200/60 hover:border-emerald-300 shadow-sm transition-all duration-300"
            whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.2)" }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-md group-hover:scale-105 transition-transform">
              <Book className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm sm:text-base text-emerald-900">Journal</p>
              <p className="text-[10px] sm:text-xs text-emerald-600/80">Write new entry</p>
            </div>
          </motion.button>
        </motion.div>
      </main>

      {/* Offline Indicator */}
      <OfflineIndicator />
    </div>
  );
};

export default ReflectionArchivePage;
