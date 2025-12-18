import { useState, useEffect } from "react";
import { useUserData } from "@/context/UserDataContext";
import { authFetch } from "@/lib/authFetch";
import { AVAILABLE_CARDS, DEFAULT_DASHBOARD_CARDS } from "@/data/dashboardCards";
import { useToast } from "@/hooks/useToast";
import { GripVertical, Eye, EyeOff } from "lucide-react";

export const ProfileDashboard = () => {
  const { userData, refreshUserData } = useUserData();
  const { showToast } = useToast();
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    // Initialize with user's saved preferences or defaults
    if (userData?.preferences?.dashboardCards) {
      setSelectedCards(userData.preferences.dashboardCards);
    } else {
      setSelectedCards(DEFAULT_DASHBOARD_CARDS);
    }
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

    setIsSaving(true);
    try {
      console.log("Saving dashboard cards:", selectedCards);
      console.log("Request body:", JSON.stringify({ dashboardCards: selectedCards }));

      await authFetch("/profile/preferences", {
        method: "PATCH",
        body: JSON.stringify({ dashboardCards: selectedCards }),
      });

      await refreshUserData();

      showToast({
        title: "Success",
        description: "Dashboard preferences updated successfully",
      });
    } catch (error: any) {
      console.error("Error saving dashboard preferences:", error);
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
      // Remove card
      setSelectedCards(selectedCards.filter((id) => id !== cardId));
    } else {
      // Add card (max 6)
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

  const getCardInfo = (cardId: string) => {
    return AVAILABLE_CARDS.find((card) => card.id === cardId);
  };

  const availableCardsToAdd = AVAILABLE_CARDS.filter(
    (card) => !selectedCards.includes(card.id)
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Dashboard Customization
        </h3>
        <p className="text-sm text-gray-600">
          Choose up to 6 cards to display on your home page and arrange them in
          your preferred order.
        </p>
      </div>

      {/* Selected Cards Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-700">
            Selected Cards ({selectedCards.length}/6)
          </h4>
          <button
            onClick={() => setSelectedCards(DEFAULT_DASHBOARD_CARDS)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Reset to Default
          </button>
        </div>

        <div className="space-y-2">
          {selectedCards.length === 0 ? (
            <p className="text-sm text-gray-500 italic">
              No cards selected. Choose from available cards below.
            </p>
          ) : (
            selectedCards.map((cardId, index) => {
              const cardInfo = getCardInfo(cardId);
              if (!cardInfo) return null;

              return (
                <div
                  key={cardId}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-move hover:bg-blue-100 transition-colors"
                >
                  <GripVertical className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{cardInfo.name}</p>
                    <p className="text-sm text-gray-600">
                      {cardInfo.description}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleCard(cardId)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                  >
                    <EyeOff className="w-5 h-5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Available Cards Section */}
      {availableCardsToAdd.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-3">Available Cards</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {availableCardsToAdd.map((card) => (
              <div
                key={card.id}
                className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{card.name}</p>
                  <p className="text-xs text-gray-600">{card.description}</p>
                </div>
                <button
                  onClick={() => toggleCard(card.id)}
                  disabled={selectedCards.length >= 6}
                  className={`p-2 rounded transition-colors ${
                    selectedCards.length >= 6
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-green-600 hover:bg-green-100"
                  }`}
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSavePreferences}
          disabled={isSaving || selectedCards.length === 0}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </div>
  );
};
