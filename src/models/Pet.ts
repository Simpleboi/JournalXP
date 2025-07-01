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
  bondingLevel: number;
  streakDays: number;
  currentEmotion?: "happy" | "anxious" | "tired" | "calm" | "sad" | "nuetral";
  trustLevel: number;
  energyLevel: number;
  activeQuests: PetQuest[];
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

export interface PetQuest {
  id: string;
  title: string;
  description: string;
  type: "journal" | "habit" | "task" | "streak";
  target: number; // target count
  current: number; // current progress
  reward: {
    type: "accessory" | "dance" | "toy" | "points";
    value: string | number;
  };
  isCompleted: boolean;
  dateCreated: string;
}

export const AVAILABLE_QUESTS: Omit<
  PetQuest,
  "id" | "current" | "isCompleted" | "dateCreated"
>[] = [
  {
    title: "Journal Explorer",
    description: "Write in your journal 3 days in a row",
    type: "journal",
    target: 3,
    reward: { type: "toy", value: "🧸" },
  },
  {
    title: "Habit Master",
    description: "Complete 2 different habits",
    type: "habit",
    target: 2,
    reward: { type: "dance", value: "happy_dance" },
  },
  {
    title: "Task Champion",
    description: "Complete 5 daily tasks",
    type: "task",
    target: 5,
    reward: { type: "accessory", value: "🏆" },
  },
  {
    title: "Streak Warrior",
    description: "Maintain a 10-day wellness streak",
    type: "streak",
    target: 10,
    reward: { type: "points", value: 100 },
  },
  {
    title: "Mindful Writer",
    description: "Journal 5 times this week",
    type: "journal",
    target: 5,
    reward: { type: "toy", value: "📚" },
  },
  {
    title: "Wellness Guru",
    description: "Complete 3 habits in one day",
    type: "habit",
    target: 3,
    reward: { type: "dance", value: "celebration_dance" },
  },
];
