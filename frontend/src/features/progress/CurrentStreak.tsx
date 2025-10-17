import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { useUserData } from "@/context/UserDataContext";
import { parseISO, format, differenceInCalendarDays } from "date-fns";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect } from "react";

// This is the Streak card on the Home page under the welcome banner.
export const ProgressCurrentStreak = () => {
  const { userData, refreshUserData } = useUserData();

  useEffect(() => {
    if (!userData || !userData.lastJournalEntryDate) return;

    const today = new Date();
    const todayStr = format(today, "yyyy-MM-dd");

    const lastDate = parseISO(userData.lastJournalEntryDate);
    const lastDateStr = format(lastDate, "yyyy-MM-dd");

    // Already updated today
    if (todayStr === lastDateStr) return;

    const dayDiff = differenceInCalendarDays(today, lastDate);
    let newStreak = 1;

    if (dayDiff === 1) {
      newStreak = userData.streak + 1;
    }

    // Update Firestore and context
    const userRef = doc(db, "users", userData.uid);
    updateDoc(userRef, {
      streak: newStreak,
      lastActivityDate: todayStr,
    }).then(() => {
      refreshUserData(); 
    });
  }, [userData, refreshUserData]);
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
          <span className="text-lg text-gray-600">days</span>
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

