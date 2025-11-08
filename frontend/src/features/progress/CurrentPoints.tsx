import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useUserData } from "@/context/UserDataContext";

// This is the Points progress card in the Home page under the welcome banner
export const ProgressCurrentPoints = () => {

  const { userData } = useUserData();
  if (!userData) return null;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-none shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-gray-700">Total Points</h3>
          <Star className="h-5 w-5 text-yellow-500" />
        </div>
        <motion.p
          className="text-3xl font-bold text-indigo-600"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {userData.xp}
        </motion.p>
        <p className="text-sm text-gray-500 mt-2">You can use points in the Reward shop!</p>
      </CardContent>
    </Card>
  );
};
