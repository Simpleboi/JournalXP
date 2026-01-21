import { PathStep, ReflectionCategory } from '@shared/types/guidedReflection';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Category-specific styling
const categoryStyles: Record<ReflectionCategory, { gradient: string; iconBg: string; iconText: string; buttonGradient: string }> = {
  'Emotional Regulation': {
    gradient: 'from-violet-100 to-purple-100',
    iconBg: 'from-violet-500 to-purple-600',
    iconText: 'text-white',
    buttonGradient: 'from-violet-500 to-purple-600',
  },
  'Self-Development': {
    gradient: 'from-amber-100 to-orange-100',
    iconBg: 'from-amber-500 to-orange-600',
    iconText: 'text-white',
    buttonGradient: 'from-amber-500 to-orange-600',
  },
  'Life Transitions': {
    gradient: 'from-sky-100 to-blue-100',
    iconBg: 'from-sky-500 to-blue-600',
    iconText: 'text-white',
    buttonGradient: 'from-sky-500 to-blue-600',
  },
  'Relationships': {
    gradient: 'from-rose-100 to-pink-100',
    iconBg: 'from-rose-500 to-pink-600',
    iconText: 'text-white',
    buttonGradient: 'from-rose-500 to-pink-600',
  },
  'Wellness': {
    gradient: 'from-emerald-100 to-teal-100',
    iconBg: 'from-emerald-500 to-teal-600',
    iconText: 'text-white',
    buttonGradient: 'from-emerald-500 to-teal-600',
  },
  'Growth & Purpose': {
    gradient: 'from-indigo-100 to-violet-100',
    iconBg: 'from-indigo-500 to-violet-600',
    iconText: 'text-white',
    buttonGradient: 'from-indigo-500 to-violet-600',
  },
};

interface IntroStepProps {
  step: PathStep;
  disclaimer: string;
  onContinue: () => void;
  pathCategory?: ReflectionCategory;
}

export function IntroStep({ step, disclaimer, onContinue, pathCategory = 'Emotional Regulation' }: IntroStepProps) {
  const style = categoryStyles[pathCategory];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Hero section */}
      <div className="text-center relative">
        {/* Decorative background gradient */}
        <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${style.gradient} rounded-3xl blur-3xl opacity-50 scale-110`} />

        <motion.div
          className={`inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br ${style.iconBg} shadow-xl mb-6`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
        >
          <Sparkles className={`h-8 w-8 ${style.iconText}`} />
        </motion.div>

        <motion.h2
          className="text-3xl font-bold text-gray-900 mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {step.title}
        </motion.h2>

        <motion.p
          className="text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Let's begin your reflection journey
        </motion.p>
      </div>

      {/* Content card with glass morphism */}
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-sm border border-white/80 shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${style.buttonGradient}`} />
        <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
          {step.content}
        </p>
      </motion.div>

      {/* Disclaimer with subtle styling */}
      <motion.div
        className="flex gap-3 p-4 rounded-xl bg-amber-50/80 border border-amber-200/60"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 leading-relaxed">
          {disclaimer}
        </p>
      </motion.div>

      {/* Continue button */}
      <motion.div
        className="flex justify-center pt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={onContinue}
          size="lg"
          className={`gap-2 px-8 rounded-xl bg-gradient-to-r ${style.buttonGradient} hover:opacity-90 shadow-lg transition-all hover:shadow-xl hover:scale-105`}
        >
          Begin Reflection
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
