export interface Achievement {
  id: number;
  title: string;
  description: string;
  points: number;
  unlocked: boolean;
  category: "mindfulness" | "journaling" | "streak" | "community" | "general";
  icon: string; 
  dateUnlocked?: string;
  requirement: string;
  requirementValue: number;
  requirementType: string;
  milestone: number;
}

