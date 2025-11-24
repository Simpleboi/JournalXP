import { useState, useCallback, useRef } from "react";

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

interface UseUndoRedoOptions {
  maxHistorySize?: number;
}

/**
 * Hook for undo/redo functionality with keyboard shortcuts
 */
export function useUndoRedo<T>(initialState: T, options: UseUndoRedoOptions = {}) {
  const { maxHistorySize = 50 } = options;

  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  // Set new state and add to history
  const setState = useCallback(
    (newState: T | ((prev: T) => T)) => {
      setHistory((currentHistory) => {
        const newPresent = typeof newState === "function"
          ? (newState as (prev: T) => T)(currentHistory.present)
          : newState;

        // Don't add to history if state hasn't changed
        if (JSON.stringify(newPresent) === JSON.stringify(currentHistory.present)) {
          return currentHistory;
        }

        const newPast = [...currentHistory.past, currentHistory.present];

        // Limit history size
        if (newPast.length > maxHistorySize) {
          newPast.shift();
        }

        return {
          past: newPast,
          present: newPresent,
          future: [], // Clear future when new state is set
        };
      });
    },
    [maxHistorySize]
  );

  // Undo
  const undo = useCallback(() => {
    if (!canUndo) return;

    setHistory((currentHistory) => {
      const previous = currentHistory.past[currentHistory.past.length - 1];
      const newPast = currentHistory.past.slice(0, currentHistory.past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [currentHistory.present, ...currentHistory.future],
      };
    });
  }, [canUndo]);

  // Redo
  const redo = useCallback(() => {
    if (!canRedo) return;

    setHistory((currentHistory) => {
      const next = currentHistory.future[0];
      const newFuture = currentHistory.future.slice(1);

      return {
        past: [...currentHistory.past, currentHistory.present],
        present: next,
        future: newFuture,
      };
    });
  }, [canRedo]);

  // Reset history
  const reset = useCallback((newState: T) => {
    setHistory({
      past: [],
      present: newState,
      future: [],
    });
  }, []);

  // Clear history but keep current state
  const clearHistory = useCallback(() => {
    setHistory((currentHistory) => ({
      past: [],
      present: currentHistory.present,
      future: [],
    }));
  }, []);

  // Get history info
  const getHistoryInfo = useCallback(() => {
    return {
      canUndo,
      canRedo,
      pastCount: history.past.length,
      futureCount: history.future.length,
      totalStates: history.past.length + 1 + history.future.length,
    };
  }, [canUndo, canRedo, history]);

  return {
    state: history.present,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
    clearHistory,
    getHistoryInfo,
  };
}
