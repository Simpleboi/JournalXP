import { TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  BookOpen,
  CheckCircle2,
  Flame,
  Calendar,
  ArrowRight,
  Sparkles,
  Target,
  Clock,
  ChevronRight,
} from "lucide-react";
import { useUserData } from "@/context/UserDataContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import {
  staggerContainer,
  staggerItem,
  triggerHaptic,
} from "./profileThemeUtils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

// Stat breakdown item for hover cards
interface BreakdownItem {
  label: string;
  value: string | number;
}

// Quick stat card component with hover breakdown
function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  color,
  breakdown,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtext?: string;
  color: string;
  breakdown?: BreakdownItem[];
}) {
  const [isHovered, setIsHovered] = useState(false);

  const cardContent = (
    <motion.div
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer relative overflow-hidden"
      whileHover={{ y: -4, boxShadow: "0 10px 40px -10px rgba(0,0,0,0.15)" }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => {
        setIsHovered(true);
        triggerHaptic("light");
      }}
      onHoverEnd={() => setIsHovered(false)}
      variants={staggerItem}
    >
      {/* Animated background glow on hover */}
      <motion.div
        className={`absolute inset-0 ${color} opacity-0`}
        animate={{ opacity: isHovered ? 0.05 : 0 }}
        transition={{ duration: 0.2 }}
      />

      <div className="flex items-start gap-3 relative z-10">
        <motion.div
          className={`p-2 rounded-lg ${color}`}
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Icon className="h-5 w-5 text-white" />
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {subtext && <p className="text-xs text-gray-400 mt-0.5">{subtext}</p>}
        </div>
        {breakdown && (
          <motion.div
            animate={{ x: isHovered ? 0 : -5, opacity: isHovered ? 1 : 0 }}
            className="self-center"
          >
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );

  if (breakdown && breakdown.length > 0) {
    return (
      <HoverCard openDelay={200} closeDelay={100}>
        <HoverCardTrigger asChild>{cardContent}</HoverCardTrigger>
        <HoverCardContent className="w-64" side="top" align="center">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Icon className={`h-4 w-4 ${color.replace("bg-", "text-").replace("-500", "-600")}`} />
              {label} Breakdown
            </h4>
            <div className="space-y-1.5">
              {breakdown.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between text-sm py-1 border-b border-gray-100 last:border-0"
                >
                  <span className="text-gray-500">{item.label}</span>
                  <span className="font-medium text-gray-700">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  }

  return cardContent;
}

// Quick action button component
function QuickAction({
  icon: Icon,
  label,
  to,
  color,
}: {
  icon: React.ElementType;
  label: string;
  to: string;
  color: string;
}) {
  return (
    <Link to={to}>
      <motion.div
        className={`flex items-center gap-3 p-4 rounded-xl ${color} text-white cursor-pointer`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Icon className="h-5 w-5" />
        <span className="font-medium">{label}</span>
        <ArrowRight className="h-4 w-4 ml-auto" />
      </motion.div>
    </Link>
  );
}

export const ProfileOverview = () => {
  const { userData } = useUserData();
  const { theme } = useTheme();

  // Calculate XP progress to next level
  const xpProgress =
    userData.xpNeededToNextLevel > 0
      ? ((userData.xp || 0) / userData.xpNeededToNextLevel) * 100
      : 0;

  // Get recent activity timestamps
  const lastJournalDate = userData.lastJournalEntryDate
    ? formatDistanceToNow(new Date(userData.lastJournalEntryDate), {
        addSuffix: true,
      })
    : "Never";

  const lastSundayChat = userData.lastSundayChat
    ? formatDistanceToNow(new Date(userData.lastSundayChat), { addSuffix: true })
    : "Never";

  return (
    <TabsContent value="overview" className="space-y-6">
      {/* Level Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-6 text-white shadow-lg"
        style={{
          background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary}, ${theme.colors.accent})`,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/80 text-sm">Current Level</p>
            <p className="text-4xl font-bold">{userData.level}</p>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-sm">Rank</p>
            <p className="text-xl font-semibold">{userData.rank}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to Level {userData.level + 1}</span>
            <span>
              {userData.xp || 0} / {userData.xpNeededToNextLevel} XP
            </span>
          </div>
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full transition-all duration-500 ease-out rounded-full"
              style={{
                width: `${xpProgress}%`,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Grid with Staggered Animation */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <StatCard
          icon={Sparkles}
          label="Total XP"
          value={userData.totalXP?.toLocaleString() || 0}
          color="bg-amber-500"
          breakdown={[
            { label: "From Journals", value: userData.journalStats?.totalXPfromJournals?.toLocaleString() || 0 },
            { label: "From Tasks", value: userData.taskStats?.totalXPfromTasks?.toLocaleString() || 0 },
            { label: "From Habits", value: userData.habitStats?.totalXpFromHabits?.toLocaleString() || 0 },
            { label: "Spendable", value: userData.spendableXP?.toLocaleString() || 0 },
          ]}
        />
        <StatCard
          icon={Flame}
          label="Current Streak"
          value={userData.streak || 0}
          subtext={`Best: ${userData.bestStreak || 0} days`}
          color="bg-orange-500"
          breakdown={[
            { label: "Current Streak", value: `${userData.streak || 0} days` },
            { label: "Best Streak", value: `${userData.bestStreak || 0} days` },
            { label: "Login Streak", value: `${userData.currentLoginStreak || 0} days` },
            { label: "Best Login", value: `${userData.bestLoginStreak || 0} days` },
          ]}
        />
        <StatCard
          icon={BookOpen}
          label="Journal Entries"
          value={userData.journalStats?.totalJournalEntries || 0}
          subtext={`${userData.journalStats?.totalWordCount?.toLocaleString() || 0} words`}
          color="bg-blue-500"
          breakdown={[
            { label: "Total Entries", value: userData.journalStats?.totalJournalEntries || 0 },
            { label: "Total Words", value: userData.journalStats?.totalWordCount?.toLocaleString() || 0 },
            { label: "Avg. Length", value: `${userData.journalStats?.averageEntryLength || 0} words` },
            { label: "Longest Entry", value: `${userData.journalStats?.longestEntry || 0} words` },
          ]}
        />
        <StatCard
          icon={CheckCircle2}
          label="Tasks Completed"
          value={userData.taskStats?.totalTasksCompleted || 0}
          subtext={`${userData.taskStats?.totalSuccessRate || 0}% success rate`}
          color="bg-green-500"
          breakdown={[
            { label: "Total Created", value: userData.taskStats?.totalTasksCreated || 0 },
            { label: "Completed", value: userData.taskStats?.totalTasksCompleted || 0 },
            { label: "Success Rate", value: `${userData.taskStats?.totalSuccessRate || 0}%` },
            { label: "On-Time", value: userData.taskStats?.onTimeCompletions || 0 },
          ]}
        />
      </motion.div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-400" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <BookOpen className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-gray-700">Last journal entry</span>
            </div>
            <span className="text-sm text-gray-500">{lastJournalDate}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Sparkles className="h-4 w-4 text-purple-600" />
              </div>
              <span className="text-gray-700">Last Sunday chat</span>
            </div>
            <span className="text-sm text-gray-500">{lastSundayChat}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Target className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-gray-700">Habits completed today</span>
            </div>
            <span className="text-sm text-gray-500">
              {userData.habitStats?.currentActiveHabits || 0} active
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <QuickAction
            icon={BookOpen}
            label="Write in Journal"
            to="/journal"
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <QuickAction
            icon={Sparkles}
            label="Chat with Sunday"
            to="/sunday"
            color="bg-gradient-to-r from-purple-500 to-purple-600"
          />
          <QuickAction
            icon={Target}
            label="View Habits"
            to="/habits"
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
          <QuickAction
            icon={TrendingUp}
            label="View Insights"
            to="/insights"
            color="bg-gradient-to-r from-amber-500 to-amber-600"
          />
        </div>
      </div>

      {/* Lifetime Stats */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Lifetime Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-800">
              {userData.habitStats?.totalHabitCompletions || 0}
            </p>
            <p className="text-sm text-gray-500">Habit completions</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-800">
              {userData.journalStats?.totalJournalEntries || 0}
            </p>
            <p className="text-sm text-gray-500">Journal entries</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-800">
              {userData.taskStats?.totalTasksCompleted || 0}
            </p>
            <p className="text-sm text-gray-500">Tasks completed</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-800">
              {userData.sundayStats?.totalConversations || 0}
            </p>
            <p className="text-sm text-gray-500">Sunday conversations</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-800">
              {(userData.journalStats?.totalWordCount || 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Words written</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-800">
              {userData.achievementStats?.totalUnlocked || 0}
            </p>
            <p className="text-sm text-gray-500">Achievements unlocked</p>
          </div>
        </div>
      </div>
    </TabsContent>
  );
};
