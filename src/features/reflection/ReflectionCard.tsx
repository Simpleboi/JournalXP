
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Star, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { getMoodIcon, getSentimentColor } from "./ReflectionUtils";


interface JournalEntry {
  id: string;
  type: string;
  content: string;
  mood: string;
  date: string;
  tags: string[];
  isFavorite: boolean;
  sentiment?: {
    label: string;
    score: number;
  };
}

interface JournalEntryCardProps {
  entry: JournalEntry;
  onToggleFavorite: (id: string) => void;
  onRemoveTag: (id: string, tag: string) => void;
  onAddTag: (id: string) => void;
  activeEntryId: string | null;
  setActiveEntryId: (id: string | null) => void;
  newTag: string;
  setNewTag: (tag: string) => void;
}

export const JournalEntryCard = ({
  entry,
  onToggleFavorite,
  onRemoveTag,
  onAddTag,
  activeEntryId,
  setActiveEntryId,
  newTag,
  setNewTag,
}: JournalEntryCardProps) => {
  return (
    <Card key={entry.id} className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="p-4 md:p-6 flex-grow">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="capitalize">
                  {entry.type.replace("-", " ")}
                </Badge>
                <Badge className={getSentimentColor(entry.sentiment)}>
                  {entry.sentiment?.label || "No sentiment"}
                </Badge>
                <span className="text-lg">{getMoodIcon(entry.mood)}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <CalendarIcon className="h-3 w-3 mr-1" />
                {format(new Date(entry.date), "MMM d, yyyy")}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={entry.isFavorite ? "text-yellow-500" : "text-gray-400"}
              onClick={() => onToggleFavorite(entry.id)}
            >
              <Star className="h-5 w-5" />
            </Button>
          </div>

          <div className="mb-3">
            <p className="text-gray-800">
              {entry.content.length > 200
                ? `${entry.content.substring(0, 200)}...`
                : entry.content}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {entry.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center gap-1 bg-blue-50"
              >
                <Tag className="h-3 w-3" />
                {tag}
                <button
                  className="ml-1 text-gray-500 hover:text-gray-700"
                  onClick={() => onRemoveTag(entry.id, tag)}
                >
                  ×
                </button>
              </Badge>
            ))}

            {activeEntryId === entry.id && (
              <div className="flex items-center gap-1">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  className="h-7 text-xs w-24"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onAddTag(entry.id);
                    }
                  }}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2"
                  onClick={() => onAddTag(entry.id)}
                >
                  +
                </Button>
              </div>
            )}

            {activeEntryId !== entry.id && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setActiveEntryId(entry.id)}
              >
                + Add Tag
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};