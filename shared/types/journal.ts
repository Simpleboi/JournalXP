/**
 * Shared TypeScript interfaces for Journal entries
 * Used by both frontend (web/mobile) and backend
 */

export interface JournalEntryPayload {
  type?: string;
  content: string;
  mood?: string;
  isFavorite?: boolean;
  tags?: string[];
  linkedEntryIds?: string[];
  timeSpentWriting?: number; // in seconds
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
  tags?: string[];
  linkedEntryIds?: string[];
  timeSpentWriting?: number; // in seconds
}
