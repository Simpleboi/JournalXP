import { motion } from "framer-motion";
import { Clock, User } from "lucide-react";
import { HeartButton } from "./HeartButton";
import { ReportDialog } from "./ReportDialog";
import type { CommunityResponse, ReportReason } from "@shared/types/community";

interface ResponseCardProps {
  response: CommunityResponse;
  onToggleHeart: (responseId: string) => Promise<void>;
  onReport: (responseId: string, reason: ReportReason, details?: string) => Promise<void>;
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function ResponseCard({ response, onToggleHeart, onReport }: ResponseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg border ${
        response.isOwn
          ? "bg-sky-50/50 border-sky-200"
          : "bg-white border-gray-100"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center flex-shrink-0">
            <User className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-800">
                {response.anonymousName}
              </span>
              {response.isOwn && (
                <span className="text-xs px-2 py-0.5 bg-sky-100 text-sky-700 rounded-full">
                  You
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              {getRelativeTime(response.createdAt)}
            </div>
          </div>
        </div>

        {/* Report button (don't show for own responses) */}
        {!response.isOwn && (
          <ReportDialog responseId={response.id} onReport={onReport} />
        )}
      </div>

      {/* Content */}
      <p className="text-gray-700 leading-relaxed mb-3">{response.content}</p>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <HeartButton
          hearted={response.hasHearted}
          heartCount={response.heartCount}
          onToggle={() => onToggleHeart(response.id)}
        />
      </div>
    </motion.div>
  );
}
