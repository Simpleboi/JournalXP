import { motion } from "framer-motion";
import { ArrowRight, Shield, Heart, Zap, LogIn, Star, Lock, GraduationCap, Brain } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";

export const AboutHero = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({
    users: 104,
    entries: 1847,
    streaks: 66,
    xp: 8012,
  });

  // Animate numbers counting up
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        users: prev.users + Math.floor(Math.random() * 3),
        entries: prev.entries + Math.floor(Math.random() * 5),
        streaks: prev.streaks + Math.floor(Math.random() * 2),
        xp: prev.xp + Math.floor(Math.random() * 100),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSeeHowItWorks = () => {
    // Change hash directly to trigger hashchange event and switch tab
    window.location.hash = "features";

    // Scroll to features section after tab change
    setTimeout(() => {
      const featuresSection = document.getElementById("features-section");
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white mb-6"
    style={{ background: theme.colors.gradient}}>
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Stats Ticker */}
        {/* <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-6 mb-12"
        >
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.users.toLocaleString()}</div>
            <div className="text-sm text-purple-200">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.entries.toLocaleString()}</div>
            <div className="text-sm text-purple-200">Journal Entries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.streaks.toLocaleString()}</div>
            <div className="text-sm text-purple-200">Active Streaks</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{(stats.xp)}</div>
            <div className="text-sm text-purple-200">Total XP Earned</div>
          </div>
        </motion.div> */}

        {/* Main Hero Content */}
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Your Mental Health
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              Leveled Up
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl mb-4 text-purple-100"
          >
            Redefine journaling for the modern world. Track your mind, build your habits, and level up your mental wellness, one day at a time.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg mb-8 text-purple-200"
          >
            100% Free
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <a
              href="/signup"
              className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-xl"
              style={{ color: theme.colors.primary }}
            >
              Start Your Journey (Free)
              <ArrowRight className="h-5 w-5" />
            </a>
            <button
              onClick={handleSeeHowItWorks}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
            >
              See How It Works
            </button>
            <a
              href="/login"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-lg font-semibold text-lg hover:bg-white/20 hover:border-white/50 transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="h-5 w-5" />
              Log In
            </a>
          </motion.div>

          {/* Trust Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="space-y-4"
          >
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full">
                <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
                <span className="text-sm text-white font-medium">4.9 from beta testers</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full">
                <Lock className="h-4 w-4 text-green-300" />
                <span className="text-sm text-white font-medium">Private & encrypted</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full">
                <GraduationCap className="h-4 w-4 text-blue-300" />
                <span className="text-sm text-white font-medium">Built for everyone</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full">
                <Brain className="h-4 w-4 text-pink-300" />
                <span className="text-sm text-white font-medium">Mental wellness first</span>
              </div>
            </div>

            {/* Social Proof Line */}
            <p className="text-purple-200 text-sm text-center">
              Used by students building better habits every day.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-20">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
};
