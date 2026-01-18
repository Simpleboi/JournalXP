// Notebook Service - localStorage based for demo
import { Note, createEmptyNote } from "@/models/Note";

const NOTES_STORAGE_KEY = "notebook_notes";
const AUTOSAVE_DELAY = 1000; // 1 second debounce

// ============================================================================
// NOTES CRUD
// ============================================================================

export const getAllNotes = (userId: string): Note[] => {
  const data = localStorage.getItem(`${NOTES_STORAGE_KEY}_${userId}`);
  if (!data) return [];
  return JSON.parse(data);
};

export const getNoteById = (userId: string, noteId: string): Note | null => {
  const notes = getAllNotes(userId);
  return notes.find((note) => note.id === noteId) || null;
};

export const saveNote = (userId: string, note: Note): Note => {
  const notes = getAllNotes(userId);
  const existingIndex = notes.findIndex((n) => n.id === note.id);

  const updatedNote = {
    ...note,
    updatedAt: new Date().toISOString(),
  };

  if (existingIndex !== -1) {
    notes[existingIndex] = updatedNote;
  } else {
    notes.unshift(updatedNote);
  }

  localStorage.setItem(`${NOTES_STORAGE_KEY}_${userId}`, JSON.stringify(notes));
  return updatedNote;
};

export const createNote = (userId: string): Note => {
  const newNote = createEmptyNote(userId);
  return saveNote(userId, newNote);
};

export const deleteNote = (userId: string, noteId: string): boolean => {
  const notes = getAllNotes(userId);
  const filtered = notes.filter((n) => n.id !== noteId);

  if (filtered.length === notes.length) return false;

  localStorage.setItem(`${NOTES_STORAGE_KEY}_${userId}`, JSON.stringify(filtered));
  return true;
};

export const togglePinNote = (userId: string, noteId: string): Note | null => {
  const notes = getAllNotes(userId);
  const noteIndex = notes.findIndex((n) => n.id === noteId);

  if (noteIndex === -1) return null;

  notes[noteIndex] = {
    ...notes[noteIndex],
    isPinned: !notes[noteIndex].isPinned,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(`${NOTES_STORAGE_KEY}_${userId}`, JSON.stringify(notes));
  return notes[noteIndex];
};

// ============================================================================
// SEARCH
// ============================================================================

export const searchNotes = (userId: string, query: string): Note[] => {
  const notes = getAllNotes(userId);
  if (!query.trim()) return notes;

  const lowerQuery = query.toLowerCase();
  return notes.filter(
    (note) =>
      note.title.toLowerCase().includes(lowerQuery) ||
      note.content.toLowerCase().includes(lowerQuery)
  );
};

// ============================================================================
// SORTING & FILTERING
// ============================================================================

export const getSortedNotes = (notes: Note[]): Note[] => {
  // Pinned notes first, then by updated date
  return [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
};

export const cleanupEmptyNotes = (userId: string): number => {
  const notes = getAllNotes(userId);
  const nonEmptyNotes = notes.filter(
    (note) => note.title.trim() || note.content.trim()
  );

  const removedCount = notes.length - nonEmptyNotes.length;
  if (removedCount > 0) {
    localStorage.setItem(
      `${NOTES_STORAGE_KEY}_${userId}`,
      JSON.stringify(nonEmptyNotes)
    );
  }

  return removedCount;
};

// ============================================================================
// JOURNAL BRIDGE
// ============================================================================

export const convertNoteToJournalEntry = (
  note: Note
): { type: string; content: string; title: string; date: string } => {
  return {
    type: "free-writing",
    content: note.content,
    title: note.title || "Untitled Note",
    date: new Date().toISOString(),
  };
};

// ============================================================================
// UTILITIES
// ============================================================================

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const getWordCount = (text: string): number => {
  return text.trim().split(/\s+/).filter((word) => word.length > 0).length;
};

export const getCharacterCount = (text: string): number => {
  return text.length;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};
