import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Heart, Calendar, MessageSquare, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getMyResponses } from "@/services/communityService";
import type { GetUserHistoryResponse, PromptCategory } from "@shared/types/community";

const CATEGORY_STYLES: Record<PromptCategory, { bg: string; text: string }> = {
  gratitude: { bg: "bg-amber-100", text: "text-amber-700" },
  growth: { bg: "bg-green-100", text: "text-green-700" },
  reflection: { bg: "bg-purple-100", text: "text-purple-700" },
  connection: { bg: "bg-pink-100", text: "text-pink-700" },
  mindfulness: { bg: "bg-blue-100", text: "text-blue-700" },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });
}

export function MyResponsesHistory() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<GetUserHistoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !data) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getMyResponses({ limit: 20 });
      setData(result);
    } catch (err: any) {
      setError(err.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-full"
        >
          <History className="h-4 w-4" />
          My Responses
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-sky-600" />
            My Response History
          </SheetTitle>
          <SheetDescription>
            View all your community responses and the hearts you've received
          </SheetDescription>
        </SheetHeader>

        {/* Stats Summary */}
        {data && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-3 my-6"
          >
            <Card className="bg-sky-50 border-sky-200">
              <CardContent className="p-4 text-center">
                <MessageSquare className="h-6 w-6 text-sky-600 mx-auto mb-1" />
                <div className="text-2xl font-bold text-sky-700">{data.totalResponses}</div>
                <div className="text-xs text-sky-600">Total Responses</div>
              </CardContent>
            </Card>
            <Card className="bg-pink-50 border-pink-200">
              <CardContent className="p-4 text-center">
                <Heart className="h-6 w-6 text-pink-600 mx-auto mb-1" />
                <div className="text-2xl font-bold text-pink-700">{data.totalHeartsReceived}</div>
                <div className="text-xs text-pink-600">Hearts Received</div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Responses List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-sky-600 border-t-transparent mx-auto" />
              <p className="text-gray-500 mt-4">Loading your responses...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
              <Button variant="outline" onClick={loadHistory} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : data?.responses.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">You haven't shared any responses yet.</p>
              <p className="text-sm text-gray-400 mt-2">
                Start responding to prompts to build your history!
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {data?.responses.map((response, index) => {
                const categoryStyle = CATEGORY_STYLES[response.promptCategory] || CATEGORY_STYLES.reflection;
                return (
                  <motion.div
                    key={response.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        {/* Prompt Info */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <Badge className={`${categoryStyle.bg} ${categoryStyle.text} border-0 text-xs`}>
                            {response.promptCategory}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {formatDate(response.createdAt)}
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 italic mb-2 line-clamp-2">
                          "{response.promptText}"
                        </p>

                        {/* User's Response */}
                        <div className="bg-gray-50 rounded-lg p-3 mt-3">
                          <p className="text-sm text-gray-800">{response.content}</p>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                            <span className="text-xs text-gray-500">{response.anonymousName}</span>
                            <div className="flex items-center gap-1 text-pink-600">
                              <Heart className="h-3.5 w-3.5 fill-current" />
                              <span className="text-sm font-medium">{response.heartCount}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
