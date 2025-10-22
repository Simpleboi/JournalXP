import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useUserData } from "@/context/UserDataContext";
import { Pet } from "@/models/Pet";
import { FC } from "react";

interface PetNavProps {
  pet: Pet;
  setShowDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PetNav: FC<PetNavProps> = ({
  pet,
  setShowDeleteConfirm,
}) => {
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
            {userData && userData.xp} XP
          </Badge>
          {pet && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete Pet
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
