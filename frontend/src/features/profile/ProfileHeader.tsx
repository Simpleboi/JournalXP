import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
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
} from "@/data/profileBanners";

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

  // Find the featured badge from store items
  const featuredBadge = userData.featuredBadge
    ? storeItems.badges?.find((badge) => badge.id === userData.featuredBadge)
    : null;

  // Get rank style for theming
  const rankStyle = getRankStyleFromRank(userData.rank);

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
      await uploadBytes(storageRef, file);
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
      case "rare":
        return "from-blue-100 to-blue-200 border-blue-300";
      case "epic":
        return "from-purple-100 to-purple-200 border-purple-300";
      case "legendary":
        return "from-amber-100 to-amber-200 border-amber-300";
      default:
        return "from-gray-100 to-gray-200 border-gray-300";
    }
  };

  const getRarityTextColor = (rarity?: string): string => {
    switch (rarity) {
      case "common":
        return "text-gray-700";
      case "rare":
        return "text-blue-700";
      case "epic":
        return "text-purple-700";
      case "legendary":
        return "text-amber-700";
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl shadow-xl overflow-hidden mb-8"
    >
      {/* Banner Section */}
      <div className="relative h-40 md:h-52 group">
        {/* Banner Image/Gradient */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{
            background: isGradientBanner
              ? bannerImage
              : bannerImage
              ? `url(${bannerImage})`
              : defaultBanner,
            backgroundSize: "cover",
            backgroundPosition: "center",
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

      {/* Profile Content - Glass morphism card */}
      <div className="relative bg-white/95 backdrop-blur-md px-6 pb-6">
        {/* Profile picture - positioned to overlap banner */}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 -mt-16 md:-mt-20">
          {/* Avatar with rank frame */}
          <div className="relative">
            <RankFrame rank={userData.rank}>
              <img
                src={avatarUrl}
                alt={userData.username}
                className="w-full h-full object-cover"
              />
            </RankFrame>

            {/* Camera icon overlay for upload */}
            <label className="absolute inset-0 flex items-center justify-center cursor-pointer group">
              <div className="absolute inset-1 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {uploading ? (
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                ) : (
                  <Camera className="h-8 w-8 text-white" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>

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

            <p className="text-gray-500 mt-1">
              @{userData.username || "no username yet"}
            </p>

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

          {/* Featured Badge - Right section */}
          {featuredBadge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`hidden md:flex flex-col items-center p-4 rounded-xl bg-gradient-to-br ${getRarityColor(
                featuredBadge.rarity
              )} border-2 shadow-sm min-w-[120px]`}
            >
              <span className="text-4xl mb-2">{featuredBadge.image}</span>
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
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
