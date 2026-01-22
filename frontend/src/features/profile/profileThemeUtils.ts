// Profile theming utilities for rank-based and time-of-day backgrounds

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

// Get time of day based on current hour
export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

// Time-based ambient gradients (subtle background tints)
export const TIME_GRADIENTS: Record<TimeOfDay, string> = {
  morning: 'from-amber-50/50 via-orange-50/30 to-rose-50/50',
  afternoon: 'from-sky-50/50 via-blue-50/30 to-indigo-50/50',
  evening: 'from-orange-50/50 via-rose-50/30 to-purple-50/50',
  night: 'from-slate-100/50 via-indigo-50/30 to-purple-50/50',
};

// Rank-based color schemes
export interface RankTheme {
  // Background gradients
  pageBg: string;
  cardBg: string;
  accentGradient: string;
  // Text colors
  textPrimary: string;
  textSecondary: string;
  // Border and accent colors
  borderColor: string;
  accentColor: string;
  glowColor: string;
  // Special effects
  hasShimmer: boolean;
  hasParticles: boolean;
  particleColor?: string;
}

export const RANK_THEMES: Record<string, RankTheme> = {
  Bronze: {
    pageBg: 'from-amber-50 via-orange-50/50 to-stone-50',
    cardBg: 'bg-gradient-to-br from-amber-50/80 to-orange-50/60',
    accentGradient: 'from-amber-600 to-orange-600',
    textPrimary: 'text-amber-900',
    textSecondary: 'text-amber-700',
    borderColor: 'border-amber-200',
    accentColor: 'text-amber-600',
    glowColor: 'rgba(217, 119, 6, 0.2)',
    hasShimmer: false,
    hasParticles: false,
  },
  Silver: {
    pageBg: 'from-slate-50 via-gray-50/50 to-zinc-50',
    cardBg: 'bg-gradient-to-br from-slate-50/80 to-gray-50/60',
    accentGradient: 'from-slate-500 to-gray-600',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    borderColor: 'border-slate-200',
    accentColor: 'text-slate-500',
    glowColor: 'rgba(100, 116, 139, 0.2)',
    hasShimmer: false,
    hasParticles: false,
  },
  Gold: {
    pageBg: 'from-yellow-50 via-amber-50/50 to-orange-50',
    cardBg: 'bg-gradient-to-br from-yellow-50/80 to-amber-50/60',
    accentGradient: 'from-yellow-500 to-amber-500',
    textPrimary: 'text-yellow-900',
    textSecondary: 'text-yellow-700',
    borderColor: 'border-yellow-300',
    accentColor: 'text-yellow-600',
    glowColor: 'rgba(234, 179, 8, 0.3)',
    hasShimmer: true,
    hasParticles: false,
  },
  Platinum: {
    pageBg: 'from-slate-50 via-blue-50/30 to-indigo-50/50',
    cardBg: 'bg-gradient-to-br from-slate-50/90 to-blue-50/60',
    accentGradient: 'from-slate-400 via-blue-300 to-indigo-400',
    textPrimary: 'text-slate-800',
    textSecondary: 'text-slate-600',
    borderColor: 'border-blue-200',
    accentColor: 'text-blue-500',
    glowColor: 'rgba(59, 130, 246, 0.25)',
    hasShimmer: true,
    hasParticles: false,
  },
  Diamond: {
    pageBg: 'from-cyan-50 via-sky-50/50 to-blue-50',
    cardBg: 'bg-gradient-to-br from-cyan-50/90 to-sky-50/70',
    accentGradient: 'from-cyan-400 via-sky-400 to-blue-500',
    textPrimary: 'text-cyan-900',
    textSecondary: 'text-cyan-700',
    borderColor: 'border-cyan-300',
    accentColor: 'text-cyan-500',
    glowColor: 'rgba(34, 211, 238, 0.35)',
    hasShimmer: true,
    hasParticles: true,
    particleColor: '#22d3ee',
  },
  Mythic: {
    pageBg: 'from-rose-50 via-pink-50/50 to-orange-50',
    cardBg: 'bg-gradient-to-br from-rose-50/90 to-pink-50/70',
    accentGradient: 'from-rose-500 via-pink-500 to-orange-500',
    textPrimary: 'text-rose-900',
    textSecondary: 'text-rose-700',
    borderColor: 'border-rose-300',
    accentColor: 'text-rose-500',
    glowColor: 'rgba(244, 63, 94, 0.3)',
    hasShimmer: true,
    hasParticles: true,
    particleColor: '#f43f5e',
  },
  Legend: {
    pageBg: 'from-purple-50 via-violet-50/50 to-fuchsia-50',
    cardBg: 'bg-gradient-to-br from-purple-50/90 to-violet-50/70',
    accentGradient: 'from-purple-500 via-violet-500 to-fuchsia-500',
    textPrimary: 'text-purple-900',
    textSecondary: 'text-purple-700',
    borderColor: 'border-purple-300',
    accentColor: 'text-purple-500',
    glowColor: 'rgba(168, 85, 247, 0.35)',
    hasShimmer: true,
    hasParticles: true,
    particleColor: '#a855f7',
  },
  Ascended: {
    pageBg: 'from-amber-50 via-cyan-50/30 to-violet-50',
    cardBg: 'bg-gradient-to-br from-amber-50/80 via-cyan-50/50 to-violet-50/70',
    accentGradient: 'from-amber-400 via-cyan-400 to-violet-500',
    textPrimary: 'text-violet-900',
    textSecondary: 'text-violet-700',
    borderColor: 'border-violet-300',
    accentColor: 'text-violet-500',
    glowColor: 'rgba(167, 139, 250, 0.4)',
    hasShimmer: true,
    hasParticles: true,
    particleColor: '#fbbf24',
  },
};

// Get rank theme from rank string (e.g., "Bronze III" -> Bronze theme)
export function getRankTheme(rank: string): RankTheme {
  const baseRank = rank.split(' ')[0];
  return RANK_THEMES[baseRank] || RANK_THEMES.Bronze;
}

// Combine time-of-day and rank for page background
export function getProfileBackground(rank: string): string {
  const timeGradient = TIME_GRADIENTS[getTimeOfDay()];
  const rankTheme = getRankTheme(rank);
  // Blend both: rank provides the base, time adds subtle tint
  return `bg-gradient-to-br ${rankTheme.pageBg}`;
}

// Haptic feedback utility for mobile
export function triggerHaptic(type: 'light' | 'medium' | 'heavy' = 'light') {
  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
    };
    navigator.vibrate(patterns[type]);
  }
}

// Animation variants for staggered entrance
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
    },
  },
};
