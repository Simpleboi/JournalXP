import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, Plus } from "lucide-react";

export const CommunityNav = () => {
  return (
    <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Community Reflections
              </h1>
              <p className="text-sm text-gray-600">
                A place for anonymous positive thoughts ❤️
              </p>
            </div>
          </div>
          <Button
            className="bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600"
            asChild
          >
            <Link to="/reflections/new">
              <Plus className="h-4 w-4 mr-2" />
              Share
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
