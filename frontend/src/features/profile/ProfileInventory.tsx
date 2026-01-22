import { TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Award,
  Palette,
  Zap,
  Tag,
  Star,
  Check,
  Lock,
  Sparkles,
} from "lucide-react";
import { storeItems, type StoreItem } from "@/data/shop";
import { useUserData } from "@/context/UserDataContext";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/useToast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Rarity configurations for glow effects
const RARITY_CONFIG = {
  common: {
    glow: "",
    border: "border-gray-200",
    bg: "bg-gray-50",
    text: "text-gray-600",
    badge: "bg-gray-100 text-gray-700",
  },
  rare: {
    glow: "shadow-[0_0_15px_rgba(59,130,246,0.3)]",
    border: "border-blue-300",
    bg: "bg-blue-50",
    text: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
  },
  epic: {
    glow: "shadow-[0_0_20px_rgba(168,85,247,0.4)]",
    border: "border-purple-300",
    bg: "bg-purple-50",
    text: "text-purple-600",
    badge: "bg-purple-100 text-purple-700",
  },
  legendary: {
    glow: "shadow-[0_0_25px_rgba(251,191,36,0.5)]",
    border: "border-amber-400",
    bg: "bg-gradient-to-br from-amber-50 to-yellow-50",
    text: "text-amber-600",
    badge: "bg-amber-100 text-amber-700",
  },
};

// Shimmer animation component for legendary items
function LegendaryShimmer() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.3) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
        }}
        animate={{
          backgroundPosition: ["200% 0%", "-200% 0%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </motion.div>
  );
}

// Trophy shelf display component
function TrophyShelf({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="relative">
      {/* Shelf title */}
      <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 pl-2">
        {title}
      </div>

      {/* 3D Shelf effect */}
      <div className="relative">
        {/* Back panel with depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-100 to-slate-200 rounded-xl transform-gpu" />

        {/* Shelf surface */}
        <div className="relative bg-gradient-to-b from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
          {/* Top edge highlight */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-t-xl" />

          {/* Items container */}
          <div className="relative z-10">{children}</div>

          {/* Bottom shelf edge (3D effect) */}
          <div className="absolute -bottom-2 left-2 right-2 h-3 bg-gradient-to-b from-slate-300 to-slate-400 rounded-b-lg transform perspective-1000 rotateX-12" />
        </div>

        {/* Shelf shadow */}
        <div className="absolute -bottom-4 left-4 right-4 h-4 bg-black/10 blur-md rounded-full" />
      </div>
    </div>
  );
}

// Badge display item for trophy case
function TrophyBadge({
  item,
  isOwned,
  isFeatured,
  onQuickEquip,
  userLevel,
}: {
  item: StoreItem;
  isOwned: boolean;
  isFeatured: boolean;
  onQuickEquip: () => void;
  userLevel: number;
}) {
  const rarity = item.rarity || "common";
  const config = RARITY_CONFIG[rarity];
  const isLocked = !isOwned && (item.requiredLevel || 0) > userLevel;
  const canPurchase = !isOwned && (item.requiredLevel || 0) <= userLevel;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className={`relative group cursor-pointer ${
              isOwned ? "" : "opacity-60"
            }`}
            whileHover={isOwned ? { scale: 1.1, y: -5 } : { scale: 1.02 }}
            whileTap={isOwned ? { scale: 0.95 } : {}}
            onClick={isOwned ? onQuickEquip : undefined}
          >
            {/* Badge container */}
            <div
              className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                isOwned
                  ? `${config.border} ${config.bg} ${config.glow}`
                  : "border-gray-300 bg-gray-100"
              } ${isFeatured ? "ring-2 ring-yellow-400 ring-offset-2" : ""}`}
            >
              {/* Legendary shimmer effect */}
              {isOwned && rarity === "legendary" && <LegendaryShimmer />}

              {/* Badge emoji or silhouette */}
              {isOwned ? (
                <span className="text-3xl md:text-4xl relative z-10">
                  {item.image}
                </span>
              ) : (
                <div className="relative">
                  <span className="text-3xl md:text-4xl grayscale opacity-30 blur-[1px]">
                    {item.image}
                  </span>
                  {isLocked && (
                    <Lock className="absolute inset-0 m-auto h-6 w-6 text-gray-400" />
                  )}
                </div>
              )}

              {/* Featured indicator */}
              {isFeatured && (
                <motion.div
                  className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1 shadow-md"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  <Star className="h-3 w-3 text-white fill-white" />
                </motion.div>
              )}

              {/* Quick equip overlay */}
              {isOwned && !isFeatured && (
                <div className="absolute inset-0 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-medium">Equip</span>
                </div>
              )}
            </div>

            {/* Rarity indicator dot */}
            <div
              className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${
                isOwned
                  ? rarity === "legendary"
                    ? "bg-amber-400"
                    : rarity === "epic"
                    ? "bg-purple-400"
                    : rarity === "rare"
                    ? "bg-blue-400"
                    : "bg-gray-400"
                  : "bg-gray-300"
              }`}
            />
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[200px]">
          <div className="text-center">
            <p className="font-semibold">{item.name}</p>
            <p className="text-xs text-gray-500">{item.description}</p>
            {!isOwned && (
              <p className="text-xs mt-1">
                {isLocked ? (
                  <span className="text-red-500">
                    Requires Level {item.requiredLevel}
                  </span>
                ) : (
                  <span className="text-green-600">
                    Available - {item.price} coins
                  </span>
                )}
              </p>
            )}
            {isOwned && !isFeatured && (
              <p className="text-xs text-indigo-600 mt-1">Click to equip</p>
            )}
            {isFeatured && (
              <p className="text-xs text-yellow-600 mt-1">Currently featured</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Equipped items section
function EquippedSection({
  featuredBadge,
  onUnequipBadge,
}: {
  featuredBadge: StoreItem | null;
  onUnequipBadge: () => void;
}) {
  if (!featuredBadge) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 mb-6 border border-indigo-100"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-indigo-500" />
        <h3 className="font-semibold text-gray-800">Currently Equipped</h3>
      </div>

      <div className="flex flex-wrap gap-6">
        {/* Featured Badge */}
        <div className="flex items-center gap-3 bg-white/80 rounded-lg px-4 py-3 shadow-sm">
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              RARITY_CONFIG[featuredBadge.rarity || "common"].bg
            } ${RARITY_CONFIG[featuredBadge.rarity || "common"].border} border`}
          >
            <span className="text-2xl">{featuredBadge.image}</span>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Featured Badge
            </p>
            <p className="font-medium text-gray-800">{featuredBadge.name}</p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="ml-2 h-8 w-8 p-0"
            onClick={onUnequipBadge}
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// Collection progress component
function CollectionProgress({
  owned,
  total,
  label,
}: {
  owned: number;
  total: number;
  label: string;
}) {
  const percentage = total > 0 ? (owned / total) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <Progress value={percentage} className="h-2" />
      </div>
      <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
        {owned}/{total} {label}
      </span>
    </div>
  );
}

export const ProfileInventory = () => {
  const { userData, refreshUserData } = useUserData();
  const { user } = useAuth();
  const { showToast } = useToast();

  // Get all badges from the store
  const allBadges = storeItems.badges || [];
  const allThemes = storeItems.themes || [];

  // Get all items from the store as a flat array
  const allStoreItems: StoreItem[] = Object.values(storeItems).flat();

  // Filter to only owned items
  const ownedItems = allStoreItems.filter((item) =>
    userData.inventory?.includes(item.id)
  );

  // Group owned items by category
  const ownedBadges = ownedItems.filter((item) => item.category === "badges");
  const ownedThemes = ownedItems.filter((item) => item.category === "themes");
  const ownedAvatars = ownedItems.filter((item) => item.category === "avatars");
  const ownedPowerUps = ownedItems.filter(
    (item) => item.category === "powerUps"
  );

  // Get featured items
  const featuredBadge = userData.featuredBadge
    ? allBadges.find((b) => b.id === userData.featuredBadge) || null
    : null;

  // Group badges by rarity for trophy display
  const badgesByRarity = {
    legendary: allBadges.filter((b) => b.rarity === "legendary"),
    epic: allBadges.filter((b) => b.rarity === "epic"),
    rare: allBadges.filter((b) => b.rarity === "rare"),
    common: allBadges.filter((b) => b.rarity === "common"),
  };

  const handleSetFeaturedBadge = async (badgeId: string) => {
    if (!user?.uid) return;

    try {
      const newFeaturedBadge =
        userData.featuredBadge === badgeId ? null : badgeId;

      await updateDoc(doc(db, "users", user.uid), {
        featuredBadge: newFeaturedBadge,
      });

      await refreshUserData();

      showToast({
        title: newFeaturedBadge ? "Badge Equipped!" : "Badge Unequipped",
        description: newFeaturedBadge
          ? "Your badge is now displayed on your profile"
          : "Featured badge removed from profile",
      });
    } catch (err: any) {
      showToast({
        title: "Error",
        description: err.message || "Failed to update featured badge",
        variant: "destructive",
      });
    }
  };


  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "badges":
        return <Award className="h-5 w-5" />;
      case "themes":
        return <Palette className="h-5 w-5" />;
      case "avatars":
        return <Tag className="h-5 w-5" />;
      case "powerUps":
        return <Zap className="h-5 w-5" />;
      default:
        return <ShoppingBag className="h-5 w-5" />;
    }
  };

  const renderThemeCard = (item: StoreItem) => {
    const isOwned = userData.inventory?.includes(item.id);

    return (
      <motion.div
        key={item.id}
        className={`relative group rounded-xl overflow-hidden transition-all ${
          !isOwned ? "opacity-50" : ""
        }`}
        whileHover={isOwned ? { scale: 1.02 } : {}}
      >
        <div className="aspect-[3/1] relative">
          <div className="w-full h-full" style={{ background: item.image }} />

          {/* Owned indicator */}
          {isOwned && (
            <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
              <Check className="h-3 w-3 text-white" />
            </div>
          )}

          {/* Locked overlay */}
          {!isOwned && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Lock className="h-6 w-6 text-white/70" />
            </div>
          )}
        </div>
        <div className="p-3 bg-white">
          <h4 className="font-medium text-sm truncate">{item.name}</h4>
          <p className="text-xs text-gray-500 truncate">{item.description}</p>
        </div>
      </motion.div>
    );
  };

  const renderGenericCard = (item: StoreItem) => (
    <div
      key={item.id}
      className="overflow-hidden rounded-xl bg-white shadow-sm border"
    >
      <div className="aspect-video relative overflow-hidden bg-gray-100">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-gray-600">{item.description}</p>
      </div>
    </div>
  );

  return (
    <TabsContent value="inventory" className="space-y-6">
      {/* Equipped Section */}
      <EquippedSection
        featuredBadge={featuredBadge}
        onUnequipBadge={() =>
          userData.featuredBadge && handleSetFeaturedBadge(userData.featuredBadge)
        }
      />

      {/* Badge Trophy Case */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {getCategoryIcon("badges")}
            <h3 className="text-lg font-semibold">Badge Collection</h3>
          </div>
          <div className="flex items-center gap-4">
            <CollectionProgress
              owned={ownedBadges.length}
              total={allBadges.length}
              label="collected"
            />
          </div>
        </div>

        {/* Trophy shelves by rarity */}
        <div className="space-y-8">
          {/* Legendary Shelf */}
          {badgesByRarity.legendary.length > 0 && (
            <TrophyShelf title="Legendary">
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {badgesByRarity.legendary.map((badge) => (
                  <TrophyBadge
                    key={badge.id}
                    item={badge}
                    isOwned={userData.inventory?.includes(badge.id) || false}
                    isFeatured={userData.featuredBadge === badge.id}
                    onQuickEquip={() => handleSetFeaturedBadge(badge.id)}
                    userLevel={userData.level || 1}
                  />
                ))}
              </div>
            </TrophyShelf>
          )}

          {/* Epic Shelf */}
          {badgesByRarity.epic.length > 0 && (
            <TrophyShelf title="Epic">
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {badgesByRarity.epic.map((badge) => (
                  <TrophyBadge
                    key={badge.id}
                    item={badge}
                    isOwned={userData.inventory?.includes(badge.id) || false}
                    isFeatured={userData.featuredBadge === badge.id}
                    onQuickEquip={() => handleSetFeaturedBadge(badge.id)}
                    userLevel={userData.level || 1}
                  />
                ))}
              </div>
            </TrophyShelf>
          )}

          {/* Rare Shelf */}
          {badgesByRarity.rare.length > 0 && (
            <TrophyShelf title="Rare">
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {badgesByRarity.rare.map((badge) => (
                  <TrophyBadge
                    key={badge.id}
                    item={badge}
                    isOwned={userData.inventory?.includes(badge.id) || false}
                    isFeatured={userData.featuredBadge === badge.id}
                    onQuickEquip={() => handleSetFeaturedBadge(badge.id)}
                    userLevel={userData.level || 1}
                  />
                ))}
              </div>
            </TrophyShelf>
          )}

          {/* Common Shelf */}
          {badgesByRarity.common.length > 0 && (
            <TrophyShelf title="Common">
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {badgesByRarity.common.map((badge) => (
                  <TrophyBadge
                    key={badge.id}
                    item={badge}
                    isOwned={userData.inventory?.includes(badge.id) || false}
                    isFeatured={userData.featuredBadge === badge.id}
                    onQuickEquip={() => handleSetFeaturedBadge(badge.id)}
                    userLevel={userData.level || 1}
                  />
                ))}
              </div>
            </TrophyShelf>
          )}
        </div>

        {/* Browse store link */}
        <div className="mt-6 text-center">
          <Button asChild variant="outline" size="sm">
            <Link to="/store">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Browse Store for More Badges
            </Link>
          </Button>
        </div>
      </div>

      {/* Themes Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {getCategoryIcon("themes")}
            <h3 className="text-lg font-semibold">Theme Collection</h3>
          </div>
          <CollectionProgress
            owned={ownedThemes.length}
            total={allThemes.length}
            label="owned"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allThemes.map(renderThemeCard)}
        </div>

        {ownedThemes.length === 0 && (
          <div className="text-center py-6">
            <Button asChild variant="outline" size="sm">
              <Link to="/store">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Browse Themes in Store
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Avatars Section (if any exist) */}
      {ownedAvatars.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            {getCategoryIcon("avatars")}
            <h3 className="text-lg font-semibold">Your Avatars</h3>
            <Badge variant="outline" className="ml-auto">
              {ownedAvatars.length} owned
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ownedAvatars.map(renderGenericCard)}
          </div>
        </div>
      )}

      {/* Power-Ups Section (if any exist) */}
      {ownedPowerUps.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            {getCategoryIcon("powerUps")}
            <h3 className="text-lg font-semibold">Your Power-Ups</h3>
            <Badge variant="outline" className="ml-auto">
              {ownedPowerUps.length} owned
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ownedPowerUps.map(renderGenericCard)}
          </div>
        </div>
      )}
    </TabsContent>
  );
};
