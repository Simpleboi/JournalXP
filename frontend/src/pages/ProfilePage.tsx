import { motion } from "framer-motion";
import { User, Trophy, Paintbrush, BarChart3 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { ProfileHeader } from "@/features/profile/ProfileHeader";
import { useUserData } from "@/context/UserDataContext";
import { Header } from "@/components/Header";
import { ProfileOverview } from "@/features/profile/ProfileOverview";
import { ProfileAchievements } from "@/features/profile/ProfileAchievements";
import { ProfileCustomize } from "@/features/profile/ProfileCustomize";
import { ProfileAccount } from "@/features/profile/ProfileAccount";
import { SettingsSheet } from "@/features/profile/SettingsSheet";
import { useState } from "react";

const ProfilePage = () => {
  const { user } = useAuth();
  const { userData, refreshUserData } = useUserData();
  const [activeTab, setActiveTab] = useState("overview");

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
      {/* Header with Settings Gear */}
      <Header
        title="My Profile"
        rightContent={<SettingsSheet />}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <ProfileHeader />

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Desktop: Tab List */}
          <TabsList className="hidden md:grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" /> Achievements
            </TabsTrigger>
            <TabsTrigger value="customize" className="flex items-center gap-2">
              <Paintbrush className="h-4 w-4" /> Customize
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" /> Account
            </TabsTrigger>
          </TabsList>

          {/* Mobile: Dropdown Menu */}
          <div className="md:hidden mb-8">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" /> Overview
                  </div>
                </SelectItem>
                <SelectItem value="achievements">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" /> Achievements
                  </div>
                </SelectItem>
                <SelectItem value="customize">
                  <div className="flex items-center gap-2">
                    <Paintbrush className="h-4 w-4" /> Customize
                  </div>
                </SelectItem>
                <SelectItem value="account">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" /> Account
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tab Content */}
          <ProfileOverview />
          <ProfileAchievements />
          <ProfileCustomize />
          <ProfileAccount />
        </Tabs>
      </main>
    </div>
  );
};

export default ProfilePage;
