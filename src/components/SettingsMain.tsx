import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Palette, Moon, Layout } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

export const SettingsMain = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-gray-800"
        >
          Settings
        </motion.h2>
        <p className="text-gray-600 mt-2">
          Customize your JournalXP experience to match your preferences.
        </p>
      </div>

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-4">
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
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                  </div>
                  <Switch id="dark-mode" />
                </div>

                <div className="space-y-2">
                  <Label>Color Theme</Label>
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

        <TabsContent value="dashboard" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
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
        </TabsContent>
      </Tabs>
    </main>
  );
};
