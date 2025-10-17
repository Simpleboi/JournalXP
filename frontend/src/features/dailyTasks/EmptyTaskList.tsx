import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { FC } from "react";

interface EmptyTaskListProps {
  searchQuery: string;
  filterPriority: string;
  filterStatus: string;
}

export const EmptyTaskList: FC<EmptyTaskListProps> = ({
  searchQuery,
  filterPriority,
  filterStatus,
}) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardContent className="p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No tasks found
        </h3>
        <p className="text-gray-500">
          {searchQuery || filterPriority !== "all" || filterStatus !== "all"
            ? "Try adjusting your filters or search query."
            : "Add your first task to get started!"}
        </p>
      </CardContent>
    </Card>
  );
};
