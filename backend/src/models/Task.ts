export type Task = {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  category: string;
  completed: boolean;
  createdAt: string | null;
  dueDate?: string | null;
  dueTime?: string | null;
};
