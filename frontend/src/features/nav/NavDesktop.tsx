import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Book, CalendarCheck, ListChecks, Info, PawPrint, Trophy } from "lucide-react";
import { User } from "firebase/auth";
import { UserAvatarLoggedIn } from "@/components/Nav";
import { FC } from "react";

export interface NavDesktopProps {
  user: User;
}

export const NavDesktop: FC<NavDesktopProps> = ({ user }) => {
  return (
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
      {/* <Button
        variant="ghost"
        size="icon"
        className="relative hover:bg-indigo-50"
      >
        <Link to="/achievements">
          <Trophy className="h-5 w-5 text-indigo-600" />
        </Link>
      </Button> */}
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
          <Button
            variant="outline"
            asChild
            className="hover:bg-indigo-50 text-indigo-600 font-medium"
          >
            <Link to="/login">Log in</Link>
          </Button>
          <Button
            asChild
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
          >
            <Link to="/signup">Sign up</Link>
          </Button>
        </div>
      )}
    </div>
  );
};
