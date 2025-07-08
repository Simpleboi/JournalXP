// Helper functions for data processing
export const getMoodColor = (mood: string) => {
  const colors: Record<string, string> = {
    very_happy: "bg-green-500",
    happy: "bg-green-400",
    neutral: "bg-yellow-400",
    sad: "bg-orange-400",
    very_sad: "bg-red-500",
    anxious: "bg-purple-400",
    calm: "bg-blue-400",
    excited: "bg-pink-400",
    tired: "bg-gray-400",
  };
  return colors[mood] || "bg-gray-300";
};

export const getCorrelationStrength = (correlation: number) => {
  if (Math.abs(correlation) >= 0.7) return "Strong";
  if (Math.abs(correlation) >= 0.5) return "Moderate";
  if (Math.abs(correlation) >= 0.3) return "Weak";
  return "Very Weak";
};

export const getCorrelationColor = (correlation: number) => {
  if (Math.abs(correlation) >= 0.7) return "text-green-600";
  if (Math.abs(correlation) >= 0.5) return "text-blue-600";
  if (Math.abs(correlation) >= 0.3) return "text-yellow-600";
  return "text-gray-600";
};
