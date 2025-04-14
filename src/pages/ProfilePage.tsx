import { motion } from "framer-motion";
import { User, Award, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProgressStats from "@/components/ProgressStats";
import BadgeCollection from "@/components/BadgeCollection";
import { useAuth } from "@/context/AuthContext";
import { Footer } from "@/components/Footer";
import { ProfilePageNav } from "@/features/profile/ProfileNav";
import { ProfileHeader } from "@/features/profile/ProfileHeader";
import { useUserData } from "@/context/UserDataContext";
import { ProfileAccount } from "@/features/profile/ProfileAccount";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}&backgroundColor=b6e3f4`;
  const { userData, refreshUserData } = useUserData();

  // To Handle Logout functions
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <ProfilePageNav />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <ProfileHeader />

        {/* Progress Stats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <ProgressStats
            points={userData.points}
            level={userData.level}
            streak={userData.streak}
            levelProgress={userData.levelProgress}
            rank={userData.rank}
            nextRank={userData.nextRank}
            pointsToNextRank={userData.pointsToNextRank}
            recentAchievement={userData.recentAchievement}
          />
        </motion.section>

        {/* Tabs */}
        <Tabs defaultValue="achievements" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger
              value="achievements"
              className="flex items-center gap-2"
            >
              <Award className="h-4 w-4" /> Achievements
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" /> Inventory
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <User className="h-4 w-4" /> Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="space-y-6">
            <BadgeCollection showAll={true} />
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">
                Your Purchased Items
              </h3>
              <p className="text-gray-500 mb-4">
                Items you've purchased from the rewards store will appear here.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-100 rounded-lg p-4 text-center flex flex-col items-center justify-center h-40">
                  <ShoppingBag className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-500">No items purchased yet</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Account Section in the Profile Tab */}
          <ProfileAccount />
        </Tabs>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProfilePage;
