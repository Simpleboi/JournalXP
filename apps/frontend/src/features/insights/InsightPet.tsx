import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { PawPrint, Activity, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { sampleInsightsData } from "@/data/InsightData";
import { Progress } from "@/components/ui/progress";
import { getCorrelationColor } from "@/utils/InsightUtils";
import { getCorrelationStrength } from "@/utils/InsightUtils";

export const InsightVirtualPet = () => {
  const data = sampleInsightsData;

  return (
    <TabsContent value="pet" className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PawPrint className="h-5 w-5" />
              Pet Wellbeing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(data.virtualPetMetrics.petStats).map(
              ([stat, data]) => (
                <div key={stat} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm capitalize">{stat}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {data.current}/100
                      </span>
                      <Badge
                        className={
                          data.trend === "improving"
                            ? "bg-green-100 text-green-800"
                            : data.trend === "declining"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {data.trend}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={data.current} className="h-2" />
                </div>
              )
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Care Patterns
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <p className="text-lg font-bold text-orange-900">
                  {data.virtualPetMetrics.carePatterns.feedingFrequency.average}
                </p>
                <p className="text-xs text-orange-600">Feeds/Day</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-lg font-bold text-blue-900">
                  {data.virtualPetMetrics.carePatterns.playingFrequency.average}
                </p>
                <p className="text-xs text-blue-600">Plays/Day</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Most Active Time:</span>
                <Badge className="capitalize">
                  {data.virtualPetMetrics.carePatterns.mostActiveTime}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Care Consistency:</span>
                <span className="text-sm font-medium">
                  {data.virtualPetMetrics.carePatterns.careConsistency}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Days Alive:</span>
                <span className="text-sm font-medium">
                  {data.virtualPetMetrics.petMilestones.daysAlive} days
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pet Correlations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Wellness Correlations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(data.virtualPetMetrics.correlations).map(
              ([correlation, value]) => (
                <div
                  key={correlation}
                  className="p-4 bg-gray-50 rounded-lg text-center"
                >
                  <p
                    className={`text-2xl font-bold ${getCorrelationColor(
                      value
                    )}`}
                  >
                    {(value * 100).toFixed(0)}%
                  </p>
                  <p className="text-sm text-gray-600 capitalize">
                    {correlation
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </p>
                  <Badge className="mt-1" variant="outline">
                    {getCorrelationStrength(value)}
                  </Badge>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
