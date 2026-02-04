import { Card, CardContent } from "@/components/ui/card";
import { Star, Wallet, Coins, ShoppingBag, TrendingUp, BookOpen, CheckSquare, Repeat } from "lucide-react";
import { motion } from "framer-motion";
import { useUserData } from "@/context/UserDataContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Average user total XP (mock data - could be fetched from backend)
const AVERAGE_USER_TOTAL_XP = 2500;

// Calculate XP source breakdown percentages
const getXPBreakdown = (xpBreakdown?: { journals: number; tasks: number; habits: number }) => {
  if (!xpBreakdown) {
    return { journals: 0, tasks: 0, habits: 0 };
  }

  const total = xpBreakdown.journals + xpBreakdown.tasks + xpBreakdown.habits;

  if (total === 0) {
    return { journals: 0, tasks: 0, habits: 0 };
  }

  return {
    journals: Math.round((xpBreakdown.journals / total) * 100),
    tasks: Math.round((xpBreakdown.tasks / total) * 100),
    habits: Math.round((xpBreakdown.habits / total) * 100),
  };
};

// Calculate lifetime XP rank percentile
const getLifetimeRankPercentile = (totalXP: number): number => {
  if (totalXP <= AVERAGE_USER_TOTAL_XP) {
    // Below average - map to 50-100% range
    const ratio = totalXP / AVERAGE_USER_TOTAL_XP;
    return Math.round(50 + (1 - ratio) * 50);
  } else {
    // Above average - map to 1-50% range
    const excessXP = totalXP - AVERAGE_USER_TOTAL_XP;
    const scaleFactor = Math.min(excessXP / AVERAGE_USER_TOTAL_XP, 2);
    return Math.round(50 - (scaleFactor / 2) * 45);
  }
};

// This is the Points progress card in the Home page under the welcome banner
export const ProgressCurrentPoints = () => {

  const { userData } = useUserData();
  const { theme } = useTheme();
  if (!userData) return null;

  const totalXP = userData.totalXP || 0;
  const spendableXP = userData.spendableXP || 0;
  const xpBreakdown = getXPBreakdown(userData.progression?.xpBreakdown);
  const lifetimeRankPercentile = getLifetimeRankPercentile(totalXP);

  // Get actual XP values for tooltips
  const journalXP = userData.progression?.xpBreakdown?.journals || 0;
  const taskXP = userData.progression?.xpBreakdown?.tasks || 0;
  const habitXP = userData.progression?.xpBreakdown?.habits || 0;

  return (
    <TooltipProvider>
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-none shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-gray-700">Experience Points</h3>
            <Star className="h-5 w-5 text-yellow-500" />
          </div>

          {/* Split view: Total XP vs Spendable XP */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Total XP */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-white/50 rounded-lg p-3 border border-indigo-100 cursor-help">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Coins className="h-4 w-4 text-indigo-500" />
                    <span className="text-xs text-gray-600 font-medium">Total XP</span>
                  </div>
                  <motion.p
                    className="text-2xl font-bold text-indigo-600"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    key={totalXP}
                  >
                    {totalXP.toLocaleString()}
                  </motion.p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">Lifetime Total XP</p>
                <p className="text-xs opacity-90">All XP you've ever earned</p>
                <p className="text-xs opacity-90">Used for leveling up</p>
              </TooltipContent>
            </Tooltip>

            {/* Spendable XP */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-white/50 rounded-lg p-3 border border-green-100 cursor-help">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Wallet className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-gray-600 font-medium">Spendable</span>
                  </div>
                  <motion.p
                    className="text-2xl font-bold text-green-600"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    key={spendableXP}
                  >
                    {spendableXP.toLocaleString()}
                  </motion.p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">Spendable XP</p>
                <p className="text-xs opacity-90">XP available to spend in the store</p>
                <p className="text-xs opacity-90">Separate from total XP</p>
              </TooltipContent>
            </Tooltip>
          </div>

        {/* XP Breakdown by Source */}
        {(xpBreakdown.journals > 0 || xpBreakdown.tasks > 0 || xpBreakdown.habits > 0) && (
          <div className="mb-4 pb-4 border-b border-indigo-200">
            <h4 className="text-xs font-semibold text-gray-700 mb-2">XP Sources</h4>
            <div className="space-y-2">
              {/* Journals */}
              {xpBreakdown.journals > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-help">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="flex items-center gap-1.5 text-gray-600">
                          <BookOpen className="h-3.5 w-3.5 text-purple-500" />
                          Journals
                        </span>
                        <span className="font-semibold text-purple-600">{xpBreakdown.journals}%</span>
                      </div>
                      <Progress value={xpBreakdown.journals} className="h-1.5 bg-purple-100" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-semibold">Journal XP: {journalXP.toLocaleString()}</p>
                    <p className="text-xs opacity-90">30 XP per journal entry</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {/* Tasks */}
              {xpBreakdown.tasks > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-help">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="flex items-center gap-1.5 text-gray-600">
                          <CheckSquare className="h-3.5 w-3.5 text-blue-500" />
                          Tasks
                        </span>
                        <span className="font-semibold text-blue-600">{xpBreakdown.tasks}%</span>
                      </div>
                      <Progress value={xpBreakdown.tasks} className="h-1.5 bg-blue-100" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-semibold">Task XP: {taskXP.toLocaleString()}</p>
                    <p className="text-xs opacity-90">20 XP per completed task</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {/* Habits */}
              {xpBreakdown.habits > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-help">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="flex items-center gap-1.5 text-gray-600">
                          <Repeat className="h-3.5 w-3.5 text-green-500" />
                          Habits
                        </span>
                        <span className="font-semibold text-green-600">{xpBreakdown.habits}%</span>
                      </div>
                      <Progress value={xpBreakdown.habits} className="h-1.5 bg-green-100" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-semibold">Habit XP: {habitXP.toLocaleString()}</p>
                    <p className="text-xs opacity-90">10 XP per completed habit</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        )}

        {/* Lifetime XP Rank */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-indigo-500" />
            <span className="text-xs font-semibold text-gray-700">Lifetime Rank</span>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className={`cursor-help ${
                  lifetimeRankPercentile <= 15
                    ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                    : lifetimeRankPercentile <= 30
                    ? "bg-green-100 text-green-700 border-green-300"
                    : lifetimeRankPercentile <= 50
                    ? "bg-blue-100 text-blue-700 border-blue-300"
                    : "bg-gray-100 text-gray-700 border-gray-300"
                }`}
              >
                Top {lifetimeRankPercentile}% of all users
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-semibold">Your Total XP: {totalXP.toLocaleString()}</p>
              <p className="text-xs opacity-90">Average User: {AVERAGE_USER_TOTAL_XP.toLocaleString()} XP</p>
              <p className="text-xs opacity-90">Based on lifetime XP earned</p>
            </TooltipContent>
          </Tooltip>
          <p className="text-xs text-gray-500 mt-1">
            {lifetimeRankPercentile <= 15
              ? "Elite performer! You're among the best!"
              : lifetimeRankPercentile <= 30
              ? "Excellent progress! Keep climbing!"
              : lifetimeRankPercentile <= 50
              ? "Above average! You're doing great!"
              : "Keep earning XP to climb the ranks!"}
          </p>
        </div>

        {/* Quick Spend Button */}
        <Link to="/store">
          <Button
            className="w-full text-white shadow-md hover:brightness-110 transition-all"
            size="sm"
            style={{
              background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
            }}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Visit Store
          </Button>
        </Link>
      </CardContent>
    </Card>
    </TooltipProvider>
  );
};
