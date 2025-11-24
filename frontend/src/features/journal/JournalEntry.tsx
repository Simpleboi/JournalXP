export interface JournalEntry {
  id: string;
  type: string;
  content: string;
  mood: string;
  date: string;
  createdAt?: string;
  isFavorite: boolean;
  wordCount: number;
  tags?: string[];
  linkedEntryIds?: string[];
  timeSpentWriting?: number; // in seconds
}

export interface JournalInterfaceProps {
  onSubmit?: (entry: { type: string; content: string; mood: string }) => void;
  prompts?: {
    freeWriting: string[];
    guided: string[];
    gratitude: string[];
  };
}

export interface JournalProps extends JournalInterfaceProps {
  entries: JournalEntry[];
  setEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
}
