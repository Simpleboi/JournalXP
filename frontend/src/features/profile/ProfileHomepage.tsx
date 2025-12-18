import { TabsContent } from "@radix-ui/react-tabs";
import { ProfileDashboard } from "./ProfileDashboard";

export const ProfileHomepage = () => {
  return (
    <TabsContent value="homepage" className="space-y-6">
      {/* Dashboard */}
      <ProfileDashboard />
    </TabsContent>
  );
};
