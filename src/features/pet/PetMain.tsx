import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Pet, PET_TYPES } from "@/models/Pet";
import {
  Heart,
  Sparkles,
  RotateCcw,
  Star,
  AlertTriangle,
  Zap,
  Flame
} from "lucide-react";
import { REVIVE_COST } from "@/models/Pet";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { FC } from "react";
import { getPetEmoji } from "./PetUtils";
import {
  getHealthColor,
  getHappinessColor,
  getMoodDescription,
  getTrustColor,
  getEnergyColor,
} from "./PetUtils";
import { useUserData } from "@/context/UserDataContext";
import { getTimeUntilNextAction } from "./PetUtils";
import { PetFeedAction } from "./PetFeedAction";
import { PetPlayAction } from "./PetPlayAction";
import { PetCleanAction } from "./PetCleanAction";

export interface PetStatusProps {
  pet: Pet;
  setPet: React.Dispatch<React.SetStateAction<Pet>>;
  lastFeedTime: string;
  setLastFeedTime: React.Dispatch<React.SetStateAction<string>>;
  lastCleanTime: string;
  setLastCleanTime: React.Dispatch<React.SetStateAction<string>>;
  lastPlayTime: string;
  setLastPlayTime: React.Dispatch<React.SetStateAction<string>>;
  setUserPoints: React.Dispatch<React.SetStateAction<number>>;
  showActionFeedback: string;
  setShowActionFeedback: React.Dispatch<React.SetStateAction<string>>;
}

export const PetStatus: FC<PetStatusProps> = ({
  pet,
  lastFeedTime,
  lastCleanTime,
  lastPlayTime,
  setUserPoints,
  setPet,
  setLastFeedTime,
  setShowActionFeedback,
  showActionFeedback,
  setLastCleanTime,
  setLastPlayTime,
}) => {
  const { userData } = useUserData();

  const revivePet = () => {
    if (!pet || userData.points < REVIVE_COST) return;

    setUserPoints((prev) => prev - REVIVE_COST);
    setPet((prevPet) => {
      if (!prevPet) return null;

      return {
        ...prevPet,
        health: 50,
        happiness: 50,
        mood: "neutral",
        isDead: false,
        lastActivityDate: new Date().toISOString(),
      };
    });
  };

  return (
    <Card className="bg-white shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <motion.div
              className="text-8xl mb-4"
              animate={{
                scale: pet.isDead ? 1 : [1, 1.1, 1],
                rotate: pet.isDead ? 0 : [0, -5, 5, 0],
              }}
              transition={{
                duration: pet.isDead ? 0 : 2,
                repeat: pet.isDead ? 0 : Infinity,
                repeatDelay: 3,
              }}
            >
              {getPetEmoji(pet)}
            </motion.div>
            <h2 className="text-3xl font-bold text-purple-700 mb-2">
              {pet.name}
            </h2>
            <Badge className="bg-purple-100 text-purple-700 px-3 py-1">
              {PET_TYPES[pet.type].name}
            </Badge>
            <Badge className="bg-gradient-to-r from-red-100 to-pink-100 text-red-700 px-3 py-1 ml-2">
              <Flame className="h-3 w-3 mr-1" />
              0 day streak
            </Badge>
          </div>

          <div className="space-y-4 w-full md:w-1/2">
            {/* Health Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Heart className="h-5 w-5 text-red-500 mr-2" />
                  <span className="font-medium text-gray-700">Health</span>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {pet.health}/100
                </span>
              </div>
              <Progress
                value={pet.health}
                className={`h-3 ${getHealthColor(pet.health)}`}
              />
            </div>

            {/* Happiness Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Sparkles className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="font-medium text-gray-700">Happiness</span>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {pet.happiness}/100
                </span>
              </div>
              <Progress
                value={pet.happiness}
                className={`h-3 ${getHappinessColor(pet.happiness)}`}
              />
            </div>

            {/* Trust Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Heart className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="font-medium text-gray-700">Trust Bond</span>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {pet.trustLevel || 50}/100
                </span>
              </div>
              <Progress
                value={pet.trustLevel || 50}
                className={`h-3 ${getTrustColor(pet.trustLevel || 50)}`}
              />
              {(pet.trustLevel || 50) >= 100 && (
                <div className="flex items-center text-xs text-purple-600">
                  <Star className="h-3 w-3 mr-1" />
                  Maximum trust achieved!
                </div>
              )}
            </div>

            {/* Energy Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-green-500 mr-2" />
                  <span className="font-medium text-gray-700">Energy</span>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {pet.energyLevel || 100}/100
                </span>
              </div>
              <Progress
                value={pet.energyLevel || 100}
                className={`h-3 ${getEnergyColor(pet.energyLevel || 100)}`}
              />
              {(pet.energyLevel || 100) < 30 && (
                <div className="flex items-center text-xs text-orange-600">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Low energy - pet needs rest!
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-700 text-lg">
            {getMoodDescription(pet.mood)}
          </p>
          <div className="mt-3 flex items-center justify-center space-x-2">
            <span className="text-sm text-gray-600">Current mood:</span>
            <Badge className="bg-blue-100 text-blue-700">Happy</Badge>
          </div>

          {pet.isDead ? (
            <div className="mt-4">
              <Button
                onClick={revivePet}
                disabled={userData.points < REVIVE_COST}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Revive Pet ({REVIVE_COST} XP)
              </Button>
              {userData.points < REVIVE_COST && (
                <p className="text-red-600 text-sm mt-2">
                  You need {REVIVE_COST - userData.points} more XP to revive
                  your pet
                </p>
              )}
            </div>
          ) : (
            <div className="mt-6">
              {/* Action Feedback */}
              {showActionFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded-lg mb-4 text-center"
                >
                  {showActionFeedback}
                </motion.div>
              )}

              {/* Pet Care Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Feed Pet */}
                <PetFeedAction
                  pet={pet}
                  lastFeedTime={lastFeedTime}
                  setUserPoints={setUserPoints}
                  setLastFeedTime={setLastFeedTime}
                  setShowActionFeedback={setShowActionFeedback}
                  setPet={setPet}
                />

                {/* Play with Pet */}
                <PetPlayAction
                  pet={pet}
                  setPet={setPet}
                  lastPlayTime={lastPlayTime}
                  setLastPlayTime={setLastPlayTime}
                  setShowActionFeedback={setShowActionFeedback}
                  setUserPoints={setUserPoints}
                />

                {/* Clean Pet */}
                <PetCleanAction
                  pet={pet}
                  setPet={setPet}
                  lastCleanTime={lastCleanTime}
                  setLastCleanTime={setLastCleanTime}
                  setShowActionFeedback={setShowActionFeedback}
                  setUserPoints={setUserPoints}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
