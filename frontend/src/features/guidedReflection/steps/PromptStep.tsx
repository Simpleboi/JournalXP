import { PathStep, UserStepResponse } from '@shared/types/guidedReflection';
import { motion } from 'framer-motion';
import { PenLine, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';

interface PromptStepProps {
  step: PathStep;
  stepNumber: number;
  totalSteps: number;
  existingResponse?: UserStepResponse;
  onSave: (response: string) => void;
  onSkip: () => void;
}

export function PromptStep({
  step,
  stepNumber,
  totalSteps,
  existingResponse,
  onSave,
  onSkip,
}: PromptStepProps) {
  const [response, setResponse] = useState(existingResponse?.response || '');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setResponse(existingResponse?.response || '');
    setHasUnsavedChanges(false);
  }, [existingResponse, step.id]);

  const handleChange = (value: string) => {
    setResponse(value);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    onSave(response);
    setHasUnsavedChanges(false);
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
        {step.skippable && (
          <button
            onClick={onSkip}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <SkipForward className="h-4 w-4" />
            Skip this step
          </button>
        )}
      </div>

      {/* Title */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-blue-100">
            <PenLine className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">{step.title}</h2>
        </div>
      </div>

      {/* Context */}
      <div className="bg-white/60 rounded-xl p-5 border border-gray-100">
        <p className="text-gray-700 leading-relaxed">
          {step.content}
        </p>
      </div>

      {/* Prompt */}
      {step.prompt && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
          <p className="text-blue-900 font-medium leading-relaxed">
            {step.prompt}
          </p>
        </div>
      )}

      {/* Reflection questions */}
      {step.reflectionQuestions && step.reflectionQuestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600 font-medium">You might also consider:</p>
          <ul className="space-y-1.5">
            {step.reflectionQuestions.map((q, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-gray-400">•</span>
                {q}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Text area */}
      <div className="space-y-2">
        <Textarea
          value={response}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Write your thoughts here... Take as much space as you need."
          className="min-h-[200px] resize-y text-base leading-relaxed"
        />
        <p className="text-xs text-gray-500">
          Your responses are saved locally on this device.
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button
          onClick={handleSave}
          disabled={!response.trim()}
          size="lg"
        >
          {hasUnsavedChanges ? 'Save & Continue' : 'Continue'}
        </Button>
      </div>
    </motion.div>
  );
}
