# This for testing purposes only

```ts
// functions/src/lib/defaults.ts
import type { UserServer } from "../../shared/types";

export function defaultUserServer(params: {
  uid: string;
  username: string;
  joinDateISO: string; // new Date().toISOString()
  photoURL?: string | null;
}): UserServer {
  return {
    uid: params.uid,
    joinDate: params.joinDateISO,
    username: params.username,               // pick displayName or "New User"
    level: 1,
    xp: 0,
    totalXP: 0,
    xpNeededToNextLevel: 100,                // simple curve for MVP
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

```
