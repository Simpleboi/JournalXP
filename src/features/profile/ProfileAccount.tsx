import { TabsContent } from "@/components/ui/tabs";
import { useUserData } from "@/context/UserDataContext";
import SetUsername from "@/components/SetUsername";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router";

export const ProfileAccount = () => {
  const { userData, refreshUserData } = useUserData();
  const { logout } = useAuth();
  const navigate = useNavigate();

  // To Handle Logout functions
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <TabsContent value="stats" className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Account Information</h3>

        {userData.username ? (
          <div>
            <p className="text-sm text-gray-500">Username</p>
            <p className="font-medium">@{userData.username}</p>
          </div>
        ) : (
          <SetUsername onSuccess={refreshUserData} />
        )}

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
