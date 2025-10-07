import { Button } from "@/components/ui/button";
import { Droplets, Clock } from "lucide-react";
import { getTimeUntilNextAction } from "./PetUtils";
import { Pet } from "@/models/Pet";
import { FC } from "react";
import { useUserData } from "@/context/UserDataContext";

interface PetCleanActionProps {
  pet: Pet;
  lastCleanTime: string;
  setLastCleanTime: React.Dispatch<React.SetStateAction<string>>;
  setShowActionFeedback: React.Dispatch<React.SetStateAction<string>>;
  setUserPoints: React.Dispatch<React.SetStateAction<number>>;
  setPet: React.Dispatch<React.SetStateAction<Pet>>;
}

export const PetCleanAction: FC<PetCleanActionProps> = ({
  pet,
  lastCleanTime,
  setLastCleanTime,
  setShowActionFeedback,
  setUserPoints,
  setPet,
}) => {
  const { userData } = useUserData();

  const cleanPet = () => {
    if (!pet || pet.isDead || userData.points < 3) return;

    const now = new Date().toISOString();
    const canClean =
      !lastCleanTime ||
      new Date().getTime() - new Date(lastCleanTime).getTime() > 60 * 60 * 1000; // 1 hour cooldown

    if (!canClean) {
      setShowActionFeedback("Your pet is already clean and fresh!");
      setTimeout(() => setShowActionFeedback(null), 3000);
      return;
    }

    setUserPoints((prev) => prev - 3);
    setLastCleanTime(now);
    setPet((prevPet) => {
      if (!prevPet) return null;

      const newHealth = Math.min(100, prevPet.health + 10);
      const newHappiness = Math.min(100, prevPet.happiness + 8);

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
      "🛁 Your pet feels fresh and clean! +10 Health, +8 Happiness"
    );
    setTimeout(() => setShowActionFeedback(null), 3000);
  };

  return (
    <div className="text-center">
      <Button
        onClick={cleanPet}
        disabled={
          userData.points < 3 || getTimeUntilNextAction(lastCleanTime, 60) > 0
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
  );
};
