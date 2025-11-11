import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Book, Brain, Target, BarChart3, PawPrint, Users } from "lucide-react";

const features = [
  {
    id: "journaling",
    icon: Book,
    title: "Smart Journaling",
    stat: "30 XP per entry",
    description: "3 modes: Free-writing, Guided prompts, Gratitude practice",
    color: "from-purple-500 to-purple-700",
    bgColor: "bg-purple-50",
  },
  {
    id: "sunday",
    icon: Brain,
    title: "AI Wellness Companion",
    stat: "24/7 Support",
    description: "GPT-4o powered therapist that remembers your journey",
    color: "from-blue-500 to-blue-700",
    bgColor: "bg-blue-50",
  },
  {
    id: "habits",
    icon: Target,
    title: "Habit Tracking",
    stat: "Custom Goals",
    description: "Build consistency with streaks, XP rewards, and progress tracking",
    color: "from-green-500 to-green-700",
    bgColor: "bg-green-50",
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Insights & Analytics",
    stat: "AI-Powered",
    description: "Mood trends, pattern detection, burnout warnings, correlations",
    color: "from-indigo-500 to-indigo-700",
    bgColor: "bg-indigo-50",
  },
  {
    id: "pet",
    icon: PawPrint,
    title: "Virtual Pet",
    stat: "Quest System",
    description: "Grow your companion as you level up your wellness",
    color: "from-pink-500 to-pink-700",
    bgColor: "bg-pink-50",
  },
  {
    id: "community",
    icon: Users,
    title: "Anonymous Community",
    stat: "Safe Space",
    description: "Share reflections and support others without judgment",
    color: "from-orange-500 to-orange-700",
    bgColor: "bg-orange-50",
  },
];

export const FeatureShowcase = () => {
  const [selectedFeature, setSelectedFeature] = useState(features[0]);

  return (
    <div id="get-started" className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Everything You Need to Thrive
        </h2>
        <p className="text-xl text-gray-600">
          Powerful mental health tools, gamified for engagement
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        {features.map((feature) => {
          const Icon = feature.icon;
          const isSelected = selectedFeature.id === feature.id;

          return (
            <button
              key={feature.id}
              onClick={() => setSelectedFeature(feature)}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? "border-indigo-500 bg-indigo-50 shadow-lg transform scale-105"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
              }`}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
              <p className="text-xs text-gray-600">{feature.stat}</p>
            </button>
          );
        })}
      </div>

      {/* Selected Feature Detail */}
      <Card className={`${selectedFeature.bgColor} border-2`}>
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${selectedFeature.color} flex items-center justify-center flex-shrink-0`}>
              {React.createElement(selectedFeature.icon, {
                className: "h-10 w-10 text-white",
              })}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-3xl font-bold text-gray-900">{selectedFeature.title}</h3>
                <span className="px-3 py-1 bg-white rounded-full text-sm font-semibold text-gray-700">
                  {selectedFeature.stat}
                </span>
              </div>
              <p className="text-lg text-gray-700 mb-6">{selectedFeature.description}</p>

              {/* Feature-specific details */}
              {selectedFeature.id === "journaling" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Mood tracking with every entry</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Word count tracking & analytics</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Favorite entries & calendar view</span>
                  </div>
                </div>
              )}

              {selectedFeature.id === "sunday" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Powered by GPT-4o for natural conversations</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Remembers your entire journal history</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Non-judgmental, compassionate responses</span>
                  </div>
                </div>
              )}

              {selectedFeature.id === "habits" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Daily, weekly, or monthly frequency</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Custom XP rewards you set yourself</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Target completions & progress tracking</span>
                  </div>
                </div>
              )}

              {selectedFeature.id === "analytics" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span>Wellness score (0-100) across 4 dimensions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span>Mood × productivity correlation analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span>Burnout risk detection & prevention</span>
                  </div>
                </div>
              )}

              {selectedFeature.id === "pet" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span>5 pet types: Cat, Dog, Turtle, Bird, Rabbit</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span>Quest system with rewards & accessories</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span>Pet grows as you maintain wellness habits</span>
                  </div>
                </div>
              )}

              {selectedFeature.id === "community" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>100% anonymous posting (no usernames)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>AI content moderation for safety</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Support button & nested comment threads</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">Ready to start your wellness journey?</p>
        <a
          href="/signup"
          className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
        >
          Get Started Free →
        </a>
      </div>
    </div>
  );
};
