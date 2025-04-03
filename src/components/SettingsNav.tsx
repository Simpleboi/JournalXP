import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export const SettingsNav = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Button>
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: 0 }}
              className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
            />
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              JournalXP
            </h1>
          </Link>
        </div>
      </div>
    </header>
  );
};
