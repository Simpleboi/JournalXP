import { Button } from "@/components/ui/button";
import { FC } from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { formatDate } from "./ReflectionMoods";
import { getMoodIcon } from "./ReflectionMoods";
import { JournalEntry } from "../journal/JournalEntry";

export interface ReflectionListCardModalProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedEntry: React.Dispatch<React.SetStateAction<JournalEntry>>;
  selectedEntry: JournalEntry;
}

export const ReflectionListCardModal: FC<ReflectionListCardModalProps> = ({
  setIsModalOpen,
  setSelectedEntry,
  selectedEntry,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 border mt-0">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 relative">
        <Button
          variant="ghost"
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={() => {
            setIsModalOpen(false);
            setSelectedEntry(null);
          }}
        >
          <X className="w-5 h-5" />
        </Button>
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="capitalize">
              {selectedEntry.type.replace("-", " ")}
            </Badge>
            <span className="text-lg">{getMoodIcon(selectedEntry.mood)}</span>
          </div>
          <p className="text-sm text-gray-500">
            {formatDate(selectedEntry.date)}
          </p>
        </div>
        <div className="text-gray-700 whitespace-pre-line">
          {selectedEntry.content}
        </div>
      </div>
    </div>
  );
};
