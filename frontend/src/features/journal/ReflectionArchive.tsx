import { useState, useEffect } from "react";
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
import { Search, Calendar as CalendarIcon } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { ReflectionCalendarView } from "../reflection/ReflectionCalendarView";
import { ReflectionListView } from "../reflection/ReflectionListView";
import { moodOptions } from "@/utils/ReflectionUtils";
import { useAuth } from "@/context/AuthContext";
import { JournalEntry } from "./JournalEntry";
import { deleteJournalEntry } from "@/services/JournalService";


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
  const [filteredEntries, setFilteredEntries] =
    useState<JournalEntry[]>(entries);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [calendarEntries, setCalendarEntries] = useState<{
    [key: string]: JournalEntry[];
  }>({});
  const { user } = useAuth();

  // Fallback if the user has no entries
  useEffect(() => {
    const sourceEntries = entries;
    let filtered = [...sourceEntries];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((entry) =>
        entry.content.toLowerCase().includes(searchTerm.toLowerCase())
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
        return false; // skip if no valid date
      });
    }

    setFilteredEntries(filtered);

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

    setCalendarEntries(entriesByDate);
  }, [entries, searchTerm, filterMood, filterType, filterTag, selectedDate]);

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
            <Badge
              variant="secondary"
              className="px-3 py-1 bg-indigo-100 text-indigo-700"
            >
              {entries.length} Entries
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search journal entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
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
            </div>
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
              <ReflectionListView
                filteredEntries={filteredEntries}
                searchTerm={searchTerm}
                filterMood={filterMood}
                filterType={filterType}
                filterTag={filterTag}
                setSearchTerm={setSearchTerm}
                setFilterMood={setFilterMood}
                setFilterType={setFilterType}
                setFilterTag={setFilterTag}
                onToggleFavorite={onToggleFavorite}
                onRemoveTag={onRemoveTag}
                onDeleteEntry={handleDeleteEntry}
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
