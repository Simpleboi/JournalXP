import { motion } from "framer-motion";
import { User, Settings, LayoutGrid, Package } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProgressStats from "@/components/ProgressStats";
import { useAuth } from "@/context/AuthContext";
import { ProfileHeader } from "@/features/profile/ProfileHeader";
import { useUserData } from "@/context/UserDataContext";
import { Header } from "@/components/Header";
import { ProfileAccount } from "@/features/profile/ProfileAccount";
import { ProfileSettings } from "@/features/profile/ProfileSettings";
import { ProfileHomepage } from "@/features/profile/ProfileHomepage";
import { ProfileInventory } from "@/features/profile/ProfileInventory";
import { useState } from "react";

const ProfilePage = () => {
  const { user } = useAuth();
  const { userData, refreshUserData } = useUserData();
  const [activeTab, setActiveTab] = useState("account");

  // To wait until the page loads
  if (!userData) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500 text-lg font-bold">
          Loading your profile...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <Header title="My Profile" />

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

        {/* Desktop: Tab List */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="hidden md:grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" /> Settings
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" /> Account
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="h-4 w-4" /> Inventory
            </TabsTrigger>
            <TabsTrigger value="homepage" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" /> Homepage
            </TabsTrigger>
          </TabsList>

          {/* Mobile: Dropdown Menu */}
          <div className="md:hidden mb-8">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="settings">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" /> Settings
                  </div>
                </SelectItem>
                <SelectItem value="account">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" /> Account
                  </div>
                </SelectItem>
                <SelectItem value="inventory">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" /> Inventory
                  </div>
                </SelectItem>
                <SelectItem value="homepage">
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="h-4 w-4" /> Homepage
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* <TabsContent value="achievements" className="space-y-6">
            <BadgeCollection showAll={true} />
          </TabsContent> */}

          {/* Account Section */}
          <ProfileAccount />

          {/* User Setting Section*/}
          <ProfileSettings />

          {/* Inventory Section */}
          <ProfileInventory />

          {/* Homepage Section */}
          <ProfileHomepage />
        </Tabs>
      </main>
    </div>
  );
};

export default ProfilePage;
