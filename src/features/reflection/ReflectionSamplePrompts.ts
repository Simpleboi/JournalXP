import { JournalEntry } from "../journal/Journal";

// Sample journal entries for demonstration
export const sampleEntries: JournalEntry[] = [
    {
      id: "sample-1",
      type: "free-writing",
      content:
        "Today was a productive day. I managed to complete all my tasks and even had time for a short walk in the park. The fresh air really helped clear my mind.",
      mood: "happy",
      date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      tags: ["productive", "outdoors"],
      isFavorite: true,
      sentiment: { label: "Positive", score: 0.8 },
    },
    {
      id: "sample-2",
      type: "guided",
      content:
        "I faced a challenge with my project today. The deadline is approaching, and I'm feeling the pressure. I'm trying to break it down into smaller tasks to make it more manageable.",
      mood: "anxious",
      date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      tags: ["work", "stress"],
      isFavorite: false,
      sentiment: { label: "Negative", score: 0.6 },
    },
    {
      id: "sample-3",
      type: "gratitude",
      content:
        "I'm grateful for my supportive friends who checked in on me today. Their kind messages made me feel valued and loved.",
      mood: "calm",
      date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      tags: ["friends", "gratitude"],
      isFavorite: true,
      sentiment: { label: "Positive", score: 0.9 },
    },
    {
      id: "sample-4",
      type: "free-writing",
      content:
        "I'm feeling a bit unmotivated today. The weather is gloomy, and it's affecting my mood. I should try to do something creative to lift my spirits.",
      mood: "sad",
      date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      tags: ["mood", "weather"],
      isFavorite: false,
      sentiment: { label: "Negative", score: 0.7 },
    },
    {
      id: "sample-5",
      type: "guided",
      content:
        "I'm looking forward to the weekend. I've planned a hike with friends, and I think it will be a great opportunity to disconnect and recharge.",
      mood: "happy",
      date: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
      tags: ["weekend", "plans"],
      isFavorite: false,
      sentiment: { label: "Positive", score: 0.75 },
    },
  ];