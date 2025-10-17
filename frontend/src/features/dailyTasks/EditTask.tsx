import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { X, Save } from "lucide-react";
import { FC } from "react";
import { categories } from "./TaskList";
import { Task } from "@/types/TaskType";

interface EditTaskProps {
  editTitle: string;
  setEditTitle: React.Dispatch<React.SetStateAction<string>>;
  editDescription: string;
  setEditDescription: React.Dispatch<React.SetStateAction<string>>;
  editPriority: string;
  setEditPriority: React.Dispatch<
    React.SetStateAction<"medium" | "high" | "low">
  >;
  editCategory: string;
  setEditCategory: React.Dispatch<React.SetStateAction<string>>;
  editDueTime: string;
  setEditDueTime: React.Dispatch<React.SetStateAction<string>>;
  editDueDate: string;
  setEditDueDate: React.Dispatch<React.SetStateAction<string>>;
  saveEdit: (id: string) => void;
  cancelEdit: () => void;
  task: any;
}

export const EditTask: FC<EditTaskProps> = ({
  editTitle,
  setEditTitle,
  editDescription,
  setEditDescription,
  editPriority,
  setEditPriority,
  editCategory,
  setEditCategory,
  editDueTime,
  setEditDueTime,
  editDueDate,
  setEditDueDate,
  saveEdit,
  cancelEdit,
  task,
}) => {
  return (
    <div className="space-y-4">
      <Input
        value={editTitle}
        onChange={(e) => setEditTitle(e.target.value)}
        className="font-medium"
        placeholder="Task title"
      />
      <Textarea
        value={editDescription}
        onChange={(e) => setEditDescription(e.target.value)}
        placeholder="Task description"
        rows={2}
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          value={editPriority}
          onValueChange={(value: any) => setEditPriority(value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low Priority</SelectItem>
            <SelectItem value="medium">Medium Priority</SelectItem>
            <SelectItem value="high">High Priority</SelectItem>
          </SelectContent>
        </Select>
        <Select value={editCategory} onValueChange={setEditCategory}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="date"
          value={editDueDate}
          onChange={(e) => setEditDueDate(e.target.value)}
        />
        <Input
          type="time"
          value={editDueTime}
          onChange={(e) => setEditDueTime(e.target.value)}
          disabled={!editDueDate}
        />
      </div>
      <div className="flex space-x-2">
        <Button
          onClick={() => saveEdit(task.id)}
          size="sm"
          className="bg-green-500 hover:bg-green-600"
        >
          <Save className="mr-1 h-4 w-4" /> Save
        </Button>
        <Button onClick={cancelEdit} variant="outline" size="sm">
          <X className="mr-1 h-4 w-4" /> Cancel
        </Button>
      </div>
    </div>
  );
};
