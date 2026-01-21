import { PathStep, UserStepResponse, ReflectionCategory } from '@shared/types/guidedReflection';
import { motion } from 'framer-motion';
import { PenLine, SkipForward, ArrowRight, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';

// Category-specific styling
const categoryStyles: Record<ReflectionCategory, {
  iconBg: string;
  iconText: string;
  promptGradient: string;
  promptBorder: string;
  promptText: string;
  buttonGradient: string;
}> = {
  'Emotional Regulation': {
    iconBg: 'bg-gradient-to-br from-violet-500 to-purple-600',
    iconText: 'text-white',
    promptGradient: 'from-violet-50 to-purple-50',
    promptBorder: 'border-violet-200',
    promptText: 'text-violet-900',
    buttonGradient: 'from-violet-500 to-purple-600',
  },
  'Self-Development': {
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
    iconText: 'text-white',
    promptGradient: 'from-amber-50 to-orange-50',
    promptBorder: 'border-amber-200',
    promptText: 'text-amber-900',
    buttonGradient: 'from-amber-500 to-orange-600',
  },
  'Life Transitions': {
    iconBg: 'bg-gradient-to-br from-sky-500 to-blue-600',
    iconText: 'text-white',
    promptGradient: 'from-sky-50 to-blue-50',
    promptBorder: 'border-sky-200',
    promptText: 'text-sky-900',
    buttonGradient: 'from-sky-500 to-blue-600',
  },
  'Relationships': {
    iconBg: 'bg-gradient-to-br from-rose-500 to-pink-600',
    iconText: 'text-white',
    promptGradient: 'from-rose-50 to-pink-50',
    promptBorder: 'border-rose-200',
    promptText: 'text-rose-900',
    buttonGradient: 'from-rose-500 to-pink-600',
  },
  'Wellness': {
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    iconText: 'text-white',
    promptGradient: 'from-emerald-50 to-teal-50',
    promptBorder: 'border-emerald-200',
    promptText: 'text-emerald-900',
    buttonGradient: 'from-emerald-500 to-teal-600',
  },
  'Growth & Purpose': {
    iconBg: 'bg-gradient-to-br from-indigo-500 to-violet-600',
    iconText: 'text-white',
    promptGradient: 'from-indigo-50 to-violet-50',
    promptBorder: 'border-indigo-200',
    promptText: 'text-indigo-900',
    buttonGradient: 'from-indigo-500 to-violet-600',
  },
};

interface PromptStepProps {
  step: PathStep;
  stepNumber: number;
  totalSteps: number;
  existingResponse?: UserStepResponse;
  onSave: (response: string) => void;
  onSkip: () => void;
  pathCategory?: ReflectionCategory;
}

export function PromptStep({
  step,
  stepNumber,
  totalSteps,
  existingResponse,
  onSave,
  onSkip,
  pathCategory = 'Emotional Regulation',
}: PromptStepProps) {
  const [response, setResponse] = useState(existingResponse?.response || '');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const style = categoryStyles[pathCategory];

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
      {/* Step indicator with skip option */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500 font-medium">
          Reflection {stepNumber} of {totalSteps}
        </span>
        {step.skippable && (
          <motion.button
            onClick={onSkip}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            whileHover={{ x: 3 }}
          >
            Skip
            <SkipForward className="h-4 w-4" />
          </motion.button>
        )}
      </div>

      {/* Title with animated icon */}
      <div className="flex items-center gap-4">
        <motion.div
          className={`p-3 rounded-xl ${style.iconBg} shadow-lg`}
          whileHover={{ scale: 1.05, rotate: 5 }}
        >
          <PenLine className={`h-6 w-6 ${style.iconText}`} />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900">{step.title}</h2>
      </div>

      {/* Context card with glass morphism */}
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-sm border border-white/80 shadow-sm p-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <p className="text-gray-700 leading-relaxed text-lg">
          {step.content}
        </p>
      </motion.div>

      {/* Prompt with category-specific styling */}
      {step.prompt && (
        <motion.div
          className={`relative overflow-hidden bg-gradient-to-br ${style.promptGradient} rounded-2xl p-6 border-2 ${style.promptBorder}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex gap-4">
            <div className={`p-2 rounded-lg ${style.iconBg} h-fit`}>
              <Lightbulb className="h-4 w-4 text-white" />
            </div>
            <p className={`${style.promptText} font-medium leading-relaxed text-lg`}>
              {step.prompt}
            </p>
          </div>
        </motion.div>
      )}

      {/* Reflection questions */}
      {step.reflectionQuestions && step.reflectionQuestions.length > 0 && (
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-gray-600 font-medium">You might also consider:</p>
          <ul className="space-y-2">
            {step.reflectionQuestions.map((q, i) => (
              <motion.li
                key={i}
                className="text-gray-600 flex items-start gap-3 pl-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <span className={`w-1.5 h-1.5 rounded-full mt-2 ${style.iconBg}`} />
                {q}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Text area with enhanced styling */}
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className={`relative rounded-2xl transition-all duration-300 ${isFocused ? 'ring-2 ring-offset-2 ring-gray-300' : ''}`}>
          <Textarea
            value={response}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Write your thoughts here... Take as much space as you need."
            className="min-h-[220px] resize-y text-base leading-relaxed rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm focus:border-gray-300 focus:ring-0 p-5 placeholder:text-gray-400"
          />
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 px-1">
          <span>Your responses are saved locally on this device.</span>
          {response.length > 0 && (
            <span className="text-gray-400">{response.length} characters</span>
          )}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        className="flex justify-end pt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={handleSave}
          disabled={!response.trim()}
          size="lg"
          className={`gap-2 rounded-xl bg-gradient-to-r ${style.buttonGradient} hover:opacity-90 shadow-lg transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {hasUnsavedChanges ? 'Save & Continue' : 'Continue'}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
