import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useUserData } from "@/context/UserDataContext";

// This is the level progress card in the Home page under the welcome banner
export const ProgressCurrentLevel = () => {
  const { userData } = useUserData();

  // Conditional Check
  if (!userData) return null;

  const currentLevel = userData.level;
  const nextLevel = currentLevel + 1;
  const levelProgress = userData.levelProgress ?? 0;
  
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-none shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-gray-700">Current Level</h3>
          <Award className="h-5 w-5 text-purple-500" />
        </div>
        <div className="flex items-end gap-2">
          <motion.p
            className="text-3xl font-bold text-purple-600"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {userData.level}
          </motion.p>
          <Badge
            variant="outline"
            className="mb-1 bg-purple-100 text-purple-700 border-purple-200"
          >
            {levelProgress}% to Level {nextLevel}
          </Badge>
        </div>
        <div className="mt-2">
          <Progress value={4} className="h-2 bg-purple-100" />
        </div>
      </CardContent>
    </Card>
  );
};
