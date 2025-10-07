import { Pet, PET_TYPES } from "@/models/Pet";

// a function that returns the health badge
export const getHealthColor = (health: number) => {
  if (health >= 70) return "bg-green-500";
  if (health >= 40) return "bg-yellow-500";
  return "bg-red-500";
};

// a function that returns the color of the badge for the pet
export const getHappinessColor = (happiness: number) => {
  if (happiness >= 70) return "bg-pink-500";
  if (happiness >= 40) return "bg-orange-500";
  return "bg-gray-500";
};

// returns an emoji that's displayed on the homepage
export const getPetEmoji = (pet: Pet) => {
  if (pet.isDead) return "💀";

  const baseEmoji = PET_TYPES[pet.type].emoji;

  switch (pet.mood) {
    case "happy":
      return baseEmoji;
    case "neutral":
      return baseEmoji;
    case "sad":
      return baseEmoji;
    case "dead":
      return "💀";
    default:
      return baseEmoji;
  }
};

// returns a descripion based on the mood of the pet
export const getMoodDescription = (mood: Pet["mood"]) => {
  switch (mood) {
    case "happy":
      return "Your pet is thriving and full of joy!";
    case "neutral":
      return "Your pet is doing okay but could use some attention.";
    case "sad":
      return "Your pet is feeling down and needs care.";
    case "dead":
      return "Your pet has passed away. Revive them to continue your journey together.";
    default:
      return "";
  }
};

// returns the time between an action (1hr - 30mins for example)
export const getTimeUntilNextAction = (
  lastActionTime: string | null,
  cooldownMinutes: number
) => {
  if (!lastActionTime) return 0;

  const timeSince = new Date().getTime() - new Date(lastActionTime).getTime();
  const cooldownMs = cooldownMinutes * 60 * 1000;
  const timeLeft = cooldownMs - timeSince;

  return Math.max(0, Math.ceil(timeLeft / (60 * 1000))); // Return minutes left
};

// a function that returns the color of trust for the pet
export const getTrustColor = (trust: number) => {
  if (trust >= 80) return "bg-purple-500";
  if (trust >= 50) return "bg-blue-500";
  if (trust >= 20) return "bg-yellow-500";
  return "bg-red-500";
};

// a function that returns the energy of the pet
export const getEnergyColor = (energy: number) => {
  if (energy >= 70) return "bg-green-500";
  if (energy >= 40) return "bg-yellow-500";
  return "bg-orange-500";
};


// a function that returns the XP color for the pet
export const getXPColor = (xp: number) => {
  return "bg-gradient-to-r from-yellow-400 to-orange-500";
};
