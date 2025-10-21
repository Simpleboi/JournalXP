import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Eye } from "lucide-react";
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

const MeditationRoom = () => {
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

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-all duration-1000 ${
        selectedMood
          ? `bg-gradient-to-br ${selectedMood.gradient}`
          : "bg-gradient-to-br from-blue-50 via-lavender-50 to-teal-50"
      }`}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-blue-200/20 rounded-full blur-xl"
          style={{
            backgroundColor:
              selectedMood?.ambientColor || "rgba(191, 219, 254, 0.2)",
          }}
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
          style={{
            backgroundColor:
              selectedMood?.ambientColor || "rgba(191, 219, 254, 0.2)",
          }}
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
          style={{
            backgroundColor:
              selectedMood?.ambientColor || "rgba(191, 219, 254, 0.2)",
          }}
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
      <Header title="Meditation Room" icon={Sparkles} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-medium text-gray-800 mb-4">
            Welcome to Your{" "}
            <span className="bg-gradient-to-r from-indigo-600/90 via-purple-600/90 to-pink-600/90 bg-clip-text text-transparent">
              Safe Space
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Take a deep breath. You're exactly where you need to be. This is
            your sanctuary for healing, growth, and peace.
          </p>
        </motion.div>

        {/* Daily Challenge Component */}
        {dailyChallenge && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <DailyChallenge
              completedChallenges={completedChallenges}
              completeChallenge={completeChallenge}
              dailyChallenge={dailyChallenge}
              timerSeconds={timerSeconds}
              timerActive={timerActive}
              startTimer={startTimer}
              stopTimer={stopTimer}
            />
          </motion.section>
        )}

        {/* Mood Selector */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-medium text-gray-800 mb-6 text-center">
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
              className="mt-8 max-w-3xl mx-auto"
            >
              <MoodBasedQuote selectedMood={selectedMood} />
            </motion.div>
          )}
        </motion.section>

        {/* Visualization Exercises */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-medium text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
            <Eye className="h-6 w-6 text-indigo-600" />
            Guided Visualization Journeys
          </h3>
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
          <h3 className="text-2xl font-medium text-gray-800 mb-6 text-center">
            How are you feeling today?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EMOTIONAL_STATES.map((state, index) => (
              <motion.div
                key={state.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
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
