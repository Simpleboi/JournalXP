import { TabsContent } from "@/components/ui/tabs";
import { useUserData } from "@/context/UserDataContext";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const ProfileAccount = () => {
  const { userData, refreshUserData, updateUsername } = useUserData();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [isUsernameOpen, setIsUsernameOpen] = useState(false);
  const [newUsername, setNewUsername] = useState(userData.username || "");
  const [isResetOpen, setIsResetOpen] = useState(false);

  // To Handle Logout functions
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Handle saving a new username
  const handleUsernameSave = async () => {
    if (!newUsername.trim()) return;

    const usernameRegex = /^[a-zA-Z0-9._]{3,20}$/;

    if (!usernameRegex.test(newUsername)) {
      alert(
        "❗Username must be 3-20 characters and only use letters, numbers, dots (.) or underscores (_)."
      );
      return;
    }
    await updateUsername(newUsername);
    await refreshUserData();
    setIsUsernameOpen(false);
  };

  // 🔁 Reset all progress
  const handleResetProgress = async () => {
    if (!user) return;

    const defaultData = {
      level: 1,
      points: 0,
      streak: 0,
      rank: "Newcomer",
      nextRank: "Mindful Beginner",
      pointsToNextRank: 100,
      levelProgress: 0,
      recentAchievement: "None yet",
    };

    await updateDoc(doc(db, "users", user.uid), defaultData);
    await refreshUserData();
    setIsResetOpen(false);
  };

  return (
    <TabsContent value="stats" className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Account Information</h3>

        {/* Username section */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Username</p>
            <p className="font-medium">@{userData.username || "no username"}</p>
          </div>
          <Dialog open={isUsernameOpen} onOpenChange={setIsUsernameOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Username</DialogTitle>
                <DialogDescription>
                  This will update your public username used across the app.
                </DialogDescription>
              </DialogHeader>
              <Input
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
              <DialogFooter className="pt-4">
                <Button onClick={handleUsernameSave}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Separator className="my-4" />

        {/* Add an Email Type */}
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{user?.email || "No Email Found"}</p>
        </div>

        {/* Member since [date] */}
        <Separator className="my-4" />
        <div>
          <p className="text-sm text-gray-500">Member Since</p>
          <p className="font-medium">{userData.joinDate}</p>
        </div>

        {/* Reset All Progress */}
        <Separator className="my-4" />
        <div>
          <p className="text-sm text-gray-500">Reset All Progress</p>
          <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 text-red-600 border-red-300 hover:bg-red-50"
              >
                Reset Progress
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Confirm Reset</DialogTitle>
                <DialogDescription>
                  This will reset your level, XP, streak, and all progress to
                  the default state. Are you sure?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="pt-4">
                <Button variant="outline" onClick={() => setIsResetOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleResetProgress}>
                  Confirm Reset
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Log Out setting */}
        <Separator className="my-4" />
        <div>
          <p className="text-sm text-gray-500">Sign Out</p>
          <Button
            variant="destructive"
            size="sm"
            className="mt-2"
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </div>
      </div>
    </TabsContent>
  );
};
