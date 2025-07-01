import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Heart,
  Activity,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Apple,
  Gamepad2,
  Droplets,
  Gift,
  Trophy,
  Clock,
  Zap,
  Star,
  ShoppingCart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Pet, PET_TYPES, REVIVE_COST } from "@/models/Pet";
import { PetNav } from "@/features/pet/PetNav";
import { PetCreationScreen } from "@/features/pet/PetCreation";
import { PetPlayAction } from "@/features/pet/PetPlayAction";

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

  const createPet = () => {
    if (!newPetName.trim()) return;

    const newPet: Pet = {
      id: Date.now().toString(),
      name: newPetName.trim(),
      type: newPetType,
      health: 100,
      happiness: 100,
      mood: "happy",
      createdAt: new Date().toISOString(),
      lastActivityDate: new Date().toISOString(),
      isDead: false,
    };

    setPet(newPet);
    setNewPetName("");
    setIsCreatingPet(false);
  };

  const revivePet = () => {
    if (!pet || userPoints < REVIVE_COST) return;

    setUserPoints((prev) => prev - REVIVE_COST);
    setPet((prevPet) => {
      if (!prevPet) return null;

      return {
        ...prevPet,
        health: 50,
        happiness: 50,
        mood: "neutral",
        isDead: false,
        lastActivityDate: new Date().toISOString(),
      };
    });
  };

  const feedPet = () => {
    if (!pet || pet.isDead || userPoints < 5) return;

    const now = new Date().toISOString();
    const canFeed =
      !lastFeedTime ||
      new Date().getTime() - new Date(lastFeedTime).getTime() > 30 * 60 * 1000; // 30 minutes cooldown

    if (!canFeed) {
      setShowActionFeedback(
        "Your pet isn't hungry yet! Wait a bit before feeding again."
      );
      setTimeout(() => setShowActionFeedback(null), 3000);
      return;
    }

    setUserPoints((prev) => prev - 5);
    setLastFeedTime(now);
    setPet((prevPet) => {
      if (!prevPet) return null;

      const newHealth = Math.min(100, prevPet.health + 15);
      const newHappiness = Math.min(100, prevPet.happiness + 10);

      return {
        ...prevPet,
        health: newHealth,
        happiness: newHappiness,
        mood:
          newHealth >= 70 && newHappiness >= 70
            ? "happy"
            : newHealth >= 40 && newHappiness >= 40
            ? "neutral"
            : "sad",
        lastActivityDate: now,
      };
    });

    setShowActionFeedback(
      "🍎 Your pet enjoyed the meal! +15 Health, +10 Happiness"
    );
    setTimeout(() => setShowActionFeedback(null), 3000);
  };

  const cleanPet = () => {
    if (!pet || pet.isDead || userPoints < 3) return;

    const now = new Date().toISOString();
    const canClean =
      !lastCleanTime ||
      new Date().getTime() - new Date(lastCleanTime).getTime() > 60 * 60 * 1000; // 1 hour cooldown

    if (!canClean) {
      setShowActionFeedback("Your pet is already clean and fresh!");
      setTimeout(() => setShowActionFeedback(null), 3000);
      return;
    }

    setUserPoints((prev) => prev - 3);
    setLastCleanTime(now);
    setPet((prevPet) => {
      if (!prevPet) return null;

      const newHealth = Math.min(100, prevPet.health + 10);
      const newHappiness = Math.min(100, prevPet.happiness + 8);

      return {
        ...prevPet,
        health: newHealth,
        happiness: newHappiness,
        mood:
          newHealth >= 70 && newHappiness >= 70
            ? "happy"
            : newHealth >= 40 && newHappiness >= 40
            ? "neutral"
            : "sad",
        lastActivityDate: now,
      };
    });

    setShowActionFeedback(
      "🛁 Your pet feels fresh and clean! +10 Health, +8 Happiness"
    );
    setTimeout(() => setShowActionFeedback(null), 3000);
  };

  const getTimeUntilNextAction = (
    lastActionTime: string | null,
    cooldownMinutes: number
  ) => {
    if (!lastActionTime) return 0;

    const timeSince = new Date().getTime() - new Date(lastActionTime).getTime();
    const cooldownMs = cooldownMinutes * 60 * 1000;
    const timeLeft = cooldownMs - timeSince;

    return Math.max(0, Math.ceil(timeLeft / (60 * 1000))); // Return minutes left
  };

  const getPetEmoji = (pet: Pet) => {
    if (pet.isDead) return "💀";

    const baseEmoji = PET_TYPES[pet.type].emoji;

    switch (pet.mood) {
      case "happy":
        return baseEmoji;
      case "neutral":
        return baseEmoji;
      case "sad":
        return baseEmoji;
      case "dead":
        return "💀";
      default:
        return baseEmoji;
    }
  };

  const getMoodDescription = (mood: Pet["mood"]) => {
    switch (mood) {
      case "happy":
        return "Your pet is thriving and full of joy!";
      case "neutral":
        return "Your pet is doing okay but could use some attention.";
      case "sad":
        return "Your pet is feeling down and needs care.";
      case "dead":
        return "Your pet has passed away. Revive them to continue your journey together.";
      default:
        return "";
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 70) return "bg-green-500";
    if (health >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getHappinessColor = (happiness: number) => {
    if (happiness >= 70) return "bg-pink-500";
    if (happiness >= 40) return "bg-orange-500";
    return "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 pb-12">
      {/* Header */}
      <PetNav />

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
            <Card className="bg-white shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="text-center md:text-left mb-4 md:mb-0">
                    <motion.div
                      className="text-8xl mb-4"
                      animate={{
                        scale: pet.isDead ? 1 : [1, 1.1, 1],
                        rotate: pet.isDead ? 0 : [0, -5, 5, 0],
                      }}
                      transition={{
                        duration: pet.isDead ? 0 : 2,
                        repeat: pet.isDead ? 0 : Infinity,
                        repeatDelay: 3,
                      }}
                    >
                      {getPetEmoji(pet)}
                    </motion.div>
                    <h2 className="text-3xl font-bold text-purple-700 mb-2">
                      {pet.name}
                    </h2>
                    <Badge className="bg-purple-100 text-purple-700 px-3 py-1">
                      {PET_TYPES[pet.type].name}
                    </Badge>
                  </div>

                  <div className="space-y-4 w-full md:w-1/2">
                    {/* Health Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Heart className="h-5 w-5 text-red-500 mr-2" />
                          <span className="font-medium text-gray-700">
                            Health
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                          {pet.health}/100
                        </span>
                      </div>
                      <Progress
                        value={pet.health}
                        className={`h-3 ${getHealthColor(pet.health)}`}
                      />
                    </div>

                    {/* Happiness Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Sparkles className="h-5 w-5 text-yellow-500 mr-2" />
                          <span className="font-medium text-gray-700">
                            Happiness
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                          {pet.happiness}/100
                        </span>
                      </div>
                      <Progress
                        value={pet.happiness}
                        className={`h-3 ${getHappinessColor(pet.happiness)}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-gray-700 text-lg">
                    {getMoodDescription(pet.mood)}
                  </p>

                  {pet.isDead ? (
                    <div className="mt-4">
                      <Button
                        onClick={revivePet}
                        disabled={userPoints < REVIVE_COST}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        <RotateCcw className="h-5 w-5 mr-2" />
                        Revive Pet ({REVIVE_COST} XP)
                      </Button>
                      {userPoints < REVIVE_COST && (
                        <p className="text-red-600 text-sm mt-2">
                          You need {REVIVE_COST - userPoints} more XP to revive
                          your pet
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="mt-6">
                      {/* Action Feedback */}
                      {showActionFeedback && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded-lg mb-4 text-center"
                        >
                          {showActionFeedback}
                        </motion.div>
                      )}

                      {/* Pet Care Actions */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Feed Pet */}
                        <div className="text-center">
                          <Button
                            onClick={feedPet}
                            disabled={
                              userPoints < 5 ||
                              getTimeUntilNextAction(lastFeedTime, 30) > 0
                            }
                            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 mb-2"
                          >
                            <Apple className="h-5 w-5 mr-2" />
                            Feed Pet (5 XP)
                          </Button>
                          {getTimeUntilNextAction(lastFeedTime, 30) > 0 && (
                            <p className="text-xs text-gray-500">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {getTimeUntilNextAction(lastFeedTime, 30)}m left
                            </p>
                          )}
                        </div>

                        {/* Play with Pet */}
                        <PetPlayAction
                          lastPlayTime={lastPlayTime}
                          pet={pet}
                          setShowActionFeedback={setShowActionFeedback}
                          setUserPoints={setUserPoints}
                          setLastPlayTime={setLastPlayTime}
                          setPet={setPet}
                        />

                        {/* Clean Pet */}
                        <div className="text-center">
                          <Button
                            onClick={cleanPet}
                            disabled={
                              userPoints < 3 ||
                              getTimeUntilNextAction(lastCleanTime, 60) > 0
                            }
                            className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 mb-2"
                          >
                            <Droplets className="h-5 w-5 mr-2" />
                            Clean (3 XP)
                          </Button>
                          {getTimeUntilNextAction(lastCleanTime, 60) > 0 && (
                            <p className="text-xs text-gray-500">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {getTimeUntilNextAction(lastCleanTime, 60)}m left
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

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

              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-purple-700 flex items-center">
                    <Activity className="h-6 w-6 mr-2" />
                    Wellness Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl mb-2">📝</div>
                      <h3 className="font-semibold text-blue-700 mb-1">
                        Journal Entry
                      </h3>
                      <p className="text-sm text-blue-600">+10 Happiness</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Write about your thoughts and feelings
                      </p>
                    </div>

                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl mb-2">✅</div>
                      <h3 className="font-semibold text-green-700 mb-1">
                        Complete Task
                      </h3>
                      <p className="text-sm text-green-600">+5 Health</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Finish your daily wellness tasks
                      </p>
                    </div>

                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-3xl mb-2">🎯</div>
                      <h3 className="font-semibold text-purple-700 mb-1">
                        Build Habit
                      </h3>
                      <p className="text-sm text-purple-600">
                        +5 Health & Happiness
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Maintain your positive habits
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pet Store Card */}
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
                    <h3 className="font-semibold text-pink-700 mb-1">
                      Cute Bow
                    </h3>
                    <p className="text-sm text-pink-600 mb-2">50 XP</p>
                    <Button
                      size="sm"
                      disabled={userPoints < 50}
                      className="bg-pink-500 hover:bg-pink-600"
                    >
                      Buy Now
                    </Button>
                  </div>

                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-4xl mb-2">🎩</div>
                    <h3 className="font-semibold text-blue-700 mb-1">
                      Fancy Hat
                    </h3>
                    <p className="text-sm text-blue-600 mb-2">75 XP</p>
                    <Button
                      size="sm"
                      disabled={userPoints < 75}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      Buy Now
                    </Button>
                  </div>

                  <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-4xl mb-2">👑</div>
                    <h3 className="font-semibold text-yellow-700 mb-1">
                      Royal Crown
                    </h3>
                    <p className="text-sm text-yellow-600 mb-2">150 XP</p>
                    <Button
                      size="sm"
                      disabled={userPoints < 150}
                      className="bg-yellow-500 hover:bg-yellow-600"
                    >
                      Buy Now
                    </Button>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="font-semibold text-yellow-700">
                      Important:
                    </span>
                  </div>
                  <p className="text-yellow-700 text-sm">
                    If you don't engage in any activities for 2+ days, your
                    pet's health will decrease by 5 points per day. If health
                    reaches 0, your pet will need to be revived using{" "}
                    {REVIVE_COST} XP. Use direct care actions (feed, play,
                    clean) for immediate boosts!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default VirtualPetPage;
