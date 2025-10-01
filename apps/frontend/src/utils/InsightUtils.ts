// Helper functions for data processing

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

export const getMoodColorInsight = (sentiment?: { label: string } | string) => {
  const label =
    typeof sentiment === "string"
      ? sentiment.toLowerCase()
      : sentiment?.label.toLowerCase();

  switch (label) {
    case "happy":
    case "excited":
    case "motivated":
    case "confident":
      return "bg-yellow-500 text-yellow-800";

    case "sad":
    case "lonely":
    case "tired":
      return "bg-blue-500 text-blue-700";

    case "anxious":
    case "overwhelmed":
      return "bg-orange-500 text-orange-700";

    case "angry":
      return "bg-red-200 text-red-800";

    case "calm":
    case "relaxed":
      return "bg-teal-500 text-teal-700";

    case "grateful":
    case "hopeful":
      return "bg-purple-500 text-purple-700";

    case "positive":
      return "bg-green-500 text-green-700";

    case "negative":
      return "bg-red-500 text-red-700";

    case "neutral":
      return "bg-gray-500 text-gray-700";

    default:
      return "bg-gray-500 text-gray-700";
  }
};