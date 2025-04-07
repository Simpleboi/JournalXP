// for the nav components
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Bell,
  Settings,
  User,
  Info,
  ShoppingBag,
  Sparkles,
  Heart,
  Code,
  Menu,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
        {/* Mobile menu button */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            className="md:hidden z-50 relative hover:bg-indigo-50"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-indigo-600" />
            ) : (
              <Menu className="h-6 w-6 text-indigo-600" />
            )}
          </Button>
        )}
        {/* Desktop navigation */}
        {!isMobile && (
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-indigo-50"
            >
              <Bell className="h-5 w-5 text-indigo-600" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
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
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hover:bg-indigo-50"
            >
              <Link to="/donate">
                <Heart className="h-5 w-5 text-indigo-600" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hover:bg-indigo-50"
            >
              <Link to="/team">
                <Code className="h-5 w-5 text-indigo-600" />
              </Link>
            </Button>
            <div className="flex items-center space-x-2 ml-2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center shadow-sm border-2 border-indigo-200"
              >
                <User className="h-5 w-5 text-indigo-600" />
              </motion.div>
              <span className="text-sm font-medium text-gray-700">Nate</span>
            </div>
          </div>
        )}
        {/* Mobile navigation menu */}
        {isMobile && isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 bg-white z-40 flex flex-col p-6 shadow-lg"
          >
            <div className="flex flex-col space-y-6 mt-4">
              <Link
                to="/"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-indigo-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <Bell className="h-5 w-5 text-indigo-600" />
                <span className="font-medium text-gray-700">Notifications</span>
              </Link>
              <Link
                to="/settings"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-indigo-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="h-5 w-5 text-indigo-600" />
                <span className="font-medium text-gray-700">Settings</span>
              </Link>
              <Link
                to="/store"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-indigo-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingBag className="h-5 w-5 text-indigo-600" />
                <span className="font-medium text-gray-700">Rewards Shop</span>
              </Link>
              <Link
                to="/about"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-indigo-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <Info className="h-5 w-5 text-indigo-600" />
                <span className="font-medium text-gray-700">About Us</span>
              </Link>
              <div className="border-t border-gray-200 my-2"></div>
              <div className="flex items-center space-x-3 p-2">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center shadow-sm border-2 border-indigo-200"
                >
                  <User className="h-5 w-5 text-indigo-600" />
                </motion.div>
                <span className="font-medium text-gray-700">Sarah</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};
