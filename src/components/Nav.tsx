// for the nav components
import { motion } from "framer-motion";
import {
  Bell,
  Settings,
  User,
  Info,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export const Nav = () => {
  return (
    <header className="bg-white/90 backdrop-blur-sm shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 10 }}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md"
          >
            <Sparkles className="h-5 w-5 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            JournalXP
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-indigo-50"
          >
            <Bell className="h-5 w-5 text-indigo-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:bg-indigo-50"
          >
            <Link to="/settings">
              <Settings className="h-5 w-5 text-indigo-600" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:bg-indigo-50"
          >
            <Link to="/store">
              <ShoppingBag className="h-5 w-5 text-indigo-600" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:bg-indigo-50"
          >
            <Link to="/about">
              <Info className="h-5 w-5 text-indigo-600" />
            </Link>
          </Button>
          <div className="flex items-center space-x-2 ml-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center shadow-sm border-2 border-indigo-200"
            >
              <User className="h-5 w-5 text-indigo-600" />
            </motion.div>
            <span className="text-sm font-medium text-gray-700">Sarah</span>
          </div>
        </div>
      </div>
    </header>
  );
};
