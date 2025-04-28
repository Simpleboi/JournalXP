import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag, Star } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { JournalEntry } from "../journal/JournalEntry";
import { moodOptions } from "./ReflectionMoods";

interface ReflectionCalendarViewProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  calendarEntries: { [key: string]: JournalEntry[] };
  onToggleFavorite: (id: string) => void;
}

export const ReflectionCalendarView = ({
  selectedDate,
  setSelectedDate,
  calendarEntries,
  onToggleFavorite,
}: ReflectionCalendarViewProps) => {
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
    const found = moodOptions.find((option) => option.value === mood);
    return found ? found.label.split(" ")[0] : "😐";
  };

  const selectedDayKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Calendar Section */}
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
                  return !!calendarEntries[dateKey];
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

      {/* Entries on Selected Day Section */}
      <div className="md:w-1/2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-indigo-700">
              {selectedDate
                ? format(selectedDate, "MMMM d, yyyy")
                : "No date selected"}
            </CardTitle>
            <CardDescription>
              {selectedDate && calendarEntries[selectedDayKey]
                ? `${calendarEntries[selectedDayKey].length} entries found`
                : "No entries for this date"}
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto">
            {selectedDate && calendarEntries[selectedDayKey] ? (
              <div className="space-y-4">
                {calendarEntries[selectedDayKey].map((entry) => (
                  <Card key={entry.id} className="overflow-hidden">
                    <div className="p-4">
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
  );
};
