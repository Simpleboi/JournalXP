import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Trophy, Star, Zap, TrendingUp, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useUserData } from "@/context/UserDataContext";
import { levelData } from "@/data/levels";
import { useState, useEffect, useRef } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Level tier configuration
const getLevelTier = (level: number) => {
  if (level >= 1 && level <= 10) return {
    tier: "Novice",
    icon: Zap,
    color: "text-blue-500",
    bgGradient: "from-blue-50 to-cyan-50",
    badge: "bg-blue-500",
  };
  if (level >= 11 && level <= 25) return {
    tier: "Intermediate",
    icon: Star,
    color: "text-purple-500",
    bgGradient: "from-purple-50 to-pink-50",
    badge: "bg-purple-500",
  };
  if (level >= 26 && level <= 50) return {
    tier: "Advanced",
    icon: Award,
    color: "text-orange-500",
    bgGradient: "from-orange-50 to-amber-50",
    badge: "bg-orange-500",
  };
  if (level >= 51 && level <= 75) return {
    tier: "Expert",
    icon: Trophy,
    color: "text-emerald-500",
    bgGradient: "from-emerald-50 to-teal-50",
    badge: "bg-emerald-500",
  };
  return {
    tier: "Master",
    icon: Sparkles,
    color: "text-rose-500",
    bgGradient: "from-rose-50 to-pink-50",
    badge: "bg-rose-500",
  };
};

// Check if level is a milestone
const isMilestone = (level: number): boolean => {
  return [10, 25, 50, 75, 100].includes(level);
};

// Get milestone icon
const getMilestoneIcon = (level: number) => {
  if (level === 10) return { icon: Star, color: "text-blue-500", label: "Rising Star" };
  if (level === 25) return { icon: Trophy, color: "text-purple-500", label: "Quarter Century" };
  if (level === 50) return { icon: Award, color: "text-orange-500", label: "Half Century" };
  if (level === 75) return { icon: Sparkles, color: "text-emerald-500", label: "Elite Status" };
  if (level === 100) return { icon: Trophy, color: "text-rose-500", label: "Legendary" };
  return null;
};

// Average user level (mock data - could be fetched from backend)
const AVERAGE_USER_LEVEL = 18;

// Confetti particle component
const ConfettiParticle = ({ delay }: { delay: number }) => {
  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#BB8FCE"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomX = Math.random() * 200 - 100;
  const randomRotation = Math.random() * 360;

  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{ backgroundColor: randomColor, top: "50%", left: "50%" }}
      initial={{ opacity: 1, scale: 0, x: 0, y: 0, rotate: 0 }}
      animate={{
        opacity: 0,
        scale: [1, 1.5, 0],
        x: randomX,
        y: [-100, -150],
        rotate: randomRotation,
      }}
      transition={{
        duration: 1.5,
        delay: delay,
        ease: "easeOut",
      }}
    />
  );
};

export const ProgressCurrentLevel = () => {
  const { userData } = useUserData();
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const previousLevelRef = useRef<number>(1);

  if (!userData) return null;

  // Calculate actual level based on totalXP
  const totalXP = userData.totalXP || 0;

  // Find the highest level the user has reached
  let calculatedLevel = 1;
  for (let i = 0; i < levelData.length; i++) {
    if (totalXP >= levelData[i].totalPointsRequired) {
      calculatedLevel = levelData[i].level;
    } else {
      break;
    }
  }

  // Detect level up
  useEffect(() => {
    if (previousLevelRef.current < calculatedLevel) {
      setShowLevelUpAnimation(true);
      setShowConfetti(true);

      setTimeout(() => {
        setShowLevelUpAnimation(false);
      }, 3000);

      setTimeout(() => {
        setShowConfetti(false);
      }, 2000);
    }
    previousLevelRef.current = calculatedLevel;
  }, [calculatedLevel]);

  // Get XP required to reach the current level
  const pointsForCurrentLevel =
    levelData[calculatedLevel - 1]?.totalPointsRequired || 0;

  // Get XP required to reach the next level
  const pointsForNextLevel = levelData[calculatedLevel]?.totalPointsRequired || pointsForCurrentLevel;

  // Calculate XP within current level
  const xpInCurrentLevel = totalXP - pointsForCurrentLevel;

  // Calculate percentage progress towards next level
  const xpNeededForNextLevel = pointsForNextLevel - pointsForCurrentLevel;
  const levelProgress = xpNeededForNextLevel > 0
    ? (xpInCurrentLevel / xpNeededForNextLevel) * 100
    : 0;

  const tierInfo = getLevelTier(calculatedLevel);
  const TierIcon = tierInfo.icon;
  const milestone = getMilestoneIcon(calculatedLevel);
  const isCloseToLevelUp = levelProgress >= 85;
  const comparisonToAverage = calculatedLevel - AVERAGE_USER_LEVEL;

  return (
    <TooltipProvider>
    <Card className={`bg-gradient-to-br ${tierInfo.bgGradient} border-none shadow-md hover:shadow-lg transition-shadow relative overflow-hidden`}>
      {/* Confetti animation */}
      <AnimatePresence>
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none z-50">
            {Array.from({ length: 50 }).map((_, i) => (
              <ConfettiParticle key={i} delay={i * 0.02} />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Level-up celebration overlay */}
      <AnimatePresence>
        {showLevelUpAnimation && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 backdrop-blur-sm z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-center"
            >
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">Level Up!</p>
              <p className="text-lg text-gray-600">Level {calculatedLevel}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CardContent className="p-6 relative z-10">
        {/* Header with title and tier badge */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-gray-700">Current Level</h3>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  className={`${tierInfo.badge} text-white text-xs px-2 py-0.5 cursor-help`}
                >
                  {tierInfo.tier}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">{tierInfo.tier} Tier</p>
                <p className="text-xs opacity-90">
                  {calculatedLevel >= 76 ? "Levels 76+" :
                   calculatedLevel >= 51 ? "Levels 51-75" :
                   calculatedLevel >= 26 ? "Levels 26-50" :
                   calculatedLevel >= 11 ? "Levels 11-25" :
                   "Levels 1-10"}
                </p>
              </TooltipContent>
            </Tooltip>
            <TierIcon className={`h-5 w-5 ${tierInfo.color}`} />
          </div>
        </div>

        {/* Milestone badge on its own row */}
        {milestone && (
          <div className="mb-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="inline-block"
                >
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 cursor-help">
                    <milestone.icon className="h-3 w-3 mr-1" />
                    {milestone.label}
                  </Badge>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">Milestone Achievement!</p>
                <p className="text-xs opacity-90">Level {calculatedLevel} is a major milestone</p>
                <p className="text-xs opacity-90">Congratulations on this accomplishment!</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        <div className="flex items-end gap-3 mb-3">
          {/* Level number */}
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.p
                className={`text-4xl font-bold ${tierInfo.color} cursor-help`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                key={calculatedLevel}
              >
                {calculatedLevel}
              </motion.p>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-semibold">Level {calculatedLevel}</p>
              <p className="text-xs opacity-90">XP in level: {xpInCurrentLevel.toLocaleString()}</p>
              <p className="text-xs opacity-90">XP to next: {(xpNeededForNextLevel - xpInCurrentLevel).toLocaleString()}</p>
              <p className="text-xs opacity-90">Total XP: {totalXP.toLocaleString()}</p>
            </TooltipContent>
          </Tooltip>

          <div className="flex-1 mb-2">
            <Badge
              variant="outline"
              className={`${isCloseToLevelUp ? "bg-yellow-100 text-yellow-700 border-yellow-300 animate-pulse" : "bg-gray-100 text-gray-700 border-gray-200"}`}
            >
              {isCloseToLevelUp && <Sparkles className="h-3 w-3 mr-1 inline" />}
              {Math.round(levelProgress)}% to Level {calculatedLevel + 1}
            </Badge>
          </div>
        </div>

        {/* Progress bar with animation when close to level up */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="mt-2 relative cursor-help">
              <Progress
                value={levelProgress}
                className={`h-2.5 ${isCloseToLevelUp ? "bg-yellow-200" : "bg-gray-200"}`}
              />
              {isCloseToLevelUp && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/50 to-transparent h-2.5 rounded-full"
                  animate={{ x: [-100, 200] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-semibold">Progress to Level {calculatedLevel + 1}</p>
            <p className="text-xs opacity-90">{xpInCurrentLevel.toLocaleString()} / {xpNeededForNextLevel.toLocaleString()} XP</p>
            <p className="text-xs opacity-90">{(xpNeededForNextLevel - xpInCurrentLevel).toLocaleString()} XP remaining</p>
          </TooltipContent>
        </Tooltip>

        {/* Comparison to average */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-between text-xs cursor-help">
                <span className="text-gray-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  vs. Average User
                </span>
                <span className={`font-semibold ${comparisonToAverage > 0 ? "text-green-600" : comparisonToAverage < 0 ? "text-orange-600" : "text-gray-600"}`}>
                  {comparisonToAverage > 0 ? `+${comparisonToAverage}` : comparisonToAverage} levels
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-semibold">Level Comparison</p>
              <p className="text-xs opacity-90">Your level: {calculatedLevel}</p>
              <p className="text-xs opacity-90">Average level: {AVERAGE_USER_LEVEL}</p>
            </TooltipContent>
          </Tooltip>
          {comparisonToAverage > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              You're ahead of {Math.round(((calculatedLevel - AVERAGE_USER_LEVEL) / calculatedLevel) * 100)}% of users!
            </p>
          )}
          {comparisonToAverage < 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Keep going! You're building momentum.
            </p>
          )}
          {comparisonToAverage === 0 && (
            <p className="text-xs text-gray-500 mt-1">
              You're right on track with the community!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
    </TooltipProvider>
  );
};
