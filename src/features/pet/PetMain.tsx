import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Pet, PET_TYPES } from "@/models/Pet";
import {
  Heart,
  Sparkles,
  RotateCcw,
  Apple,
  Clock,
  Gamepad2,
  Droplets,
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
} from "./PetUtils";
import { useUserData } from "@/context/UserDataContext";
import { getTimeUntilNextAction } from "./PetUtils";

export interface PetStatusProps {
  pet: Pet;
  lastFeedTime: string;
  lastCleanTime: string;
}

export const PetStatus: FC<PetStatusProps> = ({
  pet,
  lastFeedTime,
  lastCleanTime,
}) => {
  const { userData } = useUserData();

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
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-700 text-lg">
            {getMoodDescription(pet.mood)}
          </p>

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
              {userData.pointsToNextRank < REVIVE_COST && (
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
                <div className="text-center">
                  <Button
                    onClick={feedPet}
                    disabled={
                      userData.points < 5 ||
                      getTimeUntilNextAction(lastFeedTime, 30) > 0
                    }
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 mb-2"
                  >
                    <Apple className="h-5 w-5 mr-2" />
                    Feed Pet (5 XP)
                  </Button>
                  {getTimeUntilNextAction(lastFeedTime, 30) > 0 && (
                    <p className="text-xs text-gray-500">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {getTimeUntilNextAction(lastFeedTime, 30)}m left
                    </p>
                  )}
                </div>

                {/* Play with Pet */}
                <div className="text-center">
                  <Button
                    onClick={playWithPet}
                    disabled={
                      userData.points < 10 ||
                      getTimeUntilNextAction(lastPlayTime, 45) > 0
                    }
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 mb-2"
                  >
                    <Gamepad2 className="h-5 w-5 mr-2" />
                    Play (10 XP)
                  </Button>
                  {getTimeUntilNextAction(lastPlayTime, 45) > 0 && (
                    <p className="text-xs text-gray-500">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {getTimeUntilNextAction(lastPlayTime, 45)}m left
                    </p>
                  )}
                </div>

                {/* Clean Pet */}
                <div className="text-center">
                  <Button
                    onClick={cleanPet}
                    disabled={
                      userData.points < 3 ||
                      getTimeUntilNextAction(lastCleanTime, 60) > 0
                    }
                    className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 mb-2"
                  >
                    <Droplets className="h-5 w-5 mr-2" />
                    Clean (3 XP)
                  </Button>
                  {getTimeUntilNextAction(lastCleanTime, 60) > 0 && (
                    <p className="text-xs text-gray-500">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {getTimeUntilNextAction(lastCleanTime, 60)}m left
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
