import { motion } from "framer-motion";
import { User, Settings } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProgressStats from "@/components/ProgressStats";
import { useAuth } from "@/context/AuthContext";
import { ProfileHeader } from "@/features/profile/ProfileHeader";
import { useUserData } from "@/context/UserDataContext";
import { ProfileAccount } from "@/features/profile/ProfileAccount";
import { Header } from "@/components/Header";
import { ProfileSettings } from "@/features/profile/ProfileSettings";

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
      <Header title="My Profile"/>

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
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" /> Settings
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" /> Account
            </TabsTrigger>
          </TabsList>

          {/* <TabsContent value="achievements" className="space-y-6">
            <BadgeCollection showAll={true} />
          </TabsContent> */}


          {/* Account Section in the Profile Tab */}
          <ProfileAccount />

          {/* Setting Section in the Profile Tab */}
          <ProfileSettings />
        </Tabs>
      </main>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
};

export default ProfilePage;
