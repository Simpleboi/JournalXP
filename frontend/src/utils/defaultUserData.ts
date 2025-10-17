import { UserData } from "@/types/user";

// This function defines the default user data structure for a new user
export const getDefaultUserData = (uid: string, email: string): UserData => ({
  uid,
  level: 1,
  streak: 0,
  points: 0,
  journalCount: 0,
  totalPoints: 0,
  totalJournalEntries: 0,
  totalTasksCreated: 0,
  totalTasksCompleted: 0,
  username: email.split("@")[0],
  rank: "Bronze III",
  recentAchievement: "None yet",
  joinDate: new Date().toLocaleDateString(),
  lastJournalEntryDate: "",
});
