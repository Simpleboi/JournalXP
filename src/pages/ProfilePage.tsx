import { motion } from "framer-motion";
import { User, Award, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProgressStats from "@/components/ProgressStats";
import BadgeCollection from "@/components/BadgeCollection";
import { useAuth } from "@/context/AuthContext";
import { Footer } from "@/components/Footer";
import { ProfilePageNav } from "@/features/profile/ProfileNav";
import { ProfileHeader } from "@/features/profile/ProfileHeader";
import { useUserData } from "@/context/UserDataContext";
import { ProfileAccount } from "@/features/profile/ProfileAccount";
import { ProfileInventory } from "@/features/profile/ProfileInventory";

const ProfilePage = () => {
  const { user } = useAuth();
  const { userData, refreshUserData } = useUserData();

  // To wait until the page loads
  if (!userData) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500 text-lg font-bold">Loading your profile...</p>
      </div>
    );
  }

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
          <ProgressStats />
        </motion.section>

        {/* Tabs */}
        <Tabs defaultValue="achievements" className="w-full">
          <TabsList className="grid w-full grid-cols-1 mb-8">
            {/* <TabsTrigger
              value="achievements"
              className="flex items-center gap-2"
            >
              <Award className="h-4 w-4" /> Achievements
            </TabsTrigger> */}
            {/* <TabsTrigger value="inventory" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" /> Inventory
            </TabsTrigger> */}
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <User className="h-4 w-4" /> Account
            </TabsTrigger>
          </TabsList>

          {/* <TabsContent value="achievements" className="space-y-6">
            <BadgeCollection showAll={true} />
          </TabsContent> */}

          {/* Inventory of Items Purchased */}
          <ProfileInventory />

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
