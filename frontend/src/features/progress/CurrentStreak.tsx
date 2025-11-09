import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { useUserData } from "@/context/UserDataContext";

// This is the Streak card on the Home page under the welcome banner.
export const ProgressCurrentStreak = () => {
  const { userData } = useUserData();

  // Conditional Check for the user
  if (!userData) return null;

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-none shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-gray-700">Current Streak</h3>
          <Flame className="h-5 w-5 text-orange-500" />
        </div>
        <div className="flex items-center gap-2">
          <motion.p
            className="text-3xl font-bold text-orange-600"
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {userData.streak}
          </motion.p>
          <span className="text-lg text-gray-600">{userData.streak === 1 ? "day" : "days"}</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {getStreakMessage(userData.streak)}
        </p>
      </CardContent>
    </Card>
  );
};

// Helper function to get a streak
export function getStreakMessage(streak: number): string {
  switch (streak) {
    case 0:
      return "Check back in after a day, Let's build up a streak💪";
    case 1:
      return "🔥 Keep going!";
    case 2:
      return "🔥 2 days! Good Job!"
    case 7:
      return "🎉 One week strong!";
    case 10:
      return "💪 Double digits! You're crushing it!";
    case 30:
      return "🏆 30 days of commitment. Legend!";
    default:
      return `🔥 You're on a ${streak}-day streak! Keep it up!`;
  }
}
