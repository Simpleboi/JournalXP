import { TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  Award,
  Trophy,
  Star,
  Lock,
  Sparkles,
  Target,
  Flame,
  BookOpen,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";
import { storeItems, type StoreItem } from "@/data/shop";
import { useUserData } from "@/context/UserDataContext";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/useToast";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Helper to check if image is a URL/path (not an emoji)
const isImageUrl = (image: string) =>
  image.startsWith("http") || image.startsWith("/") || image.startsWith("data:");

// Rarity configurations
const RARITY_CONFIG = {
  common: {
    glow: "",
    border: "border-gray-200",
    bg: "bg-gray-50",
  },
  rare: {
    glow: "shadow-[0_0_15px_rgba(59,130,246,0.3)]",
    border: "border-blue-300",
    bg: "bg-blue-50",
  },
  epic: {
    glow: "shadow-[0_0_20px_rgba(168,85,247,0.4)]",
    border: "border-purple-300",
    bg: "bg-purple-50",
  },
  legendary: {
    glow: "shadow-[0_0_25px_rgba(251,191,36,0.5)]",
    border: "border-amber-400",
    bg: "bg-gradient-to-br from-amber-50 to-yellow-50",
  },
};

// Shimmer animation for legendary items
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

// Milestone card component
function MilestoneCard({
  icon: Icon,
  title,
  current,
  target,
  color,
  completed,
}: {
  icon: React.ElementType;
  title: string;
  current: number;
  target: number;
  color: string;
  completed: boolean;
}) {
  const progress = Math.min((current / target) * 100, 100);

  return (
    <motion.div
      className={`relative p-4 rounded-xl border ${
        completed
          ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
          : "bg-white border-gray-200"
      }`}
      whileHover={{ y: -2 }}
    >
      {completed && (
        <div className="absolute top-2 right-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        </div>
      )}
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h4 className="font-medium text-gray-800">{title}</h4>
          <p className="text-xs text-gray-500">
            {current.toLocaleString()} / {target.toLocaleString()}
          </p>
        </div>
      </div>
      <Progress value={progress} className="h-2" />
    </motion.div>
  );
}

// Trophy badge component
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
            <div
              className={`relative w-14 h-14 md:w-16 md:h-16 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                isOwned
                  ? `${config.border} ${config.bg} ${config.glow}`
                  : "border-gray-300 bg-gray-100"
              } ${isFeatured ? "ring-2 ring-yellow-400 ring-offset-2" : ""}`}
            >
              {isOwned && rarity === "legendary" && <LegendaryShimmer />}

              {isOwned ? (
                isImageUrl(item.image) ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-md relative z-10"
                  />
                ) : (
                  <span className="text-2xl md:text-3xl relative z-10">
                    {item.image}
                  </span>
                )
              ) : (
                <div className="relative">
                  {isImageUrl(item.image) ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md grayscale opacity-30 blur-[1px]"
                    />
                  ) : (
                    <span className="text-2xl md:text-3xl grayscale opacity-30 blur-[1px]">
                      {item.image}
                    </span>
                  )}
                  {isLocked && (
                    <Lock className="absolute inset-0 m-auto h-5 w-5 text-gray-400" />
                  )}
                </div>
              )}

              {isFeatured && (
                <motion.div
                  className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-0.5 shadow-md"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <Star className="h-2.5 w-2.5 text-white fill-white" />
                </motion.div>
              )}

              {isOwned && !isFeatured && (
                <div className="absolute inset-0 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-[10px] font-medium">
                    Equip
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[180px]">
          <div className="text-center">
            <p className="font-semibold text-sm">{item.name}</p>
            <p className="text-xs text-gray-500">{item.description}</p>
            {!isOwned && (
              <p className="text-xs mt-1">
                {isLocked ? (
                  <span className="text-red-500">
                    Level {item.requiredLevel}
                  </span>
                ) : (
                  <span className="text-green-600">{item.price} coins</span>
                )}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Trophy shelf component
function TrophyShelf({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative mb-6">
      <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 pl-1">
        {title}
      </div>
      <div className="relative">
        <div className="bg-gradient-to-b from-slate-50 to-slate-100 rounded-xl p-3 border border-slate-200">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-t-xl" />
          <div className="relative z-10">{children}</div>
          <div className="absolute -bottom-1.5 left-2 right-2 h-2 bg-gradient-to-b from-slate-300 to-slate-400 rounded-b-lg" />
        </div>
        <div className="absolute -bottom-3 left-4 right-4 h-3 bg-black/10 blur-md rounded-full" />
      </div>
    </div>
  );
}

export const ProfileAchievements = () => {
  const { userData, refreshUserData } = useUserData();
  const { user } = useAuth();
  const { showToast } = useToast();

  const allBadges = storeItems.badges || [];
  const ownedBadges =
    allBadges.filter((b) => userData.inventory?.includes(b.id)) || [];

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
          ? "Badge now displayed on your profile"
          : "Badge removed from profile",
      });
    } catch (err: any) {
      showToast({
        title: "Error",
        description: err.message || "Failed to update badge",
        variant: "destructive",
      });
    }
  };

  // Milestone definitions
  const milestones = [
    {
      icon: BookOpen,
      title: "Journal Master",
      current: userData.journalStats?.totalJournalEntries || 0,
      target: 100,
      color: "bg-blue-500",
    },
    {
      icon: Flame,
      title: "Streak Champion",
      current: userData.bestStreak || 0,
      target: 30,
      color: "bg-orange-500",
    },
    {
      icon: Target,
      title: "Habit Hero",
      current: userData.habitStats?.totalHabitCompletions || 0,
      target: 500,
      color: "bg-green-500",
    },
    {
      icon: CheckCircle2,
      title: "Task Terminator",
      current: userData.taskStats?.totalTasksCompleted || 0,
      target: 200,
      color: "bg-purple-500",
    },
    {
      icon: Sparkles,
      title: "XP Collector",
      current: userData.totalXP || 0,
      target: 10000,
      color: "bg-amber-500",
    },
    {
      icon: Trophy,
      title: "Level Legend",
      current: userData.level || 1,
      target: 50,
      color: "bg-indigo-500",
    },
  ];

  return (
    <TabsContent value="achievements" className="space-y-6">
      {/* Featured Badge Display */}
      {userData.featuredBadge && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              <span className="font-medium text-gray-700">Featured Badge</span>
            </div>
            {(() => {
              const badge = allBadges.find(
                (b) => b.id === userData.featuredBadge
              );
              if (!badge) return null;
              return (
                <div className="flex items-center gap-2 bg-white/80 rounded-lg px-3 py-2">
                  {isImageUrl(badge.image) ? (
                    <img
                      src={badge.image}
                      alt={badge.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                  ) : (
                    <span className="text-2xl">{badge.image}</span>
                  )}
                  <span className="font-medium">{badge.name}</span>
                </div>
              );
            })()}
          </div>
        </motion.div>
      )}

      {/* Milestones Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-5 w-5 text-amber-500" />
          <h3 className="text-lg font-semibold text-gray-800">Milestones</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {milestones.map((milestone, index) => (
            <MilestoneCard
              key={index}
              icon={milestone.icon}
              title={milestone.title}
              current={milestone.current}
              target={milestone.target}
              color={milestone.color}
              completed={milestone.current >= milestone.target}
            />
          ))}
        </div>
      </div>

      {/* Badge Trophy Case */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-500" />
            <h3 className="text-lg font-semibold text-gray-800">
              Badge Collection
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Progress
              value={(ownedBadges.length / allBadges.length) * 100}
              className="w-24 h-2"
            />
            <span className="text-sm text-gray-500">
              {ownedBadges.length}/{allBadges.length}
            </span>
          </div>
        </div>

        {/* Trophy shelves by rarity */}
        <div className="space-y-4">
          {badgesByRarity.legendary.length > 0 && (
            <TrophyShelf title="Legendary">
              <div className="flex flex-wrap gap-3">
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

          {badgesByRarity.epic.length > 0 && (
            <TrophyShelf title="Epic">
              <div className="flex flex-wrap gap-3">
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

          {badgesByRarity.rare.length > 0 && (
            <TrophyShelf title="Rare">
              <div className="flex flex-wrap gap-3">
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

          {badgesByRarity.common.length > 0 && (
            <TrophyShelf title="Common">
              <div className="flex flex-wrap gap-3">
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

        <div className="mt-4 text-center">
          <Button asChild variant="outline" size="sm">
            <Link to="/store">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Get More Badges
            </Link>
          </Button>
        </div>
      </div>
    </TabsContent>
  );
};
