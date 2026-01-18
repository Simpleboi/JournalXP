import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { COMMUNITY_CONSTANTS } from "@shared/types/community";

interface ResponseFormProps {
  promptId: string;
  onSubmit: (promptId: string, content: string) => Promise<void>;
  disabled?: boolean;
  disabledReason?: string;
}

export function ResponseForm({
  promptId,
  onSubmit,
  disabled,
  disabledReason,
}: ResponseFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const charCount = content.length;
  const maxLength = COMMUNITY_CONSTANTS.MAX_RESPONSE_LENGTH;
  const isOverLimit = charCount > maxLength;
  const isEmpty = content.trim().length === 0;

  const handleSubmit = async () => {
    if (isEmpty || isOverLimit || disabled) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(promptId, content.trim());
      setContent(""); // Clear on success
    } catch (err: any) {
      setError(err.message || "Failed to submit response. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 space-y-3"
    >
      <div className="relative">
        <Textarea
          placeholder={
            disabled && disabledReason
              ? disabledReason
              : "Share your thoughts anonymously..."
          }
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isSubmitting}
          rows={3}
          className={`resize-none pr-16 ${
            isOverLimit
              ? "border-red-300 focus:ring-red-500"
              : "border-gray-200 focus:ring-sky-500"
          }`}
        />
        <div
          className={`absolute bottom-2 right-2 text-xs ${
            isOverLimit ? "text-red-500 font-medium" : "text-gray-400"
          }`}
        >
          {charCount}/{maxLength}
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </motion.div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Earn 20 XP for responding</span>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isEmpty || isOverLimit || disabled || isSubmitting}
          size="sm"
          className="bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 rounded-full px-4"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Share
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-gray-400 text-center">
        Press Ctrl+Enter (Cmd+Enter on Mac) to submit
      </p>
    </motion.div>
  );
}
