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
  introMessage: string;
  techniques: string[];
  grounding: string[];
  bodyAwareness: string[];
  journalPrompts: string[];
  meditation: string;
  externalResources: ExternalResources[];
}

export interface Quote {
  text: string;
  author: string;
}
