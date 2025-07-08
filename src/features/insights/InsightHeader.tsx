import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const InsightsHeader = () => {
  return (
    <header className="bg-white/90 backdrop-blur-sm shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link to="/">
            <ChevronLeft className="h-5 w-5 text-indigo-600" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Insights & Analytics
        </h1>
      </div>
    </header>
  );
};
