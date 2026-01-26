import { VaultSection } from "@/features/journal/VaultSection";
import { Header } from "@/components/Header";
import { Lock, Shield } from "lucide-react";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";

// Floating shape component for the hero background
const FloatingShape = ({
  className,
  delay = 0,
  duration = 20
}: {
  className: string;
  delay?: number;
  duration?: number;
}) => (
  <motion.div
    className={className}
    animate={{
      y: [0, -20, 0],
      x: [0, 10, 0],
      rotate: [0, 5, 0],
      scale: [1, 1.05, 1],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  />
);

const VaultPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <SEO
        title="Secure Vault - Password-Protected Journal Entries"
        description="Store your most sensitive thoughts in the Secure Vault with password protection and AES-256 encryption. Your privacy matters."
        url="https://journalxp.com/vault"
      />

      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link sr-only-focusable">
        Skip to main content
      </a>

      {/* Header */}
      <Header title="Secure Vault" icon={Lock} />

      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 via-indigo-50/30 to-cyan-50/40" />

        {/* Animated mesh gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-60"
          animate={{
            background: [
              'radial-gradient(ellipse at 20% 20%, rgba(99, 102, 241, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(34, 211, 238, 0.2) 0%, transparent 50%)',
              'radial-gradient(ellipse at 40% 40%, rgba(71, 85, 105, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 60% 60%, rgba(99, 102, 241, 0.2) 0%, transparent 50%)',
              'radial-gradient(ellipse at 20% 20%, rgba(99, 102, 241, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(34, 211, 238, 0.2) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating decorative shapes */}
        <FloatingShape
          className="absolute top-10 left-[10%] w-64 h-64 rounded-full bg-gradient-to-br from-indigo-200/40 to-blue-300/30 blur-3xl"
          delay={0}
          duration={15}
        />
        <FloatingShape
          className="absolute top-20 right-[15%] w-48 h-48 rounded-full bg-gradient-to-br from-slate-200/40 to-gray-300/30 blur-3xl"
          delay={2}
          duration={18}
        />
        <FloatingShape
          className="absolute bottom-10 left-[30%] w-56 h-56 rounded-full bg-gradient-to-br from-cyan-200/40 to-teal-300/30 blur-3xl"
          delay={4}
          duration={20}
        />
        <FloatingShape
          className="absolute bottom-20 right-[25%] w-40 h-40 rounded-full bg-gradient-to-br from-violet-200/40 to-purple-300/30 blur-3xl"
          delay={1}
          duration={16}
        />

        {/* Abstract wave decoration */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full h-24 text-white"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,50 C360,100 720,0 1080,50 C1260,75 1380,75 1440,50 L1440,100 L0,100 Z"
            fill="currentColor"
            animate={{
              d: [
                "M0,50 C360,100 720,0 1080,50 C1260,75 1380,75 1440,50 L1440,100 L0,100 Z",
                "M0,60 C360,20 720,80 1080,40 C1260,25 1380,65 1440,60 L1440,100 L0,100 Z",
                "M0,50 C360,100 720,0 1080,50 C1260,75 1380,75 1440,50 L1440,100 L0,100 Z",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>

        {/* Hero content */}
        <div className="relative z-10 container mx-auto px-4 py-16 md:py-24 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Icon badge */}
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg shadow-indigo-200/50"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Shield className="w-8 h-8 text-indigo-600" />
            </motion.div>

            {/* Main headline */}
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Secure Vault
            </h1>

            {/* Tagline */}
            <p className="text-xl md:text-2xl text-gray-600 mb-3 font-light">
              Your private sanctuary for sensitive thoughts
            </p>

            {/* Description */}
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed px-2">
              Protected by AES-256 encryption and your personal password.
              Your most private entries stay completely secure,
              accessible only to you.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <main id="main-content" className="relative container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <VaultSection />
      </main>

      {/* Offline Indicator */}
      <OfflineIndicator />
    </div>
  );
};

export default VaultPage;
