import { TabsContent } from "@/components/ui/tabs";
import { ShoppingBag, Award, Palette, Zap, Tag, Star, Check } from "lucide-react";
import { storeItems, type StoreItem } from "@/data/shop";
import { useUserData } from "@/context/UserDataContext";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/useToast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const ProfileInventory = () => {
  const { userData, refreshUserData } = useUserData();
  const { user } = useAuth();
  const { showToast } = useToast();

  // Get all items from the store as a flat array
  const allStoreItems: StoreItem[] = Object.values(storeItems).flat();

  // Filter to only owned items
  const ownedItems = allStoreItems.filter(
    (item) => userData.inventory?.includes(item.id)
  );

  // Group owned items by category
  const ownedBadges = ownedItems.filter((item) => item.category === "badges");
  const ownedThemes = ownedItems.filter((item) => item.category === "themes");
  const ownedAvatars = ownedItems.filter((item) => item.category === "avatars");
  const ownedPowerUps = ownedItems.filter((item) => item.category === "powerUps");

  const handleSetFeaturedBadge = async (badgeId: string) => {
    if (!user?.uid) return;

    try {
      // If already featured, remove it
      const newFeaturedBadge = userData.featuredBadge === badgeId ? null : badgeId;

      await updateDoc(doc(db, "users", user.uid), {
        featuredBadge: newFeaturedBadge,
      });

      await refreshUserData();

      showToast({
        title: newFeaturedBadge ? "Featured Badge Set!" : "Featured Badge Removed",
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

  const getRarityColor = (rarity?: string): string => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "rare":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "epic":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "legendary":
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
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

  const renderEmptyState = () => (
    <div className="bg-gray-100 rounded-lg p-4 text-center flex flex-col items-center justify-center h-40">
      <ShoppingBag className="h-8 w-8 text-gray-400 mb-2" />
      <p className="text-gray-500">No items purchased yet</p>
    </div>
  );

  const renderBadgeItem = (item: StoreItem) => {
    const isFeatured = userData.featuredBadge === item.id;

    return (
      <div
        key={item.id}
        className={`relative bg-white rounded-lg p-4 border-2 transition-all hover:shadow-md ${
          isFeatured ? "border-yellow-400 ring-2 ring-yellow-200" : "border-gray-200"
        }`}
      >
        {isFeatured && (
          <div className="absolute -top-2 -right-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400">
              <Star className="h-3 w-3 text-white fill-white" />
            </span>
          </div>
        )}
        <div className="flex flex-col items-center gap-2">
          <span className="text-4xl">{item.image}</span>
          <h4 className="font-semibold text-sm text-center">{item.name}</h4>
          {item.rarity && (
            <Badge className={`text-xs ${getRarityColor(item.rarity)}`}>
              {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
            </Badge>
          )}
          <Button
            size="sm"
            variant={isFeatured ? "default" : "outline"}
            className="w-full mt-2 text-xs"
            onClick={() => handleSetFeaturedBadge(item.id)}
          >
            {isFeatured ? (
              <>
                <Check className="h-3 w-3 mr-1" /> Featured
              </>
            ) : (
              "Set as Featured"
            )}
          </Button>
        </div>
      </div>
    );
  };

  const renderThemeItem = (item: StoreItem) => (
    <div
      key={item.id}
      className="bg-white rounded-lg overflow-hidden border-2 border-gray-200 hover:shadow-md transition-all"
    >
      <div
        className="h-20 w-full"
        style={{ background: item.image }}
      />
      <div className="p-3">
        <h4 className="font-semibold text-sm">{item.name}</h4>
        <p className="text-xs text-gray-500">{item.description}</p>
      </div>
    </div>
  );

  const renderGenericItem = (item: StoreItem) => (
    <div
      key={item.id}
      className="bg-white rounded-lg overflow-hidden border-2 border-gray-200 hover:shadow-md transition-all"
    >
      <img
        src={item.image}
        alt={item.name}
        className="h-20 w-full object-cover"
      />
      <div className="p-3">
        <h4 className="font-semibold text-sm">{item.name}</h4>
        <p className="text-xs text-gray-500">{item.description}</p>
      </div>
    </div>
  );

  return (
    <TabsContent value="inventory" className="space-y-6">
      {/* Badges Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          {getCategoryIcon("badges")}
          <h3 className="text-lg font-semibold">Your Badges</h3>
          <Badge variant="outline" className="ml-auto">
            {ownedBadges.length} collected
          </Badge>
        </div>
        {ownedBadges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {ownedBadges.map(renderBadgeItem)}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Award className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No badges yet. Visit the store to purchase your first badge!</p>
          </div>
        )}
      </div>

      {/* Themes Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          {getCategoryIcon("themes")}
          <h3 className="text-lg font-semibold">Your Themes</h3>
          <Badge variant="outline" className="ml-auto">
            {ownedThemes.length} owned
          </Badge>
        </div>
        {ownedThemes.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {ownedThemes.map(renderThemeItem)}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Palette className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No themes purchased yet. Visit the store to customize your experience!</p>
          </div>
        )}
      </div>

      {/* Avatars Section (if any owned) */}
      {ownedAvatars.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            {getCategoryIcon("avatars")}
            <h3 className="text-lg font-semibold">Your Avatars</h3>
            <Badge variant="outline" className="ml-auto">
              {ownedAvatars.length} owned
            </Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {ownedAvatars.map(renderGenericItem)}
          </div>
        </div>
      )}

      {/* Power-Ups Section (if any owned) */}
      {ownedPowerUps.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            {getCategoryIcon("powerUps")}
            <h3 className="text-lg font-semibold">Your Power-Ups</h3>
            <Badge variant="outline" className="ml-auto">
              {ownedPowerUps.length} owned
            </Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {ownedPowerUps.map(renderGenericItem)}
          </div>
        </div>
      )}

      {/* Empty state when nothing is owned */}
      {ownedItems.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Your Purchased Items</h3>
          <p className="text-gray-500 mb-4">
            Items you've purchased from the rewards store will appear here.
          </p>
          {renderEmptyState()}
        </div>
      )}
    </TabsContent>
  );
};
