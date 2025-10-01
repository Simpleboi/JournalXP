import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Pet, PET_TYPES } from "@/models/Pet";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { FC } from "react";

export interface PetCreationProps {
  newPetType: "cat" | "dog" | "turtle" | "bird" | "rabbit";
  setNewPetType: React.Dispatch<
    React.SetStateAction<"cat" | "dog" | "turtle" | "bird" | "rabbit">
  >;
  newPetName: string;
  setNewPetName: React.Dispatch<React.SetStateAction<string>>;
  setPet:  React.Dispatch<React.SetStateAction<Pet>>;
  setIsCreatingPet: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PetCreationScreen: FC<PetCreationProps> = ({
  newPetType,
  setNewPetType,
  newPetName,
  setNewPetName,
  setPet,
  setIsCreatingPet
}) => {
  // function to create a new pet
  const createPet = () => {
    if (!newPetName.trim()) return;

    const newPet: Pet = {
      id: Date.now().toString(),
      name: newPetName.trim(),
      type: newPetType,
      health: 100,
      happiness: 100,
      mood: "happy",
      createdAt: new Date().toISOString(),
      lastActivityDate: new Date().toISOString(),
      isDead: false,
      trustLevel: 100,
      bondingLevel: 100,
      streakDays: 0,
      activeQuests: [],
      energyLevel: 100
    };

    setPet(newPet);
    setNewPetName("");
    setIsCreatingPet(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-purple-700 mb-2">
            Welcome to Your Virtual Pet!
          </CardTitle>
          <p className="text-gray-600">
            Choose a companion to join you on your mental wellness journey. Your
            pet's health and happiness will reflect your daily activities.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(PET_TYPES).map(([key, petType]) => (
              <motion.div
                key={key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  newPetType === key
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-purple-300"
                }`}
                onClick={() => setNewPetType(key as keyof typeof PET_TYPES)}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{petType.emoji}</div>
                  <h3 className="font-semibold text-gray-800">
                    {petType.name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {petType.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Give your pet a name:
            </label>
            <Input
              value={newPetName}
              onChange={(e) => setNewPetName(e.target.value)}
              placeholder="Enter pet name"
              className="text-center"
            />
          </div>

          <Button
            onClick={createPet}
            disabled={!newPetName.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Create My Pet!
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
