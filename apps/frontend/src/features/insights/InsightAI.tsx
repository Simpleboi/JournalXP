import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, AlertTriangle, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { sampleInsightsData } from "@/data/InsightData";
import { getCorrelationColor } from "@/utils/InsightUtils";

export const InsightAI = () => {
  const data = sampleInsightsData;

  return (
    <TabsContent value="insights" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.behavioralInsights.recommendations.map((rec, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                rec.priority === "high"
                  ? "bg-red-50 border-red-400"
                  : rec.priority === "medium"
                  ? "bg-yellow-50 border-yellow-400"
                  : "bg-blue-50 border-blue-400"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{rec.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {rec.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Based on: {rec.basedOn}
                  </p>
                </div>
                <Badge
                  className={`ml-4 ${
                    rec.priority === "high"
                      ? "bg-red-100 text-red-800"
                      : rec.priority === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {rec.priority} priority
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Behavioral Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Key Correlations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(data.behavioralInsights.correlations).map(
              ([key, corr]) => (
                <div key={key} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm capitalize">
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </h4>
                    <Badge
                      className={`${
                        corr.confidence === "high"
                          ? "bg-green-100 text-green-800"
                          : corr.confidence === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {corr.confidence} confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{corr.insight}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getCorrelationColor(
                          corr.correlation
                        ).replace("text-", "bg-")}`}
                        style={{
                          width: `${Math.abs(corr.correlation) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium">
                      {(corr.correlation * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              )
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Areas to Watch
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.behavioralInsights.riskFactors.map((risk, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-l-4 ${
                  risk.riskLevel === "high"
                    ? "bg-red-50 border-red-400"
                    : risk.riskLevel === "medium"
                    ? "bg-yellow-50 border-yellow-400"
                    : "bg-blue-50 border-blue-400"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{risk.factor}</h4>
                  <Badge
                    className={`${
                      risk.riskLevel === "high"
                        ? "bg-red-100 text-red-800"
                        : risk.riskLevel === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {risk.riskLevel} risk
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{risk.description}</p>
                <p className="text-xs text-gray-500">
                  <strong>Suggestion:</strong> {risk.suggestion}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      {/* Productivity Patterns Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-primary">
            Productivity Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <h3 className="font-semibold">Daily Productivity</h3>
            <div className="h-64 w-full">
              <div className="flex h-full items-end space-x-2">
                {data.behavioralInsights.patterns.productivityPatterns.dayOfWeek.map(
                  (day) => (
                    <div
                      key={day.day}
                      className="flex flex-col items-center flex-1"
                    >
                      <div
                        className="w-full bg-indigo-400 rounded-t-md transition-all duration-500"
                        style={{ height: `${day.productivity}%` }}
                      ></div>
                      <span className="text-xs mt-2">
                        {day.day.substring(0, 3)}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-700">Most Productive Day</p>
                <p className="font-semibold">
                  {data.behavioralInsights.patterns.bestPerformanceDays[0]}
                </p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-700">Optimal Journal Time</p>
                <p className="font-semibold">
                  {data.behavioralInsights.patterns.optimalJournalingTime}
                </p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-700">Current Level</p>
                <p className="font-semibold">
                  Level {data.xpProgress.currentLevel}
                </p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-700">Overall Trend</p>
                <p className="font-semibold text-green-600">+12% ↑</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
