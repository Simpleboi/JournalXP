import { useEffect, useRef, useState } from "react";

/**
 * Custom hook for tracking time spent writing
 * Pauses when user is inactive
 */
export function useWritingTimer() {
  const [timeSpent, setTimeSpent] = useState(0); // in seconds
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Start timer
  const start = () => {
    setIsActive(true);
    lastActivityRef.current = Date.now();
  };

  // Pause timer
  const pause = () => {
    setIsActive(false);
  };

  // Reset timer
  const reset = () => {
    setTimeSpent(0);
    setIsActive(false);
  };

  // Record activity (called on keypress/input)
  const recordActivity = () => {
    lastActivityRef.current = Date.now();
    if (!isActive) {
      start();
    }
  };

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const timeSinceActivity = now - lastActivityRef.current;

        // Pause if user has been inactive for more than 5 seconds
        if (timeSinceActivity > 5000) {
          pause();
        } else {
          setTimeSpent((prev) => prev + 1);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  // Format time as MM:SS
  const formattedTime = () => {
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return {
    timeSpent,
    formattedTime: formattedTime(),
    isActive,
    start,
    pause,
    reset,
    recordActivity,
  };
}
