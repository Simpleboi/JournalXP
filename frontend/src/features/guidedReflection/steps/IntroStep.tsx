import { PathStep } from '@shared/types/guidedReflection';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IntroStepProps {
  step: PathStep;
  disclaimer: string;
  onContinue: () => void;
}

export function IntroStep({ step, disclaimer, onContinue }: IntroStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Title */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 mb-4">
          <Sparkles className="h-6 w-6 text-purple-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">{step.title}</h2>
      </div>

      {/* Content */}
      <div className="bg-white/60 rounded-xl p-6 border border-gray-100">
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {step.content}
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
        <p className="text-sm text-amber-800 leading-relaxed">
          {disclaimer}
        </p>
      </div>

      {/* Continue button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onContinue}
          size="lg"
          className="px-8"
        >
          Begin Reflection
        </Button>
      </div>
    </motion.div>
  );
}
