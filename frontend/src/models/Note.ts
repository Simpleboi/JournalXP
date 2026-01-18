// Note Data Models for Notebook Feature

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NoteState {
  notes: Note[];
  activeNoteId: string | null;
  searchQuery: string;
  isLoading: boolean;
  lastSaved: string | null;
}

export const createEmptyNote = (userId: string): Note => ({
  id: `note-${Date.now()}`,
  userId,
  title: "",
  content: "",
  isPinned: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
