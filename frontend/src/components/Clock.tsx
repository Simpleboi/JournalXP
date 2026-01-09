import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Clock } from "lucide-react";
import { useState } from "react";

export const LiveClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100 shadow-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium">Current Time</span>
            </div>
            <motion.div
              key={formatTime(currentTime)}
              initial={{ opacity: 0.5, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            >
              {formatTime(currentTime)}
            </motion.div>
            <p className="text-gray-600 mt-2 font-medium">
              {formatDate(currentTime)}
            </p>
          </div>
          <div className="hidden md:flex flex-col items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 60,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-20 h-20 rounded-full border-4 border-indigo-200 flex items-center justify-center"
            >
              <div
                className="w-1 h-8 bg-indigo-600 rounded-full origin-bottom"
                style={{
                  transform: `rotate(${
                    currentTime.getMinutes() * 6 +
                    currentTime.getSeconds() * 0.1
                  }deg)`,
                }}
              />
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
