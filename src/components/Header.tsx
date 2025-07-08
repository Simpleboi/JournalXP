import { Button } from "./ui/button";
import { ArrowLeft, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { FC } from "react";

interface HeaderProps {
  title: string;
  icon?: LucideIcon;
}

export const Header: FC<HeaderProps> = ({ title, icon: Icon }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="mr-2 hover:bg-indigo-50"
        >
          <Link to="/">
            <ArrowLeft className="h-5 w-5 text-indigo-600" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center">
          {Icon && <Icon className="h-5 w-5 mr-2 text-indigo-600" />}
          {title}
        </h1>
      </div>
    </header>
  );
};
