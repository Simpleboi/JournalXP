import { guidedPaths } from '@shared/data/guidedPaths';
import { useAllPathProgress } from './usePathProgress';
import { PathCard } from './PathCard';
import { FeatureNotice } from '@/components/FeatureNotice';

export function PathList() {
  const { allProgress, isLoading } = useAllPathProgress();

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

  // Sort paths: in-progress first, then not started, then completed
  const sortedPaths = [...guidedPaths].sort((a, b) => {
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
