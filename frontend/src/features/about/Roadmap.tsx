import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Lightbulb, Wrench, Loader2, AlertCircle } from "lucide-react";
import { useGitHubCommits } from "@/hooks/useGitHubCommits";

const roadmapItems = {
  shipped: [
    { title: "Habit Tracking System", description: "Custom goals, streaks, XP rewards" },
    { title: "Daily Tasks Section", description: "New Tasks to build productivity" },
    { title: "Journal Page", description: "Journal your thoughts & feelings" },
    { title: "Meditation Room", description: "Breathing exercises & affirmations" },
  ],
  inProgress: [
    { title: "Sunday AI Therapist", description: "Personalized reflections and mental health guidance powered by AI", eta: "December 2025" },
    { title: "Achievement System", description: "Earn badges and milestones as you journal, build habits, and grow", eta: "December 2025" },
    { title: "Insights & Analytics", description: "Visual breakdowns of mood trends, habit consistency, and emotional growth", eta: "December 2025" },
  ],
  comingSoon: [
    { title: "Voice Journaling", description: "Record audio entries with AI transcription", votes: 847 },
    { title: "Therapist Matching", description: "Connect with licensed professionals", votes: 623 },
    { title: "Group Challenges", description: "Team up with friends for wellness goals", votes: 412 },
    { title: "API for Developers", description: "Build integrations with JournalXP", votes: 289 },
  ],
  considering: [
    { title: "Wearable Integration", description: "Apple Watch, Fitbit sync", votes: 534 },
    { title: "Family Sharing", description: "Share progress with trusted family", votes: 298 },
    { title: "Enterprise Plans", description: "Team wellness for organizations", votes: 156 },
    { title: "Multi-language Support", description: "Spanish, French, German, more", votes: 721 },
  ],
};

export const Roadmap = () => {
  // Fetch live commits from GitHub
  const { commits, loading, error } = useGitHubCommits("Simpleboi", "JournalXP", 8);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Product Roadmap
        </h2>
        <p className="text-xl text-gray-600">
          See what we're building next (updated weekly)
        </p>
      </div>

      <div className="space-y-8">
        {/* Shipped */}
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <CardTitle className="text-green-900">✅ Shipped</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roadmapItems.shipped.map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-green-100">
                  <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* In Progress */}
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Wrench className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-blue-900">🚧 In Progress (Current Sprint)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roadmapItems.inProgress.map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-blue-100">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <Badge className="bg-blue-100 text-blue-700">{item.eta}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  {/* Progress bar */}
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.random() * 40 + 40}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon */}
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Circle className="h-6 w-6 text-purple-600" />
              <CardTitle className="text-purple-900">🔮 Coming Soon (Q2 2025)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roadmapItems.comingSoon.map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-purple-100">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <div className="flex items-center gap-1 text-purple-600">
                      <span className="text-sm font-medium">{item.votes}</span>
                      <span className="text-xs">votes</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  <button className="text-xs text-purple-600 hover:text-purple-700 font-medium">
                    Vote for this feature →
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Under Consideration */}
        <Card className="border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Lightbulb className="h-6 w-6 text-gray-600" />
              <CardTitle className="text-gray-900">💭 Under Consideration</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roadmapItems.considering.map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-100">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <div className="flex items-center gap-1 text-gray-600">
                      <span className="text-sm font-medium">{item.votes}</span>
                      <span className="text-xs">votes</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  <button className="text-xs text-gray-600 hover:text-gray-700 font-medium">
                    Vote for this feature →
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Updates - Live from GitHub */}
      <Card className="mt-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Development Updates (Live from GitHub)</CardTitle>
            {!loading && !error && (
              <Badge className="bg-green-100 text-green-700">
                Live
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <span className="ml-3 text-gray-600">Fetching latest commits...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-900">Unable to fetch commits</p>
                <p className="text-xs text-red-700">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && commits.length > 0 && (
            <>
              <div className="space-y-3">
                {commits.map((commit, index) => (
                  <div
                    key={commit.sha}
                    className={`flex items-start gap-3 pb-3 ${
                      index !== commits.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div className="text-xs text-gray-500 w-24 flex-shrink-0">
                      {commit.timeAgo}
                    </div>
                    <div className="flex-1">
                      <a
                        href={commit.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                      >
                        {commit.message}
                      </a>
                      <div className="flex items-center gap-2 mt-1">
                        <a
                          href={commit.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-gray-500 hover:text-indigo-600 font-mono"
                        >
                          {commit.shortSha}
                        </a>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{commit.author}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <a
                  href="https://github.com/Simpleboi/JournalXP/commits"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  View full changelog on GitHub →
                </a>
              </div>
            </>
          )}

          {!loading && !error && commits.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No recent commits found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
