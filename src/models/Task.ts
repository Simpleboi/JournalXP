export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  priority: "low" | "medium" | "high";
  category?: string;
  dueDate?: string;
  dueTime?: string;
}
