export interface EmotionalState {
  id: string;
  title: string;
  emoji: string;
  description: string;
  color: string;
  techniques: string[];
  journalPrompts: string[];
  meditation: string;
  grounding: string[];
}

export interface Quote {
  text: string;
  author: string;
}

export interface VisualizationExercise {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: any;
  script: string[];
  color: string;
}

export interface MindfulnessChallenge {
  id: string;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
}

export interface MoodState {
  id: string;
  name: string;
  emoji: string;
  gradient: string;
  quote: string;
  breathingPattern: {
    inhale: number;
    hold: number;
    exhale: number;
    holdAfter: number;
  };
  journalPrompt: string;
  ambientColor: string;
}