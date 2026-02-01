import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Play, Pause, Wind } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

// Breathing patterns (in seconds): [inhale, hold, exhale, hold]
const BREATHING_PATTERNS = {
  calm: { pattern: [4, 7, 8, 0], name: "4-7-8 Relaxing Breath", color: "from-blue-400 to-cyan-500" },
  focus: { pattern: [4, 4, 4, 4], name: "Box Breathing", color: "from-purple-400 to-indigo-500" },
  energize: { pattern: [2, 0, 2, 0], name: "Energizing Breath", color: "from-orange-400 to-red-500" },
};

type BreathPhase = "inhale" | "hold1" | "exhale" | "hold2";

export const MeditationBreathing = () => {
  const [breathingType, setBreathingType] = useState<keyof typeof BREATHING_PATTERNS>("calm");
  const [breathingDuration, setBreathingDuration] = useState(3);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingProgress, setBreathingProgress] = useState(0);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [currentPhase, setCurrentPhase] = useState<BreathPhase>("inhale");
  const [phaseProgress, setPhaseProgress] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const phaseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play a simple tone for phase transitions
  const playTone = (frequency: number, duration: number) => {
    if (!isSoundOn) return;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration / 1000);
    } catch (error) {
      console.log("Audio not supported");
    }
  };

  // Cycle through breathing phases
  useEffect(() => {
    if (!isBreathing) return;

    const pattern = BREATHING_PATTERNS[breathingType].pattern;
    const phases: BreathPhase[] = ["inhale", "hold1", "exhale", "hold2"];
    let currentPhaseIndex = 0;

    const runPhase = () => {
      const phase = phases[currentPhaseIndex];
      const phaseDuration = pattern[currentPhaseIndex];

      if (phaseDuration === 0) {
        // Skip this phase
        currentPhaseIndex = (currentPhaseIndex + 1) % 4;
        runPhase();
        return;
      }

      setCurrentPhase(phase);
      setPhaseProgress(0);

      // Play tone at start of inhale and exhale
      if (phase === "inhale") {
        playTone(440, 200); // A4 note
      } else if (phase === "exhale") {
        playTone(330, 200); // E4 note
      }

      let elapsed = 0;
      const interval = 50; // Update every 50ms for smooth animation

      if (phaseTimerRef.current) {
        clearInterval(phaseTimerRef.current);
      }

      phaseTimerRef.current = setInterval(() => {
        elapsed += interval;
        const progress = Math.min((elapsed / (phaseDuration * 1000)) * 100, 100);
        setPhaseProgress(progress);

        if (elapsed >= phaseDuration * 1000) {
          clearInterval(phaseTimerRef.current!);
          currentPhaseIndex = (currentPhaseIndex + 1) % 4;
          runPhase();
        }
      }, interval);
    };

    runPhase();

    return () => {
      if (phaseTimerRef.current) {
        clearInterval(phaseTimerRef.current);
      }
    };
  }, [isBreathing, breathingType, isSoundOn]);

  // Overall progress timer
  useEffect(() => {
    if (!isBreathing) return;

    const totalTime = breathingDuration * 60 * 1000; // convert to milliseconds
    const interval = 100; // update every 100ms
    const increment = (interval / totalTime) * 100;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setBreathingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timerRef.current!);
          setIsBreathing(false);
          return 100;
        }
        return prev + increment;
      });
    }, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isBreathing, breathingDuration]);

  const startBreathing = () => {
    setIsBreathing(true);
    setBreathingProgress(0);
    setCurrentPhase("inhale");
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    setBreathingProgress(0);
    setPhaseProgress(0);
    if (timerRef.current) clearInterval(timerRef.current);
    if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
  };

  // Get phase text
  const getPhaseText = () => {
    switch (currentPhase) {
      case "inhale":
        return "Breathe In";
      case "hold1":
        return "Hold";
      case "exhale":
        return "Breathe Out";
      case "hold2":
        return "Hold";
    }
  };

  // Get animation scale based on phase
  const getAnimationScale = () => {
    if (currentPhase === "inhale") {
      return 1 + (phaseProgress / 100) * 0.5; // Scale from 1 to 1.5
    } else if (currentPhase === "exhale") {
      return 1.5 - (phaseProgress / 100) * 0.5; // Scale from 1.5 to 1
    } else if (currentPhase === "hold1") {
      return 1.5; // Stay at max
    } else {
      return 1; // Stay at min
    }
  };

  const { theme } = useTheme();

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="mb-16"
    >
      <div
        className="max-w-4xl mx-auto rounded-3xl p-8 md:p-10 backdrop-blur-xl border"
        style={{
          background: `${theme.colors.surface}80`,
          borderColor: `${theme.colors.border}50`,
          boxShadow: `0 8px 32px ${theme.colors.primary}10`,
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{
              background: `${theme.colors.primary}20`,
              border: `1px solid ${theme.colors.primary}40`,
            }}
          >
            <Wind className="h-4 w-4" style={{ color: theme.colors.primary }} />
            <span className="text-sm font-medium" style={{ color: theme.colors.text }}>
              Breathing Exercise
            </span>
          </div>
          <p style={{ color: theme.colors.textSecondary }}>
            {BREATHING_PATTERNS[breathingType].name}
          </p>
        </div>

        <div className="space-y-8">
          <div className="flex flex-col items-center justify-center">
            {/* Phase Text */}
            <AnimatePresence mode="wait">
              {isBreathing && (
                <motion.div
                  key={currentPhase}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-2xl font-semibold mb-6"
                  style={{ color: theme.colors.text }}
                >
                  {getPhaseText()}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Breathing Circle - Glassmorphism style */}
            <div className="relative">
              {/* Outer glow */}
              <motion.div
                className="absolute inset-0 rounded-full blur-xl"
                style={{ background: theme.colors.primary }}
                animate={{
                  scale: isBreathing ? getAnimationScale() * 1.1 : 1.1,
                  opacity: isBreathing ? [0.2, 0.4, 0.2] : 0.2,
                }}
                transition={{
                  scale: { duration: 0.05, ease: "linear" },
                  opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                }}
              />

              {/* Main breathing circle */}
              <motion.div
                className="relative w-44 h-44 rounded-full flex items-center justify-center backdrop-blur-md border"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary}60, ${theme.colors.secondary}40)`,
                  borderColor: `${theme.colors.primary}60`,
                  boxShadow: `0 8px 32px ${theme.colors.primary}40, inset 0 2px 4px ${theme.colors.primary}30`,
                }}
                animate={{
                  scale: isBreathing ? getAnimationScale() : 1,
                }}
                transition={{
                  scale: { duration: 0.05, ease: "linear" },
                }}
              >
                {/* Inner circle */}
                <motion.div
                  className="w-32 h-32 rounded-full backdrop-blur-sm flex items-center justify-center border"
                  style={{
                    background: `${theme.colors.surface}60`,
                    borderColor: `${theme.colors.border}40`,
                  }}
                  animate={{
                    scale: isBreathing ? 0.8 + (phaseProgress / 100) * 0.4 : 0.8,
                  }}
                  transition={{
                    duration: 0.05,
                    ease: "linear",
                  }}
                >
                  <div
                    className="text-2xl font-bold"
                    style={{ color: theme.colors.text }}
                  >
                    {isBreathing && Math.ceil(BREATHING_PATTERNS[breathingType].pattern.reduce((a, b) => a + b, 0))}
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Pattern Info */}
            {!isBreathing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 text-center text-sm"
                style={{ color: theme.colors.textSecondary }}
              >
                <p>Pattern: {BREATHING_PATTERNS[breathingType].pattern.join("-")} seconds</p>
                <p className="text-xs mt-1 opacity-70">(Inhale - Hold - Exhale - Hold)</p>
              </motion.div>
            )}
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: theme.colors.text }}
              >
                Exercise Type
              </label>
              <Select
                value={breathingType}
                onValueChange={(value) => setBreathingType(value as keyof typeof BREATHING_PATTERNS)}
                disabled={isBreathing}
              >
                <SelectTrigger
                  disabled={isBreathing}
                  className="backdrop-blur-md border"
                  style={{
                    background: `${theme.colors.surfaceLight}50`,
                    borderColor: `${theme.colors.border}50`,
                    color: theme.colors.text,
                  }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calm">Calm (4-7-8)</SelectItem>
                  <SelectItem value="focus">Focus (Box)</SelectItem>
                  <SelectItem value="energize">Energize (Quick)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: theme.colors.text }}
              >
                Duration
              </label>
              <Select
                value={breathingDuration.toString()}
                onValueChange={(value) => setBreathingDuration(parseInt(value))}
                disabled={isBreathing}
              >
                <SelectTrigger
                  disabled={isBreathing}
                  className="backdrop-blur-md border"
                  style={{
                    background: `${theme.colors.surfaceLight}50`,
                    borderColor: `${theme.colors.border}50`,
                    color: theme.colors.text,
                  }}
                >
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
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: theme.colors.text }}
              >
                Sound
              </label>
              <Button
                variant="outline"
                onClick={() => setIsSoundOn(!isSoundOn)}
                className="w-full backdrop-blur-md border transition-all"
                style={{
                  background: isSoundOn ? `${theme.colors.primary}20` : `${theme.colors.surfaceLight}50`,
                  borderColor: isSoundOn ? theme.colors.primary : `${theme.colors.border}50`,
                  color: theme.colors.text,
                }}
              >
                {isSoundOn ? (
                  <>
                    <Volume2 className="h-4 w-4 mr-2" style={{ color: theme.colors.primary }} /> On
                  </>
                ) : (
                  <>
                    <VolumeX className="h-4 w-4 mr-2" /> Off
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Progress bar */}
          {breathingProgress > 0 && (
            <div className="space-y-2">
              <div
                className="flex justify-between text-sm"
                style={{ color: theme.colors.textSecondary }}
              >
                <span>Progress</span>
                <span>
                  {Math.floor((breathingProgress / 100) * breathingDuration * 60)}s / {breathingDuration * 60}s
                </span>
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ background: `${theme.colors.surfaceLight}80` }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                    boxShadow: `0 0 10px ${theme.colors.primary}60`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${breathingProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {/* Start/Stop button */}
          <div className="flex justify-center gap-4">
            {!isBreathing ? (
              <Button
                onClick={startBreathing}
                className="px-10 py-6 text-lg rounded-xl transition-all"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                  boxShadow: `0 4px 20px ${theme.colors.primary}40`,
                  color: theme.colors.background,
                }}
              >
                <Play className="h-5 w-5 mr-2" />
                Start Breathing
              </Button>
            ) : (
              <Button
                onClick={stopBreathing}
                className="px-10 py-6 text-lg rounded-xl backdrop-blur-md border transition-all"
                style={{
                  background: `${theme.colors.surfaceLight}50`,
                  borderColor: `${theme.colors.border}50`,
                  color: theme.colors.text,
                }}
              >
                <Pause className="h-5 w-5 mr-2" />
                Stop
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
};
