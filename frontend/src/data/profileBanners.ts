// Profile banner presets for the hero section
export interface ProfileBanner {
  id: string;
  name: string;
  category: 'nature' | 'abstract' | 'minimal' | 'gradient';
  // Using Unsplash URLs with specific sizing for performance
  url: string;
  thumbnail: string;
}

export const PROFILE_BANNERS: ProfileBanner[] = [
  // Nature scenes
  {
    id: 'mountains-lake',
    name: 'Mountain Lake',
    category: 'nature',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=80&fit=crop',
  },
  {
    id: 'ocean-sunset',
    name: 'Ocean Sunset',
    category: 'nature',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=400&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=80&fit=crop',
  },
  {
    id: 'forest-path',
    name: 'Forest Path',
    category: 'nature',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&h=400&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=200&h=80&fit=crop',
  },
  {
    id: 'starry-night',
    name: 'Starry Night',
    category: 'nature',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=400&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=200&h=80&fit=crop',
  },
  {
    id: 'cherry-blossoms',
    name: 'Cherry Blossoms',
    category: 'nature',
    url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1200&h=400&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=200&h=80&fit=crop',
  },
  {
    id: 'northern-lights',
    name: 'Northern Lights',
    category: 'nature',
    url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&h=400&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=200&h=80&fit=crop',
  },

  // Abstract/artistic
  {
    id: 'abstract-waves',
    name: 'Abstract Waves',
    category: 'abstract',
    url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1200&h=400&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=200&h=80&fit=crop',
  },
  {
    id: 'paint-swirls',
    name: 'Paint Swirls',
    category: 'abstract',
    url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1200&h=400&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=200&h=80&fit=crop',
  },
  {
    id: 'liquid-marble',
    name: 'Liquid Marble',
    category: 'abstract',
    url: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=1200&h=400&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=200&h=80&fit=crop',
  },

  // Minimal
  {
    id: 'soft-clouds',
    name: 'Soft Clouds',
    category: 'minimal',
    url: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1200&h=400&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=200&h=80&fit=crop',
  },
  {
    id: 'paper-texture',
    name: 'Paper Texture',
    category: 'minimal',
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=400&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=80&fit=crop',
  },
];

// Gradient presets (CSS gradients instead of images)
export const GRADIENT_BANNERS = [
  {
    id: 'gradient-sunset',
    name: 'Sunset Glow',
    gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 50%, #f093fb 100%)',
  },
  {
    id: 'gradient-ocean',
    name: 'Ocean Deep',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  },
  {
    id: 'gradient-forest',
    name: 'Forest Dawn',
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  },
  {
    id: 'gradient-twilight',
    name: 'Twilight',
    gradient: 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 50%, #c4e0e5 100%)',
  },
  {
    id: 'gradient-rose',
    name: 'Rose Garden',
    gradient: 'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)',
  },
  {
    id: 'gradient-aurora',
    name: 'Aurora',
    gradient: 'linear-gradient(135deg, #00c6fb 0%, #005bea 50%, #7028e4 100%)',
  },
  {
    id: 'gradient-ember',
    name: 'Ember',
    gradient: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
  },
  {
    id: 'gradient-midnight',
    name: 'Midnight',
    gradient: 'linear-gradient(135deg, #232526 0%, #414345 50%, #5c6bc0 100%)',
  },
];

// Mood options for the mood selector
export interface MoodOption {
  emoji: string;
  label: string;
}

export const MOOD_OPTIONS: MoodOption[] = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '🤔', label: 'Thoughtful' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '😤', label: 'Frustrated' },
  { emoji: '🥰', label: 'Grateful' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😰', label: 'Anxious' },
  { emoji: '🔥', label: 'Motivated' },
  { emoji: '🌟', label: 'Inspired' },
  { emoji: '😎', label: 'Confident' },
  { emoji: '🤗', label: 'Hopeful' },
];

// Rank-based styling for profile frames
export interface RankStyle {
  baseRank: string;
  frameGradient: string;
  glowColor: string;
  glowIntensity: 'none' | 'subtle' | 'medium' | 'strong' | 'intense';
  particleEffect: boolean;
  borderWidth: number;
}

export const RANK_STYLES: Record<string, RankStyle> = {
  Bronze: {
    baseRank: 'Bronze',
    frameGradient: 'linear-gradient(135deg, #cd7f32 0%, #8b4513 50%, #cd7f32 100%)',
    glowColor: 'rgba(205, 127, 50, 0.4)',
    glowIntensity: 'subtle',
    particleEffect: false,
    borderWidth: 3,
  },
  Silver: {
    baseRank: 'Silver',
    frameGradient: 'linear-gradient(135deg, #c0c0c0 0%, #a8a8a8 50%, #e8e8e8 100%)',
    glowColor: 'rgba(192, 192, 192, 0.5)',
    glowIntensity: 'medium',
    particleEffect: false,
    borderWidth: 3,
  },
  Gold: {
    baseRank: 'Gold',
    frameGradient: 'linear-gradient(135deg, #ffd700 0%, #ffb300 50%, #fff44f 100%)',
    glowColor: 'rgba(255, 215, 0, 0.6)',
    glowIntensity: 'medium',
    particleEffect: false,
    borderWidth: 4,
  },
  Platinum: {
    baseRank: 'Platinum',
    frameGradient: 'linear-gradient(135deg, #e5e4e2 0%, #b4c4d4 50%, #f0f0f0 100%)',
    glowColor: 'rgba(180, 196, 212, 0.6)',
    glowIntensity: 'strong',
    particleEffect: false,
    borderWidth: 4,
  },
  Diamond: {
    baseRank: 'Diamond',
    frameGradient: 'linear-gradient(135deg, #b9f2ff 0%, #89cff0 25%, #e0f7fa 50%, #b9f2ff 75%, #89cff0 100%)',
    glowColor: 'rgba(185, 242, 255, 0.7)',
    glowIntensity: 'intense',
    particleEffect: true,
    borderWidth: 4,
  },
  Mythic: {
    baseRank: 'Mythic',
    frameGradient: 'linear-gradient(135deg, #ff6b6b 0%, #c44569 25%, #ff6b6b 50%, #feca57 75%, #ff6b6b 100%)',
    glowColor: 'rgba(255, 107, 107, 0.7)',
    glowIntensity: 'intense',
    particleEffect: true,
    borderWidth: 5,
  },
  Legend: {
    baseRank: 'Legend',
    frameGradient: 'linear-gradient(135deg, #a855f7 0%, #6366f1 25%, #ec4899 50%, #a855f7 75%, #6366f1 100%)',
    glowColor: 'rgba(168, 85, 247, 0.8)',
    glowIntensity: 'intense',
    particleEffect: true,
    borderWidth: 5,
  },
  Ascended: {
    baseRank: 'Ascended',
    frameGradient: 'linear-gradient(135deg, #fff 0%, #ffd700 25%, #ff69b4 50%, #00ffff 75%, #fff 100%)',
    glowColor: 'rgba(255, 255, 255, 0.9)',
    glowIntensity: 'intense',
    particleEffect: true,
    borderWidth: 6,
  },
};

// Helper to get rank style from full rank string (e.g., "Bronze III" -> Bronze styles)
export function getRankStyleFromRank(rank: string): RankStyle {
  const baseRank = rank.split(' ')[0]; // Extract "Bronze" from "Bronze III"
  return RANK_STYLES[baseRank] || RANK_STYLES.Bronze;
}

// Glass morphism gradient overlays based on rank
export const GLASS_GRADIENTS: Record<string, string> = {
  Bronze: 'linear-gradient(135deg, rgba(205, 127, 50, 0.08) 0%, rgba(139, 69, 19, 0.04) 100%)',
  Silver: 'linear-gradient(135deg, rgba(192, 192, 192, 0.1) 0%, rgba(168, 168, 168, 0.05) 100%)',
  Gold: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 179, 0, 0.05) 100%)',
  Platinum: 'linear-gradient(135deg, rgba(180, 196, 212, 0.12) 0%, rgba(229, 228, 226, 0.06) 100%)',
  Diamond: 'linear-gradient(135deg, rgba(185, 242, 255, 0.15) 0%, rgba(137, 207, 240, 0.08) 100%)',
  Mythic: 'linear-gradient(135deg, rgba(255, 107, 107, 0.12) 0%, rgba(254, 202, 87, 0.06) 100%)',
  Legend: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(236, 72, 153, 0.08) 100%)',
  Ascended: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(0, 255, 255, 0.08) 50%, rgba(255, 105, 180, 0.08) 100%)',
};

// Helper to get glass gradient from rank
export function getGlassGradientFromRank(rank: string): string {
  const baseRank = rank.split(' ')[0];
  return GLASS_GRADIENTS[baseRank] || GLASS_GRADIENTS.Bronze;
}
