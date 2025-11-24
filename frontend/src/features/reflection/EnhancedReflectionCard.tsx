import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JournalEntry } from "../journal/JournalEntry";
import {
  getSentimentColor,
  formatDate,
  formatTime,
  getMoodIcon,
} from "@/utils/ReflectionUtils";
import { FC, useState } from "react";
import {
  Calendar,
  Trash,
  Clock,
  Star,
  Tag,
  BookOpen,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateJournalEntry } from "@/services/JournalService";

export interface EnhancedReflectionCardProps {
  entry: JournalEntry;
  onDeleteEntry: (id: string) => void;
  onUpdate?: () => void;
}

export const EnhancedReflectionCard: FC<EnhancedReflectionCardProps> = ({
  entry,
  onDeleteEntry,
  onUpdate,
}) => {
  const [isFavorite, setIsFavorite] = useState(entry.isFavorite);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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
    <Card
      className="overflow-hidden mb-4 transition-all hover:shadow-md cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="p-4">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="outline" className="capitalize">
                {entry.type.replace("-", " ")}
              </Badge>
              <Badge className={getSentimentColor(entry.mood)}>
                {entry.mood || "No sentiment"}
              </Badge>
              <span className="text-lg">{getMoodIcon(entry.mood)}</span>
              {isFavorite && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Favorite
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(entry.date)}
              </div>
              {entry.createdAt && (
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTime(entry.createdAt)}
                </div>
              )}
              <div className="flex items-center">
                <BookOpen className="h-3 w-3 mr-1" />
                {entry.wordCount} words
              </div>
              {entry.timeSpentWriting && (
                <div className="flex items-center">
                  <Timer className="h-3 w-3 mr-1" />
                  {formatTimeSpent(entry.timeSpentWriting)}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-1 ml-2">
            <Button
              variant="ghost"
              size="icon"
              className={
                isFavorite
                  ? "text-yellow-500 hover:text-yellow-600"
                  : "text-gray-400 hover:text-yellow-500"
              }
              onClick={(e) => {
                e.stopPropagation();
                handleToggleFavorite();
              }}
              disabled={isUpdating}
            >
              <Star className={isFavorite ? "h-5 w-5 fill-current" : "h-5 w-5"} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm("Are you sure you want to delete this entry?")) {
                  onDeleteEntry(entry.id);
                }
              }}
            >
              <Trash className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Tags Section */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Tag className="h-3 w-3 text-gray-400" />
            {entry.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Content Preview/Full */}
        <div className="mb-2">
          <p className="text-gray-800 whitespace-pre-wrap">
            {isExpanded
              ? entry.content
              : entry.content.length > 200
              ? `${entry.content.substring(0, 200)}...`
              : entry.content}
          </p>
        </div>

        {/* Expand/Collapse Indicator */}
        {entry.content.length > 200 && (
          <div className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            {isExpanded ? "Show less" : "Read more"}
          </div>
        )}
      </div>
    </Card>
  );
};
