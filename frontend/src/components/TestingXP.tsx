import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Award, Sparkles } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { useUserData } from "@/context/UserDataContext";
import { useToast } from "./ui/use-toast";
import { authFetch } from "@/lib/authFetch";

export const TestingXP = () => {
  const [testXP, setTestXP] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { userData, refreshUserData } = useUserData();
  const { toast } = useToast();

  const awardXP = async () => {
    const xpAmount = parseInt(testXP);
    if (!xpAmount || xpAmount <= 0) return;

    try {
      setIsLoading(true);

      // Call the test XP endpoint
      await authFetch("/test/award-xp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xp: xpAmount }),
      });

      // Refresh user data to show updated XP and level
      await refreshUserData();

      toast({
        title: "XP Awarded! ✨",
        description: `Successfully added ${xpAmount} XP to your account`,
      });

      setTestXP("");
    } catch (error: any) {
      console.error("Error awarding test XP:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to award XP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      awardXP();
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mb-10"
    >
      <Card className="max-w-2xl mx-auto bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Award className="h-6 w-6 text-yellow-600" />
              XP Testing Component
            </h3>
            <div className="bg-yellow-100 px-4 py-2 rounded-full">
              <span className="text-sm text-gray-600">Total XP: </span>
              <span className="text-2xl font-bold text-yellow-700">
                {userData?.totalXP || 0}
              </span>
            </div>
          </div>
          <div className="mb-4 flex gap-4 text-sm">
            <div>
              <span className="text-gray-600">Level: </span>
              <span className="font-bold text-indigo-600">{userData?.level || 1}</span>
            </div>
            <div>
              <span className="text-gray-600">Rank: </span>
              <span className="font-bold text-purple-600">{userData?.rank || "Bronze III"}</span>
            </div>
            <div>
              <span className="text-gray-600">Current XP: </span>
              <span className="font-bold text-green-600">{userData?.xp || 0}/{userData?.xpNeededToNextLevel || 100}</span>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            Test the XP system by entering a number of points to award yourself
          </p>
          <div className="flex gap-3">
            <Input
              type="number"
              placeholder="Enter XP amount..."
              value={testXP}
              onChange={(e) => setTestXP(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
              min="0"
              disabled={isLoading}
            />
            <Button
              onClick={awardXP}
              className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600"
              disabled={!testXP || parseInt(testXP) <= 0 || isLoading}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isLoading ? "Awarding..." : "Award XP"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
};
