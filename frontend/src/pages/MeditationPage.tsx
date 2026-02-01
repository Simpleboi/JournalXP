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

  return (
    <div
      className="min-h-screen relative overflow-hidden transition-all duration-1000"
      style={{ background: theme.colors.background }}
    >
      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary orb */}
        <motion.div
          className="absolute top-10 left-[10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-30"
          style={{ background: theme.colors.primary }}
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Secondary orb */}
        <motion.div
          className="absolute top-[30%] right-[5%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-25"
          style={{ background: theme.colors.secondary }}
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
        {/* Accent orb */}
        <motion.div
          className="absolute bottom-[10%] left-[30%] w-[350px] h-[350px] rounded-full blur-[90px] opacity-20"
          style={{ background: theme.colors.accent }}
          animate={{
            x: [0, 60, 0],
            y: [0, -80, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6,
          }}
        />
        {/* Extra ambient orb */}
        <motion.div
          className="absolute top-[60%] right-[30%] w-[250px] h-[250px] rounded-full blur-[80px] opacity-15"
          style={{ background: theme.colors.primaryLight }}
          animate={{
            x: [0, -40, 0],
            y: [0, 60, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 9,
          }}
        />
      </div>

      {/* Subtle grid overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${theme.colors.text} 1px, transparent 1px), linear-gradient(90deg, ${theme.colors.text} 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Header */}
      <Header title="Meditation Room" icon={Sparkles} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: `${theme.colors.primary}20`,
              border: `1px solid ${theme.colors.primary}40`,
            }}
          >
            <Heart className="w-4 h-4" style={{ color: theme.colors.primary }} />
            <span className="text-sm font-medium" style={{ color: theme.colors.text }}>
              Your sanctuary for peace
            </span>
          </motion.div>

          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: theme.colors.text }}
          >
            Welcome to Your{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: theme.colors.gradient }}
            >
              Safe Space
            </span>
          </h2>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: theme.colors.textSecondary }}
          >
            Take a deep breath. You're exactly where you need to be. This is
            your sanctuary for healing, growth, and peace.
          </p>
        </motion.div>

        {/* Mood Selector Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-16"
        >
          <div
            className="rounded-3xl p-8 md:p-10 backdrop-blur-xl border"
            style={{
              background: `${theme.colors.surface}80`,
              borderColor: `${theme.colors.border}50`,
              boxShadow: `0 8px 32px ${theme.colors.primary}10`,
            }}
          >
            <h3
              className="text-2xl font-semibold mb-8 text-center"
              style={{ color: theme.colors.text }}
            >
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
                className="mt-10 max-w-3xl mx-auto"
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
          className="mb-16"
        >
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
              style={{
                background: `${theme.colors.secondary}20`,
                border: `1px solid ${theme.colors.secondary}40`,
              }}
            >
              <Eye className="h-4 w-4" style={{ color: theme.colors.secondary }} />
              <span className="text-sm font-medium" style={{ color: theme.colors.text }}>
                Guided Journeys
              </span>
            </div>
            <h3
              className="text-2xl font-semibold"
              style={{ color: theme.colors.text }}
            >
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
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h3
              className="text-2xl font-semibold mb-2"
              style={{ color: theme.colors.text }}
            >
              Need some help with your emotions?
            </h3>
            <p style={{ color: theme.colors.textSecondary }}>
              Select an emotion to explore coping techniques and journal prompts
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <footer
        className="backdrop-blur-xl border-t mt-12 py-8 relative z-10"
        style={{
          background: `${theme.colors.surface}60`,
          borderColor: `${theme.colors.border}30`,
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <p
            className="font-medium text-sm"
            style={{ color: theme.colors.text }}
          >
            JournalXP - Your Digital Sanctuary
          </p>
          <p
            className="mt-2 text-sm leading-relaxed max-w-lg mx-auto"
            style={{ color: theme.colors.textSecondary }}
          >
            Remember, healing is not linear. Every step forward, no matter how
            small, is progress worth celebrating.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MeditationRoom;
