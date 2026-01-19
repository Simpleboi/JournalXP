import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    X,
    BookMarked,
    Feather,
    MoreVertical,
    ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
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
import { Note } from "@/models/Note";
import {
    getAllNotes,
    saveNote,
    createNote,
    deleteNote,
    togglePinNote,
    searchNotes,
    getSortedNotes,
    formatRelativeTime,
    getWordCount,
    truncateText,
    convertNoteToJournalEntry,
} from "@/services/NoteService";

export default function NotebookPage() {
    const userId = "demo-user";
    const navigate = useNavigate();

    // State
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeNote, setActiveNote] = useState<Note | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
    const [isMobileListView, setIsMobileListView] = useState(true);

    // Refs for autosave
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const contentRef = useRef<HTMLTextAreaElement>(null);

    // Load notes on mount
    useEffect(() => {
        const loadedNotes = getAllNotes(userId);
        setNotes(getSortedNotes(loadedNotes));
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

    // Create new note
    const handleCreateNote = () => {
        const newNote = createNote(userId);
        setNotes((prev) => getSortedNotes([newNote, ...prev]));
        setActiveNote(newNote);
        setIsMobileListView(false);

        // Focus the content area after a brief delay
        setTimeout(() => {
            contentRef.current?.focus();
        }, 100);
    };

    // Delete note
    const handleDeleteNote = (noteId: string) => {
        setNoteToDelete(noteId);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteNote = () => {
        if (!noteToDelete) return;

        deleteNote(userId, noteToDelete);
        setNotes((prev) => prev.filter((n) => n.id !== noteToDelete));

        if (activeNote?.id === noteToDelete) {
            setActiveNote(null);
            setIsMobileListView(true);
        }

        setDeleteDialogOpen(false);
        setNoteToDelete(null);
    };

    // Toggle pin
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

    // Search
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        const results = searchNotes(userId, query);
        setNotes(getSortedNotes(results));
    };

    // Convert to journal entry
    const handleConvertToJournal = () => {
        if (!activeNote) return;

        const journalData = convertNoteToJournalEntry(activeNote);

        // Save to localStorage for the journal page to pick up
        localStorage.setItem("pendingJournalEntry", JSON.stringify(journalData));

        // Navigate to journal page
        navigate("/journal");
    };

    // Select note
    const handleSelectNote = (note: Note) => {
        setActiveNote(note);
        setIsMobileListView(false);
    };

    // Filtered notes for display
    const displayNotes = notes;
    const pinnedNotes = displayNotes.filter((n) => n.isPinned);
    const unpinnedNotes = displayNotes.filter((n) => !n.isPinned);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                className="text-slate-600 hover:bg-slate-100"
                            >
                                <Link to="/">
                                    <ChevronLeft className="h-5 w-5" />
                                </Link>
                            </Button>
                            <div>
                                <h1 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-slate-500" />
                                    Notebook
                                </h1>
                                <p className="text-sm text-slate-500">
                                    Your mental scratchpad
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {lastSaved && (
                                <span className="text-xs text-slate-400 hidden sm:inline">
                                    {isSaving ? (
                                        <span className="flex items-center gap-1">
                                            <motion.div
                                                animate={{ opacity: [0.5, 1, 0.5] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                            >
                                                Saving...
                                            </motion.div>
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1">
                                            <Check className="h-3 w-3 text-green-500" />
                                            Saved
                                        </span>
                                    )}
                                </span>
                            )}
                            <Button
                                onClick={handleCreateNote}
                                className="bg-slate-800 hover:bg-slate-900 text-white"
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
                        animate={{ opacity: 1, x: 0 }}
                        className={`lg:w-80 flex-shrink-0 ${!isMobileListView && activeNote ? "hidden lg:block" : ""
                            }`}
                    >
                        <Card className="h-full bg-white/80 backdrop-blur-sm border-slate-200 shadow-md overflow-hidden">
                            <div className="p-4 border-b border-slate-100">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        placeholder="Search notes..."
                                        className="pl-9 bg-slate-50 border-slate-200 focus:border-slate-400"
                                    />
                                </div>
                            </div>

                            <div className="overflow-y-auto h-[calc(100%-72px)]">
                                {displayNotes.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400 p-6">
                                        <Feather className="h-12 w-12 mb-4 opacity-50" />
                                        <p className="text-center">
                                            {searchQuery
                                                ? "No notes match your search"
                                                : "No notes yet. Create one to get started."}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100">
                                        {/* Pinned Notes */}
                                        {pinnedNotes.length > 0 && (
                                            <div>
                                                <div className="px-4 py-2 bg-slate-50 text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                                    <Pin className="h-3 w-3" />
                                                    Pinned
                                                </div>
                                                {pinnedNotes.map((note) => (
                                                    <NoteListItem
                                                        key={note.id}
                                                        note={note}
                                                        isActive={activeNote?.id === note.id}
                                                        onSelect={() => handleSelectNote(note)}
                                                        onPin={() => handleTogglePin(note.id)}
                                                        onDelete={() => handleDeleteNote(note.id)}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {/* Unpinned Notes */}
                                        {unpinnedNotes.length > 0 && (
                                            <div>
                                                {pinnedNotes.length > 0 && (
                                                    <div className="px-4 py-2 bg-slate-50 text-xs font-medium text-slate-500 uppercase tracking-wider">
                                                        Notes
                                                    </div>
                                                )}
                                                {unpinnedNotes.map((note) => (
                                                    <NoteListItem
                                                        key={note.id}
                                                        note={note}
                                                        isActive={activeNote?.id === note.id}
                                                        onSelect={() => handleSelectNote(note)}
                                                        onPin={() => handleTogglePin(note.id)}
                                                        onDelete={() => handleDeleteNote(note.id)}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Note Editor */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex-1 ${isMobileListView && !activeNote ? "hidden lg:block" : ""
                            }`}
                    >
                        {activeNote ? (
                            <Card className="h-full bg-white/90 backdrop-blur-sm border-slate-200 shadow-md overflow-hidden flex flex-col">
                                {/* Editor Header */}
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setActiveNote(null);
                                                setIsMobileListView(true);
                                            }}
                                            className="lg:hidden"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </Button>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <Clock className="h-3 w-3" />
                                            {formatRelativeTime(activeNote.updatedAt)}
                                            {activeNote.isPinned && (
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-amber-100 text-amber-700 text-xs"
                                                >
                                                    <Pin className="h-2.5 w-2.5 mr-1" />
                                                    Pinned
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleConvertToJournal}
                                            className="text-slate-600 hover:text-indigo-600 hover:border-indigo-300"
                                        >
                                            <BookOpen className="h-4 w-4 mr-2" />
                                            <span className="hidden sm:inline">Convert to Journal</span>
                                            <ArrowRight className="h-3 w-3 ml-1 sm:hidden" />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => handleTogglePin(activeNote.id)}
                                                >
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
                                <div className="flex-1 overflow-y-auto p-6">
                                    <Input
                                        value={activeNote.title}
                                        onChange={(e) => handleNoteChange("title", e.target.value)}
                                        placeholder="Untitled note..."
                                        className="text-2xl font-semibold border-0 shadow-none focus:ring-0 p-0 mb-4 bg-transparent placeholder:text-slate-300"
                                    />
                                    <Textarea
                                        ref={contentRef}
                                        value={activeNote.content}
                                        onChange={(e) =>
                                            handleNoteChange("content", e.target.value)
                                        }
                                        placeholder="Start writing... No prompts, no pressure. Just your thoughts."
                                        className="min-h-[400px] border-0 shadow-none focus:ring-0 p-0 resize-none bg-transparent text-slate-700 placeholder:text-slate-300 leading-relaxed"
                                    />
                                </div>

                                {/* Editor Footer */}
                                <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                                    <span>
                                        {getWordCount(activeNote.content)} words
                                    </span>
                                    <span>
                                        Created {formatRelativeTime(activeNote.createdAt)}
                                    </span>
                                </div>
                            </Card>
                        ) : (
                            <Card className="h-full bg-white/60 backdrop-blur-sm border-slate-200 shadow-md flex items-center justify-center">
                                <div className="text-center p-8">
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                                            <BookMarked className="h-10 w-10 text-slate-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-slate-700 mb-2">
                                            Your Notebook
                                        </h3>
                                        <p className="text-slate-500 mb-6 max-w-sm">
                                            A low-pressure space for quick thoughts, ideas, and mental notes.
                                            No prompts, no scoring, just you and your thoughts.
                                        </p>
                                        <Button
                                            onClick={handleCreateNote}
                                            className="bg-slate-800 hover:bg-slate-900"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Create Your First Note
                                        </Button>
                                    </motion.div>
                                </div>
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

// Note List Item Component
interface NoteListItemProps {
    note: Note;
    isActive: boolean;
    onSelect: () => void;
    onPin: () => void;
    onDelete: () => void;
}

function NoteListItem({
    note,
    isActive,
    onSelect,
    onPin,
    onDelete,
}: NoteListItemProps) {
    return (
        <motion.div
            whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
            onClick={onSelect}
            className={`p-4 cursor-pointer transition-colors ${isActive ? "bg-slate-100 border-l-2 border-slate-800" : ""
                }`}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-800 truncate">
                        {note.title || "Untitled note"}
                    </h4>
                    <p className="text-sm text-slate-500 truncate mt-1">
                        {truncateText(note.content, 60) || "No content"}
                    </p>
                    <span className="text-xs text-slate-400 mt-2 block">
                        {formatRelativeTime(note.updatedAt)}
                    </span>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 hover:opacity-100"
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
        </motion.div>
    );
}
