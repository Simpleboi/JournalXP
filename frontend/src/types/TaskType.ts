// The task that's sent to the server from the client
export type NewTaskPayload = {
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  category?: string;
  dueDate?: string; // "YYYY-MM-DD"
  dueTime?: string; // "HH:mm"
};