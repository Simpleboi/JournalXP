import { PathStep, UserStepResponse } from '@shared/types/guidedReflection';
import { motion } from 'framer-motion';
import { Bookmark, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';

interface SummaryStepProps {
  step: PathStep;
  stepNumber: number;
  totalSteps: number;
  existingResponse?: UserStepResponse;
  allResponses: UserStepResponse[];
  onComplete: (response: string) => void;
}

export function SummaryStep({
  step,
  stepNumber,
  totalSteps,
  existingResponse,
  allResponses,
  onComplete,
}: SummaryStepProps) {
  const [response, setResponse] = useState(existingResponse?.response || '');
  const [showPreviousResponses, setShowPreviousResponses] = useState(false);

  useEffect(() => {
    setResponse(existingResponse?.response || '');
  }, [existingResponse, step.id]);

  // Filter to only prompt responses that have content
  const promptResponses = allResponses.filter(
    (r) => r.response && r.response.trim() && !r.skipped
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Step indicator */}
      <div className="text-sm text-gray-500">
        <span>Step {stepNumber} of {totalSteps}</span>
      </div>

      {/* Title */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-purple-100">
            <Bookmark className="h-5 w-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">{step.title}</h2>
        </div>
      </div>

      {/* Completion message */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-200">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-purple-900 font-medium mb-1">
              You've completed this reflection path
            </p>
            <p className="text-purple-700 text-sm">
              Take a moment to capture any final thoughts or insights.
            </p>
          </div>
        </div>
      </div>

      {/* Context */}
      <div className="bg-white/60 rounded-xl p-5 border border-gray-100">
        <p className="text-gray-700 leading-relaxed">
          {step.content}
        </p>
      </div>

      {/* Show previous responses toggle */}
      {promptResponses.length > 0 && (
        <div>
          <button
            onClick={() => setShowPreviousResponses(!showPreviousResponses)}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            {showPreviousResponses ? 'Hide' : 'Review'} your previous responses ({promptResponses.length})
          </button>

          {showPreviousResponses && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 space-y-3 max-h-64 overflow-y-auto"
            >
              {promptResponses.map((r, i) => (
                <div
                  key={r.stepId}
                  className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700"
                >
                  <p className="text-xs text-gray-500 mb-1">Response {i + 1}</p>
                  <p className="line-clamp-3">{r.response}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      )}

      {/* Prompt */}
      {step.prompt && (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 border-2 border-purple-200">
          <p className="text-purple-900 font-medium leading-relaxed">
            {step.prompt}
          </p>
        </div>
      )}

      {/* Text area */}
      <div className="space-y-2">
        <Textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Capture your final thoughts and insights..."
          className="min-h-[150px] resize-y text-base leading-relaxed"
        />
      </div>

      {/* Complete button */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={() => onComplete(response)}
          size="lg"
          className="gap-2"
        >
          <Bookmark className="h-4 w-4" />
          Complete Reflection
        </Button>
      </div>
    </motion.div>
  );
}
