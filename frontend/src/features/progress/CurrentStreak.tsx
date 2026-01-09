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
        // No entry yet, they need to write one
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);

        const hoursLeft = Math.floor(
          (midnight.getTime() - now.getTime()) / (1000 * 60 * 60)
        );
        const minutesLeft = Math.floor(
          ((midnight.getTime() - now.getTime()) % (1000 * 60 * 60)) /
            (1000 * 60)
        );

        if (hoursLeft > 0) {
          setStreakTimerMessage(
            `Write an entry in the next ${hoursLeft}h ${minutesLeft}m to maintain your streak`
          );
        } else {
          setStreakTimerMessage(
            `Write an entry in the next ${minutesLeft}m to maintain your streak`
          );
        }
        return;
      }

      const lastEntryDate = new Date(userData.lastJournalEntryDate);
      const now = new Date();

      // Check if entry was made today
      const isToday =
        lastEntryDate.getFullYear() === now.getFullYear() &&
        lastEntryDate.getMonth() === now.getMonth() &&
        lastEntryDate.getDate() === now.getDate();

      if (isToday) {
        // Entry already made today
        setStreakTimerMessage("Come back tomorrow to continue your streak! 🎉");
      } else {
        // No entry today yet - calculate time until they lose the streak (24 hours after last entry)
        const streakDeadline = new Date(
          lastEntryDate.getTime() + 48 * 60 * 60 * 1000
        ); // 48 hours after last entry
        const timeLeft = streakDeadline.getTime() - now.getTime();

        if (timeLeft <= 0) {
          setStreakTimerMessage(
            "Your streak has expired. Write an entry to start a new streak!"
          );
        } else {
          const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
          const minutesLeft = Math.floor(
            (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
          );

          if (hoursLeft > 0) {
            setStreakTimerMessage(
              `Write an entry in the next ${hoursLeft}h ${minutesLeft}m to maintain your streak`
            );
          } else {
            setStreakTimerMessage(
              `⚠️ Write an entry in the next ${minutesLeft}m or your streak resets!`
            );
          }
        }
      }
    };

    updateStreakTimer();
    // Update every minute
    const interval = setInterval(updateStreakTimer, 60000);

    return () => clearInterval(interval);
  }, [userData?.lastJournalEntryDate]);

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
