import { Header } from '@/components/Header';
import { Compass } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { PathView } from '@/features/guidedReflection';
import { useParams } from 'react-router-dom';
import { getPathById } from '@shared/data/guidedPaths';

const GuidedReflectionPathPage = () => {
  const { pathId } = useParams<{ pathId: string }>();
  const path = pathId ? getPathById(pathId) : undefined;

  return (
    <div className="min-h-screen">
      <SEO
        title={path ? `${path.title} - Guided Reflection` : 'Guided Reflection'}
        description={path?.description || 'A gentle self-reflection journey.'}
        url={`https://journalxp.com/guided-reflection/${pathId}`}
      />

      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link sr-only-focusable">
        Skip to main content
      </a>

      {/* Header */}
      <Header title="Guided Reflection" icon={Compass} />

      {/* Main Content */}
      <main id="main-content" className="container mx-auto px-4 py-8">
        <PathView />
      </main>
    </div>
  );
};

export default GuidedReflectionPathPage;
