import type { CSSProperties } from "react";
import { VaultSection } from "@/features/journal/VaultSection";
import { Header } from "@/components/Header";
import { Lock, Shield } from "lucide-react";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

// Floating shape component for the hero background
const FloatingShape = ({
  className,
  delay = 0,
  duration = 20,
  style
}: {
  className: string;
  delay?: number;
  duration?: number;
  style?: CSSProperties;
}) => (
  <motion.div
    className={className}
    style={style}
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
  const { theme } = useTheme();

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        background: `linear-gradient(to bottom, ${theme.colors.background}, ${theme.colors.surface}, ${theme.colors.background})`,
      }}
    >
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
        {/* Animated gradient background using theme colors */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background: `linear-gradient(to bottom right, ${theme.colors.primary}20, ${theme.colors.surface}, ${theme.colors.secondary}15)`,
          }}
        />

        {/* Animated mesh gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-40"
          animate={{
            background: [
              `radial-gradient(ellipse at 20% 20%, ${theme.colors.primary}40 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, ${theme.colors.secondary}30 0%, transparent 50%)`,
              `radial-gradient(ellipse at 40% 40%, ${theme.colors.primaryDark}40 0%, transparent 50%), radial-gradient(ellipse at 60% 60%, ${theme.colors.primary}30 0%, transparent 50%)`,
              `radial-gradient(ellipse at 20% 20%, ${theme.colors.primary}40 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, ${theme.colors.secondary}30 0%, transparent 50%)`,
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating decorative shapes using theme colors */}
        <FloatingShape
          className="absolute top-10 left-[10%] w-64 h-64 rounded-full blur-3xl"
          delay={0}
          duration={15}
          style={{
            background: `linear-gradient(to bottom right, ${theme.colors.primary}30, ${theme.colors.primaryLight}25)`,
          }}
        />
        <FloatingShape
          className="absolute top-20 right-[15%] w-48 h-48 rounded-full blur-3xl"
          delay={2}
          duration={18}
          style={{
            background: `linear-gradient(to bottom right, ${theme.colors.surfaceLight}40, ${theme.colors.surface}30)`,
          }}
        />
        <FloatingShape
          className="absolute bottom-10 left-[30%] w-56 h-56 rounded-full blur-3xl"
          delay={4}
          duration={20}
          style={{
            background: `linear-gradient(to bottom right, ${theme.colors.secondary}30, ${theme.colors.accent}25)`,
          }}
        />
        <FloatingShape
          className="absolute bottom-20 right-[25%] w-40 h-40 rounded-full blur-3xl"
          delay={1}
          duration={16}
          style={{
            background: `linear-gradient(to bottom right, ${theme.colors.primaryLight}30, ${theme.colors.primary}25)`,
          }}
        />

        {/* Abstract wave decoration */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full h-24"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          style={{ color: theme.colors.background }}
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
              className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl backdrop-blur-sm shadow-lg"
              style={{
                background: `${theme.colors.surface}cc`,
                boxShadow: `0 10px 40px ${theme.colors.primary}30`,
                border: `1px solid ${theme.colors.border}50`,
              }}
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Shield className="w-8 h-8" style={{ color: theme.colors.primary }} />
            </motion.div>

            {/* Main headline */}
            <h1
              className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent"
              style={{
                backgroundImage: theme.colors.gradient,
              }}
            >
              Secure Vault
            </h1>

            {/* Tagline */}
            <p
              className="text-xl md:text-2xl mb-3 font-light"
              style={{ color: theme.colors.text }}
            >
              Your private sanctuary for sensitive thoughts
            </p>

            {/* Description */}
            <p
              className="max-w-xl mx-auto leading-relaxed px-2"
              style={{ color: theme.colors.textSecondary }}
            >
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
