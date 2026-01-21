import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Circle,
  Lightbulb,
  Wrench,
  Loader2,
  AlertCircle,
  ChevronUp,
  LogIn,
} from "lucide-react";
import { useGitHubCommits } from "@/hooks/useGitHubCommits";
import { useRoadmapVotes } from "@/hooks/useRoadmapVotes";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { FeatureNotice } from "@/components/FeatureNotice";
import { ReleaseNotes } from "./ReleaseNotes";
import { progress } from "framer-motion";

const roadmapItems = {
  shipped: [
    {
      title: "Insights & Analytics Page",
      description:
        "Visualize mood trends, journal patterns, and productivity metrics",
      version: "v2.2",
    },
    {
      title: "Profile Preferences System",
      description: "Manage theme, notifications, and analytics preferences",
      version: "v2.2",
    },
    {
      title: "Improved Journal Page",
      description: "Re-design of the Journal page to improve your thoughts & feelings",
      version: "v2.2",
    },
    {
      title: "Daily Tasks Section",
      description: "New Tasks to build productivity",
      version: "v2.1",
    },
    {
      title: "Sunday AI Therapist",
      description: "Personalized reflections and mental health guidance powered by AI",
      version: "v2.3",
    },
    {
      title: "Live Clock Component",
      description: "A live clock based in your time zone",
      version: "v2.4",
    },
    {
      title: "Live Weather Update",
      description: "A live weather component that can toggle between imperial and metric units. Uses Geolocation to determine weather accuracy",
      version: "v2.4",
    },
  ],
  inProgress: [
    {
      title: "Daily Planner",
      description:
        "A mindful daily planner designed to help you organize your day, stay grounded, and feel prepared for whatever comes your way.",
      eta: "February 2025",
      progress: 40,
    },
    {
      title: "Journal themes",
      description:
        "Customizable themes that let you personalize your journaling space and create an experience that feels uniquely yours.",
      eta: "February 2025",
      progress: 30
    },
    {
      title: "Community Reflection",
      description:
        "A supportive space to share reflections, connect with like-minded individuals, and grow together through shared experiences.",
      eta: "February 2025",
      progress: 50
    },
  ],
  comingSoon: [
    {
      title: "Voice Journaling",
      description:
        "Speak your thoughts freely, JournalXP will transcribe and analyze your audio entries for deeper insights.",
    },
    {
      title: "Donation Page",
      description:
        "Support JournalXP’s mission and help keep mental wellness tools free and accessible for everyone.",
    },
    {
      title: "Email System",
      description:
        "A fully integrated email experience for activity updates, reminders, password recovery, and personalized insights.",
    },
    {
      title: "API for Developers",
      description:
        "Connect JournalXP with your own apps and workflows using a developer-friendly public API.",
    },
  ],
  considering: [
    {
      title: "Sleep Tracker",
      description:
        "Let users log sleep quality, dreams, and bedtime thoughts. AI gives insights",
    },
    {
      title: "Memory Lane / Highlights",
      description: "AI curates memorable entries",
    },
    {
      title: "Virtual Pet",
      description:
        "Care for your digital companion through wellness activities",
    },
  ],
};

// Helper function to create feature IDs from titles
const createFeatureId = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

export const Roadmap = () => {
  // Fetch live commits from GitHub
  const { commits, loading, error } = useGitHubCommits(
    "Simpleboi",
    "JournalXP",
    8
  );

  // Voting functionality
  const { getVotes, hasVoted, isVoting, toggleVote } = useRoadmapVotes();
  const { user } = useAuth();

  const handleVote = async (featureId: string) => {
    try {
      await toggleVote(featureId);
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  };

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

      {/* Feature Notice */}
      <FeatureNotice
        type="info"
        title="The Voting System is Down"
        message="Due to unexpected issues, our voting system is currently undergoing maintenance and will be restored in the next update. In the meantime, if you'd like to vote on a feature or submit a request, please use the feedback form located in the Contributing section of this page. Thank you for your patience and understanding."
      />

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
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg border border-green-100"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {item.title}
                    </h4>
                    {item.version && (
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        {item.version}
                      </Badge>
                    )}
                  </div>
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
              <CardTitle className="text-blue-900">
                🚧 In Progress (Current Sprint)
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roadmapItems.inProgress.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg border border-blue-100"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {item.title}
                    </h4>
                    <Badge className="bg-blue-100 text-blue-700">
                      {item.eta}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  {/* Progress bar */}
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${item.progress}%` }}
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
              <CardTitle className="text-purple-900">
                🔮 Coming Soon (Q1 2026)
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roadmapItems.comingSoon.map((item, index) => {
                const featureId = createFeatureId(item.title);
                const voteCount = getVotes(featureId);
                const userHasVoted = hasVoted(featureId);
                const voting = isVoting(featureId);

                return (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg border border-purple-100"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-1 text-purple-600">
                        <span className="text-sm font-medium">{voteCount}</span>
                        <span className="text-xs">votes</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {item.description}
                    </p>

                    {user ? (
                      <button
                        onClick={() => handleVote(featureId)}
                        disabled={voting}
                        className={`flex items-center gap-2 text-xs font-medium transition-all ${
                          userHasVoted
                            ? "text-purple-700 bg-purple-100 px-3 py-1.5 rounded-md hover:bg-purple-200"
                            : "text-purple-600 hover:text-purple-700"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {voting ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <ChevronUp
                            className={`h-3 w-3 ${
                              userHasVoted ? "fill-current" : ""
                            }`}
                          />
                        )}
                        {userHasVoted ? "Voted" : "Vote for this feature"}
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        className="flex items-center gap-2 text-xs text-purple-600 hover:text-purple-700 font-medium"
                      >
                        <LogIn className="h-3 w-3" />
                        Sign in to vote
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Under Consideration */}
        <Card className="border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Lightbulb className="h-6 w-6 text-gray-600" />
              <CardTitle className="text-gray-900">
                💭 Under Consideration
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roadmapItems.considering.map((item, index) => {
                const featureId = createFeatureId(item.title);
                const voteCount = getVotes(featureId);
                const userHasVoted = hasVoted(featureId);
                const voting = isVoting(featureId);

                return (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-1 text-gray-600">
                        <span className="text-sm font-medium">{voteCount}</span>
                        <span className="text-xs">votes</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {item.description}
                    </p>

                    {user ? (
                      <button
                        onClick={() => handleVote(featureId)}
                        disabled={voting}
                        className={`flex items-center gap-2 text-xs font-medium transition-all ${
                          userHasVoted
                            ? "text-gray-700 bg-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-300"
                            : "text-gray-600 hover:text-gray-700"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {voting ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <ChevronUp
                            className={`h-3 w-3 ${
                              userHasVoted ? "fill-current" : ""
                            }`}
                          />
                        )}
                        {userHasVoted ? "Voted" : "Vote for this feature"}
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-700 font-medium"
                      >
                        <LogIn className="h-3 w-3" />
                        Sign in to vote
                      </Link>
                    )}
                  </div>
                );
              })}
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
              <Badge className="bg-green-100 text-green-700">Live</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <span className="ml-3 text-gray-600">
                Fetching latest commits...
              </span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-900">
                  Unable to fetch commits
                </p>
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
                      index !== commits.length - 1
                        ? "border-b border-gray-100"
                        : ""
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
                        <span className="text-xs text-gray-500">
                          {commit.author}
                        </span>
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

      {/* Release Notes Section */}
      <ReleaseNotes />
    </div>
  );
};
