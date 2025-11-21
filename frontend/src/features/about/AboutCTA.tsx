import { motion } from "framer-motion";

export const AboutCTA = () => {
  return (
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
  );
};
