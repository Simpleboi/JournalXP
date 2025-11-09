import { UserServer } from "../../../shared/types/user";
import { getRankInfo } from "../../../shared/utils/rankSystem";

// Default new User Properties
export function defaultUserServer(params: {
  uid: string;
  username: string;
  joinDateISO: string;
  photoURL?: string | null;
}): UserServer {
  const initialLevel = 1;
  const rankInfo = getRankInfo(initialLevel);

  return {
    uid: params.uid,
    joinDate: params.joinDateISO,
    username: params.username,
    level: initialLevel,
    xp: 0,
    totalXP: 0,
    xpNeededToNextLevel: 100,
    streak: 0,
    rank: rankInfo.rank,
    nextRank: rankInfo.nextRank,
    profilePicture: params.photoURL ?? undefined,
    journalStats: {
      journalCount: 0,
      totalJournalEntries: 0,
      totalWordCount: 0,
      averageEntryLength: 0,
      mostUsedWords: [],
    },
    taskStats: {
      totalTasksCompleted: 0,
      currentTasksCreated: 0,
      currentTasksCompleted: 0,
      currentTasksPending: 0,
      completionRate: 0,
      priorityCompletion: { high: 0, medium: 0, low: 0 },
    },
  };
}
