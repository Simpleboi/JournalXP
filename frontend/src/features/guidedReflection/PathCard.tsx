import { GuidedPath, ReflectionCategory } from '@shared/types/guidedReflection';
import { UserPathProgress } from '@shared/types/guidedReflection';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { motion } from 'framer-motion';

interface PathCardProps {
  path: GuidedPath;
  progress?: UserPathProgress;
  index?: number;
}

// Category-specific accent colors for icons and accents
const categoryAccents: Record<ReflectionCategory, { iconBg: string; iconText: string; progressBar: string; glow: string }> = {
  'Emotional Regulation': {
    iconBg: 'bg-gradient-to-br from-violet-500 to-purple-600',
    iconText: 'text-white',
    progressBar: 'bg-gradient-to-r from-violet-500 to-purple-500',
    glow: 'shadow-violet-300/50',
  },
  'Self-Development': {
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
    iconText: 'text-white',
    progressBar: 'bg-gradient-to-r from-amber-500 to-orange-500',
    glow: 'shadow-amber-300/50',
  },
  'Life Transitions': {
    iconBg: 'bg-gradient-to-br from-sky-500 to-blue-600',
    iconText: 'text-white',
    progressBar: 'bg-gradient-to-r from-sky-500 to-blue-500',
    glow: 'shadow-sky-300/50',
  },
  'Relationships': {
    iconBg: 'bg-gradient-to-br from-rose-500 to-pink-600',
    iconText: 'text-white',
    progressBar: 'bg-gradient-to-r from-rose-500 to-pink-500',
    glow: 'shadow-rose-300/50',
  },
  'Wellness': {
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    iconText: 'text-white',
    progressBar: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    glow: 'shadow-emerald-300/50',
  },
  'Growth & Purpose': {
    iconBg: 'bg-gradient-to-br from-indigo-500 to-violet-600',
    iconText: 'text-white',
    progressBar: 'bg-gradient-to-r from-indigo-500 to-violet-500',
    glow: 'shadow-indigo-300/50',
  },
};

export function PathCard({ path, progress, index = 0 }: PathCardProps) {
  const navigate = useNavigate();

  // Dynamically get the icon component
  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[path.icon] || LucideIcons.Compass;

  const isStarted = progress !== undefined;
  const isCompleted = progress?.completedAt !== undefined;
  const currentStep = progress?.currentStepIndex ?? 0;
  const totalSteps = path.steps.length;
  const progressPercent = isStarted ? Math.round((currentStep / totalSteps) * 100) : 0;

  const accent = categoryAccents[path.category];

  const handleClick = () => {
    navigate(`/guided-reflection/${path.id}`);
  };

  return (
    <motion.button
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative w-full text-left p-5 rounded-2xl overflow-hidden transition-all duration-300
        ${isCompleted ? 'opacity-75' : ''}
      `}
    >
      {/* Glass morphism background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${path.gradientFrom} ${path.gradientTo} opacity-80`} />
      <div className="absolute inset-0 backdrop-blur-[2px] bg-white/40" />

      {/* Layered shadow effect - rendered via CSS */}
      <div className={`absolute inset-0 rounded-2xl border border-white/60 shadow-lg ${accent.glow} group-hover:shadow-xl transition-shadow duration-300`} />

      {/* Subtle inner glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex items-start gap-4">
        {/* Animated Icon */}
        <motion.div
          className={`p-3 rounded-xl ${accent.iconBg} shadow-lg ${accent.glow}`}
          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          <IconComponent className={`h-6 w-6 ${accent.iconText}`} />
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg group-hover:text-gray-800 transition-colors">
                {path.title}
              </h3>
              <p className="text-sm text-gray-600 mt-0.5">{path.tagline}</p>
            </div>
            <motion.div
              className="flex-shrink-0 mt-1"
              whileHover={{ x: 4 }}
            >
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </motion.div>
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {path.estimatedMinutes} min
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              {totalSteps} steps
            </span>
          </div>

          {/* Progress indicator for in-progress paths */}
          {isStarted && !isCompleted && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1.5">
                <span className="font-medium">Step {currentStep + 1} of {totalSteps}</span>
                <span className="font-semibold">{progressPercent}%</span>
              </div>
              <div className="h-2 bg-white/60 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  className={`h-full ${accent.progressBar} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          )}

          {/* Completed badge */}
          {isCompleted && (
            <motion.div
              className="mt-4 flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-sm text-xs font-medium text-gray-700 shadow-sm border border-white/50">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Completed
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/50 text-xs text-gray-500">
                <RotateCcw className="h-3 w-3" />
                Revisit
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* In-progress pulse indicator */}
      {isStarted && !isCompleted && (
        <motion.div
          className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${accent.progressBar}`}
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}
