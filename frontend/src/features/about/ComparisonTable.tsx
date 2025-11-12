import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Minus } from "lucide-react";

const comparisons = [
  {
    feature: "Price",
    journalxp: { value: "Free Forever", type: "check" },
    headspace: { value: "$70/year", type: "x" },
    daylio: { value: "$35/year", type: "minus" },
  },
  {
    feature: "Full RPG Gamification",
    journalxp: { value: "XP, Levels, Ranks, Pet", type: "check" },
    headspace: { value: "None", type: "x" },
    daylio: { value: "Basic streaks only", type: "minus" },
  },
  {
    feature: "AI Therapy Companion",
    journalxp: { value: "GPT-4o powered (Sunday)", type: "check" },
    headspace: { value: "Not available", type: "x" },
    daylio: { value: "Not available", type: "x" },
  },
  {
    feature: "Open Source",
    journalxp: { value: "100% transparent", type: "check" },
    headspace: { value: "Proprietary", type: "x" },
    daylio: { value: "Proprietary", type: "x" },
  },
  {
    feature: "Anonymous Community",
    journalxp: { value: "Safe space to share", type: "check" },
    headspace: { value: "Not available", type: "x" },
    daylio: { value: "Not available", type: "x" },
  },
  {
    feature: "No Ads",
    journalxp: { value: "Zero, forever", type: "check" },
    headspace: { value: "Ad-free (paid)", type: "check" },
    daylio: { value: "Ads in free tier", type: "minus" },
  },
  {
    feature: "Habit Tracking",
    journalxp: { value: "Full system", type: "check" },
    headspace: { value: "Limited", type: "minus" },
    daylio: { value: "Full system", type: "check" },
  },
  {
    feature: "Virtual Pet",
    journalxp: { value: "Unique feature!", type: "check" },
    headspace: { value: "Not available", type: "x" },
    daylio: { value: "Not available", type: "x" },
  },
  {
    feature: "Mood Analytics",
    journalxp: { value: "AI-powered insights", type: "check" },
    headspace: { value: "Basic tracking", type: "minus" },
    daylio: { value: "Good analytics", type: "check" },
  },
  {
    feature: "Journaling",
    journalxp: { value: "3 modes (free, guided, gratitude)", type: "check" },
    headspace: { value: "Limited", type: "minus" },
    daylio: { value: "Notes only", type: "minus" },
  },
  {
    feature: "Data Privacy",
    journalxp: { value: "You own your data", type: "check" },
    headspace: { value: "Standard", type: "minus" },
    daylio: { value: "Standard", type: "minus" },
  },
  {
    feature: "Community Built",
    journalxp: { value: "For users, by a user", type: "check" },
    headspace: { value: "Corporate", type: "x" },
    daylio: { value: "Corporate", type: "x" },
  },
];

export const ComparisonTable = () => {
  const renderIcon = (type: string) => {
    if (type === "check") {
      return <Check className="h-5 w-5 text-green-600" />;
    } else if (type === "x") {
      return <X className="h-5 w-5 text-red-500" />;
    } else {
      return <Minus className="h-5 w-5 text-yellow-600" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Why JournalXP is Different
        </h2>
        <p className="text-xl text-gray-600">
          Compare us to popular alternatives
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="p-4 text-left font-bold text-gray-700 bg-gray-50">Feature</th>
                  <th className="p-4 text-center font-bold bg-gradient-to-br from-indigo-50 to-purple-50">
                    <div className="flex flex-col items-center">
                      <span className="text-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
                        JournalXP
                      </span>
                      <span className="text-xs text-gray-500 font-normal">(That's us!)</span>
                    </div>
                  </th>
                  <th className="p-4 text-center font-bold text-gray-700 bg-gray-50">Headspace</th>
                  <th className="p-4 text-center font-bold text-gray-700 bg-gray-50">Daylio</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`}
                  >
                    <td className="p-4 font-medium text-gray-900">{row.feature}</td>
                    <td className="p-4 bg-gradient-to-br from-indigo-50/50 to-purple-50/50">
                      <div className="flex items-center justify-center gap-2">
                        {renderIcon(row.journalxp.type)}
                        <span className="text-sm text-gray-700 font-medium">{row.journalxp.value}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {renderIcon(row.headspace.type)}
                        <span className="text-sm text-gray-600">{row.headspace.value}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {renderIcon(row.daylio.type)}
                        <span className="text-sm text-gray-600">{row.daylio.value}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Bottom CTA */}
      {/* <div className="mt-8 text-center">
        <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-none">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-2">
              See the difference yourself
            </h3>
            <p className="text-purple-100 mb-6">
              Join 4,000+ users who chose JournalXP for their mental health journey
            </p>
            <a
              href="/signup"
              className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Start Free Today →
            </a>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
};
