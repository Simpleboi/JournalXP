import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Sun, Heart, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const Welcome = () => {
  const { user } = useAuth();

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  
  return (
    <div className="mb-8 text-center">
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative mb-12 rounded-2xl overflow-hidden shadow-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 via-purple-600/90 to-pink-600/90 z-10"></div>
          <div
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?w=1200&q=80')] bg-cover bg-center opacity-40"
            style={{ backgroundPosition: "center" }}
          ></div>
          <div className="relative z-20 py-16 px-8 md:px-16 flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-8 md:mb-0 md:max-w-lg">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold text-white mb-4"
              >
                Welcome back, {displayName}!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-white/90 text-lg mb-6"
              >
                Today is a new opportunity to nurture your mind and spirit. What
                small step will you take today?
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-wrap gap-3 justify-center md:justify-start"
              >
                <Button className="bg-white text-indigo-700 hover:bg-white/90 shadow-md">
                  <Link to="/meditation">Start Meditation</Link>
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white/10"
                >
                  <Link to="/journal">Journal Now</Link>
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white/10"
                >
                  <Link to="/habits">Habit Tracker</Link>
                </Button>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex gap-4"
            >
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center mb-2">
                  <Sun className="h-8 w-8 text-yellow-300" />
                </div>
                <p className="text-white text-center font-medium">
                  Morning
                  <br />
                  Routine
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center mb-2">
                  <Heart className="h-8 w-8 text-pink-300" />
                </div>
                <p className="text-white text-center font-medium">
                  Self
                  <br />
                  Care
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center mb-2">
                  <Moon className="h-8 w-8 text-blue-300" />
                </div>
                <p className="text-white text-center font-medium">
                  Evening
                  <br />
                  Calm
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
    </div>
  );
};
