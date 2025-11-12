import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Home,
  CalendarCheck,
  Info,
  LogIn,
  UserPlus,
  PawPrint,
  ListChecks,
} from "lucide-react";
import { User } from "firebase/auth";
import { FC } from "react";
import { UserAvatarLoggedIn } from "@/components/Nav";

export interface NavMobileProps {
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
}

export const NavMobile: FC<NavMobileProps> = ({ setIsMenuOpen, user }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 top-[64px] w-full h-[calc(100vh-64px)] bg-gradient-to-b from-white via-blue-50 to-purple-50 z-40 flex flex-col px-4 py-6 shadow-lg"
    >
      <div className="flex flex-col space-y-6 mt-2 p-4">
        <Link
          to="/"
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-indigo-50"
          onClick={() => setIsMenuOpen(false)}
        >
          <Home className="h-5 w-5 text-indigo-600" />
          <span className="font-medium text-gray-700">Home</span>
        </Link>
        {/* <Link
          to="/pet"
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-indigo-50"
          onClick={() => setIsMenuOpen(false)}
        >
          <PawPrint className="h-5 w-5 text-indigo-600" />
          <span className="font-medium text-gray-700">Virtual Pet</span>
        </Link> */}
        <Link
          to="/tasks"
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-indigo-50"
          onClick={() => setIsMenuOpen(false)}
        >
          <ListChecks className="h-5 w-5 text-indigo-600" />
          <span className="font-medium text-gray-700">Daily Tasks</span>
        </Link>
        <Link
          to="/habits"
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-indigo-50"
          onClick={() => setIsMenuOpen(false)}
        >
          <CalendarCheck className="h-5 w-5 text-indigo-600" />
          <span className="font-medium text-gray-700">Habit Builder</span>
        </Link>
        <Link
          to="/about"
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-indigo-50"
          onClick={() => setIsMenuOpen(false)}
        >
          <Info className="h-5 w-5 text-indigo-600" />
          <span className="font-medium text-gray-700">About JXP</span>
        </Link>
        <div className="border-t border-gray-300 my-2"></div>
        {user ? (
          <UserAvatarLoggedIn />
        ) : (
          <div className="flex flex-col space-y-2 mb-2">
            <Link
              to="/login"
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-indigo-100"
              onClick={() => setIsMenuOpen(false)}
            >
              <LogIn className="h-5 w-5 text-indigo-600" />
              <span className="font-medium text-gray-700">Log in</span>
            </Link>
            <Link
              to="/signup"
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-indigo-100"
              onClick={() => setIsMenuOpen(false)}
            >
              <UserPlus className="h-5 w-5 text-indigo-600" />
              <span className="font-medium text-gray-700">Sign up</span>
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};
