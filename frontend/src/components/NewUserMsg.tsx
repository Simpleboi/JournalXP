import { motion } from "framer-motion";
import { Info, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const NewUserMsg = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto mb-6"
    >
      <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-md border-2 border-amber-200/50 rounded-2xl shadow-lg p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md flex-shrink-0">
            <Info className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-gray-700 leading-relaxed">
              You're welcome to explore JournalXP as a guest, but to save your journal entries or personalize your experience, please log in. Some features are available only to signed-in users.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-shrink-0">
            <Button
              asChild
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl shadow-md"
            >
              <Link to="/login" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Log In
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
