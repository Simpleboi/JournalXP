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
          <span className="text-lg text-gray-600">days</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {7 >= 7 ? "You're on fire! 🔥" : "Keep it going!"}
        </p>
      </CardContent>
    </Card>
  );
};
