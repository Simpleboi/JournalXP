import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag, Star, Calendar as CalendarIcon, X, Trash } from "lucide-react";
import { JournalEntry } from "../journal/JournalEntry";
import { moodOptions } from "./ReflectionMoods";
import { useState } from "react";
import { GetSentimentColor } from "./ReflectionMoods";
import { ReflectionListCard } from "./ReflectionListCard";
import { ReflectionListCardModal } from "./ReflectionListCardModal";
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

  return (
    <div className="">
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
            <ReflectionListCard 
            entry={entry}
            onDeleteEntry={onDeleteEntry}
            />
          </div>
        ))
      )}

      {/* Modal to view full entry */}
      {isModalOpen && selectedEntry && (
        <ReflectionListCardModal 
        setIsModalOpen={setIsModalOpen}
        setSelectedEntry={setSelectedEntry}
        selectedEntry={selectedEntry}
        />
      )}
    </div>
  );
};
