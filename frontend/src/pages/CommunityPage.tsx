import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Plus,
  Heart,
  Filter,
  Clock,
  Users,
  MessageCircle,
  Send,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Comment, Reflection, MOODS } from "@shared/utils/CommunityPost";
import { STARTER_REFLECTIONS } from "@/data/Community";
import { CommunityBanner } from "@/features/community/CommunityBanner";
import { CommunityNav } from "@/features/community/CommunityNav";
import { CommentSection } from "@/features/community/CommunityPostCard";

export default function CommunityReflectionsPage() {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [selectedMood, setSelectedMood] = useState("all");
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    // Load reflections from localStorage
    const saved = localStorage.getItem("communityReflections");
    if (saved) {
      const loadedReflections = JSON.parse(saved);
      // Ensure comments array exists
      const withComments = loadedReflections.map((r: Reflection) => ({
        ...r,
        comments: r.comments || [],
        commentsExpanded: false,
      }));
      setReflections(withComments);
    } else {
      const withComments = STARTER_REFLECTIONS.map((r) => ({
        ...r,
        comments: [],
        commentsExpanded: false,
      }));
      setReflections(withComments);
    }
    setLoading(false);
  }, []);

  const filteredReflections =
    selectedMood === "all"
      ? reflections
      : reflections.filter((r) => r.mood === selectedMood);

  const toggleSupport = (id: string) => {
    const updated = reflections.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          supported: !r.supported,
          supportCount: r.supported ? r.supportCount - 1 : r.supportCount + 1,
        };
      }
      return r;
    });
    setReflections(updated);
    localStorage.setItem("communityReflections", JSON.stringify(updated));
  };

  const toggleCommentSupport = (reflectionId: string, commentId: string) => {
    const updated = reflections.map((r) => {
      if (r.id === reflectionId) {
        const updatedComments = r.comments?.map((c) => {
          if (c.id === commentId) {
            return {
              ...c,
              supported: !c.supported,
              supportCount: c.supported
                ? c.supportCount - 1
                : c.supportCount + 1,
            };
          }
          return c;
        });
        return { ...r, comments: updatedComments };
      }
      return r;
    });
    setReflections(updated);
    localStorage.setItem("communityReflections", JSON.stringify(updated));
  };

  const toggleCommentsExpanded = (id: string) => {
    const updated = reflections.map((r) => {
      if (r.id === id) {
        return { ...r, commentsExpanded: !r.commentsExpanded };
      }
      return r;
    });
    setReflections(updated);
  };

  const addComment = (reflectionId: string) => {
    const commentText = commentInputs[reflectionId]?.trim();
    if (!commentText) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      text: commentText,
      createdAt: new Date().toISOString(),
      supportCount: 0,
      supported: false,
    };

    const updated = reflections.map((r) => {
      if (r.id === reflectionId) {
        return {
          ...r,
          comments: [...(r.comments || []), newComment],
          commentsExpanded: true,
        };
      }
      return r;
    });

    setReflections(updated);
    localStorage.setItem("communityReflections", JSON.stringify(updated));
    setCommentInputs({ ...commentInputs, [reflectionId]: "" });
  };

  const handleCommentInputChange = (reflectionId: string, value: string) => {
    setCommentInputs({ ...commentInputs, [reflectionId]: value });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getMoodColor = (mood: string) => {
    return MOODS.find((m) => m.value === mood)?.color || MOODS[0].color;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-blue-50 to-purple-50">
      {/* Header */}
      <CommunityNav />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Info Banner */}
        <CommunityBanner />

        {/* Mood Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Filter by mood
            </span>
          </div>
          <Tabs value={selectedMood} onValueChange={setSelectedMood}>
            <TabsList className="bg-white/80 backdrop-blur-sm p-1 flex-wrap h-auto gap-2">
              {MOODS.map((mood) => (
                <TabsTrigger
                  key={mood.value}
                  value={mood.value}
                  className="data-[state=active]:bg-sky-100 data-[state=active]:text-sky-700 rounded-full px-4"
                >
                  {mood.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Reflections Feed */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading reflections...</p>
            </div>
          ) : filteredReflections.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="p-12 text-center">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No reflections yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Be the first to share an uplifting thought with the community
                </p>
                <Button
                  className="bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600"
                  asChild
                >
                  <Link to="/reflections/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Share a Reflection
                  </Link>
                </Button>
              </Card>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredReflections.map((reflection, index) => (
                <motion.div
                  key={reflection.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <Card className="hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-sky-100">
                    <CardContent className="p-0">
                      {/* Main Reflection Content */}
                      <div className="p-6 bg-gradient-to-br from-white to-sky-50/30">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <Badge
                            className={`${getMoodColor(
                              reflection.mood
                            )} border-0 rounded-full px-3 py-1 text-xs font-medium shadow-sm`}
                          >
                            {
                              MOODS.find((m) => m.value === reflection.mood)
                                ?.label
                            }
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="h-3 w-3" />
                            {getRelativeTime(reflection.createdAt)}
                          </div>
                        </div>

                        <p className="text-gray-800 text-lg leading-relaxed mb-6 font-medium">
                          {reflection.text}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleSupport(reflection.id)}
                              className={`gap-2 rounded-full px-4 ${
                                reflection.supported
                                  ? "text-pink-600 hover:text-pink-700 bg-pink-50"
                                  : "text-gray-600 hover:text-pink-600 hover:bg-pink-50"
                              }`}
                              aria-label={
                                reflection.supported
                                  ? "Remove support"
                                  : "Show support"
                              }
                            >
                              <Heart
                                className={`h-4 w-4 ${
                                  reflection.supported ? "fill-current" : ""
                                }`}
                              />
                              <span className="font-semibold">
                                {reflection.supportCount}
                              </span>
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                toggleCommentsExpanded(reflection.id)
                              }
                              className="gap-2 rounded-full px-4 text-gray-600 hover:text-sky-600 hover:bg-sky-50"
                            >
                              <MessageCircle className="h-4 w-4" />
                              <span className="font-semibold">
                                {reflection.comments?.length || 0}
                              </span>
                              {reflection.commentsExpanded ? (
                                <ChevronUp className="h-3 w-3" />
                              ) : (
                                <ChevronDown className="h-3 w-3" />
                              )}
                            </Button>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center">
                              <Users className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-xs text-gray-500 italic font-medium">
                              Anonymous
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Comments Section */}
                      <AnimatePresence>
                        {reflection.commentsExpanded && (
                          <CommentSection
                            addComment={addComment}
                            handleCommentInputChange={handleCommentInputChange}
                            reflection={reflection}
                            getRelativeTime={getRelativeTime}
                            toggleCommentSupport={toggleCommentSupport}
                            commentInputs={commentInputs}
                          />
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Load More (placeholder for pagination) */}
        {filteredReflections.length > 0 && (
          <div className="mt-8 text-center">
            <Button variant="outline" className="rounded-full">
              Load More Reflections
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
