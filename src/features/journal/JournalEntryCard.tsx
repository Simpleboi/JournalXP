import { Badge } from "@/components/ui/badge";

const JournalEntryCard = ({ entry }: { entry: any }) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <div className="text-sm text-gray-600 mb-2">{entry.mood}</div>
      <p className="text-gray-800">{entry.content}</p>
      <div className="flex gap-2 mt-2">
        {entry.tags?.map((tag: string) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
    </div>
  );
};

export default JournalEntryCard;
