import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useUserData } from "@/context/UserDataContext";
import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db, storage } from "@/lib/firebase";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { useState, useRef, useEffect } from "react";
import {
  Camera,
  Loader2,
  ImageIcon,
  Pencil,
  Check,
  X,
  Smile,
  Sparkles,
  ChevronDown,
  Copy,
  CheckCheck,
} from "lucide-react";
import { triggerHaptic } from "./profileThemeUtils";
import { useToast } from "@/components/ui/use-toast";
import { formatJoinDate } from "@shared/utils/date";
import { storeItems } from "@/data/shop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PROFILE_BANNERS,
  GRADIENT_BANNERS,
  MOOD_OPTIONS,
  getRankStyleFromRank,
  getGlassGradientFromRank,
} from "@/data/profileBanners";

// Helper to check if image is a URL/path (not an emoji)
const isImageUrl = (image: string) =>
  image.startsWith("http") || image.startsWith("/") || image.startsWith("data:");

// Particle effect component for high-tier ranks
function RankParticles({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color }}
          initial={{
            x: "50%",
            y: "50%",
            scale: 0,
            opacity: 0,
          }}
          animate={{
            x: `${50 + Math.cos((i * Math.PI * 2) / 8) * 60}%`,
            y: `${50 + Math.sin((i * Math.PI * 2) / 8) * 60}%`,
            scale: [0, 1, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.15,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// Badge frame configuration based on rarity
interface BadgeFrameConfig {
  borderGradient: string;
  glowColor: string;
  shadowClass: string;
  hasShimmer: boolean;
  hasParticles: boolean;
  borderWidth: number;
  particleColor?: string;
}

const BADGE_FRAME_CONFIG: Record<string, BadgeFrameConfig> = {
  common: {
    borderGradient: "linear-gradient(135deg, #9ca3af 0%, #6b7280 50%, #9ca3af 100%)",
    glowColor: "rgba(156, 163, 175, 0.3)",
    shadowClass: "shadow-md",
    hasShimmer: false,
    hasParticles: false,
    borderWidth: 3,
  },
  uncommon: {
    borderGradient: "linear-gradient(135deg, #4ade80 0%, #22c55e 50%, #16a34a 100%)",
    glowColor: "rgba(34, 197, 94, 0.4)",
    shadowClass: "shadow-lg shadow-green-200",
    hasShimmer: false,
    hasParticles: false,
    borderWidth: 3,
  },
  rare: {
    borderGradient: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)",
    glowColor: "rgba(59, 130, 246, 0.5)",
    shadowClass: "shadow-lg shadow-blue-200",
    hasShimmer: true,
    hasParticles: false,
    borderWidth: 3,
  },
  epic: {
    borderGradient: "linear-gradient(135deg, #c084fc 0%, #a855f7 50%, #9333ea 100%)",
    glowColor: "rgba(168, 85, 247, 0.6)",
    shadowClass: "shadow-xl shadow-purple-300",
    hasShimmer: true,
    hasParticles: false,
    borderWidth: 4,
  },
  legendary: {
    borderGradient: "linear-gradient(135deg, #fde047 0%, #facc15 25%, #f59e0b 50%, #facc15 75%, #fde047 100%)",
    glowColor: "rgba(250, 204, 21, 0.7)",
    shadowClass: "shadow-2xl shadow-amber-300",
    hasShimmer: true,
    hasParticles: true,
    borderWidth: 4,
    particleColor: "#fbbf24",
  },
  mythic: {
    borderGradient: "linear-gradient(135deg, #f87171 0%, #dc2626 25%, #b91c1c 50%, #dc2626 75%, #f87171 100%)",
    glowColor: "rgba(220, 38, 38, 0.8)",
    shadowClass: "shadow-2xl shadow-red-400",
    hasShimmer: true,
    hasParticles: true,
    borderWidth: 5,
    particleColor: "#ef4444",
  },
};

// Badge particles for legendary rarity
function BadgeParticles({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: color,
            left: `${15 + (i % 3) * 35}%`,
            top: `${20 + Math.floor(i / 3) * 60}%`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2 + (i * 0.3),
            delay: i * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Rarity-based badge frame component
function BadgeFrame({
  rarity = "common",
  children,
}: {
  rarity?: string;
  children: React.ReactNode;
}) {
  const config = BADGE_FRAME_CONFIG[rarity as keyof typeof BADGE_FRAME_CONFIG] || BADGE_FRAME_CONFIG.common;

  return (
    <motion.div
      className={`relative rounded-xl ${config.shadowClass}`}
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Animated glow ring */}
      <motion.div
        className="absolute -inset-[3px] rounded-xl"
        style={{
          background: config.borderGradient,
          padding: config.borderWidth,
        }}
        animate={
          rarity === "mythic" || rarity === "legendary" || rarity === "epic"
            ? {
                boxShadow: [
                  `0 0 15px ${config.glowColor}`,
                  `0 0 30px ${config.glowColor}`,
                  `0 0 15px ${config.glowColor}`,
                ],
              }
            : {}
        }
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Inner content container */}
      <div className="relative rounded-xl overflow-hidden bg-white">
        {children}
      </div>

      {/* Shimmer effect for rare+ */}
      {config.hasShimmer && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.5) 45%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.5) 55%, transparent 60%)",
            backgroundSize: "200% 200%",
          }}
          animate={{
            backgroundPosition: ["-100% -100%", "200% 200%"],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
        />
      )}

      {/* Particle effects for legendary */}
      {config.hasParticles && config.particleColor && (
        <BadgeParticles color={config.particleColor} />
      )}
    </motion.div>
  );
}

// Animated rank frame component
function RankFrame({
  rank,
  children,
  size = "large",
}: {
  rank: string;
  children: React.ReactNode;
  size?: "large" | "medium";
}) {
  const rankStyle = getRankStyleFromRank(rank);
  const sizeClasses = size === "large" ? "w-28 h-28 md:w-36 md:h-36" : "w-20 h-20";

  const glowStyles: Record<string, string> = {
    none: "",
    subtle: "shadow-lg",
    medium: "shadow-xl",
    strong: "shadow-2xl",
    intense: "shadow-2xl",
  };

  return (
    <motion.div
      className={`relative ${sizeClasses} rounded-full`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Animated glow ring */}
      <motion.div
        className={`absolute -inset-1 rounded-full ${glowStyles[rankStyle.glowIntensity]}`}
        style={{
          background: rankStyle.frameGradient,
          padding: rankStyle.borderWidth,
        }}
        animate={
          rankStyle.glowIntensity === "intense"
            ? {
                boxShadow: [
                  `0 0 20px ${rankStyle.glowColor}`,
                  `0 0 40px ${rankStyle.glowColor}`,
                  `0 0 20px ${rankStyle.glowColor}`,
                ],
              }
            : {}
        }
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Inner content */}
      <div
        className="absolute inset-1 rounded-full overflow-hidden bg-white"
        style={{ border: `${rankStyle.borderWidth}px solid transparent` }}
      >
        {children}
      </div>

      {/* Particle effects for high ranks */}
      {rankStyle.particleEffect && <RankParticles color={rankStyle.glowColor} />}

      {/* Shimmer effect for Platinum+ */}
      {["Platinum", "Diamond", "Mythic", "Legend", "Ascended"].includes(
        rank.split(" ")[0]
      ) && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)",
            backgroundSize: "200% 200%",
          }}
          animate={{
            backgroundPosition: ["0% 0%", "200% 200%"],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      )}
    </motion.div>
  );
}

export const ProfileHeader = () => {
  const { userData, refreshUserData } = useUserData();
  const { user } = useAuth();
  const { toast } = useToast();

  // State
  const [uploading, setUploading] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState(userData.bio || "");
  const [bannerDialogOpen, setBannerDialogOpen] = useState(false);
  const [moodPopoverOpen, setMoodPopoverOpen] = useState(false);

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const profilePicInputRef = useRef<HTMLInputElement>(null);

  // Find the featured badge from store items
  const featuredBadge = userData.featuredBadge
    ? storeItems.badges?.find((badge) => badge.id === userData.featuredBadge)
    : null;

  // Get rank style for theming
  const rankStyle = getRankStyleFromRank(userData.rank);
  const glassGradient = getGlassGradientFromRank(userData.rank);

  // Profile picture upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      await uploadBytes(storageRef, file, { contentType: file.type });
      const downloadURL = await getDownloadURL(storageRef);

      await updateDoc(doc(db, "users", user.uid), {
        profilePicture: downloadURL,
      });

      await refreshUserData();

      toast({
        title: "Profile Picture Updated!",
        description: "Your profile picture has been successfully updated",
      });
    } catch (err: any) {
      console.error("Image upload failed:", err);
      toast({
        title: "Upload Failed",
        description: err.message || "Failed to upload profile picture",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // Banner upload handler
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setUploadingBanner(true);

    try {
      const storageRef = ref(storage, `bannerImages/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await updateDoc(doc(db, "users", user.uid), {
        bannerImage: downloadURL,
      });

      await refreshUserData();
      setBannerDialogOpen(false);

      toast({
        title: "Banner Updated!",
        description: "Your profile banner has been updated",
      });
    } catch (err: any) {
      console.error("Banner upload failed:", err);
      toast({
        title: "Upload Failed",
        description: err.message || "Failed to upload banner",
        variant: "destructive",
      });
    } finally {
      setUploadingBanner(false);
    }
  };

  // Select preset banner
  const selectPresetBanner = async (bannerId: string, isGradient = false) => {
    if (!user) return;

    try {
      let bannerValue: string;

      if (isGradient) {
        const gradient = GRADIENT_BANNERS.find((b) => b.id === bannerId);
        bannerValue = gradient?.gradient || "";
      } else {
        const banner = PROFILE_BANNERS.find((b) => b.id === bannerId);
        bannerValue = banner?.url || "";
      }

      await updateDoc(doc(db, "users", user.uid), {
        bannerImage: bannerValue,
      });

      await refreshUserData();
      setBannerDialogOpen(false);

      toast({
        title: "Banner Updated!",
        description: "Your profile banner has been updated",
      });
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message || "Failed to update banner",
        variant: "destructive",
      });
    }
  };

  // Save bio
  const handleSaveBio = async () => {
    if (!user) return;

    try {
      await updateDoc(doc(db, "users", user.uid), {
        bio: bio.slice(0, 160),
      });

      await refreshUserData();
      setIsEditingBio(false);

      toast({
        title: "Bio Updated!",
        description: "Your bio has been saved",
      });
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message || "Failed to update bio",
        variant: "destructive",
      });
    }
  };

  // Update mood
  const handleSelectMood = async (emoji: string, label: string) => {
    if (!user) return;

    try {
      await updateDoc(doc(db, "users", user.uid), {
        currentMood: {
          emoji,
          label,
          updatedAt: new Date().toISOString(),
        },
      });

      await refreshUserData();
      setMoodPopoverOpen(false);

      toast({
        title: `Feeling ${label}!`,
        description: "Your mood has been updated",
      });
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message || "Failed to update mood",
        variant: "destructive",
      });
    }
  };

  const getRarityColor = (rarity?: string): string => {
    switch (rarity) {
      case "common":
        return "from-gray-100 to-gray-200 border-gray-300";
      case "uncommon":
        return "from-green-100 to-green-200 border-green-300";
      case "rare":
        return "from-blue-100 to-blue-200 border-blue-300";
      case "epic":
        return "from-purple-100 to-purple-200 border-purple-300";
      case "legendary":
        return "from-amber-100 to-amber-200 border-amber-300";
      case "mythic":
        return "from-red-100 to-rose-200 border-red-400";
      default:
        return "from-gray-100 to-gray-200 border-gray-300";
    }
  };

  const getRarityTextColor = (rarity?: string): string => {
    switch (rarity) {
      case "common":
        return "text-gray-700";
      case "uncommon":
        return "text-green-700";
      case "rare":
        return "text-blue-700";
      case "epic":
        return "text-purple-700";
      case "legendary":
        return "text-amber-700";
      case "mythic":
        return "text-red-700";
      default:
        return "text-gray-700";
    }
  };

  // Default avatar
  const avatarUrl =
    userData.profilePicture ||
    `https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?w=400&q=80`;

  // Banner styling
  const bannerImage = userData.bannerImage;
  const isGradientBanner = bannerImage?.startsWith("linear-gradient");
  const defaultBanner =
    "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)";

  // Parallax scroll effect for banner
  const bannerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const bannerY = useTransform(scrollY, [0, 300], [0, 100]);
  const bannerScale = useTransform(scrollY, [0, 300], [1, 1.1]);
  const bannerOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  // Copy username state
  const [usernameCopied, setUsernameCopied] = useState(false);

  const handleCopyUsername = async () => {
    const username = `@${userData.username || ""}`;
    try {
      await navigator.clipboard.writeText(username);
      setUsernameCopied(true);
      triggerHaptic("light");
      setTimeout(() => setUsernameCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy username:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl shadow-xl overflow-hidden mb-8"
    >
      {/* Banner Section with Parallax */}
      <div ref={bannerRef} className="relative h-40 md:h-52 group overflow-hidden">
        {/* Banner Image/Gradient with Parallax */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{
            background: isGradientBanner
              ? bannerImage
              : bannerImage
              ? `url(${bannerImage})`
              : defaultBanner,
            backgroundSize: "cover",
            backgroundPosition: "center",
            y: bannerY,
            scale: bannerScale,
            opacity: bannerOpacity,
          }}
        />

        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Edit banner button */}
        <Dialog open={bannerDialogOpen} onOpenChange={setBannerDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm hover:bg-white"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Edit Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Choose Profile Banner</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="presets" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="presets">Presets</TabsTrigger>
                <TabsTrigger value="gradients">Gradients</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
              </TabsList>

              <TabsContent value="presets" className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {PROFILE_BANNERS.map((banner) => (
                    <button
                      key={banner.id}
                      onClick={() => selectPresetBanner(banner.id)}
                      className="relative aspect-[3/1] rounded-lg overflow-hidden hover:ring-2 hover:ring-indigo-500 transition-all group"
                    >
                      <img
                        src={banner.thumbnail}
                        alt={banner.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {banner.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="gradients" className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {GRADIENT_BANNERS.map((gradient) => (
                    <button
                      key={gradient.id}
                      onClick={() => selectPresetBanner(gradient.id, true)}
                      className="relative aspect-[2/1] rounded-lg overflow-hidden hover:ring-2 hover:ring-indigo-500 transition-all group"
                      style={{ background: gradient.gradient }}
                    >
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium drop-shadow-md">
                          {gradient.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="upload" className="mt-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="hidden"
                  />
                  <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">
                    Upload a custom banner image
                  </p>
                  <Button
                    onClick={() => bannerInputRef.current?.click()}
                    disabled={uploadingBanner}
                  >
                    {uploadingBanner ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Choose File"
                    )}
                  </Button>
                  <p className="text-xs text-gray-400 mt-2">
                    Recommended: 1200x400px, max 10MB
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Profile Content - Glass morphism card with rank-based gradient */}
      <div
        className="relative backdrop-blur-md px-6 pb-6 border-t border-white/20"
        style={{
          background: `${glassGradient}, rgba(255, 255, 255, 0.92)`,
        }}
      >
        {/* Profile layout container */}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6">
          {/* Avatar with rank frame - positioned to overlap banner */}
          <div className="relative -mt-16 md:-mt-20">
            <RankFrame rank={userData.rank}>
              <img
                src={avatarUrl}
                alt={userData.username}
                className="w-full h-full object-cover"
              />
            </RankFrame>

            {/* Camera icon overlay for upload */}
            <input
              ref={profilePicInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
            />
            <div
              className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer group"
              onClick={() => !uploading && profilePicInputRef.current?.click()}
            >
              <div className="absolute inset-1 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {uploading ? (
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                ) : (
                  <Camera className="h-8 w-8 text-white" />
                )}
              </div>
            </div>

            {/* Rank badge */}
            <motion.div
              className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-xs font-bold text-white shadow-lg"
              style={{ background: rankStyle.frameGradient }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              {userData.rank}
            </motion.div>
          </div>

          {/* User Info - Center section */}
          <div className="flex-1 text-center md:text-left pt-2 md:pt-4">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                {userData.username || "User Name"}
              </h2>

              {/* Mood indicator */}
              <Popover open={moodPopoverOpen} onOpenChange={setMoodPopoverOpen}>
                <PopoverTrigger asChild>
                  <button className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-sm">
                    {userData.currentMood ? (
                      <>
                        <span className="text-lg">{userData.currentMood.emoji}</span>
                        <span className="text-gray-600">
                          {userData.currentMood.label}
                        </span>
                      </>
                    ) : (
                      <>
                        <Smile className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-400">Set mood</span>
                      </>
                    )}
                    <ChevronDown className="h-3 w-3 text-gray-400" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    How are you feeling?
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {MOOD_OPTIONS.map((mood) => (
                      <button
                        key={mood.label}
                        onClick={() => handleSelectMood(mood.emoji, mood.label)}
                        className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        title={mood.label}
                      >
                        <span className="text-2xl">{mood.emoji}</span>
                        <span className="text-xs text-gray-500 mt-1 truncate w-full text-center">
                          {mood.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Username with copy button */}
            <div className="flex items-center gap-2 mt-1 justify-center md:justify-start">
              <p className="text-gray-500">
                @{userData.username || "no username yet"}
              </p>
              {userData.username && (
                <button
                  onClick={handleCopyUsername}
                  className="p-1 rounded-md hover:bg-gray-100 transition-colors group relative"
                  title="Copy username"
                >
                  <AnimatePresence mode="wait">
                    {usernameCopied ? (
                      <motion.div
                        key="copied"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                      >
                        <CheckCheck className="h-4 w-4 text-green-500" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                      >
                        <Copy className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {/* Tooltip */}
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {usernameCopied ? "Copied!" : "Copy username"}
                  </span>
                </button>
              )}
            </div>

            {/* Bio section */}
            <div className="mt-3 max-w-lg">
              {isEditingBio ? (
                <div className="flex flex-col gap-2">
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value.slice(0, 160))}
                    placeholder="Write a short bio..."
                    className="resize-none text-sm"
                    rows={2}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {bio.length}/160
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setBio(userData.bio || "");
                          setIsEditingBio(false);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={handleSaveBio}>
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingBio(true)}
                  className="group text-left w-full"
                >
                  {userData.bio ? (
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {userData.bio}
                      <Pencil className="inline-block h-3 w-3 ml-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                  ) : (
                    <p className="text-gray-400 text-sm italic flex items-center gap-1 hover:text-gray-500 transition-colors">
                      <Pencil className="h-3 w-3" />
                      Add a bio...
                    </p>
                  )}
                </button>
              )}
            </div>

            {/* Stats badges */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
              <motion.span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                whileHover={{ scale: 1.05 }}
              >
                Level {userData.level}
              </motion.span>
              <motion.span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="h-3 w-3 mr-1" />
                {userData.streak} Day Streak
              </motion.span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                Member since {formatJoinDate(userData.joinDate)}
              </span>
            </div>
          </div>

          {/* Featured Badge - Right section with rarity frame */}
          {featuredBadge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden md:block"
            >
              <BadgeFrame rarity={featuredBadge.rarity}>
                <div
                  className={`flex flex-col items-center p-4 min-w-[120px] bg-gradient-to-br ${getRarityColor(
                    featuredBadge.rarity
                  )}`}
                >
                  {isImageUrl(featuredBadge.image) ? (
                    <img
                      src={featuredBadge.image}
                      alt={featuredBadge.name}
                      className="w-16 h-16 object-cover rounded-lg mb-2"
                    />
                  ) : (
                    <span className="text-4xl mb-2">{featuredBadge.image}</span>
                  )}
                  <span
                    className={`text-sm font-semibold ${getRarityTextColor(
                      featuredBadge.rarity
                    )} text-center`}
                  >
                    {featuredBadge.name}
                  </span>
                  <span className="text-xs text-gray-500 mt-1 capitalize">
                    {featuredBadge.rarity}
                  </span>
                </div>
              </BadgeFrame>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
