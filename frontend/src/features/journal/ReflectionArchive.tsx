import { useState, useEffect, useMemo } from "react";
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
import { Search, Star, List, CalendarDays } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { ReflectionCalendarView } from "../reflection/ReflectionCalendarView";
import { EnhancedReflectionListView } from "../reflection/EnhancedReflectionListView";
import { ExportEntries } from "./ExportEntries";
import { moodOptions } from "@/utils/ReflectionUtils";
import { useAuth } from "@/context/AuthContext";
import { JournalEntry } from "./JournalEntry";
import {
  deleteJournalEntry,
  getJournalEntries,
} from "@/services/JournalService";
import { motion } from "framer-motion";

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
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMood, setFilterMood] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterTag, setFilterTag] = useState("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

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

  // Listen for entries deletion event from profile page
  useEffect(() => {
    const handleEntriesDeleted = () => {
      refreshEntries();
    };

    window.addEventListener("journalEntriesDeleted", handleEntriesDeleted);
    return () => {
      window.removeEventListener("journalEntriesDeleted", handleEntriesDeleted);
    };
  }, []);

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
  }, [
    entries,
    searchTerm,
    filterMood,
    filterType,
    filterTag,
    showFavoritesOnly,
    selectedDate,
  ]);

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
    <div className="w-full max-w-6xl mx-auto">
      {/* Glass morphism container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/70 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl border-2 border-white/50 overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 backdrop-blur-sm border-b border-indigo-100/50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-indigo-900">
                Your Reflections
              </h2>
              <p className="text-sm text-indigo-600/80">
                Browse, search, and organize your journal entries
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="px-3 py-1.5 bg-indigo-100/80 text-indigo-700 border border-indigo-200/60 rounded-lg">
                {entries.length} Entries
              </Badge>
              <ExportEntries entries={entries} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Search and Filter Controls */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search Input */}
              <div className="relative flex-grow">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md bg-indigo-100">
                  <Search className="text-indigo-500 h-3.5 w-3.5" />
                </div>
                <Input
                  placeholder="Search journal entries and tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 bg-white/80 backdrop-blur-sm border-2 border-indigo-100/60 focus:border-indigo-300 focus:ring-indigo-200 rounded-xl"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2 flex-wrap">
                <Select value={filterMood} onValueChange={setFilterMood}>
                  <SelectTrigger className="w-[130px] bg-white/80 backdrop-blur-sm border-2 border-indigo-100/60 rounded-xl focus:border-indigo-300">
                    <SelectValue placeholder="Filter by mood" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    className="max-h-64 overflow-y-auto rounded-xl border-2 border-indigo-100/60"
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
                  <SelectTrigger className="w-[130px] bg-white/80 backdrop-blur-sm border-2 border-indigo-100/60 rounded-xl focus:border-indigo-300">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2 border-indigo-100/60">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="free-writing">Free Writing</SelectItem>
                    <SelectItem value="guided">Guided</SelectItem>
                    <SelectItem value="gratitude">Gratitude</SelectItem>
                  </SelectContent>
                </Select>

                {availableTags.length > 0 && (
                  <Select value={filterTag} onValueChange={setFilterTag}>
                    <SelectTrigger className="w-[130px] bg-white/80 backdrop-blur-sm border-2 border-indigo-100/60 rounded-xl focus:border-indigo-300">
                      <SelectValue placeholder="Filter by tag" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2 border-indigo-100/60">
                      <SelectItem value="all">All Tags</SelectItem>
                      {availableTags.map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 transition-all ${
                    showFavoritesOnly
                      ? "bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-300 text-amber-700"
                      : "bg-white/80 backdrop-blur-sm border-indigo-100/60 text-gray-600 hover:border-amber-200 hover:text-amber-600"
                  }`}
                >
                  <Star
                    className={`h-4 w-4 ${
                      showFavoritesOnly ? "fill-amber-500 text-amber-500" : ""
                    }`}
                  />
                  <span className="text-sm font-medium">
                    {showFavoritesOnly ? "Favorites" : "Favorites"}
                  </span>
                </motion.button>
              </div>
            </div>

            {/* Filter Summary */}
            {(searchTerm ||
              filterMood !== "all" ||
              filterType !== "all" ||
              filterTag !== "all" ||
              showFavoritesOnly) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-indigo-600 bg-indigo-50/50 backdrop-blur-sm px-3 py-2 rounded-lg border border-indigo-100/50"
              >
                Showing {filteredEntries.length} of {entries.length} entries
              </motion.div>
            )}
          </div>

          {/* Tabs for different views */}
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-indigo-50/50 backdrop-blur-sm p-1 rounded-xl border border-indigo-100/50">
              <TabsTrigger
                value="list"
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-indigo-700 transition-all"
              >
                <List className="h-4 w-4" />
                <span>List View</span>
              </TabsTrigger>
              <TabsTrigger
                value="calendar"
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-indigo-700 transition-all"
              >
                <CalendarDays className="h-4 w-4" />
                <span>Calendar</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="list"
              className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent"
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
        </div>
      </motion.div>
    </div>
  );
};

export default ReflectionArchive;
