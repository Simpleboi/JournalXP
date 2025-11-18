import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Book,
  CalendarCheck,
  ListChecks,
  Info,
  PawPrint,
  Trophy,
  Store,
} from "lucide-react";
import { User } from "firebase/auth";
import { UserAvatarLoggedIn } from "@/components/Nav";
import { FC } from "react";
import { useTheme } from "@/context/ThemeContext";

export interface NavDesktopProps {
  user: User;
}

export const NavDesktop: FC<NavDesktopProps> = ({ user }) => {
  const { theme } = useTheme();

  return (
    <div className="hidden md:flex items-center space-x-4">
      {/* Journal link */}
      <Button
        variant="ghost"
        size="icon"
        className="relative hover:bg-indigo-50"
      >
        <Link to="/journal">
          <Book className="h-5 w-5" 
          style={{ color: theme.colors.primary }}/>
        </Link>
      </Button>

      {/* Daily Task Link */}
      <Button
        variant="ghost"
        size="icon"
        asChild
        className="hover:bg-indigo-50"
      >
        <Link to="/tasks">
          <CalendarCheck className="h-5 w-5" 
          style={{ color: theme.colors.primary }}/>
        </Link>
      </Button>

      {/* Habit Builder Link */}
      <Button
        variant="ghost"
        size="icon"
        asChild
        className="hover:bg-indigo-50"
      >
        <Link to="/habits">
          <ListChecks className="h-5 w-5" 
          style={{ color: theme.colors.primary }}/>
        </Link>
      </Button>

      {/* Store Link */}
      <Button
        variant="ghost"
        size="icon"
        asChild
        className="hover:bg-indigo-50"
      >
        <Link to="/store">
          <Store className="h-5 w-5" 
          style={{ color: theme.colors.primary }}/>
        </Link>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="relative hover:bg-indigo-50"
      >
        <Link to="/achievements">
          <Trophy className="h-5 w-5"
          style={{ color: theme.colors.primary }} />
        </Link>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        asChild
        className="hover:bg-indigo-50"
      >
        <Link to="/about">
          <Info className="h-5 w-5" 
          style={{ color: theme.colors.primary }}/>
        </Link>
      </Button>
      {/* <Button
              variant="ghost"
              size="icon"
              asChild
              className="hover:bg-indigo-50"
            >
              <Link to="/settings">
                <Settings className="h-5 w-5" />
              </Link>
            </Button> */}
      {user ? (
        <UserAvatarLoggedIn />
      ) : (
        <div className="flex items-center space-x-2 mr-4">
          <Button
            variant="outline"
            asChild
            className="hover:bg-indigo-50 font-medium"
          >
            <Link to="/login">Log in</Link>
          </Button>
          <Button
            asChild
            className="bg-gradient-to-r text-white"
            style={{ background: theme.colors.gradient
             }}
          >
            <Link to="/signup">Sign up</Link>
          </Button>
        </div>
      )}
    </div>
  );
};
