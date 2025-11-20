// src/services/taskService.ts (frontend)
import { authFetch } from "@/lib/authFetch";
import { Task, NewTaskPayload } from "@/types/TaskType";

export async function fetchTasksFromServer() {
  return authFetch("/tasks");
}

/**
 * This function saves a task and returns the payload
 * @param task - a Task object
 * @returns the JSON for the task we're creating
 */
export async function saveTaskToServer(task: NewTaskPayload): Promise<Task> {
  console.log("➡️ POST /tasks payload:", task);
  return authFetch("/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  });
}

export async function updateTaskInServer(id: string, patch: any) {
  return authFetch(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export async function completeTaskInServer(id: string) {
  return authFetch(`/tasks/${id}/complete`, { method: "POST" });
}

export async function deleteTaskInServer(id: string) {
  await authFetch(`/tasks/${id}`, { method: "DELETE" });
}
