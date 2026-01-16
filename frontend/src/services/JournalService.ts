// src/services/JournalService.ts (frontend)
import { authFetch } from "@/lib/authFetch";
import type { JournalEntryPayload, JournalEntryResponse } from "@shared/types/journal";
import type { SelfReflectionGenerateResponse } from "@shared/types/api";

// Re-export the shared types for convenience
export type { JournalEntryPayload, JournalEntryResponse };

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
 * Update a journal entry (favorite status, tags, linked entries)
 * @param id - The ID of the journal entry to update
 * @param updates - Fields to update
 * @returns The updated journal entry
 */
export async function updateJournalEntry(
  id: string,
  updates: {
    isFavorite?: boolean;
    tags?: string[];
    linkedEntryIds?: string[];
  }
): Promise<JournalEntryResponse> {
  return authFetch(`/journals/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

/**
 * Delete a journal entry
 * @param id - The ID of the journal entry to delete
 */
export async function deleteJournalEntry(id: string): Promise<void> {
  await authFetch(`/journals/${id}`, { method: "DELETE" });
}

/**
 * Generate self-reflection based on recent journal entries
 * Analyzes the last 15 journal entries to provide insights about
 * emotional patterns, growth trajectory, recurring themes, and strengths
 * @returns AI-generated reflection with 10 sections and metadata
 */
export async function generateSelfReflection(): Promise<SelfReflectionGenerateResponse> {
  return authFetch("/journals/self-reflection/generate", {
    method: "POST",
  });
}

/**
 * Dig deeper into a specific section of the self-reflection
 * Expands on the original insight with more detail, examples, and guidance
 * @param section - The section key to expand
 * @param currentContent - The current content of that section
 * @returns Expanded content for the section
 */
export async function digDeeperOnSection(
  section: keyof SelfReflectionGenerateResponse['reflection'],
  currentContent: string
): Promise<{ expandedContent: string; section: string }> {
  return authFetch("/journals/self-reflection/dig-deeper", {
    method: "POST",
    body: JSON.stringify({ section, currentContent }),
  });
}
