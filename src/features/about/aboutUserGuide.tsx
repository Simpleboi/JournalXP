import { TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";
import { Book, CalendarCheck, ListChecks, User, Home } from "lucide-react";

// The About User Guide Component
export const AboutUserGuide = () => {
  return (
    <TabsContent value="guide" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>How to navigate and use JournalXP</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="border-l-4 border-indigo-500 pl-4 py-2">
              <h3 className="font-medium text-gray-900 flex gap-1 items-center text-lg">
                {" "}
                <Home className="text-gray-900" />
                Dashboard
              </h3>
              <p className="text-gray-600 mb-2">
                Your home base shows your progress stats, daily tasks, and quick
                access to all features.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                <li>View your points, level, and quick links at the top</li>
                <li>Complete daily tasks to earn points</li>
                <li>Switch between tabs to access different features</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <h3 className="font-medium text-gray-900 flex gap-1 text-lg items-center">
                <Book className="text-gray-900" /> Journal
              </h3>
              <p className="text-gray-600 mb-2">
                Express your thoughts and track your mood with guided prompts or
                free writing.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                <li>
                  Write journal entries using guided prompts or free writing to
                  express your thoughts.
                </li>
                <li>
                  Select a mood with each entry to help track your emotional
                  patterns.
                </li>
                <li>
                  Earn +30 points for every completed entry, contributing to
                  your progress and rewards.
                </li>
                <li>
                  Access your past entries in the Reflection Archive for easy
                  review.
                </li>
                <li>
                  Filter entries by mood or prompt type to find specific
                  reflections quickly.
                </li>
                <li>
                  Delete entries directly from the List View or select any day
                  from the Calendar to manage specific entries.
                </li>
              </ul>
            </div>

            {/* Daily Tasks Section */}
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h3 className="font-medium text-gray-900 flex gap-1 items-center text-lg">
                <CalendarCheck className="text-gray-900" /> Daily Tasks
              </h3>
              <p className="text-gray-600 mb-2">
                Build habits, reflect daily, and level up your mental wellness.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>
                  Create new tasks with a title, description, and priority level
                  (Low, Medium, High).
                </li>
                <li>
                  Earn +10 XP for each task completed, helping you level up and
                  unlock rewards.
                </li>
                <li>
                  View, complete, edit, or delete tasks from your personalized
                  task list.
                </li>
                <li>
                  Use priority-based color coding to visually distinguish tasks
                  by importance.
                </li>
              </ul>
            </div>

            {/* Habit Builder */}
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h3 className="font-medium text-gray-900 flex gap-1 text-lg  items-center">
                {" "}
                <ListChecks className="text-gray-900" /> Habit Builder
              </h3>
              <p className="text-gray-600 mb-2">
                Create and track daily habits for better wellbeing.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>
                  Create new habits with customizable details like title,
                  description, frequency, and category.
                </li>
                <li>
                  Set your own XP rewards for what you believe each habit is
                  worth in your self-improvement journey.
                </li>
                <li>
                  Track each habit's streak and completions as you build
                  consistency over time.
                </li>
                <li>
                  Edit or delete habits at any time through an intuitive
                  interface.
                </li>
                <li>
                  View your habits in two tabs: Active Habits and Completed
                  Goals (coming soon).
                </li>
              </ul>
            </div>

            {/* Profile Section */}
            <div className="border-l-4 border-amber-500 pl-4 py-2">
              <h3 className="font-medium text-gray-900 flex gap-1 text-lg items-center">
                {" "}
                <User className="text-gray-900" />
                Profile Settings
              </h3>
              <p className="text-gray-600 mb-2">
                Customize your JournalXP experience to suit your preferences.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Adjust appearance settings</li>
                <li>Customize dashboard layout</li>
                <li>Manage notification preferences</li>
                <li>You can change your profile picture by clicking on the default one</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
