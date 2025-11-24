import { useEffect, useRef, useState } from "react";

interface AutoSaveOptions {
  content: string;
  delay?: number; // milliseconds
  onSave: (content: string) => Promise<void>;
  enabled?: boolean;
}

/**
 * Custom hook for auto-saving journal content
 * Debounces saves to avoid excessive API calls
 */
export function useJournalAutoSave({
  content,
  delay = 3000,
  onSave,
  enabled = true,
}: AutoSaveOptions) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastContentRef = useRef<string>("");

  useEffect(() => {
    if (!enabled || content === lastContentRef.current || !content.trim()) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debounced save
    timeoutRef.current = setTimeout(async () => {
      try {
        setIsSaving(true);
        setSaveError(null);
        await onSave(content);
        setLastSaved(new Date());
        lastContentRef.current = content;
      } catch (error: any) {
        console.error("Auto-save error:", error);
        setSaveError(error.message || "Failed to auto-save");
      } finally {
        setIsSaving(false);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, delay, enabled, onSave]);

  return {
    isSaving,
    lastSaved,
    saveError,
  };
}
