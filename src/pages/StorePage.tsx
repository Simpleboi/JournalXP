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

// Mock user data - in a real app, this would come from a context or state management
const mockUserData = {
  points: 1250,
  inventory: [],
};

// Store items data
const storeItems = {
  avatars: [
    {
      id: "avatar-1",
      name: "Zen Master",
      description: "A peaceful avatar with meditation vibes",
      price: 500,
      image:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=zen&backgroundColor=b6e3f4",
      category: "avatars",
    },
    {
      id: "avatar-2",
      name: "Nature Spirit",
      description: "Connect with nature through this earthy avatar",
      price: 750,
      image:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=nature&backgroundColor=d1f4d7",
      category: "avatars",
    },
    {
      id: "avatar-3",
      name: "Cosmic Mind",
      description: "Expand your consciousness with this cosmic avatar",
      price: 1000,
      image:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=cosmic&backgroundColor=e0d1f4",
      category: "avatars",
    },
  ],
  themes: [
    {
      id: "theme-1",
      name: "Ocean Calm",
      description: "Soothing blue tones inspired by the ocean",
      price: 600,
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=80",
      category: "themes",
    },
    {
      id: "theme-2",
      name: "Forest Retreat",
      description: "Calming greens from a peaceful forest",
      price: 600,
      image:
        "https://images.unsplash.com/photo-1448375240586-882707db888b?w=300&q=80",
      category: "themes",
    },
    {
      id: "theme-3",
      name: "Sunset Meditation",
      description: "Warm sunset colors for a peaceful mind",
      price: 800,
      image:
        "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=300&q=80",
      category: "themes",
    },
  ],
  powerUps: [
    {
      id: "powerup-1",
      name: "Streak Shield",
      description: "Protects your streak for one missed day",
      price: 400,
      image:
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&q=80",
      category: "powerUps",
    },
    {
      id: "powerup-2",
      name: "Double Points",
      description: "Earn double points for all activities for 24 hours",
      price: 500,
      image:
        "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=300&q=80",
      category: "powerUps",
    },
    {
      id: "powerup-3",
      name: "Insight Boost",
      description: "Unlock special journal prompts for deeper reflection",
      price: 350,
      image:
        "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=300&q=80",
      category: "powerUps",
    },
  ],
};

const StorePage = () => {
  const [userData, setUserData] = useState(mockUserData);
  const [activeTab, setActiveTab] = useState("avatars");

  const handlePurchase = (item) => {
    if (userData.points >= item.price) {
      // Update user data
      setUserData({
        points: userData.points - item.price,
        inventory: [...userData.inventory, item.id],
      });

      // Show success toast
      toast({
        title: "Item Purchased!",
        description: `You've successfully purchased ${item.name}`,
        action: (
          <ToastAction altText="View Inventory">View Inventory</ToastAction>
        ),
      });
    } else {
      // Show error toast
      toast({
        title: "Not enough points",
        description: `You need ${item.price - userData.points} more points to purchase this item`,
        variant: "destructive",
      });
    }
  };

  const isItemOwned = (itemId) => {
    return userData.inventory.includes(itemId);
  };

  const getCategoryIcon = (category) => {
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
              WellPoint Store
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="font-medium">{userData.points} points</span>
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
          <p>WellPoint - Your Mental Health Companion</p>
        </div>
      </footer>
    </div>
  );
};

export default StorePage;




