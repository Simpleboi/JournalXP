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
import { useToast } from "@/hooks/useToast";
import { authFetch } from "@/lib/authFetch";
import { formatJoinDate } from "@shared/utils/date";

export const ProfileAccount = () => {
  const { userData, refreshUserData, updateUsername } = useUserData();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isUsernameOpen, setIsUsernameOpen] = useState(false);
  const [newUsername, setNewUsername] = useState(userData.username || "");
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

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

    try {
      setIsResetting(true);

      // Call the reset progress API endpoint
      await authFetch("/test/reset-progress", {
        method: "POST",
      });

      // Refresh user data to show updated values
      await refreshUserData();

      // Dispatch event to notify other components (like ReflectionArchive)
      window.dispatchEvent(new CustomEvent("journalEntriesDeleted"));

      showToast({
        title: "Progress Reset ✨",
        description: "Your account has been reset to a fresh start",
      });

      setIsResetOpen(false);
    } catch (error: any) {
      console.error("Error resetting progress:", error);

      showToast({
        title: "Error",
        description: error.message || "Failed to reset progress",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  // 🗑️ Delete account permanently
  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      setIsDeletingAccount(true);

      // Call the delete account API endpoint
      await authFetch("/auth/account", {
        method: "DELETE",
      });

      showToast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted",
      });

      // Log out and redirect to home
      await logout();
      navigate("/");
    } catch (error: any) {
      console.error("Error deleting account:", error);
      showToast({
        title: "Error",
        description: error.message || "Failed to delete account",
        variant: "destructive",
      });
      setIsDeletingAccount(false);
    }
  };

  return (
    <TabsContent value="account" className="space-y-6">
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
          <p className="font-medium">{formatJoinDate(userData.joinDate)}</p>
        </div>

        {/* Reset All Progress */}
        <Separator className="my-4" />
        <div>
          <p className="text-sm text-gray-500">Reset All Progress</p>
          <p className="text-xs text-gray-400 mt-1 mb-2">
            Start fresh as if you just created your account
          </p>
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
                <DialogTitle>Reset Everything?</DialogTitle>
                <DialogDescription>
                  This will completely reset your account to a fresh start. All
                  your progress, XP, level, rank, streak, achievements, journal
                  entries, tasks, habits, and Sunday conversations will be
                  permanently deleted. Your account info (email, username,
                  profile picture) will be preserved.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsResetOpen(false)}
                  disabled={isResetting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleResetProgress}
                  disabled={isResetting}
                >
                  {isResetting ? "Resetting..." : "Reset Everything"}
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

        {/* Delete Account */}
        <Separator className="my-4" />
        <div>
          <p className="text-sm text-gray-500">Delete Account</p>
          <p className="text-xs text-gray-400 mt-1 mb-2">
            Permanently delete your account and all associated data
          </p>
          <Dialog
            open={isDeleteAccountOpen}
            onOpenChange={setIsDeleteAccountOpen}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 text-red-600 border-red-300 hover:bg-red-50"
              >
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Delete Account Forever?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account, all your journal entries, tasks, habits,
                  progress, and remove all your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteAccountOpen(false)}
                  disabled={isDeletingAccount}
                  className="mt-2"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={isDeletingAccount}
                >
                  {isDeletingAccount ? "Deleting..." : "Delete Forever"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </TabsContent>
  );
};
