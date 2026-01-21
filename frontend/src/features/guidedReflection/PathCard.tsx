import { GuidedPath } from '@shared/types/guidedReflection';
import { UserPathProgress } from '@shared/types/guidedReflection';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronRight, RotateCcw } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { motion } from 'framer-motion';

interface PathCardProps {
  path: GuidedPath;
  progress?: UserPathProgress;
}

export function PathCard({ path, progress }: PathCardProps) {
  const navigate = useNavigate();

  // Dynamically get the icon component
  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[path.icon] || LucideIcons.Compass;

  const isStarted = progress !== undefined;
  const isCompleted = progress?.completedAt !== undefined;
  const currentStep = progress?.currentStepIndex ?? 0;
  const totalSteps = path.steps.length;
  const progressPercent = isStarted ? Math.round((currentStep / totalSteps) * 100) : 0;

  const handleClick = () => {
    navigate(`/guided-reflection/${path.id}`);
  };

  return (
    <motion.button
      onClick={handleClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group w-full text-left p-5 rounded-xl bg-gradient-to-br ${path.gradientFrom} ${path.gradientTo} border-2 ${path.borderColor} hover:shadow-lg transition-all duration-200`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`p-3 rounded-xl bg-white/60 group-hover:bg-white/80 transition-colors`}>
          <IconComponent className="h-6 w-6 text-gray-700" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{path.title}</h3>
              <p className="text-sm text-gray-600 mt-0.5">{path.tagline}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {path.estimatedMinutes} min
            </span>
            <span>{totalSteps} steps</span>
          </div>

          {/* Progress indicator */}
          {isStarted && !isCompleted && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Step {currentStep + 1} of {totalSteps}</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-1.5 bg-white/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-600 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Completed badge */}
          {isCompleted && (
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/60 text-xs font-medium text-gray-700">
                <RotateCcw className="h-3 w-3" />
                Completed - Tap to revisit
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}
