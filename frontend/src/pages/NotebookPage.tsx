import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup, Reorder } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Plus,
  Search,
  Pin,
  PinOff,
  Trash2,
  BookOpen,
  FileText,
  Clock,
  Check,
  BookMarked,
  Feather,
  MoreVertical,
  ArrowRight,
  Palette,
  Bold,
  Italic,
  Heading,
  List,
  Quote,
  X,
  Eye,
  EyeOff,
  Calendar,
  FileStack,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Note, NoteColor, NOTE_COLORS } from "@/models/Note";
import {
  getAllNotes,
  saveNote,
  createNote,
  deleteNote,
  togglePinNote,
  setNoteColor,
  searchNotes,
  getSortedNotes,
  formatRelativeTime,
  getWordCount,
  truncateText,
  convertNoteToJournalEntry,
  highlightMatches,
  getRecentSearches,
  saveRecentSearch,
  clearRecentSearches,
  filterNotes,
  FilterType,
  extractFirstImageUrl,
  getTimeOfDay,
  parseMarkdown,
  getCharacterCount,
} from "@/services/NoteService";

// Time-based ambient gradients
const AMBIENT_GRADIENTS = {
  morning: 'from-amber-50 via-orange-50 to-rose-50',
  afternoon: 'from-sky-50 via-blue-50 to-indigo-50',
  evening: 'from-orange-50 via-rose-50 to-purple-50',
  night: 'from-slate-100 via-indigo-50 to-purple-50',
};

export default function NotebookPage() {
  const userId = "demo-user";
  const navigate = useNavigate();

  // Core state
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [isMobileListView, setIsMobileListView] = useState(true);

  // Enhanced state
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [showLinedPaper, setShowLinedPaper] = useState(true);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  // Selection state for floating toolbar
  const [selection, setSelection] = useState<{ text: string; range: Range | null }>({ text: '', range: null });
  const [toolbarPosition, setToolbarPosition] = useState<{ x: number; y: number } | null>(null);

  // Refs
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Time-based theming
  const timeOfDay = getTimeOfDay();
  const ambientGradient = AMBIENT_GRADIENTS[timeOfDay];

  // Load notes on mount
  useEffect(() => {
    const loadedNotes = getAllNotes(userId);
    setNotes(getSortedNotes(loadedNotes));
    setRecentSearches(getRecentSearches(userId));
  }, []);

  // Handle text selection for floating toolbar
  useEffect(() => {
    const handleSelection = () => {
      const sel = window.getSelection();
      if (sel && sel.toString().trim() && editorRef.current?.contains(sel.anchorNode)) {
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSelection({ text: sel.toString(), range });
        setToolbarPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10,
        });
      } else {
        setToolbarPosition(null);
      }
    };

    document.addEventListener('selectionchange', handleSelection);
    return () => document.removeEventListener('selectionchange', handleSelection);
  }, []);

  // Autosave with debounce
  const handleAutosave = useCallback(
    (note: Note) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      setIsSaving(true);

      saveTimeoutRef.current = setTimeout(() => {
        try {
          const savedNote = saveNote(userId, note);
          setNotes((prevNotes) => {
            const updated = prevNotes.map((n) =>
              n.id === savedNote.id ? savedNote : n
            );
            return getSortedNotes(updated);
          });
          setLastSaved(new Date());
        } catch (error) {
          console.error("Autosave failed:", error);
        } finally {
          setIsSaving(false);
        }
      }, 1000);
    },
    [userId]
  );

  // Handle note content changes
  const handleNoteChange = (field: "title" | "content", value: string) => {
    if (!activeNote) return;

    const updatedNote = { ...activeNote, [field]: value };
    setActiveNote(updatedNote);
    handleAutosave(updatedNote);
  };

  // Insert markdown formatting
  const insertFormatting = (prefix: string, suffix: string = prefix) => {
    if (!contentRef.current || !selection.text) return;

    const textarea = contentRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const newText = text.slice(0, start) + prefix + selection.text + suffix + text.slice(end);
    handleNoteChange("content", newText);

    // Reset selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);

    setToolbarPosition(null);
  };

  // Create new note
  const handleCreateNote = () => {
    const newNote = createNote(userId);
    setNotes((prev) => getSortedNotes([newNote, ...prev]));
    setActiveNote(newNote);
    setIsMobileListView(false);
    setIsFocusMode(false);

    setTimeout(() => {
      contentRef.current?.focus();
    }, 100);
  };

  // Delete note with animation
  const handleDeleteNote = (noteId: string) => {
    setNoteToDelete(noteId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteNote = () => {
    if (!noteToDelete) return;

    setDeletingNoteId(noteToDelete);

    // Animate out then delete
    setTimeout(() => {
      deleteNote(userId, noteToDelete);
      setNotes((prev) => prev.filter((n) => n.id !== noteToDelete));

      if (activeNote?.id === noteToDelete) {
        setActiveNote(null);
        setIsMobileListView(true);
      }

      setDeletingNoteId(null);
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
    }, 300);
  };

  // Toggle pin with animation
  const handleTogglePin = (noteId: string) => {
    const updatedNote = togglePinNote(userId, noteId);
    if (updatedNote) {
      setNotes((prev) =>
        getSortedNotes(prev.map((n) => (n.id === noteId ? updatedNote : n)))
      );
      if (activeNote?.id === noteId) {
        setActiveNote(updatedNote);
      }
    }
  };

  // Change note color
  const handleSetColor = (noteId: string, color: NoteColor) => {
    const updatedNote = setNoteColor(userId, noteId, color);
    if (updatedNote) {
      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? updatedNote : n))
      );
      if (activeNote?.id === noteId) {
        setActiveNote(updatedNote);
      }
    }
  };

  // Search with recent history
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowRecentSearches(false);

    if (query.trim()) {
      saveRecentSearch(userId, query);
      setRecentSearches(getRecentSearches(userId));
    }

    const results = searchNotes(userId, query);
    setNotes(getSortedNotes(results));
  };

  // Apply filter
  const handleFilter = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  // Convert to journal entry
  const handleConvertToJournal = () => {
    if (!activeNote) return;

    const journalData = convertNoteToJournalEntry(activeNote);
    localStorage.setItem("pendingJournalEntry", JSON.stringify(journalData));
    navigate("/journal");
  };

  // Select note
  const handleSelectNote = (note: Note) => {
    setActiveNote(note);
    setIsMobileListView(false);
    setIsFocusMode(false);
    setShowMarkdownPreview(false);
  };

  // Filtered and sorted notes
  const displayNotes = useMemo(() => {
    let filtered = searchQuery ? searchNotes(userId, searchQuery) : notes;
    filtered = filterNotes(filtered, activeFilter);
    return getSortedNotes(filtered);
  }, [notes, searchQuery, activeFilter]);

  const pinnedNotes = displayNotes.filter((n) => n.isPinned);
  const unpinnedNotes = displayNotes.filter((n) => !n.isPinned);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${ambientGradient} transition-colors duration-1000`}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-stone-200/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-stone-600 hover:bg-stone-100"
              >
                <Link to="/">
                  <ChevronLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                {/* Animated notebook icon */}
                <motion.div
                  className="relative"
                  initial={{ rotateY: -90 }}
                  animate={{ rotateY: 0 }}
                  transition={{ type: "spring", duration: 0.8 }}
                >
                  <div className="p-2 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 shadow-sm">
                    <FileText className="h-5 w-5 text-amber-700" />
                  </div>
                </motion.div>
                <div>
                  <h1 className="text-xl font-semibold text-stone-800 flex items-center gap-2">
                    Notebook
                    {/* Note count badge */}
                    <Badge variant="secondary" className="bg-stone-100 text-stone-600 text-xs">
                      {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                    </Badge>
                  </h1>
                  <p className="text-sm text-stone-500">
                    Your mental scratchpad
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Save indicator - pulsing dot */}
              <AnimatePresence>
                {lastSaved && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2"
                  >
                    {isSaving ? (
                      <motion.div
                        className="w-2 h-2 rounded-full bg-amber-500"
                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    ) : (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full bg-emerald-500"
                      />
                    )}
                    <span className="text-xs text-stone-400 hidden sm:inline">
                      {isSaving ? 'Saving...' : 'Saved'}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
              <Button
                onClick={handleCreateNote}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-md"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">New Note</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-180px)]">
          {/* Notes List Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: isFocusMode ? 0.3 : 1,
              x: 0,
              filter: isFocusMode ? 'blur(2px)' : 'blur(0px)',
            }}
            transition={{ duration: 0.3 }}
            className={`lg:w-80 flex-shrink-0 ${!isMobileListView && activeNote ? "hidden lg:block" : ""}`}
          >
            <Card className="h-full bg-white/90 backdrop-blur-sm border-stone-200 shadow-lg overflow-hidden">
              {/* Search section */}
              <div className="p-4 border-b border-stone-100 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => setShowRecentSearches(true)}
                    onBlur={() => setTimeout(() => setShowRecentSearches(false), 200)}
                    placeholder="Search notes..."
                    className="pl-9 bg-stone-50 border-stone-200 focus:border-amber-400 focus:ring-amber-400/20"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setNotes(getSortedNotes(getAllNotes(userId)));
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <X className="h-4 w-4 text-stone-400 hover:text-stone-600" />
                    </button>
                  )}

                  {/* Recent searches dropdown */}
                  <AnimatePresence>
                    {showRecentSearches && recentSearches.length > 0 && !searchQuery && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-stone-200 z-20 overflow-hidden"
                      >
                        <div className="p-2 text-xs text-stone-500 border-b border-stone-100 flex items-center justify-between">
                          <span>Recent searches</span>
                          <button
                            onClick={() => {
                              clearRecentSearches(userId);
                              setRecentSearches([]);
                            }}
                            className="text-stone-400 hover:text-stone-600"
                          >
                            Clear
                          </button>
                        </div>
                        {recentSearches.map((search, i) => (
                          <button
                            key={i}
                            onClick={() => handleSearch(search)}
                            className="w-full px-3 py-2 text-left text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                          >
                            <Clock className="h-3 w-3 text-stone-400" />
                            {search}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Filter chips */}
                <div className="flex gap-2 flex-wrap">
                  {[
                    { key: 'all', label: 'All', icon: FileStack },
                    { key: 'pinned', label: 'Pinned', icon: Pin },
                    { key: 'this-week', label: 'This Week', icon: Calendar },
                    { key: 'long', label: 'Long', icon: FileText },
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => handleFilter(key as FilterType)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-all ${
                        activeFilter === key
                          ? 'bg-amber-100 text-amber-700 shadow-sm'
                          : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                      }`}
                    >
                      <Icon className="h-3 w-3" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes list */}
              <div className="overflow-y-auto h-[calc(100%-140px)]">
                {displayNotes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-stone-400 p-6">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring" }}
                    >
                      <Feather className="h-12 w-12 mb-4 opacity-50" />
                    </motion.div>
                    <p className="text-center">
                      {searchQuery
                        ? "No notes match your search"
                        : activeFilter !== 'all'
                        ? `No ${activeFilter} notes`
                        : "No notes yet. Create one to get started."}
                    </p>
                  </div>
                ) : (
                  <LayoutGroup>
                    <div className="divide-y divide-stone-100">
                      {/* Pinned Notes */}
                      {pinnedNotes.length > 0 && (
                        <div>
                          <div className="px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 text-xs font-medium text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                            <Pin className="h-3 w-3" />
                            Pinned
                            <Badge variant="secondary" className="bg-amber-100 text-amber-600 text-xs ml-auto">
                              {pinnedNotes.length}
                            </Badge>
                          </div>
                          {pinnedNotes.map((note, index) => (
                            <NoteListItem
                              key={note.id}
                              note={note}
                              index={index}
                              isActive={activeNote?.id === note.id}
                              isDeleting={deletingNoteId === note.id}
                              searchQuery={searchQuery}
                              onSelect={() => handleSelectNote(note)}
                              onPin={() => handleTogglePin(note.id)}
                              onDelete={() => handleDeleteNote(note.id)}
                              onSetColor={(color) => handleSetColor(note.id, color)}
                            />
                          ))}
                        </div>
                      )}

                      {/* Unpinned Notes */}
                      {unpinnedNotes.length > 0 && (
                        <div>
                          {pinnedNotes.length > 0 && (
                            <div className="px-4 py-2 bg-stone-50 text-xs font-medium text-stone-500 uppercase tracking-wider">
                              Notes
                            </div>
                          )}
                          {unpinnedNotes.map((note, index) => (
                            <NoteListItem
                              key={note.id}
                              note={note}
                              index={index}
                              isActive={activeNote?.id === note.id}
                              isDeleting={deletingNoteId === note.id}
                              searchQuery={searchQuery}
                              onSelect={() => handleSelectNote(note)}
                              onPin={() => handleTogglePin(note.id)}
                              onDelete={() => handleDeleteNote(note.id)}
                              onSetColor={(color) => handleSetColor(note.id, color)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </LayoutGroup>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Note Editor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex-1 ${isMobileListView && !activeNote ? "hidden lg:block" : ""}`}
          >
            {activeNote ? (
              <Card
                className={`h-full overflow-hidden flex flex-col transition-all duration-300${
                  NOTE_COLORS[activeNote.color].bg
                } ${NOTE_COLORS[activeNote.color].border} border-2 shadow-xl`}
                style={{
                  boxShadow: isFocusMode
                    ? '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
                    : '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
                }}
              >
                {/* Editor Header */}
                <div className={`p-4 border-b${NOTE_COLORS[activeNote.color].border} flex items-center justify-between bg-white/50`}>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setActiveNote(null);
                        setIsMobileListView(true);
                        setIsFocusMode(false);
                      }}
                      className="lg:hidden"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <Clock className="h-3 w-3" />
                      {formatRelativeTime(activeNote.updatedAt)}
                      {activeNote.isPinned && (
                        <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border-amber-200 text-xs">
                          <Pin className="h-2.5 w-2.5 mr-1" />
                          Pinned
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Focus mode toggle */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsFocusMode(!isFocusMode)}
                      className={`text-stone-500 ${isFocusMode ? 'bg-amber-100 text-amber-700' : ''}`}
                    >
                      <Sparkles className="h-4 w-4" />
                    </Button>

                    {/* Lined paper toggle */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowLinedPaper(!showLinedPaper)}
                      className={`text-stone-500 ${showLinedPaper ? 'bg-stone-100' : ''}`}
                    >
                      <List className="h-4 w-4" />
                    </Button>

                    {/* Markdown preview toggle */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowMarkdownPreview(!showMarkdownPreview)}
                      className={`text-stone-500 ${showMarkdownPreview ? 'bg-stone-100' : ''}`}
                    >
                      {showMarkdownPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleConvertToJournal}
                      className="text-stone-600 hover:text-amber-700 hover:border-amber-300 hidden sm:flex"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Convert to Journal
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleTogglePin(activeNote.id)}>
                          {activeNote.isPinned ? (
                            <>
                              <PinOff className="h-4 w-4 mr-2" />
                              Unpin Note
                            </>
                          ) : (
                            <>
                              <Pin className="h-4 w-4 mr-2" />
                              Pin Note
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <Palette className="h-4 w-4 mr-2" />
                            Change Color
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            {(Object.keys(NOTE_COLORS) as NoteColor[]).map((color) => (
                              <DropdownMenuItem
                                key={color}
                                onClick={() => handleSetColor(activeNote.id, color)}
                              >
                                <div className={`w-4 h-4 rounded-full mr-2 ${NOTE_COLORS[color].light} border ${NOTE_COLORS[color].border}`} />
                                {color.charAt(0).toUpperCase() + color.slice(1)}
                                {activeNote.color === color && <Check className="h-4 w-4 ml-auto" />}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuItem onClick={handleConvertToJournal} className="sm:hidden">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Convert to Journal
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteNote(activeNote.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Note
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Editor Content */}
                <div
                  ref={editorRef}
                  className="flex-1 overflow-y-auto p-6 relative"
                >
                  <Input
                    value={activeNote.title}
                    onChange={(e) => handleNoteChange("title", e.target.value)}
                    placeholder="Untitled note..."
                    className="text-2xl font-semibold border-0 shadow-none focus-visible:ring-0 p-0 mb-4 bg-transparent placeholder:text-stone-300 text-stone-800"
                    style={{ fontFamily: "'Georgia', serif" }}
                  />

                  {showMarkdownPreview ? (
                    <div
                      className="prose prose-stone max-w-none text-stone-700"
                      style={{
                        fontFamily: "'Georgia', serif",
                        lineHeight: showLinedPaper ? '32px' : '1.8',
                        backgroundImage: showLinedPaper
                          ? 'repeating-linear-gradient(transparent, transparent 31px, #e7e5e4 31px, #e7e5e4 32px)'
                          : 'none',
                        backgroundSize: '100% 32px',
                        backgroundAttachment: 'local',
                        paddingTop: showLinedPaper ? '8px' : '0',
                      }}
                      dangerouslySetInnerHTML={{ __html: parseMarkdown(activeNote.content) || '<p class="text-stone-400">Nothing to preview...</p>' }}
                    />
                  ) : (
                    <Textarea
                      ref={contentRef}
                      value={activeNote.content}
                      onChange={(e) => handleNoteChange("content", e.target.value)}
                      placeholder="Start writing... No prompts, no pressure. Just your thoughts."
                      className="min-h-[400px] border-0 shadow-none focus-visible:ring-0 pl-0 resize-none text-stone-700 placeholder:text-stone-300"
                      style={{
                        fontFamily: "'Georgia', serif",
                        fontSize: '1.05rem',
                        lineHeight: showLinedPaper ? '32px' : '1.8',
                        backgroundImage: showLinedPaper
                          ? 'repeating-linear-gradient(transparent, transparent 31px, #e7e5e4 31px, #e7e5e4 32px)'
                          : 'none',
                        backgroundSize: '100% 32px',
                        backgroundAttachment: 'local',
                        backgroundColor: 'transparent',
                        paddingTop: showLinedPaper ? '8px' : '0',
                      }}
                    />
                  )}

                  {/* Floating formatting toolbar */}
                  <AnimatePresence>
                    {toolbarPosition && !showMarkdownPreview && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="fixed z-50 bg-white rounded-lg shadow-xl border border-stone-200 p-1 flex gap-1"
                        style={{
                          left: toolbarPosition.x,
                          top: toolbarPosition.y,
                          transform: 'translate(-50%, -100%)',
                        }}
                      >
                        <button
                          onClick={() => insertFormatting('**')}
                          className="p-2 hover:bg-stone-100 rounded"
                          title="Bold"
                        >
                          <Bold className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => insertFormatting('*')}
                          className="p-2 hover:bg-stone-100 rounded"
                          title="Italic"
                        >
                          <Italic className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => insertFormatting('## ', '')}
                          className="p-2 hover:bg-stone-100 rounded"
                          title="Heading"
                        >
                          <Heading className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => insertFormatting('> ', '')}
                          className="p-2 hover:bg-stone-100 rounded"
                          title="Quote"
                        >
                          <Quote className="h-4 w-4" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Editor Footer */}
                <div className={`p-4 border-t ${NOTE_COLORS[activeNote.color].border} flex items-center justify-between text-xs text-stone-500 bg-white/50`}>
                  <div className="flex items-center gap-4">
                    <span>{getWordCount(activeNote.content)} words</span>
                    <span>{getCharacterCount(activeNote.content)} chars</span>
                  </div>
                  <span>Created {formatRelativeTime(activeNote.createdAt)}</span>
                </div>
              </Card>
            ) : (
              <Card className="h-full bg-white/80 backdrop-blur-sm border-stone-200 shadow-lg flex items-center justify-center">
                <EmptyState onCreateNote={handleCreateNote} />
              </Card>
            )}
          </motion.div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this note?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The note will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteNote}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============================================================================
// ILLUSTRATED EMPTY STATE
// ============================================================================

function EmptyState({ onCreateNote }: { onCreateNote: () => void }) {
  return (
    <div className="text-center p-8 max-w-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        {/* Illustrated notebook */}
        <div className="relative w-32 h-40 mx-auto mb-8">
          {/* Notebook pages */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg shadow-md"
            style={{ transform: 'rotate(-3deg)' }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-stone-50 to-stone-100 rounded-lg shadow-md"
            style={{ transform: 'rotate(0deg)' }}
            initial={{ rotateY: -30 }}
            animate={{ rotateY: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            {/* Lines on page */}
            <div className="absolute inset-4 space-y-3">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-0.5 bg-stone-200 rounded"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                />
              ))}
            </div>
            {/* Binding */}
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-amber-200 to-amber-100 rounded-l-lg" />
          </motion.div>
          {/* Pencil */}
          <motion.div
            className="absolute -right-4 -bottom-4 w-24 h-3 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full shadow-md"
            style={{ transform: 'rotate(-45deg)', transformOrigin: 'left center' }}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, type: "spring" }}
          >
            <div className="absolute right-0 w-4 h-3 bg-stone-700 rounded-r-full" />
            <div className="absolute left-0 w-3 h-3 bg-pink-300 rounded-l-full" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-stone-700 mb-2">
            Your Notebook
          </h3>
          <p className="text-stone-500 mb-6">
            A low-pressure space for quick thoughts, ideas, and mental notes.
            No prompts, no scoring, just you and your thoughts.
          </p>
          <Button
            onClick={onCreateNote}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Note
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ============================================================================
// NOTE LIST ITEM
// ============================================================================

interface NoteListItemProps {
  note: Note;
  index: number;
  isActive: boolean;
  isDeleting: boolean;
  searchQuery: string;
  onSelect: () => void;
  onPin: () => void;
  onDelete: () => void;
  onSetColor: (color: NoteColor) => void;
}

function NoteListItem({
  note,
  index,
  isActive,
  isDeleting,
  searchQuery,
  onSelect,
  onPin,
  onDelete,
  onSetColor,
}: NoteListItemProps) {
  const colorStyles = NOTE_COLORS[note.color];
  const imageUrl = extractFirstImageUrl(note.content);
  const charCount = getCharacterCount(note.content);

  // Highlight search matches
  const renderHighlightedText = (text: string, maxLength: number) => {
    const truncated = truncateText(text, maxLength);
    const parts = highlightMatches(truncated, searchQuery);

    return parts.map((part, i) =>
      part.isMatch ? (
        <mark key={i} className="bg-amber-200 text-amber-900 rounded px-0.5">
          {part.text}
        </mark>
      ) : (
        <span key={i}>{part.text}</span>
      )
    );
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{
        opacity: isDeleting ? 0 : 1,
        x: isDeleting ? -50 : 0,
        scale: isDeleting ? 0.8 : 1,
      }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      onClick={onSelect}
      className={`p-4 cursor-pointer transition-all group relative ${
        isActive
          ? `${colorStyles.bg} border-l-4 border-amber-500`
          : `hover:${colorStyles.bg} border-l-4 border-transparent`
      } ${note.isPinned && !isActive ? 'bg-gradient-to-r from-amber-50/50 to-transparent' : ''}`}
    >
      {/* Color indicator */}
      {note.color !== 'default' && (
        <div className={`absolute top-0 right-0 w-2 h-2 rounded-bl-md ${colorStyles.light}`} />
      )}

      <div className="flex gap-3">
        {/* Thumbnail if image exists */}
        {imageUrl && (
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-100">
              <img
                src={imageUrl}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-stone-800 truncate text-sm">
                {searchQuery
                  ? renderHighlightedText(note.title || "Untitled note", 40)
                  : note.title || "Untitled note"}
              </h4>
              <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                {searchQuery
                  ? renderHighlightedText(note.content || "No content", 80)
                  : truncateText(note.content, 80) || "No content"}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-stone-400">
                  {formatRelativeTime(note.updatedAt)}
                </span>
                {/* Character count badge */}
                <Badge variant="outline" className="text-xs py-0 px-1.5 text-stone-400 border-stone-200">
                  {charCount > 1000 ? `${Math.floor(charCount / 1000)}k` : charCount}
                </Badge>
                {note.isPinned && (
                  <Pin className="h-3 w-3 text-amber-500" />
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onPin();
                  }}
                >
                  {note.isPinned ? (
                    <>
                      <PinOff className="h-4 w-4 mr-2" />
                      Unpin
                    </>
                  ) : (
                    <>
                      <Pin className="h-4 w-4 mr-2" />
                      Pin
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Palette className="h-4 w-4 mr-2" />
                    Color
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {(Object.keys(NOTE_COLORS) as NoteColor[]).map((color) => (
                      <DropdownMenuItem
                        key={color}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSetColor(color);
                        }}
                      >
                        <div className={`w-4 h-4 rounded-full mr-2 ${NOTE_COLORS[color].light} border ${NOTE_COLORS[color].border}`} />
                        {color.charAt(0).toUpperCase() + color.slice(1)}
                        {note.color === color && <Check className="h-4 w-4 ml-auto" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
