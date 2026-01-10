import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Clock } from "lucide-react";
import { useState, useEffect } from "react";

export const LiveClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
    <Card className="bg-white shadow-lg overflow-hidden border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--theme-primary)' }}>
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium">Current Time</span>
            </div>
            <motion.div
              key={formatTime(currentTime)}
              initial={{ opacity: 0.5, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-4xl md:text-5xl font-bold"
              style={{
                background: 'var(--theme-gradient)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent'
              }}
            >
              {formatTime(currentTime)}
            </motion.div>
            <p className="mt-2 font-medium" style={{ color: 'var(--theme-primary)' }}>
              {formatDate(currentTime)}
            </p>
          </div>
          <div className="hidden md:flex flex-col items-center justify-center">
            <svg className="w-32 h-32" viewBox="0 0 200 200">
              {/* Clock face */}
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="white"
                stroke="var(--theme-primary)"
                strokeWidth="4"
              />

              {/* Hour markers */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 - 90) * (Math.PI / 180);
                const x1 = 100 + 75 * Math.cos(angle);
                const y1 = 100 + 75 * Math.sin(angle);
                const x2 = 100 + 85 * Math.cos(angle);
                const y2 = 100 + 85 * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="var(--theme-primary)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                );
              })}

              {/* Hour hand */}
              <motion.line
                x1="100"
                y1="100"
                x2={
                  100 +
                  45 *
                    Math.sin(
                      ((currentTime.getHours() % 12) +
                        currentTime.getMinutes() / 60) *
                        30 *
                        (Math.PI / 180)
                    )
                }
                y2={
                  100 -
                  45 *
                    Math.cos(
                      ((currentTime.getHours() % 12) +
                        currentTime.getMinutes() / 60) *
                        30 *
                        (Math.PI / 180)
                    )
                }
                stroke="var(--theme-primary)"
                strokeWidth="6"
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />

              {/* Minute hand */}
              <motion.line
                x1="100"
                y1="100"
                x2={
                  100 +
                  60 *
                    Math.sin(
                      (currentTime.getMinutes() +
                        currentTime.getSeconds() / 60) *
                        6 *
                        (Math.PI / 180)
                    )
                }
                y2={
                  100 -
                  60 *
                    Math.cos(
                      (currentTime.getMinutes() +
                        currentTime.getSeconds() / 60) *
                        6 *
                        (Math.PI / 180)
                    )
                }
                stroke="var(--theme-secondary)"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />

              {/* Second hand */}
              <motion.line
                x1="100"
                y1="100"
                x2={
                  100 +
                  70 * Math.sin(currentTime.getSeconds() * 6 * (Math.PI / 180))
                }
                y2={
                  100 -
                  70 * Math.cos(currentTime.getSeconds() * 6 * (Math.PI / 180))
                }
                stroke="var(--theme-accent)"
                strokeWidth="2"
                strokeLinecap="round"
                animate={{
                  x2:
                    100 +
                    70 *
                      Math.sin(currentTime.getSeconds() * 6 * (Math.PI / 180)),
                  y2:
                    100 -
                    70 *
                      Math.cos(currentTime.getSeconds() * 6 * (Math.PI / 180)),
                }}
                transition={{ duration: 0.1 }}
              />

              {/* Center dot */}
              <circle cx="100" cy="100" r="5" fill="var(--theme-primary)" />
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
