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
import { useToast } from "@/components/ui/use-toast";
import { authFetch } from "@/lib/authFetch";

export const ProfileAccount = () => {
  const { userData, refreshUserData, updateUsername } = useUserData();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isUsernameOpen, setIsUsernameOpen] = useState(false);
  const [newUsername, setNewUsername] = useState(userData.username || "");
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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

      toast({
        title: "Progress Reset ✨",
        description: "Your progress has been reset to default starter values",
      });

      setIsResetOpen(false);
    } catch (error: any) {
      console.error("Error resetting progress:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to reset progress",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
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
          {/* {userData.joinDate} TODO: implement this */}
          <p className="text-sm text-gray-500">Member Since</p>
          <p className="font-medium">9/18/25</p>
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
                  This will reset your level, XP, rank, streak, and all progress stats
                  (journal, task, and habit stats) to default starter values. Your username,
                  email, and actual journal entries/tasks/habits will NOT be deleted.
                  Are you sure?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsResetOpen(false)}
                  className="mt-4"
                  disabled={isResetting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleResetProgress}
                  disabled={isResetting}
                >
                  {isResetting ? "Resetting..." : "Confirm Reset"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Delete Journal Entires */}
        <Separator className="my-4" />
        <div>
          <p className="text-sm text-gray-500">Delete all Journal Entries</p>
          <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 text-red-600 border-red-300 hover:bg-red-50"
              >
                Delete Entries
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Confirm Reset</DialogTitle>
                <DialogDescription>
                  This will delete every Journal Entry you made. Are you sure?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    // TODO: implement this: await deleteAllJournalEntries(userData.uid);
                    setIsDeleteOpen(false);
                  }}
                >
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
