import { TabsContent } from "@/components/ui/tabs";
import { useUserData } from "@/context/UserDataContext";
import SetUsername from "@/components/SetUsername";
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
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";


export const ProfileAccount = () => {
  const { userData, refreshUserData } = useUserData();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [isUsernameOpen, setIsUsernameOpen] = useState(false);
  const [newUsername, setNewUsername] = useState(userData.username || "");

  // To Handle Logout functions
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleUsernameSave = async () => {
    // Call your DB logic here
    // Update Firestore with new username
    // Then refresh the context
    await refreshUserData();
    setIsUsernameOpen(false);
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
          <p className="font-medium">{userData?.username || "Email"}</p>
        </div>

        <Separator className="my-4" />
        <div>
          <p className="text-sm text-gray-500">Member Since</p>
          <p className="font-medium">{userData.joinDate}</p>
        </div>

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
