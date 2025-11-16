/**
 * Mobile Journal Service
 * Wraps the shared journal service with mobile-specific authFetch
 */

import { authFetch } from '../lib/authFetch';
import { createJournalService } from '@shared/services/journalService';

// Create journal service instance with mobile authFetch
const journalService = createJournalService(authFetch);

// Re-export all functions
export const {
  getJournalEntries,
  saveJournalEntry,
  deleteJournalEntry,
} = journalService;

// Also export types for convenience
export type { JournalEntryPayload, JournalEntryResponse } from '@shared/types/journal';
