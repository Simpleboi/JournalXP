import { UserServer } from "@shared/types/user";

// Default new User Properties
export function defaultUserServer(params: {
  uid: string;
  username: string;
  joinDateISO: string;
  photoURL?: string | null;
}): UserServer {
  return {
    uid: params.uid,
    joinDate: params.joinDateISO,
    username: params.username,
    level: 1,
    xp: 0,
    totalXP: 0,
    xpNeededToNextLevel: 100,
    streak: 0,
    rank: "Novice",
    profilePicture: params.photoURL ?? undefined,
    journalStats: {
      journalCount: 0,
      totalJournalEntries: 0,
      totalWordCount: 0,
      averageEntryLength: 0,
      mostUsedWords: [],
    },
    taskStats: {
      currentTasksCreated: 0,
      currentTasksCompleted: 0,
      currentTasksPending: 0,
      completionRate: 0,
      priorityCompletion: { high: 0, medium: 0, low: 0 },
    },
  };
}
