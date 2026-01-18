import { motion } from "framer-motion";
import { MessageSquare, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DailyResponseCounterProps {
  responsesToday: number;
  maxResponsesPerDay: number;
}

export function DailyResponseCounter({
  responsesToday,
  maxResponsesPerDay,
}: DailyResponseCounterProps) {
  const percentage = (responsesToday / maxResponsesPerDay) * 100;
  const remaining = maxResponsesPerDay - responsesToday;
  const isLimitReached = remaining <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg p-4 ${
        isLimitReached
          ? "bg-amber-50 border border-amber-200"
          : "bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <MessageSquare
            className={`h-4 w-4 ${isLimitReached ? "text-amber-600" : "text-sky-600"}`}
          />
          <span className="text-sm font-medium text-gray-700">
            Daily Responses
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span className="text-xs text-gray-600">+20 XP each</span>
        </div>
      </div>

      <Progress
        value={percentage}
        className={`h-2 mb-2 ${isLimitReached ? "[&>div]:bg-amber-500" : "[&>div]:bg-sky-500"}`}
      />

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">
          <span className="font-semibold">{responsesToday}</span>
          <span className="text-gray-400"> / {maxResponsesPerDay}</span>
        </span>
        <span className={isLimitReached ? "text-amber-600 font-medium" : "text-gray-500"}>
          {isLimitReached
            ? "Limit reached - come back tomorrow!"
            : `${remaining} remaining today`}
        </span>
      </div>
    </motion.div>
  );
}
