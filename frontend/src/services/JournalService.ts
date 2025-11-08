// src/services/JournalService.ts (frontend)
import { authFetch } from "@/lib/authFetch";

export interface JournalEntryPayload {
  type?: string;
  content: string;
  mood?: string;
  isFavorite?: boolean;
}

export interface JournalEntryResponse {
  id: string;
  type: string;
  content: string;
  mood: string;
  date: string;
  createdAt: string;
  isFavorite: boolean;
  wordCount: number;
}

/**
 * Fetch all journal entries for the authenticated user
 */
export async function getJournalEntries(): Promise<JournalEntryResponse[]> {
  return authFetch("/journals");
}

/**
 * Create a new journal entry
 * Awards 30 XP automatically on the backend
 * @param entry - Journal entry data (type, content, mood, isFavorite)
 * @returns The created journal entry with id, date, and wordCount
 */
export async function saveJournalEntry(entry: JournalEntryPayload): Promise<JournalEntryResponse> {
  console.log("➡️ POST /journals payload:", entry);
  return authFetch("/journals", {
    method: "POST",
    body: JSON.stringify(entry),
  });
}

/**
 * Delete a journal entry
 * @param id - The ID of the journal entry to delete
 */
export async function deleteJournalEntry(id: string): Promise<void> {
  await authFetch(`/journals/${id}`, { method: "DELETE" });
}
