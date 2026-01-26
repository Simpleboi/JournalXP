import { TabsContent } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Palette,
  LayoutGrid,
  Check,
  GripVertical,
  Eye,
  EyeOff,
  Lock,
  ShoppingBag,
  Sparkles,
  PenLine,
  Target,
  ListChecks,
  MessageCircle,
  Leaf,
  Timer,
  BarChart3,
  Trophy,
  User,
  Info,
  Archive,
  BookOpen,
  Compass,
  Users,
  LucideIcon,
} from "lucide-react";

// Icon mapping for dynamic rendering
const iconMap: Record<string, LucideIcon> = {
  PenLine,
  Target,
  ListChecks,
  MessageCircle,
  Leaf,
  Timer,
  ShoppingBag,
  BarChart3,
  Trophy,
  User,
  Info,
  Lock,
  Archive,
  BookOpen,
  Compass,
  Users,
};
import { useTheme } from "@/context/ThemeContext";
import { useUserData } from "@/context/UserDataContext";
import { authFetch } from "@/lib/authFetch";
import {
  AVAILABLE_CARDS,
  DEFAULT_DASHBOARD_CARDS,
  DEFAULT_WELCOME_BUTTONS,
} from "@/data/dashboardCards";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";
import { storeItems } from "@/data/shop";

export const ProfileCustomize = () => {
  const { themeId, setTheme, availableThemes } = useTheme();
  const { userData, refreshUserData } = useUserData();
  const { showToast } = useToast();

  // Dashboard customization state
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [welcomeButtons, setWelcomeButtons] = useState<string[]>(DEFAULT_WELCOME_BUTTONS);
  const [showUpdatesBanner, setShowUpdatesBanner] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [welcomeDraggedIndex, setWelcomeDraggedIndex] = useState<number | null>(null);

  // Free themes that everyone has access to
  const freeThemes = ["default", "ocean", "sunset"];

  // Filter themes to only show owned ones
  const ownedThemes = availableThemes.filter((theme) => {
    if (freeThemes.includes(theme.id)) return true;
    return userData?.inventory?.includes(theme.id);
  });

  // Locked themes (not owned)
  const lockedThemes = availableThemes.filter((theme) => {
    if (freeThemes.includes(theme.id)) return false;
    return !userData?.inventory?.includes(theme.id);
  });

  useEffect(() => {
    if (userData?.preferences?.dashboardCards) {
      setSelectedCards(userData.preferences.dashboardCards);
    } else {
      setSelectedCards(DEFAULT_DASHBOARD_CARDS);
    }
    if (userData?.preferences?.welcomeButtons) {
      setWelcomeButtons(userData.preferences.welcomeButtons);
    } else {
      setWelcomeButtons(DEFAULT_WELCOME_BUTTONS);
    }
    setShowUpdatesBanner(userData?.preferences?.showUpdatesBanner ?? true);
  }, [userData]);

  const handleSavePreferences = async () => {
    if (selectedCards.length === 0) {
      showToast({
        title: "Error",
        description: "Please select at least one card",
        variant: "destructive",
      });
      return;
    }

    if (selectedCards.length > 6) {
      showToast({
        title: "Error",
        description: "Maximum 6 cards allowed",
        variant: "destructive",
      });
      return;
    }

    if (welcomeButtons.length !== 3) {
      showToast({
        title: "Error",
        description: "Please select exactly 3 quick actions",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await authFetch("/profile/preferences", {
        method: "PATCH",
        body: JSON.stringify({
          dashboardCards: selectedCards,
          welcomeButtons,
          showUpdatesBanner,
        }),
      });

      await refreshUserData();

      showToast({
        title: "Saved!",
        description: "Your homepage preferences have been updated",
      });
    } catch (error: any) {
      showToast({
        title: "Error",
        description: error.message || "Failed to save preferences",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCard = (cardId: string) => {
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter((id) => id !== cardId));
    } else {
      if (selectedCards.length < 6) {
        setSelectedCards([...selectedCards, cardId]);
      } else {
        showToast({
          title: "Maximum cards reached",
          description: "You can only select up to 6 cards",
          variant: "destructive",
        });
      }
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newCards = [...selectedCards];
    const draggedCard = newCards[draggedIndex];
    newCards.splice(draggedIndex, 1);
    newCards.splice(index, 0, draggedCard);

    setSelectedCards(newCards);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Welcome buttons drag handlers
  const handleWelcomeDragStart = (index: number) => {
    setWelcomeDraggedIndex(index);
  };

  const handleWelcomeDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (welcomeDraggedIndex === null || welcomeDraggedIndex === index) return;

    const newButtons = [...welcomeButtons];
    const draggedButton = newButtons[welcomeDraggedIndex];
    newButtons.splice(welcomeDraggedIndex, 1);
    newButtons.splice(index, 0, draggedButton);

    setWelcomeButtons(newButtons);
    setWelcomeDraggedIndex(index);
  };

  const handleWelcomeDragEnd = () => {
    setWelcomeDraggedIndex(null);
  };

  const toggleWelcomeButton = (cardId: string) => {
    if (welcomeButtons.includes(cardId)) {
      setWelcomeButtons(welcomeButtons.filter((id) => id !== cardId));
    } else {
      if (welcomeButtons.length < 3) {
        setWelcomeButtons([...welcomeButtons, cardId]);
      } else {
        showToast({
          title: "Maximum buttons reached",
          description: "You can only select up to 3 quick actions",
          variant: "destructive",
        });
      }
    }
  };

  const getCardInfo = (cardId: string) => {
    return AVAILABLE_CARDS.find((card) => card.id === cardId);
  };

  const availableCardsToAdd = AVAILABLE_CARDS.filter(
    (card) => !selectedCards.includes(card.id)
  );

  const availableWelcomeButtonsToAdd = AVAILABLE_CARDS.filter(
    (card) => !welcomeButtons.includes(card.id)
  );

  return (
    <TabsContent value="customize" className="space-y-6">
      {/* Theme Selection */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="h-5 w-5 text-indigo-500" />
          <h3 className="text-lg font-semibold text-gray-800">App Theme</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Choose a color theme for your JournalXP experience. Unlock more themes
          in the store!
        </p>

        <div className="space-y-4">
          {/* Owned Themes */}
          <div>
            <Label className="text-sm text-gray-500 mb-2 block">
              Your Themes ({ownedThemes.length} available)
            </Label>
            <RadioGroup
              value={themeId}
              onValueChange={setTheme}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
            >
              {ownedThemes.map((theme) => (
                <div key={theme.id}>
                  <RadioGroupItem
                    value={theme.id}
                    id={theme.id}
                    className="sr-only"
                  />
                  <Label
                    htmlFor={theme.id}
                    className={`flex flex-col items-center justify-center rounded-xl border-2 p-4 cursor-pointer transition-all relative h-24 ${
                      themeId === theme.id
                        ? "border-white ring-2 ring-indigo-500 ring-offset-2"
                        : "border-transparent hover:border-white/50"
                    }`}
                    style={{
                      background: theme.colors.gradient,
                    }}
                  >
                    {themeId === theme.id && (
                      <motion.div
                        className="absolute top-2 right-2 bg-white rounded-full p-1"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Check className="h-3 w-3 text-green-600" />
                      </motion.div>
                    )}
                    <span className="text-white font-medium text-sm drop-shadow-md">
                      {theme.name}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Locked Themes */}
          {lockedThemes.length > 0 && (
            <div>
              <Label className="text-sm text-gray-500 mb-2 block">
                Available in Store ({lockedThemes.length})
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {lockedThemes.slice(0, 4).map((theme) => (
                  <div
                    key={theme.id}
                    className="relative h-24 rounded-xl opacity-60"
                    style={{ background: theme.colors.gradient }}
                  >
                    <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center">
                      <Lock className="h-6 w-6 text-white" />
                    </div>
                    <span className="absolute bottom-2 left-0 right-0 text-center text-white text-xs font-medium drop-shadow-md">
                      {theme.name}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-center">
                <Button asChild variant="outline" size="sm">
                  <Link to="/store">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Browse Themes in Store
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Welcome Banner Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-amber-500" />
          <h3 className="text-lg font-semibold text-gray-800">Welcome Banner Quick Actions</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Choose 3 features for quick access from the welcome banner on your homepage.
          Drag to reorder them.
        </p>

        {/* Selected Welcome Buttons */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium">
              Quick Actions ({welcomeButtons.length}/3)
            </Label>
            <button
              onClick={() => setWelcomeButtons(DEFAULT_WELCOME_BUTTONS)}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Reset to Default
            </button>
          </div>

          <div className="space-y-2">
            {welcomeButtons.length === 0 ? (
              <p className="text-sm text-gray-500 italic py-4 text-center">
                No quick actions selected. Choose from available features below.
              </p>
            ) : (
              welcomeButtons.map((cardId, index) => {
                const cardInfo = getCardInfo(cardId);
                if (!cardInfo) return null;
                const IconComponent = iconMap[cardInfo.icon] || PenLine;

                return (
                  <motion.div
                    key={cardId}
                    draggable
                    onDragStart={() => handleWelcomeDragStart(index)}
                    onDragOver={(e) => handleWelcomeDragOver(e, index)}
                    onDragEnd={handleWelcomeDragEnd}
                    className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg cursor-move hover:bg-amber-100 transition-colors"
                    layout
                  >
                    <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">
                        {cardInfo.name}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {cardInfo.description}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleWelcomeButton(cardId)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors flex-shrink-0"
                    >
                      <EyeOff className="w-4 h-4" />
                    </button>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Available Features for Welcome Buttons */}
        {availableWelcomeButtonsToAdd.length > 0 && welcomeButtons.length < 3 && (
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Available Features
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {availableWelcomeButtonsToAdd.map((card) => {
                const IconComponent = iconMap[card.icon] || PenLine;
                return (
                  <div
                    key={card.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">
                        {card.name}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {card.description}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleWelcomeButton(card.id)}
                      disabled={welcomeButtons.length >= 3}
                      className={`p-2 rounded transition-colors flex-shrink-0 ${
                        welcomeButtons.length >= 3
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-green-600 hover:bg-green-100"
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Homepage Layout */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <LayoutGrid className="h-5 w-5 text-indigo-500" />
          <h3 className="text-lg font-semibold text-gray-800">Homepage Layout</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Choose which cards appear on your homepage and arrange them in your
          preferred order.
        </p>

        {/* Updates Banner Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
          <div>
            <p className="font-medium text-gray-800">Updates Banner</p>
            <p className="text-sm text-gray-500">
              Show latest features on homepage
            </p>
          </div>
          <Switch
            checked={showUpdatesBanner}
            onCheckedChange={setShowUpdatesBanner}
          />
        </div>

        {/* Selected Cards */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium">
              Active Cards ({selectedCards.length}/6)
            </Label>
            <button
              onClick={() => setSelectedCards(DEFAULT_DASHBOARD_CARDS)}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Reset to Default
            </button>
          </div>

          <div className="space-y-2">
            {selectedCards.length === 0 ? (
              <p className="text-sm text-gray-500 italic py-4 text-center">
                No cards selected. Choose from available cards below.
              </p>
            ) : (
              selectedCards.map((cardId, index) => {
                const cardInfo = getCardInfo(cardId);
                if (!cardInfo) return null;

                return (
                  <motion.div
                    key={cardId}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg cursor-move hover:bg-indigo-100 transition-colors"
                    layout
                  >
                    <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">
                        {cardInfo.name}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {cardInfo.description}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleCard(cardId)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors flex-shrink-0"
                    >
                      <EyeOff className="w-4 h-4" />
                    </button>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Available Cards */}
        {availableCardsToAdd.length > 0 && (
          <div className="mb-6">
            <Label className="text-sm font-medium mb-3 block">
              Available Cards
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {availableCardsToAdd.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">
                      {card.name}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {card.description}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleCard(card.id)}
                    disabled={selectedCards.length >= 6}
                    className={`p-2 rounded transition-colors flex-shrink-0 ${
                      selectedCards.length >= 6
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-green-600 hover:bg-green-100"
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSavePreferences}
            disabled={isSaving || selectedCards.length === 0}
          >
            {isSaving ? "Saving..." : "Save Layout"}
          </Button>
        </div>
      </div>
    </TabsContent>
  );
};
