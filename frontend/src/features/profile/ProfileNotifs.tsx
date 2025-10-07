import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const ProfileNotifs = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="daily-reminder">Daily Task Reminders</Label>
            <Switch id="daily-reminder" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="streak-alerts">Streak Alerts</Label>
            <Switch id="streak-alerts" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="achievement-alerts">
              Achievement Notifications
            </Label>
            <Switch id="achievement-alerts" defaultChecked />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
