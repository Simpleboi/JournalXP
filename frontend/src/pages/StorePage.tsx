import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft, Star, Tag, Palette, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { storeItems } from "@/data/shop";
import { useUserData } from "@/context/UserDataContext";
import { useAuth } from "@/context/AuthContext";
import { purchaseItem } from "@/services/userService";

interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

const StorePage = () => {
  const [activeTab, setActiveTab] = useState("avatars");
  const { user } = useAuth();
  const { userData, refreshUserData, loading } = useUserData();

  if (loading || !userData || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading store...
      </div>
    );
  }

  const handlePurchase = async (item: StoreItem) => {
    if (!user?.uid) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to make purchases.",
        variant: "destructive",
      });
      return;
    }

    // Check if user has enough XP before attempting purchase
    if (userData.xp < item.price) {
      toast({
        title: "Not Enough XP",
        description: `You need ${item.price} XP to purchase this item. You currently have ${userData.xp} XP.`,
        variant: "destructive",
      });
      return;
    }

    try {
      await purchaseItem(user.uid, item);
      await refreshUserData();

      toast({
        title: "Item Purchased!",
        description: `You've successfully purchased ${item.name}`,
        action: (
          <ToastAction altText="View Inventory">View Inventory</ToastAction>
        ),
      });
    } catch (err: any) {
      toast({
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "avatars":
        return <Tag className="h-5 w-5" />;
      case "themes":
        return <Palette className="h-5 w-5" />;
      case "powerUps":
        return <Zap className="h-5 w-5" />;
      default:
        return <ShoppingBag className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
            </Button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              JournalXP Store
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="font-medium">{userData.xp} XP</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Rewards Shop
          </h2>
          <p className="text-gray-600 mt-2 text-center">
            Spend your hard-earned points on items to enhance your wellbeing
            journey
          </p>
        </motion.div>

        <Tabs
          defaultValue="avatars"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="avatars" className="flex items-center gap-2">
              <Tag className="h-4 w-4" /> Avatars
            </TabsTrigger>
            <TabsTrigger value="themes" className="flex items-center gap-2">
              <Palette className="h-4 w-4" /> Themes
            </TabsTrigger>
            <TabsTrigger value="powerUps" className="flex items-center gap-2">
              <Zap className="h-4 w-4" /> Power-Ups
            </TabsTrigger>
          </TabsList>

          {Object.entries(storeItems).map(([category, items]) => (
            <TabsContent key={category} value={category} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {items.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden transition-all hover:shadow-md"
                  >
                    <div className="aspect-video relative overflow-hidden bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      {isItemOwned(item.id) && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Badge className="bg-green-500 text-white">
                            Owned
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          {item.price}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button
                        className="w-full"
                        variant={isItemOwned(item.id) ? "outline" : "default"}
                        disabled={isItemOwned(item.id)}
                        onClick={() => handlePurchase(item)}
                      >
                        {isItemOwned(item.id) ? "Owned" : "Purchase"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>Items purchased in the store will be available in your profile</p>
          <Separator className="my-4" />
          <p>JournalXP - Your Mental Health Companion</p>
        </div>
      </footer>
    </div>
  );
};

export default StorePage;
