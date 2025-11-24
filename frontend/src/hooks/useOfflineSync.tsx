import { useState, useEffect, useCallback, useRef } from "react";

interface QueuedAction {
  id: string;
  action: () => Promise<any>;
  data: any;
  timestamp: number;
  retries: number;
}

interface UseOfflineSyncOptions {
  onSync?: (succeededCount: number, failedCount: number) => void;
  maxRetries?: number;
}

const QUEUE_STORAGE_KEY = "journalxp_offline_queue";
const MAX_RETRIES = 3;

/**
 * Hook for offline support with automatic sync when connection is restored
 */
export function useOfflineSync(options: UseOfflineSyncOptions = {}) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [queuedCount, setQueuedCount] = useState(0);
  const queueRef = useRef<QueuedAction[]>([]);
  const { maxRetries = MAX_RETRIES } = options;

  // Load queue from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(QUEUE_STORAGE_KEY);
      if (stored) {
        queueRef.current = JSON.parse(stored);
        setQueuedCount(queueRef.current.length);
      }
    } catch (error) {
      console.error("Failed to load offline queue:", error);
    }
  }, []);

  // Save queue to localStorage whenever it changes
  const saveQueue = useCallback(() => {
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queueRef.current));
      setQueuedCount(queueRef.current.length);
    } catch (error) {
      console.error("Failed to save offline queue:", error);
    }
  }, []);

  // Add action to queue
  const queueAction = useCallback(
    (action: () => Promise<any>, data: any): string => {
      const id = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const queuedAction: QueuedAction = {
        id,
        action,
        data,
        timestamp: Date.now(),
        retries: 0,
      };

      queueRef.current.push(queuedAction);
      saveQueue();

      return id;
    },
    [saveQueue]
  );

  // Process queue and sync with server
  const syncQueue = useCallback(async () => {
    if (queueRef.current.length === 0 || !navigator.onLine) {
      return;
    }

    setIsSyncing(true);
    let succeededCount = 0;
    let failedCount = 0;

    const remainingQueue: QueuedAction[] = [];

    for (const queuedAction of queueRef.current) {
      try {
        // Attempt to execute the action
        await queuedAction.action();
        succeededCount++;
      } catch (error) {
        console.error(`Failed to sync action ${queuedAction.id}:`, error);

        // Retry if under max retries
        if (queuedAction.retries < maxRetries) {
          remainingQueue.push({
            ...queuedAction,
            retries: queuedAction.retries + 1,
          });
        } else {
          failedCount++;
          console.error(`Action ${queuedAction.id} exceeded max retries`);
        }
      }
    }

    // Update queue with remaining actions
    queueRef.current = remainingQueue;
    saveQueue();
    setIsSyncing(false);

    // Call sync callback
    if (options.onSync) {
      options.onSync(succeededCount, failedCount);
    }

    return { succeededCount, failedCount };
  }, [maxRetries, saveQueue, options]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-sync when connection is restored
      syncQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [syncQueue]);

  // Clear queue
  const clearQueue = useCallback(() => {
    queueRef.current = [];
    saveQueue();
  }, [saveQueue]);

  // Execute action with offline support
  const executeWithOfflineSupport = useCallback(
    async <T,>(action: () => Promise<T>, data?: any): Promise<T> => {
      if (!navigator.onLine) {
        // Queue action for later
        queueAction(action, data);
        throw new Error("Offline: Action queued for later sync");
      }

      try {
        return await action();
      } catch (error) {
        // If network error, queue action
        if (error instanceof TypeError && error.message.includes("fetch")) {
          queueAction(action, data);
          throw new Error("Network error: Action queued for later sync");
        }
        throw error;
      }
    },
    [queueAction]
  );

  return {
    isOnline,
    isSyncing,
    queuedCount,
    queueAction,
    syncQueue,
    clearQueue,
    executeWithOfflineSupport,
  };
}
