import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Tag } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";

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

interface CalendarViewProps {
  selectedDate?: Date;
  setSelectedDate: (date?: Date) => void;
  calendarEntries: { [key: string]: JournalEntry[] };
  onToggleFavorite: (id: string) => void;
}

const CalendarView = ({
  selectedDate,
  setSelectedDate,
  calendarEntries,
  onToggleFavorite,
}: CalendarViewProps) => {
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
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-indigo-700">Select Date</CardTitle>
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
                  return !!calendarEntries[dateKey]?.length;
                },
              }}
              modifiersClassNames={{
                hasEntry: "bg-indigo-100 font-bold text-indigo-700 hover:bg-indigo-200",
              }}
            />
          </CardContent>
        </Card>
      </div>

      <div className="md:w-1/2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-indigo-700">
              {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "No date selected"}
            </CardTitle>
            <CardDescription>
              {selectedDate && calendarEntries[format(selectedDate, "yyyy-MM-dd")] ? (
                `${calendarEntries[format(selectedDate, "yyyy-MM-dd")].length} entries found`
              ) : (
                "No entries for this date"
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto">
            {selectedDate && calendarEntries[format(selectedDate, "yyyy-MM-dd")] ? (
              <div className="space-y-4">
                {calendarEntries[format(selectedDate, "yyyy-MM-dd")].map((entry) => (
                  <Card key={entry.id} className="overflow-hidden">
                    <div className="p-4">
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
                <p className="mt-2 text-sm">Select a different date or create a new entry.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarView;
