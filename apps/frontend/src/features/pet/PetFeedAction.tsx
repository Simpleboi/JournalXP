import { Button } from "@/components/ui/button";
import { Pet } from "@/models/Pet";
import { Apple, Clock } from "lucide-react";
import { FC } from "react";
import { useUserData } from "@/context/UserDataContext";
import { getTimeUntilNextAction } from "./PetUtils";


export interface PetFeedActionProps {
  pet: Pet;
  lastFeedTime: string;
  setShowActionFeedback: React.Dispatch<React.SetStateAction<string>>;
  setUserPoints: React.Dispatch<React.SetStateAction<number>>;
  setLastFeedTime: React.Dispatch<React.SetStateAction<string>>;
  setPet: React.Dispatch<React.SetStateAction<Pet>>;
}

export const PetFeedAction: FC<PetFeedActionProps> = ({
  pet,
  lastFeedTime,
  setShowActionFeedback,
  setUserPoints,
  setLastFeedTime,
  setPet
}) => {
  const { userData } = useUserData();

  const feedPet = () => {
    if (!pet || pet.isDead || userData.points < 5) return;

    const now = new Date().toISOString();
    const canFeed =
      !lastFeedTime ||
      new Date().getTime() - new Date(lastFeedTime).getTime() > 30 * 60 * 1000; // 30 minutes cooldown

    if (!canFeed) {
      setShowActionFeedback(
        "Your pet isn't hungry yet! Wait a bit before feeding again."
      );
      setTimeout(() => setShowActionFeedback(null), 3000);
      return;
    }

    setUserPoints((prev) => prev - 5);
    setLastFeedTime(now);
    setPet((prevPet) => {
      if (!prevPet) return null;

      const newHealth = Math.min(100, prevPet.health + 15);
      const newHappiness = Math.min(100, prevPet.happiness + 10);

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
      "🍎 Your pet enjoyed the meal! +15 Health, +10 Happiness"
    );
    setTimeout(() => setShowActionFeedback(null), 3000);
  };

  return (
    <div className="text-center">
      <Button
        onClick={feedPet}
        disabled={
          userData.points < 5 || getTimeUntilNextAction(lastFeedTime, 30) > 0
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
  );
};
