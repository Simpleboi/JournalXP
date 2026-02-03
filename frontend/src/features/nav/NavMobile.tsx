import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Home,
  CalendarCheck,
  Info,
  LogIn,
  UserPlus,
  ListChecks,
  Store,
  Trophy,
  Book,
} from "lucide-react";
import { User } from "firebase/auth";
import { FC } from "react";
import { UserAvatarLoggedIn } from "@/components/Nav";
import { useTheme } from "@/context/ThemeContext";

export interface NavMobileProps {
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
}

export const NavMobile: FC<NavMobileProps> = ({ setIsMenuOpen, user }) => {
  const { theme } = useTheme();

  return (
    <>
      {/* Slide-in drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed top-[64px] right-0 w-full h-[calc(100vh-64px)] bg-gradient-to-b from-white via-blue-50 to-purple-50 z-50 flex flex-col shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex flex-col space-y-2 p-4 overflow-y-auto flex-1">
          {/* Home Link */}
          <Link
            to="/"
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/80 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-gray-100 to-slate-100">
              <Home className="h-5 w-5" style={{ color: theme.colors.primary }} />
            </div>
            <span className="font-medium text-gray-700">Home</span>
          </Link>

          {/* Journal Link */}
          <Link
            to="/journal"
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/80 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100">
              <Book className="h-5 w-5" style={{ color: theme.colors.primary }} />
            </div>
            <span className="font-medium text-gray-700">Journal</span>
          </Link>

          {/* Daily Tasks Link */}
          <Link
            to="/tasks"
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/80 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100">
              <ListChecks className="h-5 w-5" style={{ color: theme.colors.primary }} />
            </div>
            <span className="font-medium text-gray-700">Daily Tasks</span>
          </Link>

          {/* Habit Builder Link */}
          <Link
            to="/habits"
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/80 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-violet-100">
              <CalendarCheck className="h-5 w-5" style={{ color: theme.colors.primary }} />
            </div>
            <span className="font-medium text-gray-700">Habit Builder</span>
          </Link>

          {/* Store Link */}
          <Link
            to="/store"
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/80 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100">
              <Store className="h-5 w-5" style={{ color: theme.colors.primary }} />
            </div>
            <span className="font-medium text-gray-700">Rewards Shop</span>
          </Link>

          {/* Achievements */}
          <Link
            to="/achievements"
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/80 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-100 to-amber-100">
              <Trophy className="h-5 w-5" style={{ color: theme.colors.primary }} />
            </div>
            <span className="font-medium text-gray-700">Achievements</span>
          </Link>

          {/* About Link */}
          <Link
            to="/about"
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/80 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-pink-100 to-rose-100">
              <Info className="h-5 w-5" style={{ color: theme.colors.primary }} />
            </div>
            <span className="font-medium text-gray-700">About JXP</span>
          </Link>

          <div className="border-t border-gray-200 my-3"></div>

          {user ? (
            <div className="p-2">
              <UserAvatarLoggedIn />
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <Link
                to="/login"
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/80 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="p-2 rounded-lg bg-gradient-to-br from-gray-100 to-slate-100">
                  <LogIn className="h-5 w-5" style={{ color: theme.colors.primary }} />
                </div>
                <span className="font-medium text-gray-700">Log in</span>
              </Link>
              <Link
                to="/signup"
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/80 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100">
                  <UserPlus className="h-5 w-5" style={{ color: theme.colors.primary }} />
                </div>
                <span className="font-medium text-gray-700">Sign up</span>
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};
