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
import {
  Search,
  Calendar as CalendarIcon,
  Tag,
  Star,
  Heart,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { ReflectionCalendarView } from "../reflection/ReflectionCalendarView";
import { ReflectionListView } from "../reflection/ReflectionListView";
import { moodOptions } from "../reflection/ReflectionMoods";

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

interface ReflectionArchiveProps {
  entries?: JournalEntry[];
  onToggleFavorite?: (id: string) => void;
  onAddTag?: (id: string, tag: string) => void;
  onRemoveTag?: (id: string, tag: string) => void;
}

// Sample journal entries for demonstration
const sampleEntries: JournalEntry[] = [
  {
    id: "sample-1",
    type: "free-writing",
    content:
      "Today was a productive day. I managed to complete all my tasks and even had time for a short walk in the park. The fresh air really helped clear my mind.",
    mood: "happy",
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    tags: ["productive", "outdoors"],
    isFavorite: true,
    sentiment: { label: "Positive", score: 0.8 },
  },
  {
    id: "sample-2",
    type: "guided",
    content:
      "I faced a challenge with my project today. The deadline is approaching, and I'm feeling the pressure. I'm trying to break it down into smaller tasks to make it more manageable.",
    mood: "anxious",
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    tags: ["work", "stress"],
    isFavorite: false,
    sentiment: { label: "Negative", score: 0.6 },
  },
  {
    id: "sample-3",
    type: "gratitude",
    content:
      "I'm grateful for my supportive friends who checked in on me today. Their kind messages made me feel valued and loved.",
    mood: "calm",
    date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    tags: ["friends", "gratitude"],
    isFavorite: true,
    sentiment: { label: "Positive", score: 0.9 },
  },
  {
    id: "sample-4",
    type: "free-writing",
    content:
      "I'm feeling a bit unmotivated today. The weather is gloomy, and it's affecting my mood. I should try to do something creative to lift my spirits.",
    mood: "sad",
    date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    tags: ["mood", "weather"],
    isFavorite: false,
    sentiment: { label: "Negative", score: 0.7 },
  },
  {
    id: "sample-5",
    type: "guided",
    content:
      "I'm looking forward to the weekend. I've planned a hike with friends, and I think it will be a great opportunity to disconnect and recharge.",
    mood: "happy",
    date: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    tags: ["weekend", "plans"],
    isFavorite: false,
    sentiment: { label: "Positive", score: 0.75 },
  },
];

const ReflectionArchive = ({
  entries = [],
  onToggleFavorite = () => {},
  onAddTag = () => {},
  onRemoveTag = () => {},
}: ReflectionArchiveProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMood, setFilterMood] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterTag, setFilterTag] = useState("all");
  const [filteredEntries, setFilteredEntries] =
    useState<JournalEntry[]>(entries);

  const [newTag, setNewTag] = useState("");
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [calendarEntries, setCalendarEntries] = useState<{
    [key: string]: JournalEntry[];
  }>({});

  // Get all unique tags from entries
  const allTags = Array.from(new Set(entries.flatMap((entry) => entry.tags)));

  useEffect(() => {
    // Use sample entries if no entries are provided
    const sourceEntries = entries.length > 0 ? entries : sampleEntries;
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

    // Filter by tag
    if (filterTag !== "all") {
      filtered = filtered.filter((entry) => entry.tags.includes(filterTag));
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

  const handleAddTag = (entryId: string) => {
    if (
      newTag.trim() &&
      !entries.find((e) => e.id === entryId)?.tags.includes(newTag.trim())
    ) {
      onAddTag(entryId, newTag.trim());
      setNewTag("");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="w-full bg-white shadow-md max-w-7xl mx-auto">
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
              <SelectContent>
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

            {allTags.length > 0 && (
              <Select value={filterTag} onValueChange={setFilterTag}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Filter by tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {allTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
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
  );
};

export default ReflectionArchive;
