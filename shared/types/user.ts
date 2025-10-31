// User type for the client side
export interface UserClient {
  username: string;
  level: number;
  xp: number;
  totalXP: number;
  xpNeededToNextLevel: number;
  streak: number;
  rank: string;
  profilePicture?: string;
  journalStats?: {
    journalCount: number;
    totalJournalEntries: number;
    totalWordCount: number;
    averageEntryLenght: number;
    mostUsedWords: string[];
  };
  taskStats?: {
    currentTasksCreated: number;
    currentTasksCompleted: number;
    currentTasksPending: number;
    completionRate: number;
    avgCompletionTime?: number;
    priorityCompletion: {
      high: number;
      medium: number;
      low: number;
    };
  };
}

// User type for the server side
export interface UserServer {
  uid: string;
  joinDate: string;
  username: string;
  level: number;
  xp: number;
  totalXP: number;
  xpNeededToNextLevel: number;
  streak: number;
  rank: string;
  profilePicture?: string;
  journalStats?: {
    journalCount: number;
    totalJournalEntries: number;
    totalWordCount: number;
    averageEntryLenght: number;
    mostUsedWords: string[];
  };
  taskStats?: {
    currentTasksCreated: number;
    currentTasksCompleted: number;
    currentTasksPending: number;
    completionRate: number;
    avgCompletionTime?: number;
    priorityCompletion: {
      high: number;
      medium: number;
      low: number;
    };
  };
}
