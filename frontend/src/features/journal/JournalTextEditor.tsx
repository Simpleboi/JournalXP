import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  Eye,
  Edit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWritingTimer } from "@/hooks/useWritingTimer";
import { useWordCountGoal } from "@/hooks/useWordCountGoal";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useUndoRedo } from "@/hooks/useUndoRedo";

// Simple markdown renderer for preview
function renderMarkdown(text: string): string {
  if (!text) return '';

  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/_(.*?)_/g, '<em>$1</em>'); // Italic

  // Handle bullet lists
  const lines = html.split('\n');
  let inList = false;
  const processedLines: string[] = [];

  lines.forEach((line) => {
    if (line.startsWith('• ')) {
      if (!inList) {
        processedLines.push('<ul>');
        inList = true;
      }
      processedLines.push(`<li>${line.substring(2)}</li>`);
    } else {
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      processedLines.push(line + '<br>');
    }
  });

  if (inList) {
    processedLines.push('</ul>');
  }

  return processedLines.join('');
}

interface JournalTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave?: () => void;
  onCancel?: () => void;
  placeholder?: string;
  wordCountGoal?: number;
  className?: string;
}

export function JournalTextEditor({
  value,
  onChange,
  onSave,
  onCancel,
  placeholder = "Start writing...",
  wordCountGoal = 250,
  className,
}: JournalTextEditorProps) {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const { timeSpent, formattedTime, recordActivity, reset: resetTimer } = useWritingTimer();
  const {
    currentCount,
    goal,
    progress,
    remaining,
    isGoalMet,
    progressColor,
  } = useWordCountGoal(value, wordCountGoal);

  // Undo/Redo functionality
  const {
    state: undoRedoValue,
    setState: setUndoRedoValue,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useUndoRedo(value, { maxHistorySize: 50 });

  // Sync undo/redo state with external value
  useEffect(() => {
    if (value !== undoRedoValue) {
      setUndoRedoValue(value);
    }
  }, [value]);

  // Handle content change with undo/redo support
  const handleChange = (newValue: string) => {
    setUndoRedoValue(newValue);
    onChange(newValue);
    recordActivity();
  };

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
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

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: "s",
      ctrl: true,
      callback: () => onSave?.(),
      description: "Save entry",
    },
    {
      key: "z",
      ctrl: true,
      callback: () => {
        if (canUndo) {
          undo();
          onChange(undoRedoValue);
        }
      },
      description: "Undo",
    },
    {
      key: "y",
      ctrl: true,
      callback: () => {
        if (canRedo) {
          redo();
          onChange(undoRedoValue);
        }
      },
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
  ], !isFocusMode || !!onSave); // Disable shortcuts in focus mode unless onSave exists

  const insertFormatting = (prefix: string, suffix: string = prefix) => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText =
      value.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      value.substring(end);

    handleChange(newText);

    // Restore focus and selection
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(
          start + prefix.length,
          end + prefix.length
        );
      }
    }, 0);
  };

  const toggleBold = () => insertFormatting("**");
  const toggleItalic = () => insertFormatting("_");
  const insertBulletList = () => {
    const lines = value.split("\n");
    const start = textareaRef.current?.selectionStart || 0;
    const lineIndex = value.substring(0, start).split("\n").length - 1;
    lines[lineIndex] = "• " + lines[lineIndex];
    handleChange(lines.join("\n"));
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

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleChange(e.target.value);
  };

  return (
    <div
      className={cn(
        "relative rounded-lg border transition-all duration-300",
        isFocusMode &&
          "fixed inset-0 z-50 bg-white border-none rounded-none flex flex-col",
        className
      )}
    >
      {/* Toolbar */}
      <div
        className={cn(
          "flex flex-col sm:flex-row items-start sm:items-center justify-between border-b p-2 gap-2 bg-gray-50",
          isFocusMode && "bg-white"
        )}
      >
        <div className="flex items-center gap-1 flex-wrap">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleBold}
            title="Bold (Ctrl+B)"
            className="h-8 w-8 p-0" 
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleItalic}
            title="Italic (Ctrl+I)"
            className="h-8 w-8 p-0"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertBulletList}
            title="Bullet List"
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-1 hidden sm:flex" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              if (canUndo) {
                undo();
                onChange(undoRedoValue);
              }
            }}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="h-8 w-8 p-0"
            aria-label="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              if (canRedo) {
                redo();
                onChange(undoRedoValue);
              }
            }}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="h-8 w-8 p-0"
            aria-label="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-1 hidden sm:block" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleVoiceInput}
            title="Voice to Text"
            className={cn(
              "h-8 w-8 p-0",
              isListening && "bg-red-100 text-red-600"
            )}
          >
            {isListening ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-1 hidden sm:block" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            title={showPreview ? "Edit Mode" : "Preview Mode"}
            className={cn(
              "h-8 w-8 p-0",
              showPreview && "bg-indigo-100 text-indigo-600"
            )}
          >
            {showPreview ? (
              <Edit className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      {!isFocusMode && (
        <div className="h-1 bg-gray-100">
          <div
            className={cn(
              "h-full transition-all duration-300",
              isGoalMet ? "bg-green-500" : "bg-indigo-500"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Text Area or Preview */}
      {showPreview ? (
        <div
          className={cn(
            "border-0 p-3 overflow-y-auto prose prose-sm max-w-none",
            isFocusMode
              ? "flex-1 min-h-0 text-lg p-8 leading-relaxed"
              : "min-h-[300px]"
          )}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(value) || `<p class="text-gray-400">${placeholder}</p>` }}
        />
      ) : (
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={handleTextChange}
          placeholder={placeholder}
          className={cn(
            "border-0 focus-visible:ring-0 resize-none",
            isFocusMode
              ? "flex-1 min-h-0 text-lg p-8 leading-relaxed"
              : "min-h-[300px]"
          )}
        />
      )}

      <div className="flex items-center gap-2 w-full sm:w-auto justify-between">
          {/* Writing Stats */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-600 pl-2">
            <span className="font-mono">{formattedTime}</span>
            <span className={cn("font-medium", progressColor)}>
              {currentCount}/{goal}
            </span>
          </div>

          {/* Focus Mode Toggle */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsFocusMode(!isFocusMode)}
            title={isFocusMode ? "Exit Focus Mode (Esc)" : "Focus Mode (Ctrl+Shift+F)"}
            className="h-8 w-8 p-0"
          >
            {isFocusMode ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>

          {isFocusMode && onSave && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onCancel}
                className="h-8 px-2 sm:px-3"
              >
                <X className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Cancel</span>
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={onSave}
                className="h-8 px-2 sm:px-3 bg-indigo-600 hover:bg-indigo-700"
              >
                <Save className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Save</span>
              </Button>
            </>
          )}
        </div>

      {/* Focus Mode Stats Panel */}
      {isFocusMode && (
        <div className="border-t p-3 sm:p-4 bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-gray-600 gap-2 sm:gap-0">
          <div className="text-xs sm:text-sm">
            {isGoalMet ? (
              <span className="text-green-600 font-medium">
                ✓ Goal reached! Keep going!
              </span>
            ) : (
              <span>
                {remaining} words remaining
              </span>
            )}
          </div>
          <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm">
            <span>Time: {formattedTime}</span>
            <span className={progressColor}>
              {currentCount}/{goal} words
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
