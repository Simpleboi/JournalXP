import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useUserData } from "@/context/UserDataContext";

// This card is shown on the Homepage under the welcome banner
export const RecentAchievement = () => {
  const { userData } = useUserData();

  // Conditional Check
  if (!userData) return null;
  
  return (
    <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-none shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-gray-700">
            <Link to="/achievements">Recent Achievement</Link>
          </h3>
          <Link to="/achievements">
            <TrendingUp className="h-5 w-5 text-green-500" />
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1">
            {/* TODO: implement this: {userData.recentAchievement}*/}
          </Badge>
          <p className="text-sm text-gray-500 mt-3">
            Great job maintaining your wellbeing routine!
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
};
