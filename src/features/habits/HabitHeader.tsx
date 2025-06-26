import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export const HabitHeader = () => {
  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5 text-indigo-600" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-indigo-700">Habit Builder</h1>
        </div>
        <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1">
          Mini Quests
        </Badge>
      </div>
    </header>
  );
};
