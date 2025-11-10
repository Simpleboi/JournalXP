import { motion } from "framer-motion";
import { Reflection } from "@shared/utils/CommunityPost";
import React, { FC } from "react";
import { Users, Clock, Heart, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CommentSectionProps {
  addComment: (reflectionId: string) => void;
  reflection: Reflection;
  getRelativeTime: (dateString: string) => string;
  toggleCommentSupport: (reflectionId: string, commentId: string) => void;
  handleCommentInputChange: (reflectionId: string, value: string) => void;
  commentInputs: Record<string, string>
}

export const CommentSection: FC<CommentSectionProps> = ({
  addComment,
  handleCommentInputChange,
  reflection,
  getRelativeTime,
  toggleCommentSupport,
  commentInputs
}) => {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-gray-50 to-blue-50/20 border-t-2 border-sky-100"
    >
      <div className="p-6 space-y-4">
        {/* Comment Input */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center flex-shrink-0">
            <Users className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 flex gap-2">
            <Input
              placeholder="Share your thoughts..."
              value={commentInputs[reflection.id] || ""}
              onChange={(e) =>
                handleCommentInputChange(reflection.id, e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  addComment(reflection.id);
                }
              }}
              className="flex-1 rounded-full border-2 border-gray-200 focus:border-sky-400 bg-white"
            />
            <Button
              size="sm"
              onClick={() => addComment(reflection.id)}
              disabled={!commentInputs[reflection.id]?.trim()}
              className="rounded-full bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Comments List */}
        {reflection.comments && reflection.comments.length > 0 && (
          <CommentList
            reflection={reflection}
            getRelativeTime={getRelativeTime}
            toggleCommentSupport={toggleCommentSupport}
          />
        )}

        {reflection.comments?.length === 0 && (
          <div className="text-center py-6">
            <MessageCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Be the first to comment</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

interface CommentListProps {
  reflection: Reflection;
  getRelativeTime: (dateString: string) => string;
  toggleCommentSupport: (reflectionId: string, commentId: string) => void;
}

export const CommentList: FC<CommentListProps> = ({
  reflection,
  getRelativeTime,
  toggleCommentSupport,
}) => {
  return (
    <div className="space-y-3 mt-4">
      {reflection.comments.map((comment, idx) => (
        <motion.div
          key={comment.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="flex gap-3 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0">
            <Users className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-gray-700">
                Anonymous
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {getRelativeTime(comment.createdAt)}
              </span>
            </div>
            <p className="text-gray-800 text-sm leading-relaxed mb-2">
              {comment.text}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleCommentSupport(reflection.id, comment.id)}
              className={`gap-1 h-7 px-3 rounded-full text-xs ${
                comment.supported
                  ? "text-pink-600 hover:text-pink-700 bg-pink-50"
                  : "text-gray-500 hover:text-pink-600 hover:bg-pink-50"
              }`}
            >
              <Heart
                className={`h-3 w-3 ${comment.supported ? "fill-current" : ""}`}
              />
              <span className="font-semibold">{comment.supportCount}</span>
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
