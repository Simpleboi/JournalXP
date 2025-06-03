
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
