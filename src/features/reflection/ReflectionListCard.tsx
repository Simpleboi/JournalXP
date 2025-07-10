import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JournalEntry } from "../journal/JournalEntry";
import { GetSentimentColor } from "./ReflectionMoods";
import { FC } from "react";
import { Calendar, Trash, Tag } from "lucide-react";
import { FormatDate } from "./ReflectionMoods";
import { GetMoodIcon } from "./ReflectionMoods";
import { Button } from "@/components/ui/button";

export interface ReflectionListCardProps {
  entry: JournalEntry;
  onDeleteEntry: (id: string) => void;
}

export const ReflectionListCard: FC<ReflectionListCardProps> = ({
  entry,
  onDeleteEntry,
}) => {
  return (
    <Card className="overflow-hidden mb-4">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center justify-end gap-2 mb-1">
              <Badge variant="outline" className="capitalize">
                {entry.type.replace("-", " ")}
              </Badge>
              <Badge className={GetSentimentColor(entry.mood)}>
                {entry.mood || "No sentiment"}
              </Badge>
              <span className="text-lg">{GetMoodIcon(entry.mood)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              {FormatDate(entry.date)}
            </div>
          </div>
          <div className="h-full flex gap-2">
            {/* <Button
                      variant="ghost"
                      size="icon"
                      className={
                        entry.isFavorite ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(entry.id);
                      }}
                    >
                      <Star className="h-5 w-5" />
                    </Button> */}
            <Button
              variant="ghost"
              size="icon"
              className="text-red-400 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteEntry(entry.id);
              }}
            >
              <Trash className="text-gray-400 h-5 w-5 hover:text-red-600" />
            </Button>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-gray-800">
            {entry.content.length > 100
              ? `${entry.content.substring(0, 100)}...`
              : entry.content}
          </p>
        </div>
      </div>
    </Card>
  );
};
