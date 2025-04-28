import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Calendar } from "@/components/ui/calendar";
import {
  format,
  parseISO,
  isValid,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import CalendarView from "../reflection/ReflectionCalendarView";

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
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>(
    entries.length > 0 ? entries : sampleEntries
  );
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

  const getSentimentColor = (sentiment?: { label: string; score: number }) => {
    if (!sentiment) return "bg-gray-100 text-gray-700";

    switch (sentiment.label.toLowerCase()) {
      case "positive":
        return "bg-green-100 text-green-700";
      case "negative":
        return "bg-red-100 text-red-700";
      case "neutral":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "happy":
        return "😊";
      case "sad":
        return "😔";
      case "anxious":
        return "😰";
      case "calm":
        return "😌";
      case "neutral":
      default:
        return "😐";
    }
  };

  return (
    <Card className="w-full bg-white shadow-md">
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
                <SelectItem value="happy">Happy</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="sad">Sad</SelectItem>
                <SelectItem value="anxious">Anxious</SelectItem>
                <SelectItem value="calm">Calm</SelectItem>
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
                <Card key={entry.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-4 md:p-6 flex-grow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="capitalize">
                              {entry.type.replace("-", " ")}
                            </Badge>
                            <Badge
                              className={getSentimentColor(entry.sentiment)}
                            >
                              {entry.sentiment?.label || "No sentiment"}
                            </Badge>
                            <span className="text-lg">
                              {getMoodIcon(entry.mood)}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(entry.date)}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={
                            entry.isFavorite
                              ? "text-yellow-500"
                              : "text-gray-400"
                          }
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
                                  handleAddTag(entry.id);
                                }
                              }}
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2"
                              onClick={() => handleAddTag(entry.id)}
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
              ))
            )}
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-indigo-700">
                      Select Date
                    </CardTitle>
                    <CardDescription>View entries by date</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                      modifiers={{
                        hasEntry: (date) => {
                          const dateKey = format(date, "yyyy-MM-dd");
                          return (
                            !!calendarEntries[dateKey] &&
                            calendarEntries[dateKey].length > 0
                          );
                        },
                      }}
                      modifiersClassNames={{
                        hasEntry:
                          "bg-indigo-100 font-bold text-indigo-700 hover:bg-indigo-200",
                      }}
                    />
                    <div className="mt-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-indigo-100"></div>
                        <span>Dates with journal entries</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="md:w-1/2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-indigo-700">
                      {selectedDate
                        ? format(selectedDate, "MMMM d, yyyy")
                        : "No date selected"}
                    </CardTitle>
                    <CardDescription>
                      {selectedDate &&
                      calendarEntries[format(selectedDate, "yyyy-MM-dd")]
                        ? `${
                            calendarEntries[format(selectedDate, "yyyy-MM-dd")]
                              .length
                          } entries found`
                        : "No entries for this date"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="max-h-[400px] overflow-y-auto">
                    {selectedDate &&
                    calendarEntries[format(selectedDate, "yyyy-MM-dd")] ? (
                      <div className="space-y-4">
                        {calendarEntries[
                          format(selectedDate, "yyyy-MM-dd")
                        ].map((entry) => (
                          <Card key={entry.id} className="overflow-hidden">
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge
                                      variant="outline"
                                      className="capitalize"
                                    >
                                      {entry.type.replace("-", " ")}
                                    </Badge>
                                    <Badge
                                      className={getSentimentColor(
                                        entry.sentiment
                                      )}
                                    >
                                      {entry.sentiment?.label || "No sentiment"}
                                    </Badge>
                                    <span className="text-lg">
                                      {getMoodIcon(entry.mood)}
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={
                                    entry.isFavorite
                                      ? "text-yellow-500"
                                      : "text-gray-400"
                                  }
                                  onClick={() => onToggleFavorite(entry.id)}
                                >
                                  <Star className="h-5 w-5" />
                                </Button>
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
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 text-gray-500">
                        <p>No entries found for this date.</p>
                        <p className="mt-2 text-sm">
                          Select a different date or create a new entry.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ReflectionArchive;
