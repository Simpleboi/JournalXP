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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface NavDesktopProps {
  user: User;
}

export const NavDesktop: FC<NavDesktopProps> = ({ user }) => {
  const { theme } = useTheme();

  return (
    <TooltipProvider delayDuration={200}>
      <div className="hidden md:flex items-center space-x-4">
        {/* Journal link */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="relative hover:bg-indigo-50"
              aria-label="Journal"
            >
              <Link to="/journal">
                <Book className="h-5 w-5" style={{ color: theme.colors.primary }} />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Journal</p>
          </TooltipContent>
        </Tooltip>

        {/* Daily Task Link */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hover:bg-indigo-50"
              aria-label="Daily Tasks"
            >
              <Link to="/tasks">
                <CalendarCheck className="h-5 w-5" style={{ color: theme.colors.primary }} />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Daily Tasks</p>
          </TooltipContent>
        </Tooltip>

        {/* Habit Builder Link */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hover:bg-indigo-50"
              aria-label="Habit Builder"
            >
              <Link to="/habits">
                <ListChecks className="h-5 w-5" style={{ color: theme.colors.primary }} />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Habit Builder</p>
          </TooltipContent>
        </Tooltip>

        {/* Store Link */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hover:bg-indigo-50"
              aria-label="Rewards Shop"
            >
              <Link to="/store">
                <Store className="h-5 w-5" style={{ color: theme.colors.primary }} />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Rewards Shop</p>
          </TooltipContent>
        </Tooltip>

        {/* Achievements Link */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="relative hover:bg-indigo-50"
              aria-label="Achievements"
            >
              <Link to="/achievements">
                <Trophy className="h-5 w-5" style={{ color: theme.colors.primary }} />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Achievements</p>
          </TooltipContent>
        </Tooltip>

        {/* About Link */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hover:bg-indigo-50"
              aria-label="About JournalXP"
            >
              <Link to="/about">
                <Info className="h-5 w-5" style={{ color: theme.colors.primary }} />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>About</p>
          </TooltipContent>
        </Tooltip>

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
              style={{ background: theme.colors.gradient }}
            >
              <Link to="/signup">Sign up</Link>
            </Button>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
