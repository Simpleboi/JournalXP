import { useState } from 'react';
import { guidedPaths } from '@shared/data/guidedPaths';
import { REFLECTION_CATEGORIES, ReflectionCategory } from '@shared/types/guidedReflection';
import { useAllPathProgress } from './usePathProgress';
import { PathCard } from './PathCard';
import { FeatureNotice } from '@/components/FeatureNotice';

export function PathList() {
  const { allProgress, isLoading } = useAllPathProgress();
  const [selectedCategory, setSelectedCategory] = useState<ReflectionCategory | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 rounded-xl bg-gray-100 animate-pulse"
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

  return (
    <div className="space-y-6">
      <FeatureNotice
        type="info"
        title="A gentle reminder"
        message="These reflections are for self-exploration, not therapy or diagnosis. Take breaks if needed, and skip anything that doesn't feel right. If you're struggling, please reach out to a mental health professional."
      />

      {/* Category Filter Chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === null
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {REFLECTION_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500">
        {sortedPaths.length} {sortedPaths.length === 1 ? 'path' : 'paths'}
        {selectedCategory && ` in ${selectedCategory}`}
      </p>

      <div className="space-y-4">
        {sortedPaths.map((path) => (
          <PathCard
            key={path.id}
            path={path}
            progress={allProgress[path.id]}
          />
        ))}
      </div>
    </div>
  );
}
