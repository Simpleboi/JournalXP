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
  templateId?: string; // Template used for this entry
  structuredData?: Record<string, any>; // Structured data from template fields
  prompt?: string; // The prompt/question shown to the user when writing
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
  templateId?: string; // Template used for this entry
  structuredData?: Record<string, any>; // Structured data from template fields
  prompt?: string; // The prompt/question shown to the user when writing
}
