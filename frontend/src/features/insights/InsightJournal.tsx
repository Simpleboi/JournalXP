import { TabsContent } from "@radix-ui/react-tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { sampleInsightsData } from "@/data/InsightData";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { useUserData } from "@/context/UserDataContext";

export const InsightJournal = () => {
  const { userData } = useUserData();
  if (!userData) return null;
  const data = sampleInsightsData;

  return (
    <TabsContent value="journal" className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Writing Patterns
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-900">
                  {/* TODO: get the average words per entry */}
                  {/* {userData.journalStats && userData.totalJournalEntries > 0
                    ? (
                        userData.journalStats.totalWordCount /
                        userData.totalJournalEntries
                      ).toFixed(1)
                    : "0"} */}
                </p>
                <p className="text-sm text-purple-600">Avg Words/Entry</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-900">
                  {data.journalStats.reflectiveDepth.averageDepthScore.toFixed(
                    1
                  )}
                </p>
                <p className="text-sm text-blue-600">Reflection Depth</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Preferred Time:</span>
                <Badge className="capitalize">
                  {data.journalStats.writingPatterns.preferredTime}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Session:</span>
                <span className="text-sm font-medium">
                  {data.journalStats.writingPatterns.averageSessionLength} min
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Emotional Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-lg font-bold text-green-900">
                    {data.emotionalWordCloud.sentimentAnalysis.positive.toFixed(
                      1
                    )}
                    %
                  </p>
                  <p className="text-xs text-green-600">Positive</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">
                    {data.emotionalWordCloud.sentimentAnalysis.neutral.toFixed(
                      1
                    )}
                    %
                  </p>
                  <p className="text-xs text-gray-600">Neutral</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-lg font-bold text-red-900">
                    {data.emotionalWordCloud.sentimentAnalysis.negative.toFixed(
                      1
                    )}
                    %
                  </p>
                  <p className="text-xs text-red-600">Negative</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Top Emotions:</h4>
                {data.emotionalWordCloud.topEmotions
                  .slice(0, 3)
                  .map((emotion, index) => (
                    <div
                      key={emotion.emotion}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm capitalize">
                        {emotion.emotion}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
                            style={{ width: `${emotion.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">
                          {emotion.count}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};
