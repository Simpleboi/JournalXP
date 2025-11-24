import { JournalEntry } from "../journal/JournalEntry";
import { EnhancedReflectionCard } from "./EnhancedReflectionCard";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EnhancedReflectionListViewProps {
  filteredEntries: JournalEntry[];
  onDeleteEntry: (id: string) => void;
  onUpdate?: () => void;
  showFavoritesFirst?: boolean;
}

export const EnhancedReflectionListView = ({
  filteredEntries,
  onDeleteEntry,
  onUpdate,
  showFavoritesFirst = true,
}: EnhancedReflectionListViewProps) => {
  // Separate favorites and non-favorites
  const favoriteEntries = filteredEntries.filter((entry) => entry.isFavorite);
  const regularEntries = filteredEntries.filter((entry) => !entry.isFavorite);

  if (filteredEntries.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No entries found</p>
        <p className="text-sm mt-2">Try adjusting your filters or create a new journal entry</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Favorites Section */}
      {showFavoritesFirst && favoriteEntries.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-yellow-500 fill-current" />
            <h3 className="text-lg font-semibold text-gray-700">Favorites</h3>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              {favoriteEntries.length}
            </Badge>
          </div>
          <div className="space-y-4">
            {favoriteEntries.map((entry) => (
              <EnhancedReflectionCard
                key={entry.id}
                entry={entry}
                onDeleteEntry={onDeleteEntry}
                onUpdate={onUpdate}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Entries Section */}
      {regularEntries.length > 0 && (
        <div>
          {showFavoritesFirst && favoriteEntries.length > 0 && (
            <div className="flex items-center gap-2 mb-4 mt-8">
              <h3 className="text-lg font-semibold text-gray-700">All Entries</h3>
              <Badge variant="secondary">{regularEntries.length}</Badge>
            </div>
          )}
          <div className="space-y-4">
            {regularEntries.map((entry) => (
              <EnhancedReflectionCard
                key={entry.id}
                entry={entry}
                onDeleteEntry={onDeleteEntry}
                onUpdate={onUpdate}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
