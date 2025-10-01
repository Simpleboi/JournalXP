import { EmotionalState } from "@/models/Meditation";
import { Quote } from "@/models/Meditation";

export const emotionalStates: EmotionalState[] = [
  {
    id: "anger",
    title: "Anger",
    emoji: "😡",
    description: "Learn how to cool your thoughts and find clarity when angry.",
    color: "from-red-100 to-orange-100",
    techniques: [
      "4-7-8 Breathing: Inhale for 4, hold for 7, exhale for 8",
      "Progressive muscle relaxation starting from your jaw",
      "Cold water on wrists or splash on face",
      "Count backwards from 100 by 7s",
    ],
    journalPrompts: [
      "What triggered this anger? What was the underlying need?",
      "How can I express this feeling constructively?",
      "What would I tell a friend feeling this way?",
    ],
    meditation:
      "A 5-minute guided meditation focusing on releasing tension and finding inner calm through breath awareness.",
    grounding: [
      "Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste",
      "Press your feet firmly into the ground and feel the connection",
      "Hold an ice cube or cold object to bring awareness to the present",
    ],
    externalResources: [
      {
        title: "Scientific Benefits of Breathing Exercises",
        link: "https://example.com/science-of-breathing",
      },
      {
        title: "Scientific Benefits of Breathing Exercises",
        link: "https://example.com/science-of-breathing",
      },
    ],
  },
  {
    id: "sadness",
    title: "Sadness",
    emoji: "😔",
    description: "Gentle support to honor your feelings and find comfort.",
    color: "from-blue-100 to-indigo-100",
    techniques: [
      "Gentle belly breathing with hand on chest",
      "Self-compassion meditation",
      "Warm tea or comfort ritual",
      "Gentle movement or stretching",
    ],
    journalPrompts: [
      "What am I grieving or missing right now?",
      "How can I show myself kindness today?",
      "What small thing would bring me comfort?",
    ],
    meditation:
      "A nurturing 7-minute meditation focused on self-compassion and emotional healing.",
    grounding: [
      "Wrap yourself in a soft blanket and feel the warmth",
      "Listen to calming music or nature sounds",
      "Practice gentle self-touch like placing hand on heart",
    ],
    externalResources: [
      {
        title: "Scientific Benefits of Breathing Exercises",
        link: "https://example.com/science-of-breathing",
      },
    ],
  },
  {
    id: "anxiety",
    title: "Anxiety",
    emoji: "😰",
    description: "Tools to calm your nervous system and find peace.",
    color: "from-yellow-100 to-amber-100",
    techniques: [
      "Box breathing: 4 counts in, hold 4, out 4, hold 4",
      "Butterfly taps on shoulders alternating",
      "Grounding through your senses",
      "Gentle neck and shoulder rolls",
    ],
    journalPrompts: [
      "What specific worry is taking up space in my mind?",
      "What evidence do I have that contradicts this worry?",
      "What would I do if I felt completely safe right now?",
    ],
    meditation:
      "A 6-minute anxiety-relief meditation with focus on safety and present-moment awareness.",
    grounding: [
      "Feel your back against the chair and your feet on the floor",
      "Name your current location out loud in detail",
      "Focus on slow, deep exhales longer than inhales",
    ],
    externalResources: [
      {
        title: "Scientific Benefits of Breathing Exercises",
        link: "https://example.com/science-of-breathing",
      },
    ],
  },
  {
    id: "overwhelm",
    title: "Overwhelm",
    emoji: "😩",
    description: "Step back, breathe, and find clarity in the chaos.",
    color: "from-purple-100 to-pink-100",
    techniques: [
      "Three-part breath: belly, ribs, chest",
      "Brain dump: write everything down",
      "Priority sorting: urgent vs important",
      "5-minute timer for one small task",
    ],
    journalPrompts: [
      "What are the top 3 things that actually need my attention today?",
      "What can I delegate, delay, or delete from my list?",
      "How can I break this big thing into smaller steps?",
    ],
    meditation:
      "A 4-minute meditation for mental clarity and prioritizing what truly matters.",
    grounding: [
      "Write down everything in your mind, then close the paper",
      "Set a timer for 2 minutes and just breathe",
      "Choose one tiny action and do it mindfully",
    ],
    externalResources: [
      {
        title: "Scientific Benefits of Breathing Exercises",
        link: "https://example.com/science-of-breathing",
      },
    ],
  },
  {
    id: "calm-boost",
    title: "Calm Boost",
    emoji: "😊",
    description: "Maintain and deepen your sense of peace and well-being.",
    color: "from-green-100 to-teal-100",
    techniques: [
      "Gratitude breathing: inhale appreciation, exhale love",
      "Body scan for areas of comfort and ease",
      "Loving-kindness meditation",
      "Gentle smile meditation",
    ],
    journalPrompts: [
      "What am I most grateful for in this moment?",
      "How can I share this peaceful feeling with others?",
      "What practices help me maintain inner calm?",
    ],
    meditation:
      "An 8-minute meditation to cultivate lasting peace and positive energy.",
    grounding: [
      "Notice areas in your body that feel relaxed and comfortable",
      "Send appreciation to yourself for taking this time",
      "Set an intention to carry this calm with you",
    ],
    externalResources: [
      {
        title: "Scientific Benefits of Breathing Exercises",
        link: "https://example.com/science-of-breathing",
      },
    ],
  },
  {
    id: "focus",
    title: "Focus",
    emoji: "🎯",
    description: "Clear mental fog and sharpen your concentration.",
    color: "from-cyan-100 to-blue-100",
    techniques: [
      "Alternate nostril breathing for mental balance",
      "Single-pointed focus meditation",
      "Energizing breath work",
      "Mindful intention setting",
    ],
    journalPrompts: [
      "What is my main intention for today?",
      "What distractions can I minimize right now?",
      "How do I want to feel when I complete my tasks?",
    ],
    meditation:
      "A 5-minute concentration meditation to enhance mental clarity and focus.",
    grounding: [
      "Sit up straight and feel your spine aligned",
      "Focus on a single point or object for 30 seconds",
      "Take three energizing breaths to activate alertness",
    ],
    externalResources: [
      {
        title: "Scientific Benefits of Breathing Exercises",
        link: "https://example.com/science-of-breathing",
      },
    ],
  },
];

// Quote Section

export const quotes: Quote[] = [
  {
    text: "Peace comes from within. Do not seek it without.",
    author: "Buddha",
  },
  {
    text: "The present moment is the only time over which we have dominion.",
    author: "Thích Nhất Hạnh",
  },
  { text: "Breathe in peace, breathe out stress.", author: "Unknown" },
  {
    text: "You are the sky, everything else is just the weather.",
    author: "Pema Chödrön",
  },
  {
    text: "In the midst of movement and chaos, keep stillness inside of you.",
    author: "Deepak Chopra",
  },
  {
    text: "The quieter you become, the more you are able to hear.",
    author: "Rumi",
  },
  {
    text: "Your calm mind is the ultimate weapon against your challenges.",
    author: "Bryant McGill",
  },
  {
    text: "Meditation is not about stopping thoughts, but recognizing that we are more than our thoughts.",
    author: "Arianna Huffington",
  },
  {
    text: "The best way to take care of the future is to take care of the present moment.",
    author: "Thích Nhất Hạnh",
  },
  {
    text: "Inner peace begins the moment you choose not to allow another person or event to control your emotions.",
    author: "Pema Chödrön",
  },
];
