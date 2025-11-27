// for the nav components
import { color, motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  User,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useUserData } from "@/context/UserDataContext";
import { NavMobile } from "@/features/nav/NavMobile";
import { NavDesktop } from "@/features/nav/NavDesktop";
import { useTheme } from "@/context/ThemeContext";

export const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuth();
  const { theme } = useTheme();

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
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
              style={{ background: theme.colors.gradient }}
            >
              <Sparkles className="h-5 w-5 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent"
            style={{ backgroundImage: theme.colors.gradient }}>
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
              <X className="h-6 w-6" 
              style={{ color: theme.colors.primary }}/>
            ) : (
              <Menu className="h-6 w-6"
              style={{ color: theme.colors.primary }} />
            )}
          </Button>
        )}

        {/* Desktop Nav Links */}
        {!isMobile && <NavDesktop user={user} />}

        {/* Mobile Nav menu */}
        {isMobile && isMenuOpen && (
          <NavMobile setIsMenuOpen={setIsMenuOpen} user={user} />
        )}
      </div>
    </header>
  );
};

// This is for the desktop nav links
export const UserAvatarLoggedIn = () => {
  const { userData } = useUserData();
  const { theme } = useTheme();

  if (!userData) return null;

  const displayName = userData?.username || "User";

  return (
    <div className="flex items-center space-x-2 ml-2">
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center shadow-sm border-2 border-indigo-200"
      >
        <Link to="/profile">
          <User className="h-5 w-5"
          style={{ color: theme.colors.primary}} />
        </Link>
      </motion.div>
      <Link to="/profile">
        <span className="text-sm font-medium text-gray-700">{displayName}</span>
      </Link>
    </div>
  );
};
