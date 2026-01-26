import { Button } from "@/components/ui/button";
import { FC, useEffect } from "react";
import { createPortal } from "react-dom";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Calendar,
  Clock,
  Star,
  Tag,
  BookOpen,
  Timer,
  Trash,
} from "lucide-react";
import {
  getMoodIcon,
  formatDate,
  formatTime,
  getSentimentColor,
} from "@/utils/ReflectionUtils";
import { JournalEntry } from "../journal/JournalEntry";
import { updateJournalEntry } from "@/services/JournalService";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface EnhancedReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: JournalEntry;
  onUpdate?: () => void;
  onDelete?: (id: string) => void;
}

export const EnhancedReflectionModal: FC<EnhancedReflectionModalProps> = ({
  isOpen,
  onClose,
  entry,
  onUpdate,
  onDelete,
}) => {
  const [isFavorite, setIsFavorite] = useState(entry.isFavorite);
  const [isUpdating, setIsUpdating] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleToggleFavorite = async () => {
    setIsUpdating(true);
    try {
      await updateJournalEntry(entry.id, { isFavorite: !isFavorite });
      setIsFavorite(!isFavorite);
      onUpdate?.();
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this entry?")) {
      onDelete?.(entry.id);
      onClose();
    }
  };

  const formatTimeSpent = (seconds?: number) => {
    if (!seconds) return null;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border-2 border-white/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-50/90 to-purple-50/90 backdrop-blur-sm p-4 sm:p-6 border-b border-indigo-100/50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <Badge variant="outline" className="capitalize text-sm rounded-lg border-indigo-200">
                      {entry.type.replace("-", " ")}
                    </Badge>
                    <Badge className={`${getSentimentColor(entry.mood)} text-sm rounded-lg`}>
                      {entry.mood || "No sentiment"}
                    </Badge>
                    <span className="text-2xl">{getMoodIcon(entry.mood)}</span>
                    {isFavorite && (
                      <Badge
                        variant="secondary"
                        className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border border-amber-200 rounded-lg"
                      >
                        <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                        Favorite
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 text-sm text-gray-600 flex-wrap">
                    <div className="flex items-center bg-white/60 px-2 py-1 rounded-lg">
                      <Calendar className="h-4 w-4 mr-1.5 text-indigo-500" />
                      {formatDate(entry.date)}
                    </div>
                    {entry.createdAt && (
                      <div className="flex items-center bg-white/60 px-2 py-1 rounded-lg">
                        <Clock className="h-4 w-4 mr-1.5 text-indigo-500" />
                        {formatTime(entry.createdAt)}
                      </div>
                    )}
                    <div className="flex items-center bg-white/60 px-2 py-1 rounded-lg">
                      <BookOpen className="h-4 w-4 mr-1.5 text-indigo-500" />
                      {entry.wordCount} words
                    </div>
                    {entry.timeSpentWriting && entry.timeSpentWriting > 0 && (
                      <div className="flex items-center bg-white/60 px-2 py-1 rounded-lg">
                        <Timer className="h-4 w-4 mr-1.5 text-indigo-500" />
                        {formatTimeSpent(entry.timeSpentWriting)}
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <Tag className="h-4 w-4 text-indigo-400" />
                      {entry.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-indigo-100/80 text-indigo-700 rounded-lg">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-1 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-xl ${
                      isFavorite
                        ? "text-amber-500 hover:text-amber-600 hover:bg-amber-50"
                        : "text-gray-400 hover:text-amber-500 hover:bg-amber-50"
                    }`}
                    onClick={handleToggleFavorite}
                    disabled={isUpdating}
                    title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Star
                      className={isFavorite ? "h-5 w-5 fill-current" : "h-5 w-5"}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                    onClick={handleDelete}
                    title="Delete entry"
                  >
                    <Trash className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl"
                    onClick={onClose}
                    title="Close"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gradient-to-b from-white/50 to-indigo-50/30">
              <div className="text-gray-800 whitespace-pre-wrap leading-relaxed text-base">
                {entry.content}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-indigo-100/50 p-4 bg-white/60 backdrop-blur-sm flex justify-end">
              <Button
                variant="outline"
                onClick={onClose}
                className="rounded-xl border-2 border-indigo-200/60 hover:bg-indigo-50 hover:border-indigo-300"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Use portal to render modal at document body level
  return createPortal(modalContent, document.body);
};
