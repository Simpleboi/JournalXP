import { PathStep } from '@shared/types/guidedReflection';
import { motion } from 'framer-motion';
import { Wind, SkipForward, Play, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';

interface ExerciseStepProps {
  step: PathStep;
  stepNumber: number;
  totalSteps: number;
  onComplete: () => void;
  onSkip: () => void;
}

export function ExerciseStep({
  step,
  stepNumber,
  totalSteps,
  onComplete,
  onSkip,
}: ExerciseStepProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentInstruction, setCurrentInstruction] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const instructions = step.exerciseInstructions || [];
  const duration = step.exerciseDuration || 60;
  const instructionDuration = duration / instructions.length;

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const startExercise = () => {
    setIsActive(true);
    setCurrentInstruction(0);
    progressInstructions(0);
  };

  const progressInstructions = (index: number) => {
    if (index >= instructions.length) {
      setIsFinished(true);
      setIsActive(false);
      return;
    }

    setCurrentInstruction(index);
    timerRef.current = setTimeout(() => {
      progressInstructions(index + 1);
    }, instructionDuration * 1000);
  };

  const handleFinish = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsFinished(true);
    setIsActive(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Step indicator */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Step {stepNumber} of {totalSteps}</span>
        <button
          onClick={onSkip}
          className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <SkipForward className="h-4 w-4" />
          Skip this exercise
        </button>
      </div>

      {/* Title */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-teal-100">
            <Wind className="h-5 w-5 text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{step.title}</h2>
            <p className="text-sm text-gray-500">Optional exercise</p>
          </div>
        </div>
      </div>

      {/* Context */}
      <div className="bg-white/60 rounded-xl p-5 border border-gray-100">
        <p className="text-gray-700 leading-relaxed">
          {step.content}
        </p>
      </div>

      {/* Exercise area */}
      <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-6 border-2 border-teal-200 min-h-[200px] flex flex-col items-center justify-center">
        {!isActive && !isFinished && (
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              This exercise takes about {Math.round(duration / 60)} minute{duration >= 120 ? 's' : ''}.
            </p>
            <Button
              onClick={startExercise}
              size="lg"
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              Start Exercise
            </Button>
          </div>
        )}

        {isActive && (
          <div className="text-center space-y-6 w-full max-w-md">
            {/* Instruction display */}
            <motion.div
              key={currentInstruction}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <p className="text-xl text-teal-900 font-medium leading-relaxed">
                {instructions[currentInstruction]}
              </p>
              <p className="text-sm text-teal-600">
                {currentInstruction + 1} of {instructions.length}
              </p>
            </motion.div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2">
              {instructions.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    i <= currentInstruction ? 'bg-teal-500' : 'bg-teal-200'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleFinish}
              variant="outline"
              size="sm"
            >
              Finish early
            </Button>
          </div>
        )}

        {isFinished && (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-teal-100">
              <Check className="h-6 w-6 text-teal-600" />
            </div>
            <p className="text-teal-900 font-medium">
              Exercise complete
            </p>
            <p className="text-sm text-teal-700">
              Take a moment to notice how you feel.
            </p>
          </div>
        )}
      </div>

      {/* Continue button */}
      {isFinished && (
        <div className="flex justify-end pt-2">
          <Button onClick={onComplete} size="lg">
            Continue
          </Button>
        </div>
      )}
    </motion.div>
  );
}
