import { useParams, useNavigate } from 'react-router-dom';
import { getPathById } from '@shared/data/guidedPaths';
import { usePathProgress } from './usePathProgress';
import { IntroStep } from './steps/IntroStep';
import { PromptStep } from './steps/PromptStep';
import { ExerciseStep } from './steps/ExerciseStep';
import { SummaryStep } from './steps/SummaryStep';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Sparkles, Home, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as LucideIcons from 'lucide-react';
import { ReflectionCategory } from '@shared/types/guidedReflection';

// Category-specific accent colors
const categoryAccents: Record<ReflectionCategory, { gradient: string; text: string; bg: string; border: string; glow: string }> = {
  'Emotional Regulation': {
    gradient: 'from-violet-500 to-purple-600',
    text: 'text-violet-600',
    bg: 'bg-violet-100',
    border: 'border-violet-200',
    glow: 'shadow-violet-200/50',
  },
  'Self-Development': {
    gradient: 'from-amber-500 to-orange-600',
    text: 'text-amber-600',
    bg: 'bg-amber-100',
    border: 'border-amber-200',
    glow: 'shadow-amber-200/50',
  },
  'Life Transitions': {
    gradient: 'from-sky-500 to-blue-600',
    text: 'text-sky-600',
    bg: 'bg-sky-100',
    border: 'border-sky-200',
    glow: 'shadow-sky-200/50',
  },
  'Relationships': {
    gradient: 'from-rose-500 to-pink-600',
    text: 'text-rose-600',
    bg: 'bg-rose-100',
    border: 'border-rose-200',
    glow: 'shadow-rose-200/50',
  },
  'Wellness': {
    gradient: 'from-emerald-500 to-teal-600',
    text: 'text-emerald-600',
    bg: 'bg-emerald-100',
    border: 'border-emerald-200',
    glow: 'shadow-emerald-200/50',
  },
  'Growth & Purpose': {
    gradient: 'from-indigo-500 to-violet-600',
    text: 'text-indigo-600',
    bg: 'bg-indigo-100',
    border: 'border-indigo-200',
    glow: 'shadow-indigo-200/50',
  },
};

export function PathView() {
  const { pathId } = useParams<{ pathId: string }>();
  const navigate = useNavigate();
  const path = pathId ? getPathById(pathId) : undefined;

  const {
    progress,
    isLoading,
    startPath,
    saveStepResponse,
    goToStep,
    completePath,
    resetPath,
    getStepResponse,
    isStarted,
    isCompleted,
  } = usePathProgress(pathId || '');

  if (!path) {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
            <LucideIcons.Compass className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-600">Path not found</p>
          <Button
            onClick={() => navigate('/guided-reflection')}
            variant="outline"
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            Back to Paths
          </Button>
        </motion.div>
      </div>
    );
  }

  const accent = categoryAccents[path.category];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <motion.div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accent.gradient}`}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-gray-500 text-sm">Loading your journey...</p>
      </div>
    );
  }

  const currentStepIndex = progress?.currentStepIndex ?? 0;
  const currentStep = path.steps[currentStepIndex];
  const totalSteps = path.steps.length;
  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  // Get icon component
  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[path.icon] || LucideIcons.Compass;

  const handleStart = () => {
    startPath();
  };

  const handleContinue = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < totalSteps) {
      goToStep(nextIndex);
    }
  };

  const handleSavePrompt = (response: string) => {
    saveStepResponse(currentStep.id, response, false);
    handleContinue();
  };

  const handleSkip = () => {
    saveStepResponse(currentStep.id, undefined, true);
    handleContinue();
  };

  const handleExerciseComplete = () => {
    saveStepResponse(currentStep.id, undefined, false);
    handleContinue();
  };

  const handleComplete = (response: string) => {
    saveStepResponse(currentStep.id, response, false);
    completePath();
  };

  const handleRestart = () => {
    resetPath();
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      goToStep(currentStepIndex - 1);
    }
  };

  // Completion screen
  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8"
        >
          {/* Celebration icon */}
          <div className="relative inline-block">
            <motion.div
              className={`p-6 rounded-3xl bg-gradient-to-br ${accent.gradient} shadow-xl ${accent.glow}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <IconComponent className="h-12 w-12 text-white" />
            </motion.div>
            <motion.div
              className="absolute -top-2 -right-2 p-2 rounded-full bg-white shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.4 }}
            >
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </motion.div>

            {/* Floating celebration particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-2 h-2 rounded-full ${accent.bg}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: [0, (i % 2 === 0 ? 1 : -1) * (30 + i * 10)],
                  y: [0, -40 - i * 15],
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.5 + i * 0.1,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Reflection Complete
            </h2>
            <p className="text-gray-600 text-lg">
              You've completed <span className={accent.text + " font-medium"}>"{path.title}"</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`relative overflow-hidden rounded-2xl p-6 border-2 ${accent.border} bg-white/80 backdrop-blur-sm`}
          >
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accent.gradient}`} />
            <div className="flex items-start gap-4 text-left">
              <div className={`p-2 rounded-lg ${accent.bg} flex-shrink-0`}>
                <Sparkles className={`h-5 w-5 ${accent.text}`} />
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">
                  Thank you for taking this time for yourself
                </p>
                <p className="text-gray-600 text-sm">
                  Your responses have been saved locally and you can revisit this path anytime.
                  Remember, self-reflection is a practice that grows with consistency.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
          >
            <Button
              onClick={() => navigate('/guided-reflection')}
              variant="outline"
              size="lg"
              className="gap-2 rounded-xl"
            >
              <Home className="h-4 w-4" />
              Explore More Paths
            </Button>
            <Button
              onClick={handleRestart}
              variant="ghost"
              size="lg"
              className="gap-2 rounded-xl"
            >
              <RotateCcw className="h-4 w-4" />
              Start Again
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Not started - show intro
  if (!isStarted) {
    return (
      <div className="max-w-2xl mx-auto">
        {/* Header with glass morphism */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8 p-3 -mx-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/80 shadow-sm"
        >
          <button
            onClick={() => navigate('/guided-reflection')}
            className="p-2 rounded-xl hover:bg-white/80 transition-all hover:shadow-sm"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-3 flex-1">
            <motion.div
              className={`p-2.5 rounded-xl bg-gradient-to-br ${accent.gradient} shadow-lg ${accent.glow}`}
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <IconComponent className="h-5 w-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{path.title}</h1>
              <p className="text-xs text-gray-500">{path.category}</p>
            </div>
          </div>
        </motion.div>

        <IntroStep
          step={path.steps[0]}
          disclaimer={path.disclaimer}
          onContinue={handleStart}
          pathCategory={path.category}
        />
      </div>
    );
  }

  // In progress - show current step
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header with glass morphism and improved progress */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-4 -mx-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/80 shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              disabled={currentStepIndex === 0}
              className={`p-2 rounded-xl transition-all ${
                currentStepIndex === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'hover:bg-white/80 text-gray-600 hover:shadow-sm'
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-gradient-to-br ${accent.gradient} shadow-md ${accent.glow}`}>
                <IconComponent className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-medium text-gray-900">{path.title}</h1>
                <p className="text-xs text-gray-500">Step {currentStepIndex + 1} of {totalSteps}</p>
              </div>
            </div>
          </div>
          <div className={`text-sm font-semibold ${accent.text}`}>
            {progressPercent}%
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${accent.gradient} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-between mt-3 px-1">
          {path.steps.map((s, i) => (
            <motion.div
              key={i}
              className={`h-1.5 flex-1 mx-0.5 rounded-full transition-all duration-300 ${
                i < currentStepIndex
                  ? `bg-gradient-to-r ${accent.gradient}`
                  : i === currentStepIndex
                  ? accent.bg
                  : 'bg-gray-100'
              }`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
            />
          ))}
        </div>
      </motion.div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep.type === 'intro' && (
            <IntroStep
              step={currentStep}
              disclaimer={path.disclaimer}
              onContinue={handleContinue}
              pathCategory={path.category}
            />
          )}

          {currentStep.type === 'prompt' && (
            <PromptStep
              step={currentStep}
              stepNumber={currentStepIndex + 1}
              totalSteps={totalSteps}
              existingResponse={getStepResponse(currentStep.id)}
              onSave={handleSavePrompt}
              onSkip={handleSkip}
              pathCategory={path.category}
            />
          )}

          {currentStep.type === 'exercise' && (
            <ExerciseStep
              step={currentStep}
              stepNumber={currentStepIndex + 1}
              totalSteps={totalSteps}
              onComplete={handleExerciseComplete}
              onSkip={handleSkip}
              pathCategory={path.category}
            />
          )}

          {currentStep.type === 'summary' && (
            <SummaryStep
              step={currentStep}
              stepNumber={currentStepIndex + 1}
              totalSteps={totalSteps}
              existingResponse={getStepResponse(currentStep.id)}
              allResponses={progress?.stepResponses || []}
              onComplete={handleComplete}
              pathCategory={path.category}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
