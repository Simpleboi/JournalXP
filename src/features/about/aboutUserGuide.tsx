import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardTitle, CardHeader } from "@/components/ui/card";

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
              <h3 className="font-medium text-gray-900">Dashboard</h3>
              <p className="text-gray-600 mb-2">
                Your home base shows your progress stats, daily tasks, and quick
                access to all features.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                <li>View your points, level, and streak at the top</li>
                <li>Complete daily tasks to earn points</li>
                <li>Switch between tabs to access different features</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <h3 className="font-medium text-gray-900">Journal</h3>
              <p className="text-gray-600 mb-2">
                Express your thoughts and track your mood with guided prompts or
                free writing.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                <li>Write down entries in the Journal Prompts and select a mood, you'll earn +20 points per entry.</li>
                <li>You can view your entries in the Reflection Archive underneath it. You can filter entries by mood or prompt type. Entries are also displayed in the Calendar View.</li>
                <li>You can delete entries in the List View or select different days in the Calendar View</li>
              </ul>
            </div>

            {/* <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h3 className="font-medium text-gray-900">Insights</h3>
              <p className="text-gray-600 mb-2">
                Visualize your mental health trends and activity patterns over
                time.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>View mood trends across different time periods</li>
                <li>Track your activity completion rates</li>
                <li>Identify patterns in your mental wellbeing</li>
              </ul>
            </div> */}

            {/* <div className="border-l-4 border-green-500 pl-4 py-2">
              <h3 className="font-medium text-gray-900">Meditation Room</h3>
              <p className="text-gray-600 mb-2">
                Practice mindfulness with guided meditations and breathing
                exercises.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Choose from different meditation types</li>
                <li>Set duration based on your availability</li>
                <li>Track your meditation streak</li>
              </ul>
            </div> */}

            <div className="border-l-4 border-amber-500 pl-4 py-2">
              <h3 className="font-medium text-gray-900">Profile Settings</h3>
              <p className="text-gray-600 mb-2">
                Customize your JournalXP experience to suit your preferences.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Adjust appearance settings</li>
                <li>Customize dashboard layout</li>
                <li>Manage notification preferences</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};