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
import { format } from "date-fns";
import { JournalEntry } from "../journal/JournalEntry";
import { moodOptions } from "./ReflectionMoods";
import { ReflectionListCard } from "./ReflectionListCard";

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

  const selectedDayKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Calendar Section */}
      <div className="md:w-1/2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-indigo-700 text-center">
              Select Date
            </CardTitle>
            <CardDescription className="text-center">View entries by date</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border w-fit mx-auto"
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
                  <ReflectionListCard 
                  entry={entry}
                  onDeleteEntry={() => {}}
                  />
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
