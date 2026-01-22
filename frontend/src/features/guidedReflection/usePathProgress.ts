import { useState, useEffect, useCallback } from 'react';
import { UserPathProgress, UserStepResponse } from '@shared/types/guidedReflection';
import { useAuth } from '@/context/AuthContext';
import { authFetch } from '@/lib/authFetch';

const STORAGE_KEY = 'guided-reflection-progress';

interface PathProgressStore {
  [pathId: string]: UserPathProgress;
}

function loadLocalProgress(): PathProgressStore {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveLocalProgress(progress: PathProgressStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
}

export function usePathProgress(pathId: string) {
  const [progress, setProgress] = useState<UserPathProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load progress on mount - from API if logged in, otherwise localStorage
  useEffect(() => {
    const loadProgress = async () => {
      setIsLoading(true);

      if (user) {
        try {
          const response = await authFetch(`/guided-reflection/progress/${pathId}`);
          if (response.progress) {
            setProgress(response.progress);
            // Also save to localStorage for offline access
            const localProgress = loadLocalProgress();
            localProgress[pathId] = response.progress;
            saveLocalProgress(localProgress);
          } else {
            // Check localStorage as fallback
            const localProgress = loadLocalProgress();
            setProgress(localProgress[pathId] || null);
          }
        } catch (error) {
          console.error('Failed to fetch progress from API:', error);
          // Fall back to localStorage
          const localProgress = loadLocalProgress();
          setProgress(localProgress[pathId] || null);
        }
      } else {
        const localProgress = loadLocalProgress();
        setProgress(localProgress[pathId] || null);
      }

      setIsLoading(false);
    };

    loadProgress();
  }, [pathId, user]);

  // Helper to save progress both locally and to API
  const persistProgress = useCallback(
    async (updatedProgress: UserPathProgress) => {
      // Always save locally first
      const allProgress = loadLocalProgress();
      allProgress[pathId] = updatedProgress;
      saveLocalProgress(allProgress);
      setProgress({ ...updatedProgress });

      // Sync to API if logged in (fire and forget)
      if (user) {
        console.log('[GuidedReflection] Syncing progress to API for path:', pathId);
        try {
          const result = await authFetch(`/guided-reflection/progress/${pathId}`, {
            method: 'POST',
            body: JSON.stringify(updatedProgress),
          });
          console.log('[GuidedReflection] Sync successful:', result);
        } catch (error) {
          console.error('[GuidedReflection] Failed to sync progress to API:', error);
        }
      } else {
        console.log('[GuidedReflection] User not logged in, skipping API sync');
      }
    },
    [pathId, user]
  );

  // Start a path (begins at step 1, skipping the intro which is step 0)
  const startPath = useCallback(() => {
    const newProgress: UserPathProgress = {
      pathId,
      currentStepIndex: 1,
      stepResponses: [],
      startedAt: new Date().toISOString(),
    };
    persistProgress(newProgress);
    return newProgress;
  }, [pathId, persistProgress]);

  // Save a step response
  const saveStepResponse = useCallback(
    (stepId: string, response: string | undefined, skipped: boolean) => {
      const allProgress = loadLocalProgress();
      const current = allProgress[pathId];
      if (!current) return;

      const stepResponse: UserStepResponse = {
        stepId,
        response,
        completed: !skipped,
        skipped,
        timestamp: new Date().toISOString(),
      };

      // Update or add the step response
      const existingIndex = current.stepResponses.findIndex(
        (r) => r.stepId === stepId
      );
      if (existingIndex >= 0) {
        current.stepResponses[existingIndex] = stepResponse;
      } else {
        current.stepResponses.push(stepResponse);
      }

      persistProgress(current);
    },
    [pathId, persistProgress]
  );

  // Move to next step
  const goToStep = useCallback(
    (stepIndex: number) => {
      const allProgress = loadLocalProgress();
      const current = allProgress[pathId];
      if (!current) return;

      current.currentStepIndex = stepIndex;
      persistProgress(current);
    },
    [pathId, persistProgress]
  );

  // Complete the path
  const completePath = useCallback(
    (aiSummary?: string) => {
      const allProgress = loadLocalProgress();
      const current = allProgress[pathId];
      if (!current) return;

      current.completedAt = new Date().toISOString();
      if (aiSummary) {
        current.aiSummary = aiSummary;
      }

      persistProgress(current);
    },
    [pathId, persistProgress]
  );

  // Reset progress for a path
  const resetPath = useCallback(async () => {
    const allProgress = loadLocalProgress();
    delete allProgress[pathId];
    saveLocalProgress(allProgress);
    setProgress(null);

    // Delete from API if logged in
    if (user) {
      try {
        await authFetch(`/guided-reflection/progress/${pathId}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Failed to delete progress from API:', error);
      }
    }
  }, [pathId, user]);

  // Get response for a specific step
  const getStepResponse = useCallback(
    (stepId: string): UserStepResponse | undefined => {
      return progress?.stepResponses.find((r) => r.stepId === stepId);
    },
    [progress]
  );

  return {
    progress,
    isLoading,
    startPath,
    saveStepResponse,
    goToStep,
    completePath,
    resetPath,
    getStepResponse,
    isStarted: progress !== null,
    isCompleted: progress?.completedAt !== undefined,
  };
}

// Hook to get all path progress for listing
export function useAllPathProgress() {
  const [allProgress, setAllProgress] = useState<PathProgressStore>({});
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProgress = async () => {
      setIsLoading(true);

      if (user) {
        try {
          const response = await authFetch('/guided-reflection/progress');
          if (response.progress) {
            setAllProgress(response.progress);
            // Also save to localStorage
            saveLocalProgress(response.progress);
          } else {
            setAllProgress(loadLocalProgress());
          }
        } catch (error) {
          console.error('Failed to fetch all progress from API:', error);
          setAllProgress(loadLocalProgress());
        }
      } else {
        setAllProgress(loadLocalProgress());
      }

      setIsLoading(false);
    };

    fetchProgress();
  }, [user]);

  const getPathProgress = useCallback(
    (pathId: string): UserPathProgress | undefined => {
      return allProgress[pathId];
    },
    [allProgress]
  );

  return {
    allProgress,
    isLoading,
    getPathProgress,
  };
}
