import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  List,
  Maximize2,
  Minimize2,
  Mic,
  MicOff,
  Save,
  X,
  Undo2,
  Redo2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWritingTimer } from "@/hooks/useWritingTimer";
import { useWordCountGoal } from "@/hooks/useWordCountGoal";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

interface JournalTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave?: () => void;
  onCancel?: () => void;
  onTimeUpdate?: (timeInSeconds: number) => void;
  placeholder?: string;
  wordCountGoal?: number;
  className?: string;
}

// Convert HTML to plain text with markdown
function htmlToMarkdown(html: string): string {
  const temp = document.createElement('div');
  temp.innerHTML = html;

  // Replace <b> and <strong> with **
  temp.querySelectorAll('b, strong').forEach(el => {
    el.replaceWith(`**${el.textContent}**`);
  });

  // Replace <i> and <em> with _
  temp.querySelectorAll('i, em').forEach(el => {
    el.replaceWith(`_${el.textContent}_`);
  });

  // Replace <br> with newlines
  temp.querySelectorAll('br').forEach(el => {
    el.replaceWith('\n');
  });

  // Replace divs/paragraphs with newlines
  temp.querySelectorAll('div, p').forEach(el => {
    if (el.textContent) {
      el.replaceWith(el.textContent + '\n');
    }
  });

  // Get text and clean up multiple newlines
  return temp.textContent || '';
}

// Convert markdown to HTML for display
function markdownToHtml(text: string): string {
  if (!text) return '';

  let html = text
    // Escape HTML entities first
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Bold: **text** or __text__
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    // Italic: *text* or _text_ (but not inside words)
    .replace(/(?<!\w)\*([^*]+)\*(?!\w)/g, '<em>$1</em>')
    .replace(/(?<!\w)_([^_]+)_(?!\w)/g, '<em>$1</em>')
    // Bullet points
    .replace(/^• (.+)$/gm, '<li>$1</li>')
    // Line breaks
    .replace(/\n/g, '<br>');

  return html;
}

export function JournalTextEditor({
  value,
  onChange,
  onSave,
  onCancel,
  onTimeUpdate,
  placeholder = "Start writing...",
  wordCountGoal = 250,
  className,
}: JournalTextEditorProps) {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [isBoldActive, setIsBoldActive] = useState(false);
  const [isItalicActive, setIsItalicActive] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const isInternalUpdate = useRef(false);

  // Check formatting state on selection change
  const updateFormattingState = useCallback(() => {
    setIsBoldActive(document.queryCommandState('bold'));
    setIsItalicActive(document.queryCommandState('italic'));
  }, []);

  // Listen for selection changes to update formatting state
  useEffect(() => {
    const handleSelectionChange = () => {
      if (isTextareaFocused) {
        updateFormattingState();
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [isTextareaFocused, updateFormattingState]);

  const {
    formattedTime,
    recordActivity,
  } = useWritingTimer();

  const { currentCount, goal, progress, remaining, isGoalMet, progressColor } =
    useWordCountGoal(value, wordCountGoal);

  // Save cursor position
  const saveCursorPosition = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(editorRef.current!);
    preCaretRange.setEnd(range.endContainer, range.endOffset);

    return preCaretRange.toString().length;
  }, []);

  // Restore cursor position
  const restoreCursorPosition = useCallback((position: number) => {
    if (!editorRef.current || position === null) return;

    const selection = window.getSelection();
    if (!selection) return;

    const range = document.createRange();
    let currentPos = 0;
    let found = false;

    const walker = document.createTreeWalker(
      editorRef.current,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node: Node | null;
    while ((node = walker.nextNode()) && !found) {
      const textNode = node as Text;
      const nodeLength = textNode.length;

      if (currentPos + nodeLength >= position) {
        range.setStart(textNode, position - currentPos);
        range.collapse(true);
        found = true;
      }
      currentPos += nodeLength;
    }

    if (found) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, []);

  // Handle content change
  const handleInput = useCallback(() => {
    if (!editorRef.current || isInternalUpdate.current) return;

    const html = editorRef.current.innerHTML;
    const text = htmlToMarkdown(html);

    // Save to undo stack
    setUndoStack(prev => [...prev.slice(-49), value]);
    setRedoStack([]);

    onChange(text);
    recordActivity();
  }, [onChange, recordActivity, value]);

  // Update editor content when value changes externally
  useEffect(() => {
    if (!editorRef.current) return;

    const currentHtml = editorRef.current.innerHTML;
    const newHtml = markdownToHtml(value);

    // Only update if content actually changed (avoid cursor jumping)
    if (htmlToMarkdown(currentHtml) !== value) {
      isInternalUpdate.current = true;
      const cursorPos = saveCursorPosition();
      editorRef.current.innerHTML = newHtml || '';
      if (cursorPos !== null) {
        restoreCursorPosition(cursorPos);
      }
      isInternalUpdate.current = false;
    }
  }, [value, saveCursorPosition, restoreCursorPosition]);

  // Initialize speech recognition
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          }
        }

        if (finalTranscript) {
          onChange(value + finalTranscript);
          recordActivity();
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [value, onChange, recordActivity]);

  const toggleBold = useCallback(() => {
    document.execCommand('bold', false);
    updateFormattingState();
    if (!editorRef.current || isInternalUpdate.current) return;
    const html = editorRef.current.innerHTML;
    const text = htmlToMarkdown(html);
    setUndoStack(prev => [...prev.slice(-49), value]);
    setRedoStack([]);
    onChange(text);
    recordActivity();
  }, [onChange, recordActivity, value, updateFormattingState]);

  const toggleItalic = useCallback(() => {
    document.execCommand('italic', false);
    updateFormattingState();
    if (!editorRef.current || isInternalUpdate.current) return;
    const html = editorRef.current.innerHTML;
    const text = htmlToMarkdown(html);
    setUndoStack(prev => [...prev.slice(-49), value]);
    setRedoStack([]);
    onChange(text);
    recordActivity();
  }, [onChange, recordActivity, value, updateFormattingState]);

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const previousValue = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, value]);
    onChange(previousValue);
  }, [undoStack, value, onChange]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const nextValue = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, value]);
    onChange(nextValue);
  }, [redoStack, value, onChange]);

  // Keyboard shortcuts
  useKeyboardShortcuts(
    [
      {
        key: "s",
        ctrl: true,
        callback: () => onSave?.(),
        description: "Save entry",
      },
      {
        key: "b",
        ctrl: true,
        callback: toggleBold,
        description: "Bold",
      },
      {
        key: "i",
        ctrl: true,
        callback: toggleItalic,
        description: "Italic",
      },
      {
        key: "z",
        ctrl: true,
        callback: handleUndo,
        description: "Undo",
      },
      {
        key: "y",
        ctrl: true,
        callback: handleRedo,
        description: "Redo",
      },
      {
        key: "Escape",
        callback: () => {
          if (isFocusMode) {
            setIsFocusMode(false);
          } else {
            onCancel?.();
          }
        },
        description: "Exit focus mode or cancel",
      },
      {
        key: "f",
        ctrl: true,
        shift: true,
        callback: () => setIsFocusMode(!isFocusMode),
        description: "Toggle focus mode",
      },
    ],
    true
  );

  const insertBulletList = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const bulletNode = document.createTextNode('• ');
    range.insertNode(bulletNode);
    range.setStartAfter(bulletNode);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);

    handleInput();
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Handle paste - strip formatting and convert to plain text
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    handleInput();
  };

  // Handle key events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Enter key to insert <br> instead of <div>
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      document.execCommand('insertLineBreak');
      handleInput();
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-xl sm:rounded-2xl border-2 transition-all duration-300 overflow-hidden",
        isTextareaFocused && !isFocusMode && "ring-2 ring-offset-2 ring-indigo-200",
        isFocusMode
          ? "fixed inset-0 z-50 bg-white border-none rounded-none flex flex-col"
          : "border-gray-200/80 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md",
        className
      )}
    >
      {/* Toolbar */}
      <div
        className={cn(
          "flex items-center justify-between border-b border-gray-200/50 p-1.5 sm:p-2 gap-1 sm:gap-2 bg-gradient-to-r from-gray-50/90 to-slate-50/90 backdrop-blur-sm",
          isFocusMode && "bg-white"
        )}
      >
        <div className="flex items-center gap-0.5 sm:gap-1 flex-wrap">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleBold}
            title="Bold (Ctrl+B)"
            className={cn(
              "h-7 w-7 sm:h-8 sm:w-8 p-0 font-bold transition-all",
              isBoldActive && "bg-indigo-100 text-indigo-700 ring-2 ring-indigo-300 ring-offset-1"
            )}
          >
            <Bold className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleItalic}
            title="Italic (Ctrl+I)"
            className={cn(
              "h-7 w-7 sm:h-8 sm:w-8 p-0 transition-all",
              isItalicActive && "bg-indigo-100 text-indigo-700 ring-2 ring-indigo-300 ring-offset-1"
            )}
          >
            <Italic className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertBulletList}
            title="Bullet List"
            className="h-7 w-7 sm:h-8 sm:w-8 p-0"
          >
            <List className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
          <div className="w-px h-5 sm:h-6 bg-gray-300 mx-0.5 sm:mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            title="Undo (Ctrl+Z)"
            className="h-7 w-7 sm:h-8 sm:w-8 p-0"
            aria-label="Undo"
          >
            <Undo2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            title="Redo (Ctrl+Y)"
            className="h-7 w-7 sm:h-8 sm:w-8 p-0"
            aria-label="Redo"
          >
            <Redo2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
          <div className="w-px h-5 sm:h-6 bg-gray-300 mx-0.5 sm:mx-1 hidden sm:block" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleVoiceInput}
            title="Voice to Text"
            className={cn(
              "h-7 w-7 sm:h-8 sm:w-8 p-0",
              isListening && "bg-red-100 text-red-600"
            )}
          >
            {isListening ? (
              <MicOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            ) : (
              <Mic className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      {!isFocusMode && (
        <div className="h-1.5 bg-gradient-to-r from-gray-100 to-gray-50">
          <div
            className={cn(
              "h-full transition-all duration-500 ease-out rounded-r-full",
              isGoalMet
                ? "bg-gradient-to-r from-green-400 to-emerald-500"
                : "bg-gradient-to-r from-indigo-400 to-purple-500"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Rich Text Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsTextareaFocused(true)}
        onBlur={() => setIsTextareaFocused(false)}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        className={cn(
          "outline-none bg-white/50 text-gray-800",
          "prose prose-sm max-w-none",
          "[&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-gray-400 [&:empty]:before:pointer-events-none",
          "[&_strong]:font-bold [&_em]:italic",
          isFocusMode
            ? "flex-1 min-h-0 text-base sm:text-lg p-4 sm:p-8 leading-relaxed overflow-auto"
            : "min-h-[200px] sm:min-h-[300px] p-3 sm:p-5 text-sm sm:text-base leading-relaxed overflow-auto resize-y"
        )}
        style={{
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
        }}
      />

      {/* Writing Stats */}
      <div className="flex items-center gap-1.5 sm:gap-2 w-full justify-between p-1.5 sm:p-2 bg-gradient-to-r from-gray-50/80 to-slate-50/80 border-t border-gray-100/50">
        <div className="flex items-center gap-1.5 sm:gap-3 text-[10px] sm:text-xs text-gray-600 pl-1 sm:pl-2">
          <span className="font-mono bg-white/60 px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg">{formattedTime}</span>
          <span className={cn("font-medium px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg", progressColor, isGoalMet ? "bg-green-50" : "bg-indigo-50/60")}>
            {currentCount}/{goal} <span className="text-gray-600 font-normal pl-2">word goal</span>
          </span>
        </div>

        {/* Focus Mode Toggle */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsFocusMode(!isFocusMode)}
          title={
            isFocusMode ? "Exit Focus Mode (Esc)" : "Focus Mode (Ctrl+Shift+F)"
          }
          className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-white/60"
        >
          {isFocusMode ? (
            <Minimize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          ) : (
            <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          )}
        </Button>

        {isFocusMode && onSave && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-7 sm:h-8 px-2 sm:px-3"
            >
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-1" />
              <span className="hidden sm:inline">Cancel</span>
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onSave}
              className="h-7 sm:h-8 px-2 sm:px-3 bg-indigo-600 hover:bg-indigo-700"
            >
              <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-1" />
              <span className="hidden sm:inline">Save</span>
            </Button>
          </>
        )}
      </div>

      {/* Focus Mode Stats Panel */}
      {isFocusMode && (
        <div className="border-t p-2 sm:p-4 bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm text-gray-600 gap-1.5 sm:gap-0">
          <div className="text-[10px] sm:text-sm">
            {isGoalMet ? (
              <span className="text-green-600 font-medium">
                ✓ Goal reached!
              </span>
            ) : (
              <span>{remaining} words left</span>
            )}
          </div>
          <div className="flex gap-2 sm:gap-4 text-[10px] sm:text-sm">
            <span>{formattedTime}</span>
            <span className={progressColor}>
              {currentCount}/{goal} <span className="text-gray-400 font-normal">word goal</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
