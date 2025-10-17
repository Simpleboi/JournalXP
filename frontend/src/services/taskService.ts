// src/services/taskService.ts (frontend)
import { getAuth } from "firebase/auth";
import { Task } from "../../../backend/src/models/Task";
import { NewTaskPayload } from "@/types/TaskType";

const API_BASE = import.meta.env.VITE_API_URL;

async function authFetch(path: string, init?: RequestInit) {
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken();

  // Merge headers (caller wins if they pass a header with same key)
  const baseHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) baseHeaders.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...baseHeaders,
      ...(init.headers as Record<string, string> | undefined),
    },
  });

  if (!res.ok) {
    // Try to surface server error details if JSON
    let details: unknown = undefined;
    try {
      details = await res.json();
    } catch {
      /* ignore */
    }
    const message =
      (details as any)?.error ||
      `Request failed: ${res.status} ${res.statusText}`;
    throw new Error(message);
  }

  return res;
}

export async function fetchTasksFromServer() {
  const res = await authFetch("/api/tasks");
  return res.json();
}

/**
 * This function saves a task and returns the payload
 * @param task - a Task object
 * @returns the JSON for the task we're creating
 */
export async function saveTaskToServer(task: NewTaskPayload): Promise<Task> {
  // Log the task we're sending
  console.log("➡️ POST /api/tasks payload:", task);
  const res = await authFetch("/api/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  });

  // Log status + headers
  console.log("⬅️ status:", res.status, res.statusText);
  console.log("⬅️ content-type:", res.headers.get("content-type"));

  return res.json() as Promise<Task>;
}

export async function updateTaskInServer(id: string, patch: any) {
  const res = await authFetch(`/api/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
  return res.json();
}

export async function completeTaskInServer(id: string) {
  const res = await authFetch(`/api/tasks/${id}/complete`, { method: "POST" });
  return res.json();
}

export async function deleteTaskInServer(id: string) {
  await authFetch(`/api/tasks/${id}`, { method: "DELETE" });
}
