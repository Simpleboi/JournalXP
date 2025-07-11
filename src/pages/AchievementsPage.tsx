import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Lock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AchievementHeader } from "@/features/achievements/AchievementsHeader";
import { AchievementElement } from "@/features/achievements/AchievementElement";
import { useUserData } from "@/context/UserDataContext";
import { ACHIEVEMENTS } from "@/data/achievementData";
import { AchievementStats } from "@/features/achievements/AchievementsStats";
import { useAchievementSync } from "@/hooks/useAchievements";

const AchievementsPage = () => {
  const [filter, setFilter] = useState<string>("all");
  const { userData } = useUserData();
  const achievements = useAchievementSync();

  // const computedAchievements = ACHIEVEMENTS.map((achievement) => ({
  //   ...achievement,
  //   unlocked:
  //     userData?.achievements.includes(achievement.id.toString()) ?? false,
  // }));

  // const filteredAchievements =
  //   filter === "all"
  //     ? computedAchievements
  //     : filter === "unlocked"
  //     ? computedAchievements.filter((a) => a.unlocked)
  //     : computedAchievements.filter((a) => !a.unlocked);

  // const categoryFiltered = (category: string) => {
  //   return filter === "category"
  //     ? filteredAchievements.filter((a) => a.category === category)
  //     : filteredAchievements;
  // };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <AchievementHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Achievement Stats */}
          <AchievementStats />

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className={
                filter === "all" ? "bg-indigo-600 hover:bg-indigo-700" : ""
              }
            >
              All
            </Button>
            <Button
              variant={filter === "unlocked" ? "default" : "outline"}
              onClick={() => setFilter("unlocked")}
              className={
                filter === "unlocked" ? "bg-green-600 hover:bg-green-700" : ""
              }
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Unlocked
            </Button>
            <Button
              variant={filter === "locked" ? "default" : "outline"}
              onClick={() => setFilter("locked")}
              className={
                filter === "locked" ? "bg-gray-600 hover:bg-gray-700" : ""
              }
            >
              <Lock className="h-4 w-4 mr-2" />
              Locked
            </Button>
          </div>

          {/* Achievement Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((ach) => {
              return <AchievementElement key={ach.id} achievement={ach}/>
            })}
          </div>

          {achievements.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                <Trophy className="h-8 w-8 text-indigo-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                No achievements found
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Try a different filter to see more achievements.
              </p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default AchievementsPage;
