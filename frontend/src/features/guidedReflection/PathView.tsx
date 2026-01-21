import { useParams, useNavigate } from 'react-router-dom';
import { getPathById } from '@shared/data/guidedPaths';
import { usePathProgress } from './usePathProgress';
import { IntroStep } from './steps/IntroStep';
import { PromptStep } from './steps/PromptStep';
import { ExerciseStep } from './steps/ExerciseStep';
import { SummaryStep } from './steps/SummaryStep';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as LucideIcons from 'lucide-react';

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
        <p className="text-gray-600">Path not found</p>
        <Button
          onClick={() => navigate('/guided-reflection')}
          variant="outline"
          className="mt-4"
        >
          Back to Paths
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  const currentStepIndex = progress?.currentStepIndex ?? 0;
  const currentStep = path.steps[currentStepIndex];
  const totalSteps = path.steps.length;

  // Get icon component
  const IconComponent = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[path.icon] || LucideIcons.Compass;

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
          className="text-center space-y-6"
        >
          <div className={`inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br ${path.gradientFrom} ${path.gradientTo}`}>
            <IconComponent className="h-10 w-10 text-gray-700" />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Reflection Complete
            </h2>
            <p className="text-gray-600">
              You've completed "{path.title}"
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
            <p className="text-purple-900">
              Thank you for taking this time for yourself. Your responses have been saved locally and you can revisit this path anytime.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Button
              onClick={() => navigate('/guided-reflection')}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Paths
            </Button>
            <Button
              onClick={handleRestart}
              variant="outline"
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Start Again
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Not started - show intro
  if (!isStarted) {
    return (
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/guided-reflection')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${path.gradientFrom} ${path.gradientTo}`}>
              <IconComponent className="h-5 w-5 text-gray-700" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">{path.title}</h1>
          </div>
        </div>

        <IntroStep
          step={path.steps[0]}
          disclaimer={path.disclaimer}
          onContinue={handleStart}
        />
      </div>
    );
  }

  // In progress - show current step
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className={`p-2 rounded-lg transition-colors ${
              currentStepIndex === 0
                ? 'text-gray-300 cursor-not-allowed'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${path.gradientFrom} ${path.gradientTo}`}>
              <IconComponent className="h-5 w-5 text-gray-700" />
            </div>
            <h1 className="text-lg font-medium text-gray-900">{path.title}</h1>
          </div>
        </div>

        {/* Progress bar */}
        <div className="hidden sm:flex items-center gap-2">
          {path.steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-6 rounded-full transition-colors ${
                i < currentStepIndex
                  ? 'bg-gray-900'
                  : i === currentStepIndex
                  ? 'bg-gray-400'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <div key={currentStep.id}>
          {currentStep.type === 'intro' && (
            <IntroStep
              step={currentStep}
              disclaimer={path.disclaimer}
              onContinue={handleContinue}
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
            />
          )}

          {currentStep.type === 'exercise' && (
            <ExerciseStep
              step={currentStep}
              stepNumber={currentStepIndex + 1}
              totalSteps={totalSteps}
              onComplete={handleExerciseComplete}
              onSkip={handleSkip}
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
            />
          )}
        </div>
      </AnimatePresence>
    </div>
  );
}
