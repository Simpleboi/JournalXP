import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResponseCard } from "./ResponseCard";
import { ResponseForm } from "./ResponseForm";
import type {
  CommunityPromptWithResponses,
  PromptCategory,
  ReportReason,
} from "@shared/types/community";

interface PromptCardProps {
  data: CommunityPromptWithResponses;
  onSubmitResponse: (promptId: string, content: string) => Promise<void>;
  onToggleHeart: (responseId: string) => Promise<void>;
  onReport: (responseId: string, reason: ReportReason, details?: string) => Promise<void>;
  canRespond: boolean;
  dailyLimitReached: boolean;
}

const CATEGORY_STYLES: Record<PromptCategory, { bg: string; text: string; label: string }> = {
  gratitude: { bg: "bg-amber-100", text: "text-amber-700", label: "Gratitude" },
  growth: { bg: "bg-green-100", text: "text-green-700", label: "Growth" },
  reflection: { bg: "bg-purple-100", text: "text-purple-700", label: "Reflection" },
  connection: { bg: "bg-pink-100", text: "text-pink-700", label: "Connection" },
  mindfulness: { bg: "bg-blue-100", text: "text-blue-700", label: "Mindfulness" },
};

export function PromptCard({
  data,
  onSubmitResponse,
  onToggleHeart,
  onReport,
  canRespond,
  dailyLimitReached,
}: PromptCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { prompt, responses, hasResponded } = data;
  const categoryStyle = CATEGORY_STYLES[prompt.category] || CATEGORY_STYLES.reflection;

  const getDisabledReason = () => {
    if (hasResponded) return "You've already responded to this prompt";
    if (dailyLimitReached) return "Daily response limit reached";
    return undefined;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-sky-100">
        <CardContent className="p-0">
          {/* Prompt Header */}
          <div className="p-6 bg-gradient-to-br from-white to-sky-50/30">
            <div className="flex items-start justify-between gap-4 mb-4">
              <Badge className={`${categoryStyle.bg} ${categoryStyle.text} border-0 rounded-full px-3 py-1`}>
                {categoryStyle.label}
              </Badge>
              {hasResponded && (
                <div className="flex items-center gap-1 text-emerald-600 text-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-medium">Responded</span>
                </div>
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-800 leading-relaxed mb-4">
              {prompt.text}
            </h3>

            {/* Response Form (only show if user can respond) */}
            {!hasResponded && canRespond && (
              <ResponseForm
                promptId={prompt.id}
                onSubmit={onSubmitResponse}
                disabled={dailyLimitReached}
                disabledReason={getDisabledReason()}
              />
            )}

            {/* Expand/Collapse Button */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="gap-2 rounded-full px-4 text-gray-600 hover:text-sky-600 hover:bg-sky-50"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="font-semibold">{responses.length}</span>
                <span className="text-gray-500">
                  {responses.length === 1 ? "response" : "responses"}
                </span>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 ml-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-1" />
                )}
              </Button>

              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>+20 XP</span>
              </div>
            </div>
          </div>

          {/* Responses Section */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-3">
                  {responses.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No responses yet. Be the first to share!</p>
                    </div>
                  ) : (
                    responses.map((response) => (
                      <ResponseCard
                        key={response.id}
                        response={response}
                        onToggleHeart={onToggleHeart}
                        onReport={onReport}
                      />
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
