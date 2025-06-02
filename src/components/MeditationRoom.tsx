import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Moon,
  Wind,
  Clock,
  Heart,
  BookOpen,
  Play,
  Pause,
  RotateCcw,
  Save,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface EmotionalState {
  id: string;
  title: string;
  emoji: string;
  description: string;
  color: string;
  techniques: string[];
  journalPrompts: string[];
  meditation: string;
  grounding: string[];
}

interface Quote {
  text: string;
  author: string;
}

const MeditationRoom = () => {
  const [selectedState, setSelectedState] = useState<EmotionalState | null>(
    null,
  );
  const [breathingType, setBreathingType] = useState("calm");
  const [breathingDuration, setBreathingDuration] = useState(3);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingProgress, setBreathingProgress] = useState(0);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [currentQuote, setCurrentQuote] = useState<Quote>({
    text: "",
    author: "",
  });
  const [savedQuotes, setSavedQuotes] = useState<Quote[]>([]);
  const [journalEntry, setJournalEntry] = useState("");

  const emotionalStates: EmotionalState[] = [
    {
      id: "anger",
      title: "Anger",
      emoji: "😡",
      description:
        "Learn how to cool your thoughts and find clarity when angry.",
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
    },
  ];

  const quotes: Quote[] = [
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

  useEffect(() => {
    setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const startBreathing = () => {
    setIsBreathing(true);
    setBreathingProgress(0);

    const totalTime = breathingDuration * 60 * 1000; // convert to milliseconds
    const interval = 100; // update every 100ms
    const increment = (interval / totalTime) * 100;

    const timer = setInterval(() => {
      setBreathingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsBreathing(false);
          return 100;
        }
        return prev + increment;
      });
    }, interval);
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    setBreathingProgress(0);
  };

  const refreshQuote = () => {
    const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(newQuote);
  };

  const saveQuote = () => {
    if (!savedQuotes.find((q) => q.text === currentQuote.text)) {
      setSavedQuotes([...savedQuotes, currentQuote]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-lavender-50 to-teal-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-blue-200/20 rounded-full blur-xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-32 w-24 h-24 bg-purple-200/20 rounded-full blur-xl"
          animate={{
            x: [0, -25, 0],
            y: [0, 15, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute bottom-32 left-1/3 w-40 h-40 bg-teal-200/15 rounded-full blur-xl"
          animate={{
            x: [0, 20, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm relative z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Button>
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: 0 }}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
              />
              <h1 className="text-xl font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                JournalXP
              </h1>
            </Link>
          </div>
          <div>
            <h2 className="text-lg font-medium text-indigo-700">
              Digital Sanctuary
            </h2>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-medium text-gray-800 mb-4">
            Welcome to Your <span className="bg-gradient-to-r from-indigo-600/90 via-purple-600/90 to-pink-600/90 bg-clip-text text-transparent">Safe Space</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Take a deep breath. You're exactly where you need to be. This is
            your sanctuary for healing, growth, and peace.
          </p>
        </motion.div>

        {/* Emotional States Grid */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-medium text-gray-800 mb-6 text-center">
            How are you feeling today?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emotionalStates.map((state, index) => (
              <motion.div
                key={state.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="transform transition-all duration-300"
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <Card
                      className={`cursor-pointer bg-gradient-to-br ${state.color} border-0 shadow-lg hover:shadow-xl transition-all duration-300`}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-3">{state.emoji}</div>
                        <h4 className="text-xl font-medium text-gray-800 mb-2">
                          {state.title}
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {state.description}
                        </p>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-3 text-2xl">
                        <span className="text-3xl">{state.emoji}</span>
                        {state.title} Support
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium text-lg mb-3 text-gray-800">
                            Breathing Techniques
                          </h4>
                          <ul className="space-y-2">
                            {state.techniques.map((technique, idx) => (
                              <li
                                key={idx}
                                className="text-gray-600 text-sm leading-relaxed flex items-start gap-2"
                              >
                                <span className="text-blue-500 mt-1">•</span>
                                {technique}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-lg mb-3 text-gray-800">
                            Grounding Techniques
                          </h4>
                          <ul className="space-y-2">
                            {state.grounding.map((technique, idx) => (
                              <li
                                key={idx}
                                className="text-gray-600 text-sm leading-relaxed flex items-start gap-2"
                              >
                                <span className="text-green-500 mt-1">•</span>
                                {technique}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium text-lg mb-3 text-gray-800">
                            Journal Prompts
                          </h4>
                          <div className="space-y-3">
                            {state.journalPrompts.map((prompt, idx) => (
                              <p
                                key={idx}
                                className="text-gray-600 text-sm italic leading-relaxed p-3 bg-gray-50 rounded-lg"
                              >
                                "{prompt}"
                              </p>
                            ))}
                          </div>
                          <Textarea
                            placeholder="Write your thoughts here..."
                            value={journalEntry}
                            onChange={(e) => setJournalEntry(e.target.value)}
                            className="mt-3 min-h-[100px]"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-lg mb-3 text-gray-800">
                            Guided Meditation
                          </h4>
                          <p className="text-gray-600 text-sm leading-relaxed p-4 bg-blue-50 rounded-lg">
                            {state.meditation}
                          </p>
                          <Button className="mt-3 w-full bg-blue-600 hover:bg-blue-700">
                            <Play className="h-4 w-4 mr-2" />
                            Start Meditation
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Breathing Exercise Tool */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12"
        >
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-indigo-50 to-purple-50 border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-medium text-gray-800">
                Breathing Exercise
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Find your rhythm and center yourself
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <motion.div
                  className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center shadow-lg"
                  animate={
                    isBreathing
                      ? {
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7],
                        }
                      : {}
                  }
                  transition={{
                    duration: 4,
                    repeat: isBreathing ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                >
                  <motion.div
                    className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm"
                    animate={
                      isBreathing
                        ? {
                            scale: [0.8, 1.1, 0.8],
                          }
                        : {}
                    }
                    transition={{
                      duration: 4,
                      repeat: isBreathing ? Infinity : 0,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exercise Type
                  </label>
                  <Select
                    value={breathingType}
                    onValueChange={setBreathingType}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="calm">Calm</SelectItem>
                      <SelectItem value="focus">Focus</SelectItem>
                      <SelectItem value="energize">Energize</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <Select
                    value={breathingDuration.toString()}
                    onValueChange={(value) =>
                      setBreathingDuration(parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 minute</SelectItem>
                      <SelectItem value="3">3 minutes</SelectItem>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sound
                  </label>
                  <Button
                    variant="outline"
                    onClick={() => setIsSoundOn(!isSoundOn)}
                    className="w-full"
                  >
                    {isSoundOn ? (
                      <>
                        <Volume2 className="h-4 w-4 mr-2" /> On
                      </>
                    ) : (
                      <>
                        <VolumeX className="h-4 w-4 mr-2" /> Off
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {breathingProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${breathingProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}

              <div className="flex justify-center gap-4">
                {!isBreathing ? (
                  <Button
                    onClick={startBreathing}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Breathing
                  </Button>
                ) : (
                  <Button
                    onClick={stopBreathing}
                    variant="outline"
                    className="px-8"
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Daily Affirmation */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-teal-50 to-green-50 border-0 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-medium text-gray-800">
                Daily Inspiration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div
                key={currentQuote.text}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center p-6 bg-white/50 rounded-xl"
              >
                <blockquote className="text-lg text-gray-700 italic leading-relaxed mb-4">
                  "{currentQuote.text}"
                </blockquote>
                <cite className="text-gray-600 font-medium">
                  — {currentQuote.author}
                </cite>
              </motion.div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={refreshQuote}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  New Quote
                </Button>
                <Button
                  onClick={saveQuote}
                  className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700"
                >
                  <Save className="h-4 w-4" />
                  Save Quote
                </Button>
              </div>

              {savedQuotes.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-800 mb-3 text-center">
                    Your Saved Quotes ({savedQuotes.length})
                  </h4>
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {savedQuotes.map((quote, index) => (
                      <div
                        key={index}
                        className="text-sm text-gray-600 p-2 bg-white/30 rounded"
                      >
                        "{quote.text}" — {quote.author}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t mt-12 py-6 relative z-10">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p className="font-medium">JournalXP - Your Digital Sanctuary</p>
          <p className="mt-2 leading-relaxed">
            Remember, healing is not linear. Every step forward, no matter how
            small, is progress worth celebrating.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MeditationRoom;
