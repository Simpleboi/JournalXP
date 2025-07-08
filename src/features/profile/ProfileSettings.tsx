import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Moon, Settings, Palette } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const ProfileSettings = () => {
  return (
    <TabsContent value="settings" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" /> Theme Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Moon className="h-5 w-5 text-gray-600" />
                <Label htmlFor="dark-mode">
                  Dark Mode (This feature is not available yet)
                </Label>
              </div>
              <Switch id="dark-mode" />
            </div>

            <div className="space-y-2">
              <Label>Color Theme (This feature is not available yet)</Label>
              <RadioGroup
                defaultValue="default"
                className="grid grid-cols-3 gap-4"
              >
                <div>
                  <RadioGroupItem
                    value="default"
                    id="default"
                    className="sr-only"
                  />
                  <Label
                    htmlFor="default"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-gradient-to-r from-indigo-500 to-purple-500 p-4 hover:border-accent cursor-pointer"
                  >
                    <span className="text-white font-medium">Default</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="ocean"
                    id="ocean"
                    className="sr-only"
                  />
                  <Label
                    htmlFor="ocean"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-gradient-to-r from-blue-500 to-teal-500 p-4 hover:border-accent cursor-pointer"
                  >
                    <span className="text-white font-medium">Ocean</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="sunset"
                    id="sunset"
                    className="sr-only"
                  />
                  <Label
                    htmlFor="sunset"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-gradient-to-r from-orange-500 to-pink-500 p-4 hover:border-accent cursor-pointer"
                  >
                    <span className="text-white font-medium">Sunset</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
