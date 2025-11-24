import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Calendar as CalendarIcon, Star } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { ReflectionCalendarView } from "../reflection/ReflectionCalendarView";
import { EnhancedReflectionListView } from "../reflection/EnhancedReflectionListView";
import { ExportEntries } from "./ExportEntries";
import { moodOptions } from "@/utils/ReflectionUtils";
import { useAuth } from "@/context/AuthContext";
import { JournalEntry } from "./JournalEntry";
import { deleteJournalEntry, getJournalEntries } from "@/services/JournalService";


interface ReflectionArchiveProps {
  entries?: JournalEntry[];
  setEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
  onToggleFavorite?: (id: string) => void;
  onAddTag?: (id: string, tag: string) => void;
  onRemoveTag?: (id: string, tag: string) => void;
}

const ReflectionArchive = ({
  entries,
  setEntries,
  onToggleFavorite = () => {},
  onRemoveTag = () => {},
}: ReflectionArchiveProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMood, setFilterMood] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterTag, setFilterTag] = useState("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const { user } = useAuth();

  // Get all unique tags from entries
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    entries.forEach((entry) => {
      entry.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [entries]);

  // Refresh entries function
  const refreshEntries = async () => {
    try {
      const fetchedEntries = await getJournalEntries();
      setEntries(fetchedEntries);
    } catch (error) {
      console.error("Failed to refresh entries:", error);
    }
  };

  // Filter entries
  const { filteredEntries, calendarEntries } = useMemo(() => {
    const sourceEntries = entries;
    let filtered = [...sourceEntries];

    // Filter by search term (search in content and tags)
    if (searchTerm) {
      filtered = filtered.filter(
        (entry) =>
          entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.tags?.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Filter by mood
    if (filterMood !== "all") {
      filtered = filtered.filter((entry) => entry.mood === filterMood);
    }

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((entry) => entry.type === filterType);
    }

    // Filter by tag
    if (filterTag !== "all") {
      filtered = filtered.filter((entry) => entry.tags?.includes(filterTag));
    }

    // Filter by favorites
    if (showFavoritesOnly) {
      filtered = filtered.filter((entry) => entry.isFavorite);
    }

    // Filter by selected date if in calendar view
    if (selectedDate) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      filtered = filtered.filter((entry) => {
        if (typeof entry.date === "string" && entry.date.trim() !== "") {
          const entryDate = parseISO(entry.date);
          return (
            isValid(entryDate) && format(entryDate, "yyyy-MM-dd") === dateStr
          );
        }
        return false;
      });
    }

    // Group entries by date for calendar view
    const entriesByDate: { [key: string]: JournalEntry[] } = {};
    sourceEntries.forEach((entry) => {
      if (typeof entry.date === "string" && entry.date.trim() !== "") {
        const entryDate = parseISO(entry.date);
        if (isValid(entryDate)) {
          const dateKey = format(entryDate, "yyyy-MM-dd");
          if (!entriesByDate[dateKey]) {
            entriesByDate[dateKey] = [];
          }
          entriesByDate[dateKey].push(entry);
        }
      }
    });

    return { filteredEntries: filtered, calendarEntries: entriesByDate };
  }, [entries, searchTerm, filterMood, filterType, filterTag, showFavoritesOnly, selectedDate]);

  // To delete an entry
  const handleDeleteEntry = async (id: string) => {
    if (!user) return;

    try {
      await deleteJournalEntry(id);

      setEntries((prevEntries) =>
        prevEntries.filter((entry) => entry.id !== id)
      );
      console.log("Entry deleted successfully");
    } catch (error) {
      console.error("Failed to delete journal entry:", error);
    }
  };

  return (
    <>
      <Card className="w-full bg-white shadow-md max-w-5xl mx-auto">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-indigo-700 flex items-center">
                <span className="mr-2">🗂️</span> Reflection Archive
              </CardTitle>
              <CardDescription className="text-indigo-500">
                Browse, search, and organize your past journal entries
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className="px-3 py-1 bg-indigo-100 text-indigo-700"
              >
                {entries.length} Entries
              </Badge>
              <ExportEntries entries={entries} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Search and Filter Controls */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search journal entries and tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Select value={filterMood} onValueChange={setFilterMood}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Filter by mood" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    className="max-h-64 overflow-y-auto"
                  >
                    <SelectItem value="all">All Moods</SelectItem>
                    {moodOptions.map((mood) => (
                      <SelectItem key={mood.value} value={mood.value}>
                        {mood.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="free-writing">Free Writing</SelectItem>
                    <SelectItem value="guided">Guided</SelectItem>
                    <SelectItem value="gratitude">Gratitude</SelectItem>
                  </SelectContent>
                </Select>

                {availableTags.length > 0 && (
                  <Select value={filterTag} onValueChange={setFilterTag}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Filter by tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tags</SelectItem>
                      {availableTags.map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <Badge
                  variant={showFavoritesOnly ? "default" : "outline"}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                >
                  <Star
                    className={`h-4 w-4 mr-1 ${showFavoritesOnly ? "fill-current" : ""}`}
                  />
                  {showFavoritesOnly ? "Showing Favorites" : "Show Favorites"}
                </Badge>
              </div>
            </div>

            {/* Filter Summary */}
            {(searchTerm || filterMood !== "all" || filterType !== "all" || filterTag !== "all" || showFavoritesOnly) && (
              <div className="text-sm text-gray-600">
                Showing {filteredEntries.length} of {entries.length} entries
              </div>
            )}
          </div>

          {/* Tabs for different views */}
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </TabsList>

            <TabsContent
              value="list"
              className="space-y-4 max-h-[500px] overflow-y-auto"
            >
              <EnhancedReflectionListView
                filteredEntries={filteredEntries}
                onDeleteEntry={handleDeleteEntry}
                onUpdate={refreshEntries}
              />
            </TabsContent>

            {/* Calendar View */}
            <TabsContent value="calendar" className="space-y-4">
              <ReflectionCalendarView
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                calendarEntries={calendarEntries}
                onToggleFavorite={onToggleFavorite}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
};

export default ReflectionArchive;
