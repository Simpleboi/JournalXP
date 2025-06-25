import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag, Star, Calendar as CalendarIcon, X, Trash } from "lucide-react";
import { JournalEntry } from "../journal/JournalEntry";
import { moodOptions } from "./ReflectionMoods";
import { useState } from "react";
import { getSentimentColor } from "./ReflectionMoods";
import "../../styles/example.scss";


interface ReflectionListViewProps {
  filteredEntries: JournalEntry[];
  searchTerm: string;
  filterMood: string;
  filterType: string;
  filterTag: string;
  setSearchTerm: (val: string) => void;
  setFilterMood: (val: string) => void;
  setFilterType: (val: string) => void;
  setFilterTag: (val: string) => void;
  onToggleFavorite: (id: string) => void;
  onRemoveTag: (id: string, tag: string) => void;
  onDeleteEntry: (id: string) => void;
}

export const ReflectionListView = ({
  filteredEntries,
  searchTerm,
  filterMood,
  filterType,
  filterTag,
  setSearchTerm,
  setFilterMood,
  setFilterType,
  setFilterTag,
  onToggleFavorite,
  onRemoveTag,
  onDeleteEntry,
}: ReflectionListViewProps) => {
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getMoodIcon = (mood: string) => {
    const found = moodOptions.find((option) => option.value === mood);
    return found ? found.label.split(" ")[0] : "😐";
  };

  const getMoodLabel = (mood: string) => {
    const found = moodOptions.find((option) => {
      return option.value === mood;
    })
    return found ? found.label : "Neutral"
  }

  return (
    <div>
      {filteredEntries.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p>No journal entries found matching your filters.</p>
          {searchTerm ||
          filterMood !== "all" ||
          filterType !== "all" ||
          filterTag !== "all" ? (
            <Button
              variant="link"
              onClick={() => {
                setSearchTerm("");
                setFilterMood("all");
                setFilterType("all");
                setFilterTag("all");
              }}
            >
              Clear all filters
            </Button>
          ) : (
            <p className="mt-2 text-sm">
              Start journaling to build your reflection archive.
            </p>
          )}
        </div>
      ) : (
        filteredEntries.map((entry) => (
          <div 
            key={entry.id}
            onClick={() => {
              setSelectedEntry(entry);
              setIsModalOpen(true);
            }}
            className="w-full text-left cursor-pointer"
          >
            <Card className="overflow-hidden mb-4">
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center justify-end gap-2 mb-1">
                      <Badge variant="outline" className="capitalize">
                        {entry.type.replace("-", " ")}
                      </Badge>
                      <Badge className={getSentimentColor(entry.mood)}>
                        {entry.mood || "No sentiment"}
                      </Badge>
                      <span className="text-lg">{getMoodIcon(entry.mood)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {formatDate(entry.date)}
                    </div>
                  </div>
                  <div className="h-full flex gap-2">
                    {/* <Button
                      variant="ghost"
                      size="icon"
                      className={
                        entry.isFavorite ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(entry.id);
                      }}
                    >
                      <Star className="h-5 w-5" />
                    </Button> */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteEntry(entry.id)
                      }}
                    >
                      <Trash className="text-gray-400 h-5 w-5 hover:text-red-600"/>
                    </Button>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-gray-800">
                    {entry.content.length > 100
                      ? `${entry.content.substring(0, 100)}...`
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
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        ))
      )}

      {/* Modal to view full entry */}
      {isModalOpen && selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 border mt-0">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 relative">
            <Button
              variant="ghost"
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedEntry(null);
              }}
            >
              <X className="w-5 h-5" />
            </Button>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="capitalize">
                  {selectedEntry.type.replace("-", " ")}
                </Badge>
                <Badge className={getSentimentColor(selectedEntry.sentiment)}>
                  {selectedEntry.sentiment?.label || "No sentiment"}
                </Badge>
                <span className="text-lg">
                  {getMoodIcon(selectedEntry.mood)}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {formatDate(selectedEntry.date)}
              </p>
            </div>
            <div className="text-gray-700 whitespace-pre-line">
              {selectedEntry.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
