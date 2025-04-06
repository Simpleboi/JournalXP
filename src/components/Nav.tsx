// for the nav components
import { motion } from "framer-motion";
import { Bell, Settings, User, Info, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export const Nav = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: 0 }}
            className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
          />
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            JournalXP
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/settings">
              <Settings className="h-5 w-5 text-gray-600" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/about">
              <Info className="h-5 w-5 text-gray-600" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/store">
              <ShoppingBag className="h-5 w-5 text-gray-600" />
            </Link>
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <User className="h-4 w-4 text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Nate</span>
          </div>
        </div>
      </div>
    </header>
  );
};
