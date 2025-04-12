import { motion } from "framer-motion";
import { ArrowLeft, User, Award, ShoppingBag, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import ProgressStats from "@/components/ProgressStats";
import BadgeCollection from "@/components/BadgeCollection";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { getDoc, doc } from "firebase/firestore";
import { useState, useEffect } from "react";

// Mock user data - in a real app, this would come from a context or state management
const mockUserData = {
  name: "Nate",
  username: "n8.jsx",
  email: "n8thegr8.jsx@gmail.com",
  joinDate: "April 2024",
  avatarUrl:
    "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah&backgroundColor=b6e3f4",
  points: 1250,
  level: 4,
  streak: 7,
  levelProgress: 65,
  rank: "Reflective Explorer",
  nextRank: "Mindful Adept",
  pointsToNextRank: 750,
  recentAchievement: "Consistent Journaler",
};

const ProfilePage = () => {
  const { user, logout } = useAuth();
  
  // User Data
  const [userData, setUserData] = useState({
    level: 1,
    streak: 0,
    points: 0,
    rank: "Newcomer",
    nextRank: "Mindful Beginner",
    pointsToNextRank: 100,
    levelProgress: 0,
    recentAchievement: "None yet",
    joinDate: "",
  });
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData({
          level: data.level || 1,
          streak: data.streak || 0,
          points: data.points || 0,
          rank: data.rank || "Newcomer",
          nextRank: data.nextRank || "Mindful Beginner",
          pointsToNextRank: data.pointsToNextRank || 100,
          levelProgress: data.levelProgress || 0,
          recentAchievement: data.recentAchievement || "None yet",
          joinDate: data.joinDate || new Date().toLocaleDateString(),
        });
      } else {
        // Optional: if no doc, set defaults or create user profile
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
            </Button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              My Profile
            </h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:bg-indigo-50"
          >
            <Link to="/settings">
              <Settings className="h-5 w-5 text-indigo-600" />
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center shadow-md border-4 border-white overflow-hidden"
            >
              {mockUserData.avatarUrl ? (
                <img
                  src={mockUserData.avatarUrl}
                  alt={mockUserData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 md:h-16 md:w-16 text-indigo-600" />
              )}
            </motion.div>

            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-800">
                {mockUserData.name}
              </h2>
              <p className="text-gray-500">@{mockUserData.username}</p>
              <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {mockUserData.rank}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Level {mockUserData.level}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  {mockUserData.streak} Day Streak
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Member since {mockUserData.joinDate}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Progress Stats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <ProgressStats
            points={mockUserData.points}
            level={mockUserData.level}
            streak={mockUserData.streak}
            levelProgress={mockUserData.levelProgress}
            rank={mockUserData.rank}
            nextRank={mockUserData.nextRank}
            pointsToNextRank={mockUserData.pointsToNextRank}
            recentAchievement={mockUserData.recentAchievement}
          />
        </motion.section>

        {/* Profile Tabs */}
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

              {/* Placeholder for purchased items - will be implemented in next phase */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-100 rounded-lg p-4 text-center flex flex-col items-center justify-center h-40">
                  <ShoppingBag className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-500">No items purchased yet</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">
                Account Information
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{mockUserData.email}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="font-medium">@{mockUserData.username}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium">{mockUserData.joinDate}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-500">Sign Out</p>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-2"
                    onClick={logout}
                  >
                    Log Out
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>WellPoint - Your Mental Health Companion</p>
          <p className="mt-2 text-xs">
            © {new Date().getFullYear()} WellPoint. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ProfilePage;
