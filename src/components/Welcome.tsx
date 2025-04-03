import { motion } from "framer-motion";

export const Welcome = () => {
  return (
    <div className="mb-8 text-center">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
      >
        Welcome back, Nate!
      </motion.h2>
      <p className="text-gray-600 mt-2">
        Today is a new opportunity to take care of your mental wellbeing.
      </p>
    </div>
  );
};
