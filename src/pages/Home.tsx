import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ProgressStats from "@/components/ProgressStats";
import TaskChecklist from "@/components/TaskChecklist";
import JournalInterface from "@/components/JournalInterface";
import MentalHealthTrends from "@/components/MentalHealthTrends";

import { Nav } from "@/components/Nav";
import { Welcome } from "@/components/Welcome";
import { Footer } from "@/components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Nav Bar */}
      <Nav />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Message */}
        <Welcome />

        {/* Progress Stats */}
        <section className="mb-8">
          <ProgressStats
            points={1250}
            level={4}
            streak={12}
            levelProgress={65}
            rank="Reflective Explorer"
            nextRank="Mindful Adept"
            pointsToNextRank={750}
          />
        </section>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="tasks">Daily Tasks</TabsTrigger>
            <TabsTrigger value="journal">Journal</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <TaskChecklist />
              </div>
              <div className="md:col-span-1">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Rewards Shop</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                        <div>
                          <p className="font-medium">New Avatar Items</p>
                          <p className="text-sm text-gray-600">500 points</p>
                        </div>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <div>
                          <p className="font-medium">Meditation Pack</p>
                          <p className="text-sm text-gray-600">750 points</p>
                        </div>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium">Premium Themes</p>
                          <p className="text-sm text-gray-600">1000 points</p>
                        </div>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="journal">
            <JournalInterface />
          </TabsContent>

          <TabsContent value="insights">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Mood Trends</h3>
                  <MentalHealthTrends />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Activity Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Journal Entries</span>
                      <span className="font-medium">12 this month</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tasks Completed</span>
                      <span className="font-medium">28 this month</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Points Earned</span>
                      <span className="font-medium">450 this month</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mood Average</span>
                      <span className="font-medium">Good</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
