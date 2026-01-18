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
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";

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
        return "bg-gray-100 text-gray-800";
      case "rare":
        return "bg-blue-100 text-blue-800";
      case "epic":
        return "bg-purple-100 text-purple-800";
      case "legendary":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  const renderBadgeCard = (item: StoreItem) => {
    const isFeatured = userData.featuredBadge === item.id;

    return (
      <Card
        key={item.id}
        className={`overflow-hidden transition-all hover:shadow-md ${
          isFeatured ? "ring-2 ring-yellow-400" : ""
        }`}
      >
        <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <span className="text-6xl">{item.image}</span>
          {isFeatured && (
            <div className="absolute top-2 right-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 shadow-md">
                <Star className="h-4 w-4 text-white fill-white" />
              </span>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              {item.rarity && (
                <Badge className={`w-fit text-xs ${getRarityColor(item.rarity)}`}>
                  {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
                </Badge>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600">{item.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full"
            variant={isFeatured ? "default" : "outline"}
            onClick={() => handleSetFeaturedBadge(item.id)}
          >
            {isFeatured ? (
              <>
                <Check className="h-4 w-4 mr-2" /> Featured
              </>
            ) : (
              "Set as Featured"
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  const renderThemeCard = (item: StoreItem) => (
    <Card key={item.id} className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-video relative overflow-hidden">
        <div className="w-full h-full" style={{ background: item.image }} />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg">{item.name}</h3>
        <p className="text-sm text-gray-600">{item.description}</p>
      </CardContent>
    </Card>
  );

  const renderGenericCard = (item: StoreItem) => (
    <Card key={item.id} className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-video relative overflow-hidden bg-gray-100">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg">{item.name}</h3>
        <p className="text-sm text-gray-600">{item.description}</p>
      </CardContent>
    </Card>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ownedBadges.map(renderBadgeCard)}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Award className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p className="mb-4">No badges yet. Visit the store to purchase your first badge!</p>
            <Button asChild variant="outline">
              <Link to="/store">Browse Badges</Link>
            </Button>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ownedThemes.map(renderThemeCard)}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Palette className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p className="mb-4">No themes purchased yet. Visit the store to customize your experience!</p>
            <Button asChild variant="outline">
              <Link to="/store">Browse Themes</Link>
            </Button>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ownedAvatars.map(renderGenericCard)}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ownedPowerUps.map(renderGenericCard)}
          </div>
        </div>
      )}
    </TabsContent>
  );
};
