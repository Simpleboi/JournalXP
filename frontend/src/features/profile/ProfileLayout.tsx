import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Layout } from "lucide-react";

export const ProfileLayout = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layout className="h-5 w-5" /> Dashboard Layout
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-progress">Show Progress Stats</Label>
            <Switch id="show-progress" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-tasks">Show Daily Tasks</Label>
            <Switch id="show-tasks" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-rewards">Show Rewards Section</Label>
            <Switch id="show-rewards" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-insights">Show Insights Tab</Label>
            <Switch id="show-insights" defaultChecked />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
