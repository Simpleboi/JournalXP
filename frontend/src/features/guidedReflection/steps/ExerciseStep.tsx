import { PathStep, ReflectionCategory } from '@shared/types/guidedReflection';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, SkipForward, Play, Check, Pause, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef, useCallback } from 'react';

// Category-specific styling matching IntroStep
const categoryStyles: Record<ReflectionCategory, {
  gradient: string;
  lightGradient: string;
  iconBg: string;
  iconText: string;
  buttonGradient: string;
  progressBg: string;
  progressFill: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  glow: string;
}> = {
  'Emotional Regulation': {
    gradient: 'from-violet-500 to-purple-600',
    lightGradient: 'from-violet-50 via-purple-50 to-fuchsia-50',
    iconBg: 'from-violet-500 to-purple-600',
    iconText: 'text-white',
    buttonGradient: 'from-violet-500 to-purple-600',
    progressBg: 'bg-violet-100',
    progressFill: 'from-violet-500 to-purple-500',
    textPrimary: 'text-violet-900',
    textSecondary: 'text-violet-600',
    border: 'border-violet-200',
    glow: 'shadow-violet-200/50',
  },
  'Self-Development': {
    gradient: 'from-amber-500 to-orange-600',
    lightGradient: 'from-amber-50 via-orange-50 to-yellow-50',
    iconBg: 'from-amber-500 to-orange-600',
    iconText: 'text-white',
    buttonGradient: 'from-amber-500 to-orange-600',
    progressBg: 'bg-amber-100',
    progressFill: 'from-amber-500 to-orange-500',
    textPrimary: 'text-amber-900',
    textSecondary: 'text-amber-600',
    border: 'border-amber-200',
    glow: 'shadow-amber-200/50',
  },
  'Life Transitions': {
    gradient: 'from-sky-500 to-blue-600',
    lightGradient: 'from-sky-50 via-blue-50 to-cyan-50',
    iconBg: 'from-sky-500 to-blue-600',
    iconText: 'text-white',
    buttonGradient: 'from-sky-500 to-blue-600',
    progressBg: 'bg-sky-100',
    progressFill: 'from-sky-500 to-blue-500',
    textPrimary: 'text-sky-900',
    textSecondary: 'text-sky-600',
    border: 'border-sky-200',
    glow: 'shadow-sky-200/50',
  },
  'Relationships': {
    gradient: 'from-rose-500 to-pink-600',
    lightGradient: 'from-rose-50 via-pink-50 to-red-50',
    iconBg: 'from-rose-500 to-pink-600',
    iconText: 'text-white',
    buttonGradient: 'from-rose-500 to-pink-600',
    progressBg: 'bg-rose-100',
    progressFill: 'from-rose-500 to-pink-500',
    textPrimary: 'text-rose-900',
    textSecondary: 'text-rose-600',
    border: 'border-rose-200',
    glow: 'shadow-rose-200/50',
  },
  'Wellness': {
    gradient: 'from-emerald-500 to-teal-600',
    lightGradient: 'from-emerald-50 via-teal-50 to-cyan-50',
    iconBg: 'from-emerald-500 to-teal-600',
    iconText: 'text-white',
    buttonGradient: 'from-emerald-500 to-teal-600',
    progressBg: 'bg-emerald-100',
    progressFill: 'from-emerald-500 to-teal-500',
    textPrimary: 'text-emerald-900',
    textSecondary: 'text-emerald-600',
    border: 'border-emerald-200',
    glow: 'shadow-emerald-200/50',
  },
  'Growth & Purpose': {
    gradient: 'from-indigo-500 to-violet-600',
    lightGradient: 'from-indigo-50 via-violet-50 to-purple-50',
    iconBg: 'from-indigo-500 to-violet-600',
    iconText: 'text-white',
    buttonGradient: 'from-indigo-500 to-violet-600',
    progressBg: 'bg-indigo-100',
    progressFill: 'from-indigo-500 to-violet-500',
    textPrimary: 'text-indigo-900',
    textSecondary: 'text-indigo-600',
    border: 'border-indigo-200',
    glow: 'shadow-indigo-200/50',
  },
};

interface ExerciseStepProps {
  step: PathStep;
  stepNumber: number;
  totalSteps: number;
  onComplete: () => void;
  onSkip: () => void;
  pathCategory?: ReflectionCategory;
}

// Circular progress component
function CircularProgress({
  progress,
  size = 200,
  strokeWidth = 8,
  style,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  style: typeof categoryStyles[ReflectionCategory];
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/30"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// Ambient breathing orbs
function BreathingOrbs({ style }: { style: typeof categoryStyles[ReflectionCategory] }) {
  return (
    <>
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full bg-gradient-to-br ${style.gradient} opacity-20 blur-xl`}
          style={{
            width: 80 + i * 40,
            height: 80 + i * 40,
            left: `${20 + i * 25}%`,
            top: `${20 + i * 15}%`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
            x: [0, 10 * (i % 2 === 0 ? 1 : -1), 0],
            y: [0, 10 * (i % 2 === 0 ? -1 : 1), 0],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
    </>
  );
}

export function ExerciseStep({
  step,
  stepNumber,
  totalSteps,
  onComplete,
  onSkip,
  pathCategory = 'Wellness',
}: ExerciseStepProps) {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentInstruction, setCurrentInstruction] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const style = categoryStyles[pathCategory];
  const instructions = step.exerciseInstructions || [];
  const duration = step.exerciseDuration || 60;
  const instructionDuration = duration / instructions.length;

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const progressInstructions = useCallback((index: number) => {
    if (index >= instructions.length) {
      setIsFinished(true);
      setIsActive(false);
      clearTimers();
      return;
    }

    setCurrentInstruction(index);
    timerRef.current = setTimeout(() => {
      progressInstructions(index + 1);
    }, instructionDuration * 1000);
  }, [instructions.length, instructionDuration, clearTimers]);

  const startExercise = () => {
    setIsActive(true);
    setCurrentInstruction(0);
    setElapsedTime(0);
    progressInstructions(0);

    // Start elapsed time counter
    intervalRef.current = setInterval(() => {
      setElapsedTime(prev => {
        if (prev >= duration) {
          return duration;
        }
        return prev + 0.1;
      });
    }, 100);
  };

  const handlePause = () => {
    if (isPaused) {
      // Resume
      setIsPaused(false);
      const remainingInstructionTime = instructionDuration - (elapsedTime % instructionDuration);
      timerRef.current = setTimeout(() => {
        progressInstructions(currentInstruction + 1);
      }, remainingInstructionTime * 1000);

      intervalRef.current = setInterval(() => {
        setElapsedTime(prev => Math.min(prev + 0.1, duration));
      }, 100);
    } else {
      // Pause
      setIsPaused(true);
      clearTimers();
    }
  };

  const handleFinish = () => {
    clearTimers();
    setIsFinished(true);
    setIsActive(false);
  };

  const progressPercent = Math.min((elapsedTime / duration) * 100, 100);
  const remainingSeconds = Math.max(0, Math.ceil(duration - elapsedTime));
  const remainingMinutes = Math.floor(remainingSeconds / 60);
  const remainingSecs = remainingSeconds % 60;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Step indicator */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Step {stepNumber} of {totalSteps}</span>
        {!isActive && !isFinished && (
          <button
            onClick={onSkip}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <SkipForward className="h-4 w-4" />
            Skip this exercise
          </button>
        )}
      </div>

      {/* Title with category styling */}
      <div className="relative">
        <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${style.lightGradient} rounded-3xl blur-2xl opacity-60 scale-110`} />
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            className={`p-3 rounded-xl bg-gradient-to-br ${style.iconBg} shadow-lg ${style.glow}`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.6 }}
          >
            <Wind className={`h-5 w-5 ${style.iconText}`} />
          </motion.div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{step.title}</h2>
            <p className="text-sm text-gray-500">Guided exercise</p>
          </div>
        </div>
      </div>

      {/* Context card with glass morphism */}
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-sm border border-white/80 shadow-lg p-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${style.buttonGradient}`} />
        <p className="text-gray-700 leading-relaxed">
          {step.content}
        </p>
      </motion.div>

      {/* Exercise area */}
      <motion.div
        className={`relative overflow-hidden rounded-2xl p-8 min-h-[320px] flex flex-col items-center justify-center bg-gradient-to-br ${style.gradient}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        {/* Ambient breathing orbs */}
        {isActive && !isPaused && <BreathingOrbs style={style} />}

        {/* Not started state */}
        <AnimatePresence mode="wait">
          {!isActive && !isFinished && (
            <motion.div
              key="start"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-6 relative z-10"
            >
              <motion.div
                className="w-24 h-24 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Play className="h-10 w-10 text-white ml-1" />
              </motion.div>
              <div className="space-y-2">
                <p className="text-white/90 text-lg font-medium">
                  Ready to begin?
                </p>
                <p className="text-white/70 text-sm">
                  This exercise takes about {Math.round(duration / 60)} minute{duration >= 120 ? 's' : ''}
                </p>
              </div>
              <Button
                onClick={startExercise}
                size="lg"
                className="gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 shadow-xl"
              >
                <Play className="h-4 w-4" />
                Start Exercise
              </Button>
            </motion.div>
          )}

          {/* Active state */}
          {isActive && (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-6 w-full max-w-md relative z-10"
            >
              {/* Circular progress timer */}
              <div className="relative flex items-center justify-center">
                <CircularProgress progress={progressPercent} size={180} strokeWidth={6} style={style} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    key={remainingSeconds}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-white"
                  >
                    {remainingMinutes}:{remainingSecs.toString().padStart(2, '0')}
                  </motion.span>
                  <span className="text-white/70 text-sm">remaining</span>
                </div>
              </div>

              {/* Instruction display */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentInstruction}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="space-y-3 px-4"
                >
                  <p className="text-xl text-white font-medium leading-relaxed">
                    {instructions[currentInstruction]}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Progress indicators */}
              <div className="flex justify-center gap-2">
                {instructions.map((_, i) => (
                  <motion.div
                    key={i}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      i < currentInstruction
                        ? 'bg-white w-2'
                        : i === currentInstruction
                        ? 'bg-white w-6'
                        : 'bg-white/30 w-2'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                  />
                ))}
              </div>

              {/* Control buttons */}
              <div className="flex items-center justify-center gap-3">
                <Button
                  onClick={handlePause}
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-white/10 hover:bg-white/20 border-white/30 text-white"
                >
                  {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button
                  onClick={handleFinish}
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-white/10 hover:bg-white/20 border-white/30 text-white"
                >
                  <Check className="h-4 w-4" />
                  Finish early
                </Button>
              </div>
            </motion.div>
          )}

          {/* Finished state */}
          {isFinished && (
            <motion.div
              key="finished"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-6 relative z-10"
            >
              {/* Celebration icon */}
              <div className="relative inline-block">
                <motion.div
                  className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                >
                  <Check className="h-10 w-10 text-white" />
                </motion.div>

                {/* Celebration particles */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-white"
                    style={{
                      left: '50%',
                      top: '50%',
                    }}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: Math.cos((i / 8) * Math.PI * 2) * 50,
                      y: Math.sin((i / 8) * Math.PI * 2) * 50,
                    }}
                    transition={{
                      duration: 0.8,
                      delay: 0.2 + i * 0.05,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <p className="text-xl text-white font-semibold">
                  Exercise Complete
                </p>
                <p className="text-white/80 text-sm max-w-xs mx-auto">
                  Take a moment to notice how you feel. There's no rush.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center gap-2 text-white/60 text-sm"
              >
                <Sparkles className="h-4 w-4" />
                <span>Well done</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Continue button */}
      <AnimatePresence>
        {isFinished && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex justify-end pt-2"
          >
            <Button
              onClick={onComplete}
              size="lg"
              className={`gap-2 px-8 rounded-xl bg-gradient-to-r ${style.buttonGradient} hover:opacity-90 shadow-lg transition-all hover:shadow-xl hover:scale-105`}
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
