import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { User, Trophy, Paintbrush, BarChart3, RefreshCw } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { ProfileHeader } from "@/features/profile/ProfileHeader";
import { useUserData } from "@/context/UserDataContext";
import { Header } from "@/components/Header";
import { ProfileOverview } from "@/features/profile/ProfileOverview";
import { ProfileAchievements } from "@/features/profile/ProfileAchievements";
import { ProfileCustomize } from "@/features/profile/ProfileCustomize";
import { ProfileAccount } from "@/features/profile/ProfileAccount";
import { SettingsSheet } from "@/features/profile/SettingsSheet";
import { ProfilePageSkeleton } from "@/features/profile/ProfileSkeleton";
import {
  getRankTheme,
  getProfileBackground,
  triggerHaptic,
  staggerContainer,
  staggerItem,
} from "@/features/profile/profileThemeUtils";

// Tab configuration
const TABS = [
  { value: "overview", label: "Overview", icon: BarChart3 },
  { value: "achievements", label: "Achievements", icon: Trophy },
  { value: "customize", label: "Customize", icon: Paintbrush },
  { value: "account", label: "Account", icon: User },
] as const;

type TabValue = (typeof TABS)[number]["value"];

// Swipe threshold for tab navigation
const SWIPE_THRESHOLD = 50;

const ProfilePage = () => {
  const { user } = useAuth();
  const { userData, refreshUserData } = useUserData();
  const [activeTab, setActiveTab] = useState<TabValue>("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get current tab index for swipe navigation
  const currentTabIndex = TABS.findIndex((t) => t.value === activeTab);

  // Handle swipe to change tabs
  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const { offset, velocity } = info;

    // Horizontal swipe for tab navigation
    if (Math.abs(offset.x) > SWIPE_THRESHOLD || Math.abs(velocity.x) > 500) {
      if (offset.x > 0 && currentTabIndex > 0) {
        // Swipe right - go to previous tab
        setActiveTab(TABS[currentTabIndex - 1].value);
        triggerHaptic("light");
      } else if (offset.x < 0 && currentTabIndex < TABS.length - 1) {
        // Swipe left - go to next tab
        setActiveTab(TABS[currentTabIndex + 1].value);
        triggerHaptic("light");
      }
    }
  };

  // Pull to refresh handler
  const handlePullRefresh = useCallback(async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    triggerHaptic("medium");

    try {
      await refreshUserData();
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  }, [isRefreshing, refreshUserData]);

  // Show skeleton while loading
  if (!userData) {
    return <ProfilePageSkeleton />;
  }

  // Get rank-based theming
  const rankTheme = getRankTheme(userData.rank);
  const pageBackground = getProfileBackground(userData.rank);

  return (
    <motion.div
      className={`min-h-screen bg-gradient-to-br ${pageBackground} transition-colors duration-1000`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with Settings Gear */}
      <Header title="My Profile" rightContent={<SettingsSheet />} />

      {/* Pull to Refresh Indicator */}
      <AnimatePresence>
        {isRefreshing && (
          <motion.div
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
          >
            <div className="bg-white rounded-full p-3 shadow-lg">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="h-5 w-5 text-indigo-500" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content with Swipe Gestures */}
      <motion.main
        className="container mx-auto px-4 py-8"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ touchAction: "pan-y" }}
      >
        {/* Profile Header with Staggered Animation */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={staggerItem}>
            <ProfileHeader />
          </motion.div>
        </motion.div>

        {/* Tab Navigation */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value as TabValue);
            triggerHaptic("light");
          }}
          className="w-full"
        >
          {/* Desktop: Tab List */}
          <motion.div variants={staggerItem} initial="hidden" animate="visible">
            <TabsList className="hidden md:grid w-full grid-cols-4 mb-8 bg-white/80 backdrop-blur-sm">
              {TABS.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <IconComponent className="h-4 w-4" /> {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </motion.div>

          {/* Mobile: Dropdown Menu with swipe hint */}
          <div className="md:hidden mb-8">
            <motion.div variants={staggerItem} initial="hidden" animate="visible">
              <Select
                value={activeTab}
                onValueChange={(value) => {
                  setActiveTab(value as TabValue);
                  triggerHaptic("light");
                }}
              >
                <SelectTrigger className="w-full bg-white/80 backdrop-blur-sm">
                  <SelectValue placeholder="Select a section" />
                </SelectTrigger>
                <SelectContent>
                  {TABS.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <SelectItem key={tab.value} value={tab.value}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" /> {tab.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </motion.div>

            {/* Swipe indicator dots */}
            <div className="flex justify-center gap-2 mt-4">
              {TABS.map((tab, index) => (
                <motion.div
                  key={tab.value}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentTabIndex ? "bg-indigo-500" : "bg-gray-300"
                  }`}
                  animate={{
                    scale: index === currentTabIndex ? 1.2 : 1,
                  }}
                />
              ))}
            </div>
            <p className="text-center text-xs text-gray-400 mt-2">
              Swipe left/right to switch tabs
            </p>
          </div>

          {/* Tab Content with Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ProfileOverview />
              <ProfileAchievements />
              <ProfileCustomize />
              <ProfileAccount />
            </motion.div>
          </AnimatePresence>
        </Tabs>

        {/* Pull to refresh touch area */}
        <div
          className="md:hidden fixed top-0 left-0 right-0 h-20 z-40"
          onTouchStart={(e) => {
            const touch = e.touches[0];
            const startY = touch.clientY;

            const handleTouchMove = (moveEvent: TouchEvent) => {
              const currentY = moveEvent.touches[0].clientY;
              if (currentY - startY > 100 && window.scrollY === 0) {
                handlePullRefresh();
                document.removeEventListener("touchmove", handleTouchMove);
              }
            };

            const handleTouchEnd = () => {
              document.removeEventListener("touchmove", handleTouchMove);
              document.removeEventListener("touchend", handleTouchEnd);
            };

            document.addEventListener("touchmove", handleTouchMove);
            document.addEventListener("touchend", handleTouchEnd);
          }}
        />
      </motion.main>

      {/* Rank-based decorative particles for high-tier ranks */}
      {rankTheme.hasParticles && rankTheme.particleColor && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                backgroundColor: rankTheme.particleColor,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100],
                opacity: [0, 0.6, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ProfilePage;
