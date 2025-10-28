// functions/src/triggers/userView.ts
import * as firestore from "firebase-functions/v2/firestore";
import { db } from "../utils/admin.js";

export const onUserProfileWrite = firestore.onDocumentWritten(
  { region: "us-central1", document: "users/{uid}" },
  async (event) => {
    await buildUserView(event.params.uid);
  }
);

export const onUserMetaWrite = firestore.onDocumentWritten(
  { region: "us-central1", document: "usersMeta/{uid}" },
  async (event) => {
    await buildUserView(event.params.uid);
  }
);

// shared builder
export async function buildUserView(uid: string) {
  const [userSnap, metaSnap] = await Promise.all([
    db.collection("users").doc(uid).get(),
    db.collection("usersMeta").doc(uid).get(),
  ]);

  if (!userSnap.exists || !metaSnap.exists) return;

  const user = userSnap.data() ?? {};
  const meta = metaSnap.data() ?? {};

  // compute derived fields server-side so the client is dumb
  const xpNeededToNextLevel = computeXpNeeded(meta.level ?? 1, meta.xp ?? 0);
  const viewDoc = {
    uid,
    username: user.username ?? "",
    level: meta.level ?? 1,
    xp: meta.xp ?? 0,
    totalXP: meta.totalXP ?? meta.xp ?? 0,
    xpNeededToNextLevel,
    streak: meta.streak ?? 0,
    rank: meta.rank ?? "Bronze III",
    journalCount: meta.journalCount ?? 0,
    totalJournalEntries: meta.totalJournalEntries ?? 0,
    totalTasksCreated: meta.totalTasksCreated ?? 0,
    totalTasksCompleted: meta.totalTasksCompleted ?? 0,
    recentAchievement: meta.recentAchievement ?? "None yet",
    joinDate: user.joinDate ?? new Date().toISOString(),
    achievements: meta.achievements ?? {},
    lastJournalEntryDate: meta.lastJournalEntryDate ?? "",
    profilePicture: user.profilePicture ?? user.photoURL ?? "",
    moodHistory: meta.moodHistory ?? [],
    journalStats: meta.journalStats ?? {
      totalWordCount: 0,
      averageEntryLength: 0,
      mostUsedWords: [],
    },
    taskStats: meta.taskStats ?? {
      currentTasksCreated: meta.totalTasksCreated ?? 0,
      currentTasksCompleted: meta.totalTasksCompleted ?? 0,
      currentTasksPending: Math.max(
        0,
        (meta.totalTasksCreated ?? 0) - (meta.totalTasksCompleted ?? 0)
      ),
      completionRate: calcRate(
        meta.totalTasksCompleted ?? 0,
        meta.totalTasksCreated ?? 0
      ),
      avgCompletionTime: meta.taskStats?.avgCompletionTime ?? 0,
      priorityCompletion: meta.taskStats?.priorityCompletion ?? {
        high: 0,
        medium: 0,
        low: 0,
      },
    },
    habitStats: meta.habitStats ?? {
      totalHabits: 0,
      completedHabits: 0,
      currentHabitStreak: 0,
      missedDays: 0,
    },
    xpHistory: meta.xpHistory ?? [],
    petStatus: meta.petStatus ?? { happiness: 0, health: 0, cleanliness: 0 },
    reflectionTrends: meta.reflectionTrends ?? {
      peakMoodTime: "",
      consistentJournalDays: [],
      emotionalThemes: [],
    },
    pointsHistory: meta.pointsHistory ?? [],
  };

  await db.collection("usersView").doc(uid).set(viewDoc, { merge: false });
}

function computeXpNeeded(level: number, xp: number) {
  // put your real curve here; placeholder:
  const threshold = 100 + Math.floor((level - 1) * 25);
  return Math.max(0, threshold - (xp % threshold));
}

function calcRate(done: number, total: number) {
  return total > 0 ? Math.round((done / total) * 100) : 0;
}
