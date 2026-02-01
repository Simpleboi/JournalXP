import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Eye, Heart } from "lucide-react";
import { Quote } from "@/models/Meditation";
import { EMOTIONAL_STATES, mindfulnessChallenges } from "@/data/MeditationData";
import { quotes } from "@/data/MeditationData";
import { MeditationBreathing } from "@/features/meditation/MeditationBreathing";
import { MeditationAffirmations } from "@/features/meditation/MeditationAffirmation";
import { Header } from "@/components/Header";
import {
  MoodState,
  VisualizationExercise,
  MindfulnessChallenge,
} from "@/types/Meditation";
import { DailyChallenge } from "@/features/meditation/MeditationDailyChallenge";
import { MoodBasedQuote } from "@/features/meditation/MeditationMoodBased";
import { CurrentMood } from "@/features/meditation/MeditationCurrentMood";
import {
  MeditationVisual,
  VisualDialog,
} from "@/features/meditation/MeditationVisual";
import { EmotionalStatesDialog } from "@/features/meditation/MeditationEmotional";
import { useTheme } from "@/context/ThemeContext";

const MeditationRoom = () => {
  const { theme } = useTheme();
  const [breathingDuration, setBreathingDuration] = useState(3);
  const [currentQuote, setCurrentQuote] = useState<Quote>({
    text: "",
    author: "",
  });
  const [savedQuotes, setSavedQuotes] = useState<Quote[]>([]);
  const [journalEntry, setJournalEntry] = useState("");
  const [selectedMood, setSelectedMood] = useState<MoodState | null>(null);
  const [currentVisualization, setCurrentVisualization] =
    useState<VisualizationExercise | null>(null);
  const [visualizationStep, setVisualizationStep] = useState(0);
  const [dailyChallenge, setDailyChallenge] =
    useState<MindfulnessChallenge | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(60);

  useEffect(() => {
    setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  // Set daily challenge on mount
  useEffect(() => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem("challengeDate");
    const savedChallenge = localStorage.getItem("dailyChallenge");
    const savedCompleted = localStorage.getItem("completedChallenges");
    const savedXP = localStorage.getItem("totalXP");
    const savedStreak = localStorage.getItem("meditationStreak");

    if (savedDate === today && savedChallenge) {
      setDailyChallenge(JSON.parse(savedChallenge));
    } else {
      const randomChallenge =
        mindfulnessChallenges[
          Math.floor(Math.random() * mindfulnessChallenges.length)
        ];
      setDailyChallenge(randomChallenge);
      localStorage.setItem("challengeDate", today);
      localStorage.setItem("dailyChallenge", JSON.stringify(randomChallenge));
    }

    if (savedCompleted) {
      setCompletedChallenges(JSON.parse(savedCompleted));
    }
    if (savedXP) {
      setTotalXP(parseInt(savedXP));
    }
    if (savedStreak) {
      setStreak(parseInt(savedStreak));
    }
  }, []);

  // Timer effect for 60-second challenge
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerActive) {
      setTimerActive(false);
      // Auto-complete challenge when timer finishes
      if (dailyChallenge?.id === "stillness-60") {
        completeChallenge();
      }
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const completeChallenge = () => {
    if (dailyChallenge && !completedChallenges.includes(dailyChallenge.id)) {
      const newCompleted = [...completedChallenges, dailyChallenge.id];
      const newXP = totalXP + dailyChallenge.xp;
      const newStreak = streak + 1;

      setCompletedChallenges(newCompleted);
      setTotalXP(newXP);
      setStreak(newStreak);

      localStorage.setItem("completedChallenges", JSON.stringify(newCompleted));
      localStorage.setItem("totalXP", newXP.toString());
      localStorage.setItem("meditationStreak", newStreak.toString());

      setDailyChallenge({ ...dailyChallenge, completed: true });
    }
  };

  const startVisualization = (viz: VisualizationExercise) => {
    setCurrentVisualization(viz);
    setVisualizationStep(0);
  };

  const nextVisualizationStep = () => {
    if (
      currentVisualization &&
      visualizationStep < currentVisualization.script.length - 1
    ) {
      setVisualizationStep(visualizationStep + 1);
    }
  };

  const closeVisualization = () => {
    setCurrentVisualization(null);
    setVisualizationStep(0);
  };

  const startTimer = () => {
    setTimerSeconds(60);
    setTimerActive(true);
  };

  const stopTimer = () => {
    setTimerActive(false);
    setTimerSeconds(60);
  };

  // Dynamic ambient colors based on theme
  const meditationAmbience = {
    primary: `${theme.colors.primary}40`,
    secondary: `${theme.colors.secondary}38`,
    accent: `${theme.colors.primaryLight}30`,
    warm: `${theme.colors.accent}28`,
  };

  return (
    <div className="min-h-screen relative">
      {/* Animated ambient background - positioned behind everything */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 via-white to-indigo-50/50" />

        {/* Floating ambient orbs - soft and slow, smaller on mobile */}
        <motion.div
          className="absolute top-1/4 -left-16 sm:-left-32 w-48 h-48 sm:w-96 sm:h-96 rounded-full blur-2xl sm:blur-3xl"
          style={{ background: meditationAmbience.primary }}
          animate={{
            x: [0, 20, 0],
            y: [0, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 -right-12 sm:-right-24 w-40 h-40 sm:w-80 sm:h-80 rounded-full blur-2xl sm:blur-3xl"
          style={{ background: meditationAmbience.secondary }}
          animate={{
            x: [0, -15, 0],
            y: [0, 20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-36 h-36 sm:w-72 sm:h-72 rounded-full blur-2xl sm:blur-3xl"
          style={{ background: meditationAmbience.accent }}
          animate={{
            x: [0, 25, 0],
            y: [0, -12, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-32 h-32 sm:w-64 sm:h-64 rounded-full blur-2xl sm:blur-3xl hidden sm:block"
          style={{ background: meditationAmbience.warm }}
          animate={{
            x: [0, -18, 0],
            y: [0, 18, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 8,
          }}
        />
        <motion.div
          className="absolute top-2/3 left-1/2 w-28 h-28 sm:w-56 sm:h-56 rounded-full blur-2xl sm:blur-3xl hidden sm:block"
          style={{ background: meditationAmbience.primary }}
          animate={{
            x: [0, 12, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Header */}
      <Header title="Meditation Room" icon={Sparkles} />

      {/* Main Content */}
      <main className="relative container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <motion.div
              className="p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg"
              style={{
                background: `linear-gradient(to bottom right, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
              }}
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </motion.div>
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(to right, ${theme.colors.primaryDark}, ${theme.colors.primary}, ${theme.colors.secondary})`,
            }}
          >
            Welcome to Your Safe Space
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Take a deep breath. You're exactly where you need to be. This is
            your sanctuary for healing, growth, and peace.
          </p>
        </motion.div>

        {/* Mood Selector Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-12"
        >
          <div className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 bg-white/70 backdrop-blur-md border-2 border-white/50 shadow-lg">
            <h3 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8 text-center text-gray-800">
              How are you feeling right now?
            </h3>
            <CurrentMood
              selectedMood={selectedMood}
              setSelectedMood={setSelectedMood}
            />

            {/* Mood-Based Quote and Prompt */}
            {selectedMood && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 sm:mt-10 max-w-3xl mx-auto"
              >
                <MoodBasedQuote selectedMood={selectedMood} />
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Visualization Exercises */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="text-center mb-6 sm:mb-8">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200/60"
              whileHover={{ scale: 1.02 }}
            >
              <Eye className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-700">
                Guided Journeys
              </span>
            </motion.div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Visualization Exercises
            </h3>
          </div>
          <MeditationVisual startVisualization={startVisualization} />
        </motion.section>

        {/* Visual Dialog */}
        <VisualDialog
          closeVisualization={closeVisualization}
          currentVisualization={currentVisualization}
          visualizationStep={visualizationStep}
          nextVisualizationStep={nextVisualizationStep}
        />

        {/* Emotional States Grid */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-gray-800">
              Need some help with your emotions?
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Select an emotion to explore coping techniques and journal prompts
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {EMOTIONAL_STATES.map((state, index) => (
              <motion.div
                key={state.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="transform transition-all duration-300"
              >
                <EmotionalStatesDialog
                  setJournalEntry={setJournalEntry}
                  journalEntry={journalEntry}
                  state={state}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Breathing Exercise Tool */}
        <MeditationBreathing />

        {/* Daily Affirmation */}
        <MeditationAffirmations />
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 mt-12 py-6 sm:py-8 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <p className="font-medium text-sm text-gray-700">
            JournalXP - Your Digital Sanctuary
          </p>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-lg mx-auto">
            Remember, healing is not linear. Every step forward, no matter how
            small, is progress worth celebrating.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MeditationRoom;
