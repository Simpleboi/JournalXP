import { Button } from "@/components/ui/button";
import { Gamepad2, Clock } from "lucide-react";
import { getTimeUntilNextAction } from "./PetUtils";
import { FC } from "react";
import { Pet } from "@/models/Pet";
import { useUserData } from "@/context/UserDataContext";

interface PetPlayActionProps {
  lastPlayTime: string;
  pet: Pet;
  setShowActionFeedback: React.Dispatch<React.SetStateAction<string>>;
  setUserPoints: React.Dispatch<React.SetStateAction<number>>;
  setPet: React.Dispatch<React.SetStateAction<Pet>>;
  setLastPlayTime: React.Dispatch<React.SetStateAction<string>>;
}

export const PetPlayAction: FC<PetPlayActionProps> = ({
  lastPlayTime,
  pet,
  setShowActionFeedback,
  setUserPoints,
  setLastPlayTime,
  setPet
}) => {
  const { userData } = useUserData();

  const playWithPet = () => {
    if (!pet || pet.isDead || userData.points < 10) return;

    const now = new Date().toISOString();
    const canPlay =
      !lastPlayTime ||
      new Date().getTime() - new Date(lastPlayTime).getTime() > 45 * 60 * 1000; // 45 minutes cooldown

    if (!canPlay) {
      setShowActionFeedback(
        "Your pet is tired from playing! Let them rest a bit."
      );
      setTimeout(() => setShowActionFeedback(null), 3000);
      return;
    }

    setUserPoints((prev) => prev - 10);
    setLastPlayTime(now);
    setPet((prevPet) => {
      if (!prevPet) return null;

      const newHappiness = Math.min(100, prevPet.happiness + 20);
      const newHealth = Math.min(100, prevPet.health + 5);

      return {
        ...prevPet,
        health: newHealth,
        happiness: newHappiness,
        mood:
          newHealth >= 70 && newHappiness >= 70
            ? "happy"
            : newHealth >= 40 && newHappiness >= 40
            ? "neutral"
            : "sad",
        lastActivityDate: now,
      };
    });

    setShowActionFeedback(
      "🎮 Your pet had so much fun playing! +20 Happiness, +5 Health"
    );
    setTimeout(() => setShowActionFeedback(null), 3000);
  };

  return (
    <div className="text-center">
      <Button
        onClick={playWithPet}
        disabled={
          userData.points < 10 || getTimeUntilNextAction(lastPlayTime, 45) > 0
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
  );
};
