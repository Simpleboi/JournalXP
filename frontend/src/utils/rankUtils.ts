export const getRank = (level: number): string => {
  return ranks[Math.floor(level / 5)] || "Transcendent Legend";
};

export const ranks = [
  "Newcomer",
  "Mindful Beginner",
  "Reflective Explorer",
  "Balance Seeker",
  "Tranquility Guide",
  "Wellness Mentor",
  "Harmony Sage",
  "Zen Master",
  "Enlightened One",
];
