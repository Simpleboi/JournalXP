import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useUserData } from "@/context/UserDataContext";

export const PetNav = () => {
    const { userData } = useUserData();
  
    return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5 text-purple-600" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-purple-700">Virtual Pet</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1">
            {userData.points !== 0 ? "0" : userData.points} XP
          </Badge>
        </div>
      </div>
    </header>
  );
};
