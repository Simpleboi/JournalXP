import { Button } from "@/components/ui/button";
import { FC } from "react";
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

  if (!isOpen) return null;

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

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <Badge variant="outline" className="capitalize text-sm">
                  {entry.type.replace("-", " ")}
                </Badge>
                <Badge className={`${getSentimentColor(entry.mood)} text-sm`}>
                  {entry.mood || "No sentiment"}
                </Badge>
                <span className="text-2xl">{getMoodIcon(entry.mood)}</span>
                {isFavorite && (
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800"
                  >
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Favorite
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(entry.date)}
                </div>
                {entry.createdAt && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatTime(entry.createdAt)}
                  </div>
                )}
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {entry.wordCount} words
                </div>
                {entry.timeSpentWriting && entry.timeSpentWriting > 0 && (
                  <div className="flex items-center">
                    <Timer className="h-4 w-4 mr-1" />
                    {formatTimeSpent(entry.timeSpentWriting)} writing time
                  </div>
                )}
              </div>

              {/* Tags */}
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <Tag className="h-4 w-4 text-gray-400" />
                  {entry.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 ml-4">
              <Button
                variant="ghost"
                size="icon"
                className={
                  isFavorite
                    ? "text-yellow-500 hover:text-yellow-600"
                    : "text-gray-400 hover:text-yellow-500"
                }
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
                className="text-gray-400 hover:text-red-600"
                onClick={handleDelete}
                title="Delete entry"
              >
                <Trash className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-gray-600"
                onClick={onClose}
                title="Close"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="text-gray-800 whitespace-pre-wrap leading-relaxed text-base">
            {entry.content}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
