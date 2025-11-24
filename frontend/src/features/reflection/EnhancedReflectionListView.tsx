import { JournalEntry } from "../journal/JournalEntry";
import { EnhancedReflectionCard } from "./EnhancedReflectionCard";
import { Star, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLazyLoad } from "@/hooks/useLazyLoad";
import { useMemo } from "react";

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
  const favoriteEntries = useMemo(
    () => filteredEntries.filter((entry) => entry.isFavorite),
    [filteredEntries]
  );
  const regularEntries = useMemo(
    () => filteredEntries.filter((entry) => !entry.isFavorite),
    [filteredEntries]
  );

  // Lazy load regular entries (favorites always shown)
  const {
    displayedItems: displayedRegular,
    isLoading,
    hasMore,
    loadMore,
    loadMoreRef,
  } = useLazyLoad({
    items: regularEntries,
    pageSize: 10,
    threshold: 0.8,
  });

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
            {displayedRegular.map((entry) => (
              <EnhancedReflectionCard
                key={entry.id}
                entry={entry}
                onDeleteEntry={onDeleteEntry}
                onUpdate={onUpdate}
              />
            ))}
          </div>

          {/* Lazy Load Trigger */}
          <div ref={loadMoreRef} className="py-4 text-center">
            {isLoading && (
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading more entries...</span>
              </div>
            )}

            {!isLoading && hasMore && (
              <Button
                variant="outline"
                onClick={loadMore}
                className="mt-2"
                aria-label="Load more entries"
              >
                Load More ({regularEntries.length - displayedRegular.length} remaining)
              </Button>
            )}

            {!hasMore && displayedRegular.length > 10 && (
              <p className="text-sm text-gray-500 mt-2">
                All entries loaded
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
