import { motion } from "framer-motion";
import { Trophy, TrendingUp, Crown, Zap, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface RankTier {
  name: string;
  levels: string;
  badge: string;
  color: string;
  gradient: string;
  icon: string;
  description: string;
  glow: string;
}

const ranks: RankTier[] = [
  {
    name: "Bronze",
    levels: "Levels 1-15",
    badge: "Mindful Beginner",
    color: "from-orange-600 to-orange-800",
    gradient: "from-orange-400 to-orange-600",
    icon: "🥉",
    description: "Starting your wellness journey with curiosity and determination",
    glow: "shadow-orange-500/50",
  },
  {
    name: "Silver",
    levels: "Levels 16-30",
    badge: "Wellness Explorer",
    color: "from-gray-400 to-gray-600",
    gradient: "from-gray-300 to-gray-500",
    icon: "🥈",
    description: "Building consistency and discovering what works for you",
    glow: "shadow-gray-400/50",
  },
  {
    name: "Gold",
    levels: "Levels 31-45",
    badge: "Self-care Advocate",
    color: "from-yellow-500 to-yellow-700",
    gradient: "from-yellow-400 to-yellow-600",
    icon: "🥇",
    description: "Establishing strong habits and championing your mental health",
    glow: "shadow-yellow-500/50",
  },
  {
    name: "Platinum",
    levels: "Levels 46-60",
    badge: "Focused Pathfinder",
    color: "from-cyan-400 to-cyan-600",
    gradient: "from-cyan-300 to-cyan-500",
    icon: "💎",
    description: "Mastering your wellness routine with precision and grace",
    glow: "shadow-cyan-400/50",
  },
  {
    name: "Diamond",
    levels: "Levels 61-75",
    badge: "Growth Master",
    color: "from-blue-400 to-purple-600",
    gradient: "from-blue-300 to-purple-500",
    icon: "💠",
    description: "Achieving transformative growth and inspiring others",
    glow: "shadow-purple-500/50",
  },
  {
    name: "Mythic",
    levels: "Levels 76-90",
    badge: "Mental Warrior",
    color: "from-purple-600 to-pink-600",
    gradient: "from-purple-500 to-pink-500",
    icon: "⚔️",
    description: "Conquering challenges with resilience and unwavering strength",
    glow: "shadow-pink-500/50",
  },
  {
    name: "Legend",
    levels: "Levels 91-100",
    badge: "Peaceful Sage",
    color: "from-rose-500 to-orange-600",
    gradient: "from-rose-400 to-orange-500",
    icon: "👑",
    description: "Reaching enlightenment through dedication and self-mastery",
    glow: "shadow-rose-500/50",
  },
  {
    name: "Ascended",
    levels: "Level 100+",
    badge: "Ascended",
    color: "from-indigo-600 via-purple-600 to-pink-600",
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
    icon: "✨",
    description: "Transcending limits, embodying ultimate wellness mastery",
    glow: "shadow-purple-600/70",
  },
];

export const RankShowcase = () => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-6 py-3 rounded-full mb-6 shadow-xl">
          <Trophy className="h-6 w-6" />
          <span className="font-bold text-lg">Rank Progression System</span>
          <Star className="h-6 w-6 animate-pulse" />
        </div>

        <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
          Your Journey to Greatness
        </h2>

        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Level up through <span className="font-bold text-purple-600">8 prestigious ranks</span> as you build habits,
          journal your thoughts, and master your mental wellness. Every action brings you closer to <span className="font-bold text-pink-600">legendary status</span>.
        </p>

        {/* Stats showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-2xl text-white"
          >
            <TrendingUp className="h-10 w-10 mb-3 mx-auto" />
            <div className="text-4xl font-bold mb-2">100+</div>
            <div className="text-indigo-100 font-medium">Levels to Conquer</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-2xl shadow-2xl text-white"
          >
            <Crown className="h-10 w-10 mb-3 mx-auto" />
            <div className="text-4xl font-bold mb-2">8</div>
            <div className="text-purple-100 font-medium">Prestigious Ranks</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-gradient-to-br from-pink-500 to-rose-600 p-6 rounded-2xl shadow-2xl text-white"
          >
            <Zap className="h-10 w-10 mb-3 mx-auto" />
            <div className="text-4xl font-bold mb-2">Infinite</div>
            <div className="text-pink-100 font-medium">Growth Potential</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Ranks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {ranks.map((rank, index) => (
          <motion.div
            key={rank.name}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card
              className={`group relative overflow-hidden border-2 hover:border-transparent transition-all duration-500 hover:scale-105 hover:shadow-2xl ${rank.glow} hover:shadow-2xl cursor-pointer`}
            >
              {/* Animated background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${rank.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              />

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000" />

              <CardContent className="p-6 relative z-10">
                {/* Rank icon */}
                <div className="text-center mb-4">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`text-6xl mb-3 inline-block filter drop-shadow-lg`}
                  >
                    {rank.icon}
                  </motion.div>

                  <div
                    className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${rank.color} text-white font-bold text-sm mb-2 shadow-lg`}
                  >
                    {rank.name}
                  </div>
                </div>

                {/* Level range */}
                <div className="text-center mb-3">
                  <div className="text-gray-600 font-semibold text-sm mb-1">
                    {rank.levels}
                  </div>
                  <div
                    className={`text-xs font-bold bg-gradient-to-r ${rank.gradient} bg-clip-text text-transparent`}
                  >
                    {rank.badge}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  {rank.description}
                </p>

                {/* Progress indicator */}
                <div className="mt-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 1 }}
                      className={`h-full bg-gradient-to-r ${rank.gradient} rounded-full`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Call to action */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 shadow-2xl"
      >
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Start Climbing the Ranks?
        </h3>
        <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
          Every journal entry, completed task, and habit brings you closer to legendary status.
          Start your journey today and watch yourself grow!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/journal"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
          >
            <Zap className="h-5 w-5" />
            Begin Your Journey
          </a>

          <a
            href="/profile"
            className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-indigo-600 transition-all"
          >
            <Trophy className="h-5 w-5" />
            View My Rank
          </a>
        </div>

        {/* XP tip */}
        <div className="mt-8 flex items-center justify-center gap-2 text-purple-100">
          <Star className="h-5 w-5 text-yellow-300" />
          <span className="text-sm font-medium">
            Earn XP: 30 per journal entry • 20 per task • 10+ per habit
          </span>
        </div>
      </motion.div>
    </div>
  );
};
