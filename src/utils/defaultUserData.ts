import { UserData } from "@/types/user";

// This function defines the default user data structure for a new user
export const getDefaultUserData = (uid: string, email: string): UserData => ({
  uid,
  level: 1,
  streak: 0,
  points: 0,
  username: email.split("@")[0],
  rank: "Newcomer",
  nextRank: "Mindful Beginner",
  pointsToNextRank: 100,
  levelProgress: 0,
  recentAchievement: "None yet",
  joinDate: new Date().toLocaleDateString(),
  inventory: [],
  lastActivityDate: 0
});
