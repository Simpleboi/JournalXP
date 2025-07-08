import { TabsContent } from "@/components/ui/tabs";
import { ProfileLayout } from "./ProfileLayout";
import { ProfileTheme } from "./ProfileTheme";
import { ProfileNotifs } from "./ProfileNotifs";

export const ProfileSettings = () => {
  return (
    <TabsContent value="settings" className="space-y-6">
      {/* Theme Section */}
      <ProfileTheme />
      {/* Dashboard Layout Section */}
      <ProfileLayout />
      {/* Notification Section */}
      <ProfileNotifs />
    </TabsContent>
  );
};
