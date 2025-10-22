import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, AlertTriangle } from "lucide-react";
import { useUserData } from "@/context/UserDataContext";
import { REVIVE_COST } from "@/models/Pet";


export const PetStore = () => {
  const { userData } = useUserData();

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-purple-700 flex items-center">
          <ShoppingCart className="h-6 w-6 mr-2" />
          Pet Accessories Shop
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-pink-50 rounded-lg border border-pink-200">
            <div className="text-4xl mb-2">🎀</div>
            <h3 className="font-semibold text-pink-700 mb-1">Cute Bow</h3>
            <p className="text-sm text-pink-600 mb-2">50 XP</p>
            <Button
              size="sm"
              disabled={userData.xp < 50}
              className="bg-pink-500 hover:bg-pink-600"
            >
              Buy Now
            </Button>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-4xl mb-2">🎩</div>
            <h3 className="font-semibold text-blue-700 mb-1">Fancy Hat</h3>
            <p className="text-sm text-blue-600 mb-2">75 XP</p>
            <Button
              size="sm"
              disabled={userData.xp < 75}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Buy Now
            </Button>
          </div>

          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-4xl mb-2">👑</div>
            <h3 className="font-semibold text-yellow-700 mb-1">Royal Crown</h3>
            <p className="text-sm text-yellow-600 mb-2">150 XP</p>
            <Button
              size="sm"
              disabled={userData.xp < 150}
              className="bg-yellow-500 hover:bg-yellow-600"
            >
              Buy Now
            </Button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center mb-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
            <span className="font-semibold text-yellow-700">Important:</span>
          </div>
          <p className="text-yellow-700 text-sm">
            If you don't engage in any activities for 2+ days, your pet's health
            will decrease by 5 points per day. If health reaches 0, your pet
            will need to be revived using {REVIVE_COST} XP. Use direct care
            actions (feed, play, clean) for immediate boosts!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
