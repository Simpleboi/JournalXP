import { useEffect, useRef, useState, useMemo } from "react";
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
  Edit3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWritingTimer } from "@/hooks/useWritingTimer";
import { useWordCountGoal } from "@/hooks/useWordCountGoal";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useUndoRedo } from "@/hooks/useUndoRedo";
import { marked } from "marked";

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
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Render Markdown to HTML
  const renderedHtml = useMemo(() => {
    if (!isPreviewMode) return "";
    return marked(value || placeholder, { breaks: true });
  }, [value, isPreviewMode, placeholder]);

  const {
    timeSpent,
    formattedTime,
    recordActivity,
    reset: resetTimer,
  } = useWritingTimer();
  const { currentCount, goal, progress, remaining, isGoalMet, progressColor } =
    useWordCountGoal(value, wordCountGoal);

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
  useKeyboardShortcuts(
    [
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
    ],
    true
  ); // Always enable keyboard shortcuts

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
        "relative rounded-2xl border-2 transition-all duration-300 overflow-hidden",
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
          "flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200/50 p-2 gap-2 bg-gradient-to-r from-gray-50/90 to-slate-50/90 backdrop-blur-sm",
          isFocusMode && "bg-white"
        )}
      >
        <div className="flex items-center gap-1 flex-wrap">
          <Button
            type="button"
            variant={isPreviewMode ? "default" : "ghost"}
            size="sm"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            title={isPreviewMode ? "Edit Mode" : "Preview Mode"}
            className="h-8 px-2"
          >
            {isPreviewMode ? (
              <>
                <Edit3 className="h-4 w-4 mr-1" />
                <span className="text-xs">Edit</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-1" />
                <span className="text-xs">Preview</span>
              </>
            )}
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleBold}
            title="Bold (Ctrl+B)"
            className="h-8 w-8 p-0"
            disabled={isPreviewMode}
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
            disabled={isPreviewMode}
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
            disabled={isPreviewMode}
          >
            <List className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-1 hidden sm:block" />
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
            disabled={!canUndo || isPreviewMode}
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
            disabled={!canRedo || isPreviewMode}
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
            disabled={isPreviewMode}
          >
            {isListening ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
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

      {/* Text Area or Preview */}
      {isPreviewMode ? (
        <div
          className={cn(
            "prose prose-sm max-w-none p-4 overflow-auto bg-white/50",
            isFocusMode
              ? "flex-1 min-h-0 text-lg p-8 leading-relaxed prose-lg"
              : "min-h-[300px]"
          )}
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
      ) : (
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={handleTextChange}
          onFocus={() => setIsTextareaFocused(true)}
          onBlur={() => setIsTextareaFocused(false)}
          placeholder={placeholder}
          className={cn(
            "border-0 focus-visible:ring-0 resize-y bg-white/50 text-gray-800 placeholder:text-gray-400",
            isFocusMode
              ? "flex-1 min-h-0 text-lg p-8 leading-relaxed"
              : "min-h-[300px] p-5 text-base leading-relaxed"
          )}
        />
      )}

      {/* Writing Stats */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-between p-2 bg-gradient-to-r from-gray-50/80 to-slate-50/80 border-t border-gray-100/50">
        <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-600 pl-2">
          <span className="font-mono bg-white/60 px-2 py-0.5 rounded-lg">{formattedTime}</span>
          <span className={cn("font-medium px-2 py-0.5 rounded-lg", progressColor, isGoalMet ? "bg-green-50" : "bg-indigo-50/60")}>
            {currentCount}/{goal}
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
          className="h-8 w-8 p-0 hover:bg-white/60"
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
              <span>{remaining} words remaining</span>
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
