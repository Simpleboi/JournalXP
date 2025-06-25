import { TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { HelpCircle, Star, Info, Heart } from "lucide-react";

// The About Features Tab
export const AboutFeatures = () => {
  return (
    <TabsContent value="features" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
          <CardDescription>What makes JournalXP special</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-indigo-100 p-2 rounded-full">
                <HelpCircle className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  Daily Tasks & Journaling
                </h3>
                <p className="text-gray-600">
                  Complete personalized self-care tasks and journal entries to
                  earn points and build streaks.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 p-2 rounded-full">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  Progress & Rewards
                </h3>
                <p className="text-gray-600">
                  Track your mental health journey with points, levels, and
                  ranks. Unlock rewards like avatar items and premium themes. (feature coming soon)
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <Info className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Insights & Trends</h3>
                <p className="text-gray-600">
                  Visualize your mood patterns and activity over time to better
                  understand your mental health. (feature coming soon)
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-2 rounded-full">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Meditation Room</h3>
                <p className="text-gray-600">
                  Access guided meditations and breathing exercises to help
                  manage stress and anxiety.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

