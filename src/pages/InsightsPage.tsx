import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  BarChart3,
  LineChart,
  PieChart,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MentalHealthTrends from "@/components/MentalHealthTrends";
import { InsightsHeader } from "@/features/insights/InsightHeader";


const InsightsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState("week");

  // Sample data for activity summary
  const activitySummary = {
    journalEntries: 12,
    tasksCompleted: 28,
    pointsEarned: 450,
    moodAverage: "Good",
    meditationMinutes: 120,
    selfCareActivities: 8,
  };

  // Sample data for usage patterns
  const usagePatterns = [
    { day: "Monday", minutes: 25 },
    { day: "Tuesday", minutes: 18 },
    { day: "Wednesday", minutes: 30 },
    { day: "Thursday", minutes: 22 },
    { day: "Friday", minutes: 35 },
    { day: "Saturday", minutes: 15 },
    { day: "Sunday", minutes: 20 },
  ];

  // Sample data for achievement progress
  const achievementProgress = [
    { name: "Journal Streak", progress: 7, total: 10 },
    { name: "Task Master", progress: 22, total: 30 },
    { name: "Mood Tracker", progress: 14, total: 20 },
    { name: "Self-Care Pro", progress: 5, total: 15 },
    { name: "Reflection Guru", progress: 3, total: 10 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 pb-12">
      {/* Header */}
      <InsightsHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6 ">
            <div>
              <h2 className="text-2xl font-bold text-indigo-700 mb-2">
                Your Wellness Journey
              </h2>
              <p className="text-gray-600">
                Track your progress and discover patterns in your mental health
                journey
              </p>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Past Week</SelectItem>
                <SelectItem value="month">Past Month</SelectItem>
                <SelectItem value="quarter">Past 3 Months</SelectItem>
                <SelectItem value="year">Past Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 debug">
            <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                  <BarChart3 className="h-6 w-6 text-indigo-600" />
                </div>
                <p className="text-sm text-indigo-700 font-medium">
                  Total Points
                </p>
                <p className="text-2xl font-bold text-indigo-900">
                  {activitySummary.pointsEarned}
                </p>
                <p className="text-xs text-indigo-600">This {timeRange}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                  <LineChart className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-sm text-purple-700 font-medium">
                  Journal Entries
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {activitySummary.journalEntries}
                </p>
                <p className="text-xs text-purple-600">This {timeRange}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-2">
                  <PieChart className="h-6 w-6 text-pink-600" />
                </div>
                <p className="text-sm text-pink-700 font-medium">
                  Tasks Completed
                </p>
                <p className="text-2xl font-bold text-pink-900">
                  {activitySummary.tasksCompleted}
                </p>
                <p className="text-xs text-pink-600">This {timeRange}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-sm text-blue-700 font-medium">
                  Meditation Minutes
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {activitySummary.meditationMinutes}
                </p>
                <p className="text-xs text-blue-600">This {timeRange}</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="mood" className="w-full">
            <TabsList className="mb-6 w-full justify-start">
              <TabsTrigger value="mood">Mood Trends</TabsTrigger>
              <TabsTrigger value="activity">Activity Summary</TabsTrigger>
              <TabsTrigger value="usage">Usage Patterns</TabsTrigger>
              <TabsTrigger value="achievements">
                Achievement Progress
              </TabsTrigger>
            </TabsList>

            <TabsContent value="mood" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-primary">
                    Mood & Energy Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MentalHealthTrends />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-primary">
                    Activity Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">
                          This {timeRange}
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                              Journal Entries
                            </span>
                            <span className="font-medium">
                              {activitySummary.journalEntries}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-500 rounded-full"
                              style={{
                                width: `${(activitySummary.journalEntries / 20) * 100}%`,
                              }}
                            ></div>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                              Tasks Completed
                            </span>
                            <span className="font-medium">
                              {activitySummary.tasksCompleted}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-pink-500 rounded-full"
                              style={{
                                width: `${(activitySummary.tasksCompleted / 40) * 100}%`,
                              }}
                            ></div>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Points Earned</span>
                            <span className="font-medium">
                              {activitySummary.pointsEarned}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 rounded-full"
                              style={{
                                width: `${(activitySummary.pointsEarned / 600) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">
                          Additional Metrics
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Mood Average</span>
                            <span className="font-medium">
                              {activitySummary.moodAverage}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-500 rounded-full"
                              style={{ width: "75%" }}
                            ></div>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                              Meditation Minutes
                            </span>
                            <span className="font-medium">
                              {activitySummary.meditationMinutes}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{
                                width: `${(activitySummary.meditationMinutes / 180) * 100}%`,
                              }}
                            ></div>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                              Self-Care Activities
                            </span>
                            <span className="font-medium">
                              {activitySummary.selfCareActivities}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{
                                width: `${(activitySummary.selfCareActivities / 12) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="usage" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-primary">
                    App Usage Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <h3 className="font-semibold">Daily App Usage (minutes)</h3>
                    <div className="h-64 w-full">
                      <div className="flex h-full items-end space-x-2">
                        {usagePatterns.map((day) => (
                          <div
                            key={day.day}
                            className="flex flex-col items-center flex-1"
                          >
                            <div
                              className="w-full bg-indigo-400 rounded-t-md transition-all duration-500"
                              style={{ height: `${(day.minutes / 40) * 100}%` }}
                            ></div>
                            <span className="text-xs mt-2">
                              {day.day.substring(0, 3)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <p className="text-sm text-indigo-700">
                          Most Active Day
                        </p>
                        <p className="font-semibold">Friday</p>
                      </div>
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <p className="text-sm text-indigo-700">
                          Avg. Daily Usage
                        </p>
                        <p className="font-semibold">23 minutes</p>
                      </div>
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <p className="text-sm text-indigo-700">
                          Total Weekly Usage
                        </p>
                        <p className="font-semibold">165 minutes</p>
                      </div>
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <p className="text-sm text-indigo-700">Usage Trend</p>
                        <p className="font-semibold text-green-600">+12% ↑</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-primary">
                    Achievement Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {achievementProgress.map((achievement) => (
                      <div key={achievement.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">
                            {achievement.name}
                          </span>
                          <span className="text-sm text-gray-600">
                            {achievement.progress}/{achievement.total}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(achievement.progress / achievement.total) * 100}%`,
                            }}
                            transition={{ duration: 1 }}
                            className="h-full bg-indigo-500 rounded-full"
                          ></motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default InsightsPage;
