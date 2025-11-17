import { UserClient } from "@shared/types/user";

// This function defines the default user data structure for a new user
// Note: This is legacy - the backend now creates users via POST /api/session/init
export const getDefaultUserData = (uid: string, email: string): Partial<UserClient> => ({
  level: 1,
  streak: 0,
  xp: 0,
  totalXP: 0,
  xpNeededToNextLevel: 0,
  username: email.split("@")[0],
  rank: "Bronze III",
  joinDate: new Date().toISOString(),
});
