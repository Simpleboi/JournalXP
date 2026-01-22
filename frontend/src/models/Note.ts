// Note Data Models for Notebook Feature

export type NoteColor =
  | 'default'
  | 'rose'
  | 'orange'
  | 'amber'
  | 'emerald'
  | 'sky'
  | 'violet'
  | 'pink';

export const NOTE_COLORS: Record<NoteColor, { bg: string; border: string; light: string; text: string }> = {
  default: { bg: 'bg-stone-50', border: 'border-stone-200', light: 'bg-stone-100', text: 'text-stone-600' },
  rose: { bg: 'bg-rose-50', border: 'border-rose-200', light: 'bg-rose-100', text: 'text-rose-600' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', light: 'bg-orange-100', text: 'text-orange-600' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', light: 'bg-amber-100', text: 'text-amber-600' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', light: 'bg-emerald-100', text: 'text-emerald-600' },
  sky: { bg: 'bg-sky-50', border: 'border-sky-200', light: 'bg-sky-100', text: 'text-sky-600' },
  violet: { bg: 'bg-violet-50', border: 'border-violet-200', light: 'bg-violet-100', text: 'text-violet-600' },
  pink: { bg: 'bg-pink-50', border: 'border-pink-200', light: 'bg-pink-100', text: 'text-pink-600' },
};

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  isPinned: boolean;
  color: NoteColor;
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
  color: 'default',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
