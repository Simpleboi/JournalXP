import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Moon, Sun, Layout, Palette } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Button>
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: 0 }}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
              />
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                WellPoint
              </h1>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-gray-800"
          >
            Settings
          </motion.h2>
          <p className="text-gray-600 mt-2">
            Customize your WellPoint experience to match your preferences.
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
                          <span className="text-white font-medium">
                            Default
                          </span>
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

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>WellPoint - Your Mental Health Companion</p>
          <p className="mt-2">
            Remember, taking care of your mental health is a journey, not a
            destination.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SettingsPage;
