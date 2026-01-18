import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeartButtonProps {
  hearted: boolean;
  heartCount: number;
  onToggle: () => Promise<void>;
  disabled?: boolean;
}

export function HeartButton({ hearted, heartCount, onToggle, disabled }: HeartButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [localHearted, setLocalHearted] = useState(hearted);
  const [localCount, setLocalCount] = useState(heartCount);

  const handleClick = async () => {
    if (disabled) return;

    // Optimistic update
    setIsAnimating(true);
    setLocalHearted(!localHearted);
    setLocalCount(localHearted ? localCount - 1 : localCount + 1);

    try {
      await onToggle();
    } catch (error) {
      // Revert on error
      setLocalHearted(localHearted);
      setLocalCount(heartCount);
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={disabled}
      className={`gap-2 rounded-full px-4 transition-all ${
        localHearted
          ? "text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100"
          : "text-gray-600 hover:text-pink-600 hover:bg-pink-50"
      }`}
      aria-label={localHearted ? "Remove heart" : "Add heart"}
    >
      <motion.div
        animate={isAnimating && localHearted ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={`h-4 w-4 transition-all ${localHearted ? "fill-current" : ""}`}
        />
      </motion.div>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={localCount}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="font-semibold tabular-nums"
        >
          {localCount}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}
