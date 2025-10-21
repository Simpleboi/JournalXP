import { EmotionalState } from "@/models/Meditation";
import { Quote } from "@/models/Meditation";
import {
  MindfulnessChallenge,
  MoodState,
  VisualizationExercise,
} from "@/types/Meditation";
import { Feather, Home, Package, Mountain } from "lucide-react";

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

// Mood States with Adaptive Experiences
export const MOOD_STATES: MoodState[] = [
  {
    id: "anxious",
    name: "Anxious",
    emoji: "😰",
    gradient: "from-amber-100 via-yellow-50 to-orange-50",
    quote: "This too shall pass. You are safe in this moment.",
    breathingPattern: { inhale: 4, hold: 4, exhale: 6, holdAfter: 2 },
    journalPrompt:
      "What specific worry is taking up space in my mind right now? What evidence do I have that contradicts this worry?",
    ambientColor: "rgba(252, 211, 77, 0.15)",
  },
  {
    id: "angry",
    name: "Angry",
    emoji: "😡",
    gradient: "from-rose-100 via-pink-50 to-red-50",
    quote: "Anger is a messenger. What is it trying to tell you?",
    breathingPattern: { inhale: 4, hold: 7, exhale: 8, holdAfter: 0 },
    journalPrompt:
      "What triggered this anger? What underlying need is not being met?",
    ambientColor: "rgba(251, 113, 133, 0.15)",
  },
  {
    id: "tired",
    name: "Tired",
    emoji: "😴",
    gradient: "from-slate-100 via-blue-50 to-indigo-50",
    quote:
      "Rest is not a luxury, it's a necessity. Honor your need for restoration.",
    breathingPattern: { inhale: 3, hold: 2, exhale: 5, holdAfter: 2 },
    journalPrompt:
      "What is draining my energy? What would true rest look like for me?",
    ambientColor: "rgba(148, 163, 184, 0.15)",
  },
  {
    id: "unmotivated",
    name: "Unmotivated",
    emoji: "😐",
    gradient: "from-gray-100 via-neutral-50 to-stone-50",
    quote:
      "Small steps forward are still progress. You don't have to feel motivated to begin.",
    breathingPattern: { inhale: 4, hold: 4, exhale: 4, holdAfter: 4 },
    journalPrompt:
      "What is one tiny action I can take right now? What would make today feel meaningful?",
    ambientColor: "rgba(156, 163, 175, 0.15)",
  },
  {
    id: "peaceful",
    name: "Peaceful",
    emoji: "😌",
    gradient: "from-emerald-100 via-green-50 to-teal-50",
    quote: "In this moment, you are exactly where you need to be.",
    breathingPattern: { inhale: 4, hold: 4, exhale: 4, holdAfter: 4 },
    journalPrompt:
      "What am I grateful for in this peaceful moment? How can I carry this feeling forward?",
    ambientColor: "rgba(110, 231, 183, 0.15)",
  },
  {
    id: "overwhelmed",
    name: "Overwhelmed",
    emoji: "😩",
    gradient: "from-violet-100 via-purple-50 to-lavender-50",
    quote:
      "You don't have to do everything at once. One breath, one moment, one step.",
    breathingPattern: { inhale: 3, hold: 3, exhale: 6, holdAfter: 3 },
    journalPrompt:
      "What are the top 3 things that actually need my attention? What can wait?",
    ambientColor: "rgba(196, 181, 253, 0.15)",
  },
];

// Visualization Exercises
export const VISUALIZATIONS: VisualizationExercise[] = [
  {
    id: "garden",
    title: "The Garden",
    description: "Walk through a peaceful garden and plant seeds of intention",
    duration: "5 minutes",
    icon: Feather,
    color: "from-green-400 to-emerald-500",
    script: [
      "Close your eyes and take three deep breaths...",
      "Imagine yourself standing at the entrance of a beautiful garden...",
      "The sun is warm on your skin, and a gentle breeze carries the scent of flowers...",
      "You walk along a stone path, noticing the vibrant colors around you...",
      "You come to a patch of rich, dark soil...",
      "In your hand, you hold seeds representing your intentions and dreams...",
      "One by one, you plant each seed with care and love...",
      "You water them gently, knowing they will grow in their own time...",
      "You feel a deep sense of peace and possibility...",
      "When you're ready, slowly return to the present moment...",
    ],
  },
  {
    id: "safe-place",
    title: "The Safe Place",
    description: "Create and visit your personal sanctuary of peace",
    duration: "7 minutes",
    icon: Home,
    color: "from-blue-400 to-cyan-500",
    script: [
      "Take a deep breath and allow your body to relax...",
      "Imagine a place where you feel completely safe and at peace...",
      "This could be real or imaginary - a beach, a forest, a cozy room...",
      "Notice every detail: the colors, the sounds, the temperature...",
      "Feel the ground beneath you, solid and supportive...",
      "This is your sanctuary, and nothing can harm you here...",
      "Breathe in the peace of this place...",
      "Know that you can return here whenever you need...",
      "Slowly, gently, bring your awareness back to the present...",
    ],
  },
  {
    id: "release-weight",
    title: "Release the Weight",
    description: "Let go of burdens and feel lighter with each breath",
    duration: "6 minutes",
    icon: Package,
    color: "from-purple-400 to-pink-500",
    script: [
      "Sit comfortably and notice any tension in your body...",
      "Imagine you're carrying a heavy backpack filled with worries...",
      "With each exhale, you remove one item from the pack...",
      "Feel it getting lighter... your shoulders relaxing...",
      "Release worry about the past... it's already gone...",
      "Release anxiety about the future... it hasn't arrived yet...",
      "Release the need to control everything...",
      "Feel how light you are now, free and unburdened...",
      "Take a moment to enjoy this lightness...",
      "When you're ready, open your eyes...",
    ],
  },
  {
    id: "mountain",
    title: "Mountain Meditation",
    description: "Embody the strength and stability of a mountain",
    duration: "8 minutes",
    icon: Mountain,
    color: "from-gray-400 to-slate-500",
    script: [
      "Sit tall and strong, like a mountain...",
      "Feel your connection to the earth beneath you...",
      "Imagine yourself as a majestic mountain...",
      "Weather passes over you - storms, sunshine, snow...",
      "But you remain steady, unchanging at your core...",
      "Thoughts and emotions are like clouds passing by...",
      "They come and go, but you remain...",
      "Strong, stable, grounded...",
      "Breathe into this sense of inner strength...",
      "Slowly return to the room, carrying this stability with you...",
    ],
  },
];

// Daily Mindfulness Challenges
export const mindfulnessChallenges: MindfulnessChallenge[] = [
  {
    id: "stillness-60",
    title: "60 Seconds of Stillness",
    description: "Sit completely still for one minute, observing your breath",
    xp: 10,
    completed: false,
  },
  {
    id: "three-things",
    title: "Name 3 Things",
    description:
      "Notice and name 3 things you can see, hear, and feel right now",
    xp: 15,
    completed: false,
  },
  {
    id: "conscious-breath",
    title: "One Conscious Breath",
    description:
      "Take one completely conscious breath, noticing every sensation",
    xp: 5,
    completed: false,
  },
  {
    id: "gratitude-moment",
    title: "Gratitude Pause",
    description:
      "Pause and identify 3 things you're grateful for in this moment",
    xp: 15,
    completed: false,
  },
  {
    id: "body-scan",
    title: "Quick Body Scan",
    description: "Scan your body from head to toe, releasing tension",
    xp: 20,
    completed: false,
  },
  {
    id: "mindful-sip",
    title: "Mindful Sip",
    description: "Drink water or tea with complete awareness of each sensation",
    xp: 10,
    completed: false,
  },
  {
    id: "loving-kindness",
    title: "Send Kindness",
    description: "Send a kind thought to yourself and someone else",
    xp: 15,
    completed: false,
  },
];
