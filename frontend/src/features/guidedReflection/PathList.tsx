import { useState } from 'react';
import { guidedPaths } from '@shared/data/guidedPaths';
import { REFLECTION_CATEGORIES, ReflectionCategory } from '@shared/types/guidedReflection';
import { useAllPathProgress } from './usePathProgress';
import { PathCard } from './PathCard';
import { FeatureNotice } from '@/components/FeatureNotice';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Sparkles,
  Compass,
  Users,
  Leaf,
  Target,
} from 'lucide-react';

// Category-specific styling
const categoryStyles: Record<
  ReflectionCategory,
  { icon: React.ComponentType<{ className?: string }>; gradient: string; activeGradient: string; borderColor: string }
> = {
  'Emotional Regulation': {
    icon: Heart,
    gradient: 'from-violet-50 to-purple-50',
    activeGradient: 'from-violet-500 to-purple-600',
    borderColor: 'border-violet-200',
  },
  'Self-Development': {
    icon: Sparkles,
    gradient: 'from-amber-50 to-orange-50',
    activeGradient: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-200',
  },
  'Life Transitions': {
    icon: Compass,
    gradient: 'from-sky-50 to-blue-50',
    activeGradient: 'from-sky-500 to-blue-600',
    borderColor: 'border-sky-200',
  },
  'Relationships': {
    icon: Users,
    gradient: 'from-rose-50 to-pink-50',
    activeGradient: 'from-rose-500 to-pink-600',
    borderColor: 'border-rose-200',
  },
  'Wellness': {
    icon: Leaf,
    gradient: 'from-emerald-50 to-teal-50',
    activeGradient: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-200',
  },
  'Growth & Purpose': {
    icon: Target,
    gradient: 'from-indigo-50 to-violet-50',
    activeGradient: 'from-indigo-500 to-violet-600',
    borderColor: 'border-indigo-200',
  },
};

export function PathList() {
  const { allProgress, isLoading } = useAllPathProgress();
  const [selectedCategory, setSelectedCategory] = useState<ReflectionCategory | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="h-32 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        ))}
      </div>
    );
  }

  // Filter by category if selected
  const filteredPaths = selectedCategory
    ? guidedPaths.filter((path) => path.category === selectedCategory)
    : guidedPaths;

  // Sort paths: in-progress first, then not started, then completed
  const sortedPaths = [...filteredPaths].sort((a, b) => {
    const progressA = allProgress[a.id];
    const progressB = allProgress[b.id];

    const scoreA = progressA
      ? progressA.completedAt
        ? 2
        : 0
      : 1;
    const scoreB = progressB
      ? progressB.completedAt
        ? 2
        : 0
      : 1;

    return scoreA - scoreB;
  });

  // Count in-progress paths
  const inProgressCount = sortedPaths.filter(
    (path) => allProgress[path.id] && !allProgress[path.id].completedAt
  ).length;

  return (
    <div className="relative">
      {/* Ambient background gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(ellipse at 0% 0%, rgba(167, 139, 250, 0.4) 0%, transparent 50%)',
              'radial-gradient(ellipse at 100% 100%, rgba(251, 113, 133, 0.4) 0%, transparent 50%)',
              'radial-gradient(ellipse at 0% 100%, rgba(52, 211, 153, 0.4) 0%, transparent 50%)',
              'radial-gradient(ellipse at 100% 0%, rgba(251, 191, 36, 0.4) 0%, transparent 50%)',
              'radial-gradient(ellipse at 0% 0%, rgba(167, 139, 250, 0.4) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="space-y-6">
        <FeatureNotice
          type="info"
          title="A gentle reminder"
          message="These reflections are for self-exploration, not therapy or diagnosis. Take breaks if needed, and skip anything that doesn't feel right. If you're struggling, please reach out to a mental health professional."
        />

        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-2">
          <motion.button
            onClick={() => setSelectedCategory(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedCategory === null
                ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg shadow-gray-400/30'
                : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            All Paths
          </motion.button>
          {REFLECTION_CATEGORIES.map((category) => {
            const style = categoryStyles[category];
            const Icon = style.icon;
            const isSelected = selectedCategory === category;

            return (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isSelected
                    ? `bg-gradient-to-r ${style.activeGradient} text-white shadow-lg`
                    : `bg-gradient-to-br ${style.gradient} text-gray-700 border ${style.borderColor} hover:shadow-md`
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
                {category}
              </motion.button>
            );
          })}
        </div>

        {/* Results count with in-progress highlight */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-700">{sortedPaths.length}</span>{' '}
            {sortedPaths.length === 1 ? 'path' : 'paths'}
            {selectedCategory && (
              <span className="text-gray-400"> in {selectedCategory}</span>
            )}
          </p>
          {inProgressCount > 0 && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-medium"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
              {inProgressCount} in progress
            </motion.span>
          )}
        </div>

        {/* Path Cards with staggered animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory || 'all'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {sortedPaths.map((path, index) => (
              <PathCard
                key={path.id}
                path={path}
                progress={allProgress[path.id]}
                index={index}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty state */}
        {sortedPaths.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Compass className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No paths found in this category.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
