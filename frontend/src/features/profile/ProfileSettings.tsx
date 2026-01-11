import { TabsContent } from "@/components/ui/tabs";
import { ProfileLayout } from "./ProfileLayout";
import { ProfileTheme } from "./ProfileTheme";
import { ProfileNotifs } from "./ProfileNotifs";
import { ProfileJournal } from "./ProfileJournal";
import { ProfileInsights } from "./ProfileInsights";
import { ProfileLocation } from "./ProfileLocation";
import { AccessibilityPanel } from "@/components/AccessibilityPanel";

export const ProfileSettings = () => {
  return (
    <TabsContent value="settings" className="space-y-6">
      {/* Accessibility Section */}
      <AccessibilityPanel />

      {/* Location Settings Section */}
      <ProfileLocation />

      {/* Journal Preferences Section */}
      <ProfileJournal />

      {/* Insights & Analytics Preferences Section */}
      {/* <ProfileInsights /> */}

      {/* Theme Section */}
      <ProfileTheme />

      {/* Dashboard Layout Section */}
      {/* <ProfileLayout /> */}

      {/* Notification Section */}
      {/* <ProfileNotifs /> */}
    </TabsContent>
  );
};
