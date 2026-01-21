import { Header } from '@/components/Header';
import { Compass } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { PathList } from '@/features/guidedReflection';

const GuidedReflectionPage = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Guided Reflection Paths - Gentle Mental Health Journeys"
        description="Explore structured reflection paths for understanding anxiety, burnout, self-compassion, and processing change. Non-clinical, gentle self-exploration."
        url="https://journalxp.com/guided-reflection"
      />

      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link sr-only-focusable">
        Skip to main content
      </a>

      {/* Header */}
      <Header title="Guided Reflection" icon={Compass} />

      {/* Main Content */}
      <main id="main-content" className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Reflection Paths
          </h2>
          <p className="text-gray-600">
            Gentle, structured journeys for self-exploration. Take your time - there's no pressure to finish.
          </p>
        </div>

        <PathList />
      </main>
    </div>
  );
};

export default GuidedReflectionPage;
