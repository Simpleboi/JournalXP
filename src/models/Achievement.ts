export interface Achievement {
  id: number;
  title: string;
  description: string;
  points: number;
  unlocked: boolean;
  category: "mindfulness" | "journaling" | "streak" | "community" | "general";
  icon: string; // This will be the name of a Lucide icon
  dateUnlocked?: string;
  requirement: string; // Description of how to unlock the achievement
  milestone: number;
}
