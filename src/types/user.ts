export interface UserData {
  uid: string;
  username: string;
  level: number;
  points: number;
  streak: number;
  rank: string;
  nextRank: string;
  pointsToNextRank: number;
  levelProgress: number;
  recentAchievement: string;
  joinDate: string;
  inventory: string[];
  achievements: string[];
  journalCount: number;
  loginStreak: number;
  lastActivityDate: number;
  profilePicture?: string;
}
