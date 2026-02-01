import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft, Star, Tag, Palette, Zap, Award, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/useToast";
import { storeItems, type StoreItem } from "@/data/shop";
import { useUserData } from "@/context/UserDataContext";
import { useAuth } from "@/context/AuthContext";
import { purchaseItem } from "@/services/userService";
import { useTheme } from "@/context/ThemeContext";
import type { ThemeId } from "@/types/theme";

const StorePage = () => {
  const [activeTab, setActiveTab] = useState("badges");
  const { user } = useAuth();
  const { userData, refreshUserData, loading } = useUserData();
  const { setTheme, theme } = useTheme();
  const { showToast } = useToast();

  // If the page is loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading store...
      </div>
    );
  }

  const handlePurchase = async (item: StoreItem) => {
    console.log("🛒 Purchase clicked for:", item.name, item);
    // For Debugging Purposes, not meant for prod
    // console.log("👤 User:", user?.uid);
    // console.log("💰 User XP:", userData.totalXP, "Item price:", item.price);

    // if the user isn't logged in
    if (!user?.uid) {
      showToast({
        title: "Authentication Error",
        description: "You must be logged in to make purchases.",
      });
      return;
    }

    // Check if user has enough spendable XP before attempting purchase
    if (userData.spendableXP < item.price) {
      showToast({
        title: "Not Enough XP",
        description: `You need ${item.price} XP to purchase this item. You currently have ${userData.spendableXP} XP.`,
        variant: "destructive",
      });
      return;
    }

    // console.log("✅ Validation passed, calling purchaseItem...");
    try {
      await purchaseItem(user.uid, item);
      console.log("✅ Purchase completed, refreshing user data...");
      await refreshUserData();

      // Wait a bit for state to update
      setTimeout(() => {
        console.log("📦 Inventory after refresh:", userData.inventory);
        console.log("💰 Spendable XP after refresh:", userData.spendableXP);
      }, 100);

      // If it's a theme, automatically apply it
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
        return "bg-gray-200/80 text-gray-700 border border-gray-300/50";
      case "rare":
        return "bg-blue-200/80 text-blue-700 border border-blue-300/50";
      case "epic":
        return "bg-purple-200/80 text-purple-700 border border-purple-300/50";
      case "legendary":
        return "bg-gradient-to-r from-amber-200/80 to-orange-200/80 text-amber-700 border border-amber-300/50";
      default:
        return "bg-gray-200/80 text-gray-700 border border-gray-300/50";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "avatars":
        return <Tag className="h-5 w-5" />;
      case "themes":
        return <Palette className="h-5 w-5" />;
      case "powerUps":
        return <Zap className="h-5 w-5" />;
      case "badges":
        return <Award className="h-5 w-5" />;
      default:
        return <ShoppingBag className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-rose-200/30 to-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-gradient-to-br from-yellow-200/30 to-amber-200/30 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="rounded-xl hover:bg-white/50"
            >
              <Link to="/">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200/50">
                <ShoppingBag className="h-5 w-5 text-amber-600" />
              </div>
              <h1
                className="text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
                style={{ backgroundImage: theme.colors.gradient }}
              >
                Rewards Shop
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100/80 to-amber-100/80 backdrop-blur-sm border border-yellow-200/50 rounded-xl shadow-sm">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            <span className="font-semibold text-amber-700">{userData.spendableXP} XP</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-white/50 rounded-full shadow-sm mb-4">
            <Award className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-gray-600">Spend your hard-earned XP</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 bg-clip-text text-transparent">
            Unlock Rewards
          </h2>
          <p className="text-gray-600 mt-2 max-w-md mx-auto">
            Customize your experience with badges and themes
          </p>
        </motion.div>

        <Tabs
          defaultValue="badges"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/60 backdrop-blur-md border-2 border-white/50 rounded-2xl p-1.5 shadow-lg">
            <TabsTrigger
              value="badges"
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              <Award className="h-4 w-4" /> Badges
            </TabsTrigger>
            <TabsTrigger
              value="themes"
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              <Palette className="h-4 w-4" /> Themes
            </TabsTrigger>
          </TabsList>

          {Object.entries(storeItems).map(([category, items]) => (
            <TabsContent key={category} value={category} className="space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
                        className={`overflow-hidden bg-white/70 backdrop-blur-md border-2 border-white/50 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ${locked ? "opacity-75" : ""}`}
                      >
                        <div className="aspect-video relative overflow-hidden">
                          {item.category === "themes" ? (
                            <div
                              className="w-full h-full"
                              style={{ background: item.image }}
                            />
                          ) : item.category === "badges" ? (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50/80 to-orange-50/80">
                              <span className="text-7xl drop-shadow-lg">{item.image}</span>
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
                            <Badge
                              className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-amber-700 font-semibold px-3 py-1.5 rounded-full shadow-md border border-amber-200/50"
                            >
                              <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                              {item.price}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-5">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex flex-col gap-2">
                              <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
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
                        <CardFooter className="p-5 pt-0">
                          <Button
                            className={`w-full rounded-xl font-semibold transition-all ${
                              owned
                                ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-200 hover:bg-emerald-50"
                                : locked
                                  ? "bg-gray-100 text-gray-500 border-2 border-gray-200"
                                  : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg"
                            }`}
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
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-12 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white/60 backdrop-blur-md border-2 border-white/50 rounded-2xl p-6 shadow-lg text-center">
            <p className="text-gray-600">Items purchased will appear in your profile</p>
            <Separator className="my-4 bg-gray-200/50" />
            <p className="text-sm text-gray-500">JournalXP - Your Mental Health Companion</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StorePage;
