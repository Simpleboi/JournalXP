import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useTheme } from "@/context/ThemeContext";

export const LiveClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { theme } = useTheme();

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

  // Generate a unique gradient ID based on theme to avoid conflicts
  const gradientId = useMemo(() => `clockGradient-${theme.id}`, [theme.id]);

  // Create lighter version of primary for background
  const primaryWithOpacity = `${theme.colors.primary}15`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -2 }}
      className="bg-white/70 backdrop-blur-md border-2 border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="p-2 rounded-xl shadow-md"
                style={{
                  background: `linear-gradient(to bottom right, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
                }}
              >
                <Clock className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-600">Current Time</span>
            </div>
            <motion.div
              key={formatTime(currentTime)}
              initial={{ opacity: 0.5, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary}, ${theme.colors.accent})`,
              }}
            >
              {formatTime(currentTime)}
            </motion.div>
            <p
              className="mt-2 font-medium"
              style={{ color: theme.colors.primary }}
            >
              {formatDate(currentTime)}
            </p>
          </div>
          <div className="hidden md:flex flex-col items-center justify-center">
            <div
              className="p-3 rounded-2xl border"
              style={{
                background: `linear-gradient(to bottom right, ${primaryWithOpacity}, ${theme.colors.secondary}15)`,
                borderColor: `${theme.colors.primary}30`,
              }}
            >
              <svg className="w-28 h-28" viewBox="0 0 200 200">
                {/* Clock face */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="white"
                  stroke={`url(#${gradientId})`}
                  strokeWidth="4"
                />
                <defs>
                  <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={theme.colors.primary} />
                    <stop offset="100%" stopColor={theme.colors.secondary} />
                  </linearGradient>
                </defs>

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
                      stroke={theme.colors.primary}
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
                  stroke={theme.colors.primaryDark}
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
                  stroke={theme.colors.secondary}
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
                  stroke={theme.colors.accent}
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
                <circle cx="100" cy="100" r="6" fill={`url(#${gradientId})`} />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
