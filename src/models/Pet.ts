export interface Pet {
  id: string;
  name: string;
  type: "cat" | "dog" | "turtle" | "bird" | "rabbit";
  health: number; // 0-100
  happiness: number; // 0-100
  mood: "happy" | "neutral" | "sad" | "dead";
  createdAt: string;
  lastActivityDate?: string;
  isDead: boolean;
}

export interface PetActivity {
  id: string;
  petId: string;
  activityType: "journal" | "task" | "habit";
  date: string;
  healthChange: number;
  happinessChange: number;
}

export const PET_TYPES = {
  cat: {
    name: "Cat",
    emoji: "🐱",
    description: "A curious and independent companion",
  },
  dog: {
    name: "Dog",
    emoji: "🐶",
    description: "A loyal and energetic friend",
  },
  turtle: {
    name: "Turtle",
    emoji: "🐢",
    description: "A wise and patient guide",
  },
  bird: {
    name: "Bird",
    emoji: "🐦",
    description: "A cheerful and free-spirited buddy",
  },
  rabbit: {
    name: "Rabbit",
    emoji: "🐰",
    description: "A gentle and caring companion",
  },
};

export const REVIVE_COST = 100;
