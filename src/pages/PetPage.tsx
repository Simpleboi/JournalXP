import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Gift, Trophy, Zap, Star, Trash2 } from "lucide-react";
import { Pet, PET_TYPES } from "@/models/Pet";
import { PetNav } from "@/features/pet/PetNav";
import { PetCreationScreen } from "@/features/pet/PetCreation";
import { PetWellnesSGuide } from "@/features/pet/PetCareGuide";
import { PetStore } from "@/features/pet/PetStore";
import { PetStatus } from "@/features/pet/PetMain";
import { MiniQuests } from "@/features/pet/PetSideQuests";
import {
  Dialog,
  DialogFooter,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const VirtualPetPage = () => {
  const [pet, setPet] = useState<Pet | null>(null);
  const [userPoints, setUserPoints] = useState(1250); // Default points from ProgressStats
  const [isCreatingPet, setIsCreatingPet] = useState(false);
  const [newPetName, setNewPetName] = useState("");
  const [newPetType, setNewPetType] = useState<keyof typeof PET_TYPES>("cat");
  const [lastFeedTime, setLastFeedTime] = useState<string | null>(null);
  const [lastPlayTime, setLastPlayTime] = useState<string | null>(null);
  const [lastCleanTime, setLastCleanTime] = useState<string | null>(null);
  const [showActionFeedback, setShowActionFeedback] = useState<string | null>(
    null
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load pet data from localStorage on component mount
  useEffect(() => {
    const savedPet = localStorage.getItem("virtualPet");
    const savedPoints = localStorage.getItem("userPoints");
    const savedFeedTime = localStorage.getItem("lastFeedTime");
    const savedPlayTime = localStorage.getItem("lastPlayTime");
    const savedCleanTime = localStorage.getItem("lastCleanTime");

    if (savedPet) {
      setPet(JSON.parse(savedPet));
    }

    if (savedPoints) {
      setUserPoints(parseInt(savedPoints));
    }

    if (savedFeedTime) {
      setLastFeedTime(savedFeedTime);
    }

    if (savedPlayTime) {
      setLastPlayTime(savedPlayTime);
    }

    if (savedCleanTime) {
      setLastCleanTime(savedCleanTime);
    }
  }, []);

  // Save pet data to localStorage whenever it changes
  useEffect(() => {
    if (pet) {
      localStorage.setItem("virtualPet", JSON.stringify(pet));
    }
  }, [pet]);

  // Save user points to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("userPoints", userPoints.toString());
  }, [userPoints]);

  // Save action times to localStorage
  useEffect(() => {
    if (lastFeedTime) localStorage.setItem("lastFeedTime", lastFeedTime);
  }, [lastFeedTime]);

  useEffect(() => {
    if (lastPlayTime) localStorage.setItem("lastPlayTime", lastPlayTime);
  }, [lastPlayTime]);

  useEffect(() => {
    if (lastCleanTime) localStorage.setItem("lastCleanTime", lastCleanTime);
  }, [lastCleanTime]);

  // Check for inactivity and decrease health
  useEffect(() => {
    if (!pet || pet.isDead) return;

    const checkInactivity = () => {
      const now = new Date();
      const lastActivity = pet.lastActivityDate
        ? new Date(pet.lastActivityDate)
        : new Date(pet.createdAt);
      const daysSinceActivity = Math.floor(
        (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceActivity >= 2) {
        const healthDecrease = (daysSinceActivity - 1) * 5; // -5 health per day after 2 days
        const newHealth = Math.max(0, pet.health - healthDecrease);

        setPet((prevPet) => {
          if (!prevPet) return null;

          const updatedPet = {
            ...prevPet,
            health: newHealth,
            isDead: newHealth === 0,
            mood:
              newHealth === 0
                ? ("dead" as const)
                : newHealth < 30
                ? ("sad" as const)
                : newHealth < 70
                ? ("neutral" as const)
                : ("happy" as const),
          };

          return updatedPet;
        });
      }
    };

    checkInactivity();
    const interval = setInterval(checkInactivity, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [pet]);

  // Function to delete pet
  const deletePet = () => {
    setPet(null);
    setShowDeleteConfirm(false);
    localStorage.removeItem("virtualPet");
    localStorage.removeItem("lastFeedTime");
    localStorage.removeItem("lastPlayTime");
    localStorage.removeItem("lastCleanTime");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 pb-12">
      {/* Header */}
      <PetNav
        pet={pet}
        setShowDeleteConfirm={setShowDeleteConfirm}
      />

      <main className="container mx-auto px-4 py-8">
        {!pet ? (
          /* Pet Creation */
          <PetCreationScreen
            newPetType={newPetType}
            setNewPetType={setNewPetType}
            newPetName={newPetName}
            setNewPetName={setNewPetName}
            setPet={setPet}
            setIsCreatingPet={setIsCreatingPet}
          />
        ) : (
          /* Pet Display */
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Pet Status Card */}
            <PetStatus
              pet={pet}
              setPet={setPet}
              lastFeedTime={lastFeedTime}
              setLastFeedTime={setLastFeedTime}
              lastPlayTime={lastPlayTime}
              setLastPlayTime={setLastPlayTime}
              lastCleanTime={lastCleanTime}
              setLastCleanTime={setLastCleanTime}
              showActionFeedback={showActionFeedback}
              setShowActionFeedback={setShowActionFeedback}
              setUserPoints={setUserPoints}
            />

            <MiniQuests pet={pet} />

            {/* Pet Stats & Achievements Card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-purple-700 flex items-center">
                    <Trophy className="h-6 w-6 mr-2" />
                    Pet Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-500 mr-2" />
                        <span className="font-medium text-gray-700">
                          First Pet
                        </span>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-700">
                        Unlocked
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <Heart className="h-5 w-5 text-green-500 mr-2" />
                        <span className="font-medium text-gray-700">
                          Happy Pet
                        </span>
                      </div>
                      <Badge
                        className={
                          pet?.happiness >= 80
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }
                      >
                        {pet?.happiness >= 80 ? "Unlocked" : "Locked"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <Zap className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="font-medium text-gray-700">
                          Healthy Pet
                        </span>
                      </div>
                      <Badge
                        className={
                          pet?.health >= 90
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-500"
                        }
                      >
                        {pet?.health >= 90 ? "Unlocked" : "Locked"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center">
                        <Gift className="h-5 w-5 text-purple-500 mr-2" />
                        <span className="font-medium text-gray-700">
                          Pet Caretaker
                        </span>
                      </div>
                      <Badge className="bg-gray-100 text-gray-500">
                        Coming Soon
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pet Wellness Guide */}
              <PetWellnesSGuide />
            </div>

            {/* Pet Store Card */}
            <PetStore />
          </div>
        )}

        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600">
                Delete Your Pet?
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete {pet?.name}? This action cannot
                be undone.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">
                  <strong>Warning:</strong> All progress, bonding levels,
                  accessories, and quest progress will be permanently lost.
                </p>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={deletePet}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Forever
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default VirtualPetPage;
