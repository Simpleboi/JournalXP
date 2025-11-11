import { motion } from "framer-motion";
import { ArrowRight, Shield, Heart, Zap } from "lucide-react";
import { useState, useEffect } from "react";

export const AboutHero = () => {
  const [stats, setStats] = useState({
    users: 4203,
    entries: 12847,
    streaks: 892,
    xp: 1847293,
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

  const scrollToGetStarted = () => {
    const section = document.getElementById("get-started");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Stats Ticker */}
        <motion.div
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
            <div className="text-3xl font-bold">{(stats.xp / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-purple-200">Total XP Earned</div>
          </div>
        </motion.div>

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
            Turn self-care into an adventure. Journal, track moods, build habits,
            and grow stronger—one entry at a time.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg mb-8 text-purple-200"
          >
            100% Free. No Ads. Your Data Stays Private.
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
            >
              Start Your Journey (Free)
              <ArrowRight className="h-5 w-5" />
            </a>
            <button
              onClick={scrollToGetStarted}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
            >
              See How It Works
            </button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-8"
          >
            <div className="flex items-center gap-2 text-purple-100">
              <Shield className="h-5 w-5" />
              <span>Open Source</span>
            </div>
            <div className="flex items-center gap-2 text-purple-100">
              <Heart className="h-5 w-5" />
              <span>No Ads, Ever</span>
            </div>
            <div className="flex items-center gap-2 text-purple-100">
              <Zap className="h-5 w-5" />
              <span>Privacy First</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#f9fafb"
          />
        </svg>
      </div>
    </div>
  );
};
