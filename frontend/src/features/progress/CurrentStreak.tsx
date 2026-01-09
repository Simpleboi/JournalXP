import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Flame, Clock } from "lucide-react";
import { useUserData } from "@/context/UserDataContext";
import { useState, useEffect } from "react";

// This is the Streak card on the Home page under the welcome banner.
export const ProgressCurrentStreak = () => {
  const { userData } = useUserData();
  const [streakTimerMessage, setStreakTimerMessage] = useState<string>("");

  useEffect(() => {
    const updateStreakTimer = () => {
      if (!userData?.lastJournalEntryDate) {
        // No entry yet ever - they can write anytime to start a streak
        setStreakTimerMessage("");
        return;
      }

      const lastEntryDate = new Date(userData.lastJournalEntryDate);
      const now = new Date();

      // Normalize dates to start of day for comparison
      const lastEntryDay = new Date(lastEntryDate);
      lastEntryDay.setHours(0, 0, 0, 0);

      const today = new Date(now);
      today.setHours(0, 0, 0, 0);

      // Calculate difference in days
      const diffMs = today.getTime() - lastEntryDay.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Entry already made today
        setStreakTimerMessage("Come back tomorrow to continue your streak! 🎉");
      } else if (diffDays === 1) {
        // Last entry was yesterday - they need to write today to continue streak
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);

        const timeLeft = endOfDay.getTime() - now.getTime();
        const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutesLeft = Math.floor(
          (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
        );

        if (hoursLeft > 3) {
          setStreakTimerMessage(
            `Write an entry today to continue your ${userData.streak}-day streak!`
          );
        } else if (hoursLeft > 0) {
          setStreakTimerMessage(
            `⚠️ Write an entry in the next ${hoursLeft}h ${minutesLeft}m or your streak resets!`
          );
        } else {
          setStreakTimerMessage(
            `⚠️ Write an entry in the next ${minutesLeft}m or your streak resets!`
          );
        }
      } else {
        // More than 1 day gap - streak already broken
        setStreakTimerMessage(
          "Your streak has expired. Write an entry to start a new streak!"
        );
      }
    };

    updateStreakTimer();
    // Update every minute
    const interval = setInterval(updateStreakTimer, 60000);

    return () => clearInterval(interval);
  }, [userData?.lastJournalEntryDate, userData?.streak]);

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
          <span className="text-lg text-gray-600">
            {userData.streak === 1 ? "day" : "days"}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {getStreakMessage(userData.streak)}
        </p>
        {streakTimerMessage && (
          <div className="mt-3 pt-3 border-t border-orange-200">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-600 leading-relaxed">
                {streakTimerMessage}
              </p>
            </div>
          </div>
        )}
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
      return "🔥 2 days! Good Job!";
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
