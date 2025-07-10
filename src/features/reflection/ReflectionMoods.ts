// Mood options to choose from

export const moodOptions = [
  { value: "happy", label: "😊 Happy" },
  { value: "neutral", label: "😐 Neutral" },
  { value: "sad", label: "😔 Sad" },
  { value: "anxious", label: "😰 Anxious" },
  { value: "calm", label: "😌 Calm" },
  { value: "angry", label: "😡 Angry" },
  { value: "overwhelmed", label: "😵‍💫 Overwhelmed" },
  { value: "motivated", label: "🚀 Motivated" },
  { value: "grateful", label: "🙏 Grateful" },
  { value: "excited", label: "🤩 Excited" },
  { value: "lonely", label: "🥺 Lonely" },
  { value: "relaxed", label: "🧘 Relaxed" },
  { value: "hopeful", label: "🌟 Hopeful" },
  { value: "tired", label: "😴 Tired" },
  { value: "confident", label: "😎 Confident" },
];

// To filter the color
export const getSentimentColor = (sentiment?: { label: string } | string) => {
  const label =
    typeof sentiment === "string"
      ? sentiment.toLowerCase()
      : sentiment?.label.toLowerCase();

  switch (label) {
    case "happy":
    case "excited":
    case "motivated":
    case "confident":
      return "bg-yellow-100 text-yellow-800";

    case "sad":
    case "lonely":
    case "tired":
      return "bg-blue-100 text-blue-700";

    case "anxious":
    case "overwhelmed":
      return "bg-orange-100 text-orange-700";

    case "angry":
      return "bg-red-200 text-red-800";

    case "calm":
    case "relaxed":
      return "bg-teal-100 text-teal-700";

    case "grateful":
    case "hopeful":
      return "bg-purple-100 text-purple-700";

    case "positive":
      return "bg-green-100 text-green-700";

    case "negative":
      return "bg-red-100 text-red-700";

    case "neutral":
      return "bg-gray-100 text-gray-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

// to get the mood
export const getMoodIcon = (mood: string) => {
  const found = moodOptions.find((option) => option.value === mood);
  return found ? found.label.split(" ")[0] : "😐";
};

// to formate the date
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
