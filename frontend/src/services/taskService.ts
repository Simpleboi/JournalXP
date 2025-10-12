// src/services/taskService.ts (frontend)
import { getAuth } from "firebase/auth";

const API_BASE = import.meta.env.VITE_API_URL;

async function authFetch(path: string, init?: RequestInit) {
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken();
  return fetch(`${API_BASE}${path}`, {
    ...(init || {}),
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...(init?.headers || {})
    }
  });
}

export async function fetchTasksFromServer() {
  const res = await authFetch("/api/tasks");
  return res.json();
}

export async function saveTaskToServer(task: any) {
  const res = await authFetch("/api/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  });
  return res.json();
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
