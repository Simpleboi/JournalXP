// Notebook Service - localStorage based for demo
import { Note, NoteColor, createEmptyNote } from "@/models/Note";

const NOTES_STORAGE_KEY = "notebook_notes";
const RECENT_SEARCHES_KEY = "notebook_recent_searches";
const MAX_RECENT_SEARCHES = 5;

// ============================================================================
// NOTES CRUD
// ============================================================================

export const getAllNotes = (userId: string): Note[] => {
  const data = localStorage.getItem(`${NOTES_STORAGE_KEY}_${userId}`);
  if (!data) return [];
  // Migrate old notes without color field
  const notes = JSON.parse(data) as Note[];
  return notes.map(note => ({
    ...note,
    color: note.color || 'default',
  }));
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

export const setNoteColor = (userId: string, noteId: string, color: NoteColor): Note | null => {
  const notes = getAllNotes(userId);
  const noteIndex = notes.findIndex((n) => n.id === noteId);

  if (noteIndex === -1) return null;

  notes[noteIndex] = {
    ...notes[noteIndex],
    color,
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

// Highlight search matches in text
export const highlightMatches = (text: string, query: string): { text: string; isMatch: boolean }[] => {
  if (!query.trim()) return [{ text, isMatch: false }];

  const parts: { text: string; isMatch: boolean }[] = [];
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  let lastIndex = 0;
  let index = lowerText.indexOf(lowerQuery);

  while (index !== -1) {
    // Add non-matching part
    if (index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, index), isMatch: false });
    }
    // Add matching part
    parts.push({ text: text.slice(index, index + query.length), isMatch: true });
    lastIndex = index + query.length;
    index = lowerText.indexOf(lowerQuery, lastIndex);
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), isMatch: false });
  }

  return parts.length ? parts : [{ text, isMatch: false }];
};

// ============================================================================
// RECENT SEARCHES
// ============================================================================

export const getRecentSearches = (userId: string): string[] => {
  const data = localStorage.getItem(`${RECENT_SEARCHES_KEY}_${userId}`);
  return data ? JSON.parse(data) : [];
};

export const saveRecentSearch = (userId: string, query: string): void => {
  if (!query.trim()) return;

  const searches = getRecentSearches(userId);
  const filtered = searches.filter(s => s.toLowerCase() !== query.toLowerCase());
  const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);

  localStorage.setItem(`${RECENT_SEARCHES_KEY}_${userId}`, JSON.stringify(updated));
};

export const clearRecentSearches = (userId: string): void => {
  localStorage.removeItem(`${RECENT_SEARCHES_KEY}_${userId}`);
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

export const isThisWeek = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return date >= weekAgo;
};

export const isLongNote = (note: Note, minWords: number = 100): boolean => {
  return getWordCount(note.content) >= minWords;
};

export type FilterType = 'all' | 'pinned' | 'this-week' | 'long';

export const filterNotes = (notes: Note[], filter: FilterType): Note[] => {
  switch (filter) {
    case 'pinned':
      return notes.filter(n => n.isPinned);
    case 'this-week':
      return notes.filter(n => isThisWeek(n.updatedAt));
    case 'long':
      return notes.filter(n => isLongNote(n));
    case 'all':
    default:
      return notes;
  }
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
// IMAGE/LINK DETECTION
// ============================================================================

const URL_REGEX = /https?:\/\/[^\s]+/gi;
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

export const extractFirstImageUrl = (content: string): string | null => {
  const urls = content.match(URL_REGEX);
  if (!urls) return null;

  for (const url of urls) {
    const lowerUrl = url.toLowerCase();
    if (IMAGE_EXTENSIONS.some(ext => lowerUrl.includes(ext))) {
      return url;
    }
  }
  return null;
};

export const extractFirstUrl = (content: string): string | null => {
  const match = content.match(URL_REGEX);
  return match ? match[0] : null;
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

// Get time of day for ambient theming
export const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

// Simple markdown to HTML for preview
export const parseMarkdown = (text: string): string => {
  return text
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/___(.+?)___/g, '<strong><em>$1</em></strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    // Strikethrough
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
    // Code
    .replace(/`(.+?)`/g, '<code class="bg-stone-200 px-1 rounded text-sm">$1</code>')
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-amber-700 underline" target="_blank">$1</a>')
    // Lists
    .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
    .replace(/^\* (.+)$/gm, '<li class="ml-4">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-stone-300 pl-4 italic text-stone-600">$1</blockquote>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="my-4 border-stone-300" />')
    // Paragraphs (line breaks)
    .replace(/\n\n/g, '</p><p class="mb-3">')
    .replace(/\n/g, '<br />');
};
