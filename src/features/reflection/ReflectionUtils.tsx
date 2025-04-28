export const getSentimentColor = (sentiment?: {
  label: string;
  score: number;
}) => {
  if (!sentiment) return "bg-gray-100 text-gray-700";
  switch (sentiment.label.toLowerCase()) {
    case "positive":
      return "bg-green-100 text-green-700";
    case "negative":
      return "bg-red-100 text-red-700";
    case "neutral":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const getMoodIcon = (mood: string) => {
  switch (mood) {
    case "happy":
      return "😊";
    case "sad":
      return "😔";
    case "anxious":
      return "😰";
    case "calm":
      return "😌";
    default:
      return "😐";
  }
};
