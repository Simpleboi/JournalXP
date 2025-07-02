export interface UserData {
  uid: string;
  username: string;
  level: number;
  points: number;
  streak: number;
  rank: string;
  journalCount: number;
  recentAchievement: string;
  joinDate: string;
  achievements: string[];
  lastActivityDate: number;
  profilePicture?: string;
}
