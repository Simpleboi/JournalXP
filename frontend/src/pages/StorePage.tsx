import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Star, Palette, Award, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/useToast";
import { storeItems, type StoreItem } from "@/data/shop";
import { useUserData } from "@/context/UserDataContext";
import { useAuth } from "@/context/AuthContext";
import { purchaseItem } from "@/services/userService";
import { useTheme } from "@/context/ThemeContext";
import type { ThemeId } from "@/types/theme";
import { Header } from "@/components/Header";

// Helper to check if image is a URL/path (not an emoji)
const isImageUrl = (image: string) =>
  image.startsWith("http") || image.startsWith("/") || image.startsWith("data:");

const StorePage = () => {
  const [activeTab, setActiveTab] = useState("badges");
  const { user } = useAuth();
  const { userData, refreshUserData, loading } = useUserData();
  const { setTheme, theme } = useTheme();
  const { showToast } = useToast();

  // Dynamic ambient colors based on theme
  const storeAmbience = {
    primary: `${theme.colors.primary}40`,
    secondary: `${theme.colors.secondary}38`,
    accent: `${theme.colors.primaryLight}30`,
    warm: `${theme.colors.accent}28`,
  };

  // If the page is loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading store...
      </div>
    );
  }

  const handlePurchase = async (item: StoreItem) => {
    if (!user?.uid) {
      showToast({
        title: "Authentication Error",
        description: "You must be logged in to make purchases.",
      });
      return;
    }

    if (userData.spendableXP < item.price) {
      showToast({
        title: "Not Enough XP",
        description: `You need ${item.price} XP to purchase this item. You currently have ${userData.spendableXP} XP.`,
        variant: "destructive",
      });
      return;
    }

    try {
      await purchaseItem(user.uid, item);
      await refreshUserData();

      if (item.category === "themes") {
        const themeId = item.id as ThemeId;
        setTheme(themeId);
        showToast({
          title: "Theme Applied!",
          description: `You've successfully purchased and applied the ${item.name} theme`,
        });
      } else {
        showToast({
          title: "Item Purchased!",
          description: `You've successfully purchased ${item.name}`,
        });
      }
    } catch (err: any) {
      showToast({
        title: "Purchase Failed",
        description:
          err.message || "Something went wrong during your purchase.",
        variant: "destructive",
      });
    }
  };

  const isItemOwned = (itemId: string): boolean => {
    if (!userData || !Array.isArray(userData.inventory)) return false;
    return userData.inventory.includes(itemId);
  };

  const isLevelLocked = (item: StoreItem): boolean => {
    return (item.requiredLevel || 0) > userData.level;
  };

  const getRarityColor = (rarity?: string): string => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-700 border border-gray-200";
      case "uncommon":
        return "bg-green-100 text-green-700 border border-green-200";
      case "rare":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "epic":
        return "bg-purple-100 text-purple-700 border border-purple-200";
      case "legendary":
        return "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200";
      case "mythic":
        return "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Animated ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />

        {/* Floating ambient orbs */}
        <motion.div
          className="absolute top-1/4 -left-16 sm:-left-32 w-48 h-48 sm:w-96 sm:h-96 rounded-full blur-2xl sm:blur-3xl"
          style={{ background: storeAmbience.primary }}
          animate={{
            x: [0, 20, 0],
            y: [0, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 -right-12 sm:-right-24 w-40 h-40 sm:w-80 sm:h-80 rounded-full blur-2xl sm:blur-3xl"
          style={{ background: storeAmbience.secondary }}
          animate={{
            x: [0, -15, 0],
            y: [0, 20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-36 h-36 sm:w-72 sm:h-72 rounded-full blur-2xl sm:blur-3xl"
          style={{ background: storeAmbience.accent }}
          animate={{
            x: [0, 25, 0],
            y: [0, -12, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-32 h-32 sm:w-64 sm:h-64 rounded-full blur-2xl sm:blur-3xl hidden sm:block"
          style={{ background: storeAmbience.warm }}
          animate={{
            x: [0, -18, 0],
            y: [0, 18, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 8,
          }}
        />
      </div>

      {/* Header */}
      <Header title="Rewards Shop" icon={ShoppingBag} />

      {/* Main Content */}
      <main className="relative container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Page Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 sm:mb-8 max-w-5xl mx-auto"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <motion.div
              className="p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg"
              style={{
                background: `linear-gradient(to bottom right, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
              }}
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </motion.div>
            <div className="text-center sm:text-left">
              <h1
                className="text-2xl sm:text-3xl font-bold pb-2 bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(to right, ${theme.colors.primaryDark}, ${theme.colors.primary}, ${theme.colors.secondary})`,
                }}
              >
                Unlock Rewards
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Spend your hard-earned XP on badges and themes
              </p>
            </div>
          </div>
          <motion.div
            className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-amber-50 to-orange-50 backdrop-blur-sm border-2 border-amber-200/60 rounded-xl sm:rounded-2xl shadow-sm"
            whileHover={{ scale: 1.02 }}
          >
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-500" />
            <span className="font-semibold text-amber-700 text-sm sm:text-base">{userData.spendableXP} XP available</span>
          </motion.div>
        </motion.div>

        {/* Tabs */}
        <Tabs
          defaultValue="badges"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full max-w-5xl mx-auto"
        >
          {/* Tab Switcher */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex justify-center gap-3 sm:gap-4 mb-6 sm:mb-8"
          >
            <motion.button
              onClick={() => setActiveTab('badges')}
              className={`group relative flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl backdrop-blur-sm border-2 shadow-sm transition-all duration-300 ${
                activeTab === 'badges'
                  ? 'bg-gradient-to-br from-amber-100/95 to-orange-100/95 border-amber-300 shadow-lg shadow-amber-200/50'
                  : 'bg-white/70 border-white/50 hover:border-amber-200 hover:bg-amber-50/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {activeTab === 'badges' && (
                <motion.div
                  layoutId="storeActiveIndicator"
                  className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400/10 to-orange-400/10"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl shadow-md transition-all duration-300 ${
                activeTab === 'badges'
                  ? 'bg-gradient-to-br from-amber-500 to-orange-600 scale-110'
                  : 'bg-gradient-to-br from-amber-400 to-orange-500 group-hover:scale-105'
              }`}>
                <Award className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="text-left relative z-10">
                <p className={`font-semibold text-sm sm:text-base transition-colors ${
                  activeTab === 'badges' ? 'text-amber-900' : 'text-gray-700 group-hover:text-amber-800'
                }`}>
                  Badges
                </p>
                <p className={`text-[10px] sm:text-xs transition-colors ${
                  activeTab === 'badges' ? 'text-amber-600' : 'text-gray-500 group-hover:text-amber-500'
                }`}>
                  Show off achievements
                </p>
              </div>
              {activeTab === 'badges' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-md"
                />
              )}
            </motion.button>

            <motion.button
              onClick={() => setActiveTab('themes')}
              className={`group relative flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl backdrop-blur-sm border-2 shadow-sm transition-all duration-300 ${
                activeTab === 'themes'
                  ? 'bg-gradient-to-br from-purple-100/95 to-violet-100/95 border-purple-300 shadow-lg shadow-purple-200/50'
                  : 'bg-white/70 border-white/50 hover:border-purple-200 hover:bg-purple-50/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {activeTab === 'themes' && (
                <motion.div
                  layoutId="storeActiveIndicator"
                  className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-400/10 to-violet-400/10"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl shadow-md transition-all duration-300 ${
                activeTab === 'themes'
                  ? 'bg-gradient-to-br from-purple-500 to-violet-600 scale-110'
                  : 'bg-gradient-to-br from-purple-400 to-violet-500 group-hover:scale-105'
              }`}>
                <Palette className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="text-left relative z-10">
                <p className={`font-semibold text-sm sm:text-base transition-colors ${
                  activeTab === 'themes' ? 'text-purple-900' : 'text-gray-700 group-hover:text-purple-800'
                }`}>
                  Themes
                </p>
                <p className={`text-[10px] sm:text-xs transition-colors ${
                  activeTab === 'themes' ? 'text-purple-600' : 'text-gray-500 group-hover:text-purple-500'
                }`}>
                  Customize your look
                </p>
              </div>
              {activeTab === 'themes' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br from-purple-400 to-violet-500 shadow-md"
                />
              )}
            </motion.button>
          </motion.div>

          {/* Tab Content */}
          {Object.entries(storeItems).map(([category, items]) => (
            <TabsContent key={category} value={category} className="space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              >
                {items.map((item, index) => {
                  const locked = isLevelLocked(item);
                  const owned = isItemOwned(item.id);

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card
                        className={`overflow-hidden bg-white/70 backdrop-blur-md border-2 border-white/50 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ${locked ? "opacity-75" : ""}`}
                      >
                        <div className="aspect-video relative overflow-hidden">
                          {item.category === "themes" ? (
                            <div
                              className="w-full h-full"
                              style={{ background: item.image }}
                            />
                          ) : item.category === "badges" ? (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 overflow-hidden">
                              {isImageUrl(item.image) ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-6xl sm:text-7xl drop-shadow-lg">{item.image}</span>
                              )}
                            </div>
                          ) : (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                          {owned && (
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/80 to-emerald-400/60 backdrop-blur-sm flex items-center justify-center">
                              <Badge className="bg-white/90 text-emerald-600 font-semibold px-4 py-1.5 rounded-full shadow-lg">
                                Owned
                              </Badge>
                            </div>
                          )}
                          {locked && !owned && (
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-gray-800/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                              <div className="p-3 bg-white/20 rounded-full">
                                <Lock className="h-6 w-6 text-white" />
                              </div>
                              <Badge className="bg-white/90 text-gray-700 font-medium px-3 py-1 rounded-full">
                                Unlocks at Level {item.requiredLevel}
                              </Badge>
                            </div>
                          )}
                          {/* Price badge */}
                          <div className="absolute top-3 right-3">
                            <Badge className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-amber-700 font-semibold px-3 py-1.5 rounded-full shadow-md border border-amber-200/50">
                              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                              {item.price}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4 sm:p-5">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex flex-col gap-2">
                              <h3 className="font-bold text-base sm:text-lg text-gray-800">{item.name}</h3>
                              {item.rarity && (
                                <Badge className={`w-fit text-xs font-medium ${getRarityColor(item.rarity)}`}>
                                  {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {item.description}
                          </p>
                        </CardContent>
                        <CardFooter className="p-4 sm:p-5 pt-0">
                          <Button
                            className={`w-full rounded-xl font-semibold transition-all shadow-md hover:shadow-lg ${
                              owned
                                ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-200 hover:bg-emerald-50"
                                : locked
                                  ? "bg-gray-100 text-gray-500 border-2 border-gray-200"
                                  : ""
                            }`}
                            style={
                              !owned && !locked
                                ? {
                                    backgroundImage: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
                                    color: "white",
                                  }
                                : undefined
                            }
                            variant={owned ? "outline" : "default"}
                            disabled={owned || locked}
                            onClick={() => handlePurchase(item)}
                          >
                            {owned ? "Owned" : locked ? `Reach Level ${item.requiredLevel}` : "Purchase"}
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Footer info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 sm:mt-12 text-center"
        >
          <p className="text-sm text-gray-500">
            Items purchased will appear in your profile
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default StorePage;
