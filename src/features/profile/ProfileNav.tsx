import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Settings } from "lucide-react";

// Nav bar for the Profile Page
export const ProfilePageNav = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            My Profile
          </h1>
        </div>
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
      </div>
    </header>
  );
};
