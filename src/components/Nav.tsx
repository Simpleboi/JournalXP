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
  Menu,
  Code,
  X,
  LogIn,
  UserPlus,
  CalendarCheck,
  Book,
  Home,
  ListChecks,
} from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import Login from "../auth/login";
import Signup from "../auth/signup";
import { useAuth } from "@/context/AuthContext";
import { useUserData } from "@/context/UserDataContext";
import { NavMobile } from "@/features/nav/NavMobile";

export const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuth();

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
    <header className="bg-white/90 backdrop-blur-sm shadow-md sticky top-0 z-50 nav">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/">
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
        </Link>

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

        {/* Desktop Nav Links */}
        {!isMobile && (
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-indigo-50"
            >
              <Link to="/journal">
                <Book className="h-5 w-5 text-indigo-600" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hover:bg-indigo-50"
            >
              <Link to="/tasks">
                <CalendarCheck className="h-5 w-5 text-indigo-600" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hover:bg-indigo-50"
            >
              <Link to="/habits">
                <ListChecks className="h-5 w-5 text-indigo-600" />
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
            {/* <Button
              variant="ghost"
              size="icon"
              asChild
              className="hover:bg-indigo-50"
            >
              <Link to="/team">
                <Code className="h-5 w-5 text-indigo-600" />
              </Link>
            </Button> */}
            {/* <Button
              variant="ghost"
              size="icon"
              asChild
              className="hover:bg-indigo-50"
            >
              <Link to="/settings">
                <Settings className="h-5 w-5 text-indigo-600" />
              </Link>
            </Button> */}
            {user ? (
              <UserAvatarLoggedIn />
            ) : (
              <div className="flex items-center space-x-2 mr-4">
                <Login
                  buttonVariant="ghost"
                  className="hover:bg-indigo-50 text-indigo-600 font-medium"
                />
                <Signup
                  buttonVariant="default"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                />
              </div>
            )}
          </div>
        )}

        {/* Mobile Nav menu */}
        {isMobile && isMenuOpen && (
          <NavMobile 
            setIsMenuOpen={setIsMenuOpen}
            user={user}
          />
        )}
      </div>
    </header>
  );
};

// This is for the mobile log in screen
export const UserLoggedInMobile = () => {
  return (
    <div className="flex items-center space-x-3 p-2">
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center shadow-sm border-2 border-indigo-200"
      >
        <User className="h-5 w-5 text-indigo-600" />
      </motion.div>
      <span className="font-medium text-gray-700">Nate</span>
    </div>
  );
};

// This is for the desktop nav links
export const UserAvatarLoggedIn = () => {
  const { userData } = useUserData();
  if (!userData) return null;

  const displayName = userData?.username || "User";

  return (
    <div className="flex items-center space-x-2 ml-2">
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center shadow-sm border-2 border-indigo-200"
      >
        <Link to="/profile">
          <User className="h-5 w-5 text-indigo-600" />
        </Link>
      </motion.div>
      <Link to="/profile">
        <span className="text-sm font-medium text-gray-700">{displayName}</span>
      </Link>
    </div>
  );
};
