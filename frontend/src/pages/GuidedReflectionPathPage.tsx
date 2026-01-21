import { Header } from '@/components/Header';
import { Compass } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { PathView } from '@/features/guidedReflection';
import { useParams } from 'react-router-dom';
import { getPathById } from '@shared/data/guidedPaths';
import { motion } from 'framer-motion';
import { ReflectionCategory } from '@shared/types/guidedReflection';

// Category-specific ambient colors
const categoryAmbience: Record<ReflectionCategory, { from: string; to: string; accent: string }> = {
  'Emotional Regulation': {
    from: 'rgba(167, 139, 250, 0.15)',
    to: 'rgba(192, 132, 252, 0.1)',
    accent: 'rgba(139, 92, 246, 0.2)',
  },
  'Self-Development': {
    from: 'rgba(251, 191, 36, 0.15)',
    to: 'rgba(251, 146, 60, 0.1)',
    accent: 'rgba(245, 158, 11, 0.2)',
  },
  'Life Transitions': {
    from: 'rgba(56, 189, 248, 0.15)',
    to: 'rgba(59, 130, 246, 0.1)',
    accent: 'rgba(14, 165, 233, 0.2)',
  },
  'Relationships': {
    from: 'rgba(251, 113, 133, 0.15)',
    to: 'rgba(244, 63, 94, 0.1)',
    accent: 'rgba(225, 29, 72, 0.2)',
  },
  'Wellness': {
    from: 'rgba(52, 211, 153, 0.15)',
    to: 'rgba(20, 184, 166, 0.1)',
    accent: 'rgba(16, 185, 129, 0.2)',
  },
  'Growth & Purpose': {
    from: 'rgba(99, 102, 241, 0.15)',
    to: 'rgba(139, 92, 246, 0.1)',
    accent: 'rgba(79, 70, 229, 0.2)',
  },
};

const GuidedReflectionPathPage = () => {
  const { pathId } = useParams<{ pathId: string }>();
  const path = pathId ? getPathById(pathId) : undefined;
  const ambience = path ? categoryAmbience[path.category] : categoryAmbience['Emotional Regulation'];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated ambient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white" />

        {/* Floating ambient orbs */}
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl"
          style={{ background: ambience.from }}
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 -right-32 w-80 h-80 rounded-full blur-3xl"
          style={{ background: ambience.to }}
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full blur-3xl"
          style={{ background: ambience.accent }}
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
      </div>

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
      <main id="main-content" className="container mx-auto px-4 py-8 relative">
        <PathView />
      </main>
    </div>
  );
};

export default GuidedReflectionPathPage;
