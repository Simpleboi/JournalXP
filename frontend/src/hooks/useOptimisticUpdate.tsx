import { useState, useCallback } from "react";

interface OptimisticUpdateOptions<T> {
  onUpdate: (data: T) => Promise<any>;
  onSuccess?: (result: any) => void;
  onError?: (error: Error, rollback: () => void) => void;
}

/**
 * Hook for optimistic UI updates
 * Updates UI immediately and rolls back on error
 */
export function useOptimisticUpdate<T>(initialData: T, options: OptimisticUpdateOptions<T>) {
  const [data, setData] = useState<T>(initialData);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(
    async (newData: T) => {
      const previousData = data;

      // Optimistically update UI
      setData(newData);
      setIsUpdating(true);
      setError(null);

      try {
        // Perform actual update
        const result = await options.onUpdate(newData);

        // Call success callback
        options.onSuccess?.(result);

        setIsUpdating(false);
        return result;
      } catch (err) {
        // Rollback on error
        const rollback = () => setData(previousData);
        rollback();

        const error = err instanceof Error ? err : new Error("Update failed");
        setError(error);
        setIsUpdating(false);

        // Call error callback
        options.onError?.(error, rollback);

        throw error;
      }
    },
    [data, options]
  );

  return {
    data,
    setData,
    update,
    isUpdating,
    error,
  };
}
