/**
 * Shared Journal Service
 * Platform-agnostic API service for journal entries
 *
 * This service can be used by both web and mobile apps.
 * Requires a platform-specific authFetch implementation to be injected.
 */

import type { JournalEntryPayload, JournalEntryResponse } from '../types/journal';

// Type for the platform-specific fetch function
export type AuthFetchFunction = (path: string, init?: RequestInit) => Promise<any>;

/**
 * Create a journal service with platform-specific auth fetch
 * @param authFetch - Platform-specific authenticated fetch function
 * @returns Journal service functions
 */
export function createJournalService(authFetch: AuthFetchFunction) {
  /**
   * Fetch all journal entries for the authenticated user
   */
  async function getJournalEntries(): Promise<JournalEntryResponse[]> {
    return authFetch("/journals");
  }

  /**
   * Create a new journal entry
   * Awards 30 XP automatically on the backend
   * @param entry - Journal entry data (type, content, mood, isFavorite)
   * @returns The created journal entry with id, date, and wordCount
   */
  async function saveJournalEntry(entry: JournalEntryPayload): Promise<JournalEntryResponse> {
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
  async function deleteJournalEntry(id: string): Promise<void> {
    await authFetch(`/journals/${id}`, { method: "DELETE" });
  }

  return {
    getJournalEntries,
    saveJournalEntry,
    deleteJournalEntry,
  };
}

// Export individual functions for direct use (when authFetch is available globally)
export async function getJournalEntries(authFetch: AuthFetchFunction): Promise<JournalEntryResponse[]> {
  return authFetch("/journals");
}

export async function saveJournalEntry(
  authFetch: AuthFetchFunction,
  entry: JournalEntryPayload
): Promise<JournalEntryResponse> {
  console.log("➡️ POST /journals payload:", entry);
  return authFetch("/journals", {
    method: "POST",
    body: JSON.stringify(entry),
  });
}

export async function deleteJournalEntry(authFetch: AuthFetchFunction, id: string): Promise<void> {
  await authFetch(`/journals/${id}`, { method: "DELETE" });
}
