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
import { EmotionalState } from "@/models/Meditation";
import { Quote } from "@/models/Meditation";
import { emotionalStates } from "@/data/MeditationData";
import { quotes } from "@/data/MeditationData";
import { MeditationHeader } from "@/features/meditation/meditationHeader";
import { MeditationBreathing } from "@/features/meditation/MeditationBreathing";

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
      <MeditationHeader />

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
        <MeditationBreathing />

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
