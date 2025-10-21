import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Quote } from "@/models/Meditation";
import { emotionalStates, mindfulnessChallenges } from "@/data/MeditationData";
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

const MeditationRoom = () => {
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

                    {/* External Resources Section */}
                    {state.externalResources &&
                      state.externalResources.length > 0 && (
                        <div className="mt-8">
                          <h4 className="font-medium text-lg mb-3 text-gray-800">
                            Helpful Resources
                          </h4>
                          <ul className="space-y-2">
                            {state.externalResources.map((resource, idx) => (
                              <li
                                key={idx}
                                className="flex items-center gap-2 text-sm"
                              >
                                <span className="text-blue-600 hover:underline">
                                  <a
                                    href={resource.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {resource.title}
                                  </a>
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </DialogContent>
                </Dialog>
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
