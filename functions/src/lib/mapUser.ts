import type { UserClient, UserServer } from "../../../shared/types/user";

// function to return only what client side needs, no id
export function toUserClient(user: UserServer): UserClient {
  return {
    username: user.username,
    level: user.level,
    xp: user.xp,
    totalXP: user.totalXP,
    spendableXP: user.spendableXP,
    xpNeededToNextLevel: user.xpNeededToNextLevel,
    streak: user.streak,
    rank: user.rank,
    nextRank: user.nextRank,
    profilePicture: user.profilePicture,
    journalStats: user.journalStats,
    taskStats: user.taskStats,
  };
}
