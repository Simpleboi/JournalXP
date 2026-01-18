import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Users, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommunityBanner } from "@/features/community/CommunityBanner";
import { CommunityNav } from "@/features/community/CommunityNav";
import { PromptCard } from "@/features/community/PromptCard";
import { DailyResponseCounter } from "@/features/community/DailyResponseCounter";
import { MyResponsesHistory } from "@/features/community/MyResponsesHistory";
import {
  getPrompts,
  createResponse,
  toggleHeart,
  reportResponse,
} from "@/services/communityService";
import { useToast } from "@/hooks/useToast";
import type {
  GetPromptsResponse,
  CommunityPromptWithResponses,
  PromptCategory,
  ReportReason,
} from "@shared/types/community";

const CATEGORY_FILTERS: { value: PromptCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "gratitude", label: "Gratitude" },
  { value: "growth", label: "Growth" },
  { value: "reflection", label: "Reflection" },
  { value: "connection", label: "Connection" },
  { value: "mindfulness", label: "Mindfulness" },
];

export default function CommunityReflectionsPage() {
  const [data, setData] = useState<GetPromptsResponse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | "all">("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const loadPrompts = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const result = await getPrompts();
      setData(result);
    } catch (err: any) {
      setError(err.message || "Failed to load prompts");
      console.error("Error loading prompts:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);

  const handleSubmitResponse = async (promptId: string, content: string) => {
    const result = await createResponse({ promptId, content });

    // Update local state
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        responsesToday: result.responsesToday,
        prompts: prev.prompts.map((p) => {
          if (p.prompt.id === promptId) {
            return {
              ...p,
              hasResponded: true,
              userResponseId: result.response.id,
              responses: [result.response, ...p.responses],
              prompt: {
                ...p.prompt,
                responseCount: p.prompt.responseCount + 1,
              },
            };
          }
          return p;
        }),
      };
    });

    // Show XP toast
    showToast({
      title: `+${result.xpAwarded} XP Earned!`,
      description: result.leveledUp
        ? `Congratulations! You reached Level ${result.newLevel}!`
        : "Thanks for sharing with the community",
    });

    // Show achievement toast if any
    if (result.achievements && result.achievements.length > 0) {
      showToast({
        title: "Achievement Unlocked!",
        description: "Check your achievements page to see what you earned",
      });
    }
  };

  const handleToggleHeart = async (responseId: string) => {
    const result = await toggleHeart(responseId);

    // Update local state
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        prompts: prev.prompts.map((p) => ({
          ...p,
          responses: p.responses.map((r) => {
            if (r.id === responseId) {
              return {
                ...r,
                hasHearted: result.hearted,
                heartCount: result.heartCount,
              };
            }
            return r;
          }),
        })),
      };
    });
  };

  const handleReport = async (
    responseId: string,
    reason: ReportReason,
    details?: string
  ) => {
    await reportResponse({ responseId, reason, details });
    showToast({
      title: "Report Submitted",
      description: "Thank you for helping keep our community safe",
    });
  };

  const filteredPrompts =
    selectedCategory === "all"
      ? data?.prompts
      : data?.prompts.filter((p) => p.prompt.category === selectedCategory);

  const dailyLimitReached =
    data && data.responsesToday >= data.maxResponsesPerDay;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-blue-50 to-purple-50">
      <CommunityNav />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Info Banner */}
        <CommunityBanner />

        {/* Daily Counter & History */}
        {data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 space-y-4"
          >
            <div className="flex items-center justify-between gap-4">
              <DailyResponseCounter
                responsesToday={data.responsesToday}
                maxResponsesPerDay={data.maxResponsesPerDay}
              />
              <div className="flex items-center gap-2">
                <MyResponsesHistory />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadPrompts(true)}
                  disabled={refreshing}
                  className="rounded-full"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Filter by category
            </span>
          </div>
          <Tabs
            value={selectedCategory}
            onValueChange={(v) => setSelectedCategory(v as PromptCategory | "all")}
          >
            <TabsList className="bg-white/80 backdrop-blur-sm p-1 flex-wrap h-auto gap-2">
              {CATEGORY_FILTERS.map((cat) => (
                <TabsTrigger
                  key={cat.value}
                  value={cat.value}
                  className="data-[state=active]:bg-sky-100 data-[state=active]:text-sky-700 rounded-full px-4"
                >
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Prompts Feed */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto" />
              <p className="text-gray-600 mt-4">Loading community prompts...</p>
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="p-12 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => loadPrompts()}>Try Again</Button>
              </Card>
            </motion.div>
          ) : filteredPrompts && filteredPrompts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="p-12 text-center">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No prompts available
                </h3>
                <p className="text-gray-600 mb-6">
                  {selectedCategory === "all"
                    ? "Check back later for new community prompts!"
                    : `No ${selectedCategory} prompts available right now. Try another category!`}
                </p>
                {selectedCategory !== "all" && (
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCategory("all")}
                  >
                    View All Categories
                  </Button>
                )}
              </Card>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredPrompts?.map((promptData, index) => (
                <motion.div
                  key={promptData.prompt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <PromptCard
                    data={promptData}
                    onSubmitResponse={handleSubmitResponse}
                    onToggleHeart={handleToggleHeart}
                    onReport={handleReport}
                    canRespond={!promptData.hasResponded}
                    dailyLimitReached={dailyLimitReached || false}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* XP Info Footer */}
        {data && data.prompts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm">
              <Sparkles className="h-4 w-4" />
              <span>
                Earn <strong>20 XP</strong> for each response (max{" "}
                {data.maxResponsesPerDay} per day)
              </span>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
