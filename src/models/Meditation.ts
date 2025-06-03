export interface ExternalResources {
    title: string;
    link: string;
}

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
  externalResources: ExternalResources[];
}

export interface Quote {
  text: string;
  author: string;
}
