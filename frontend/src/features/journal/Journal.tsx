import { Badge } from "@/components/ui/badge";
import { Star, Edit3, BookOpen, Heart, Tag, Lightbulb, PenLine, Smile, ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { prompts } from "./JournalPrompts";
import { JournalProps, JournalEntry } from "./JournalEntry";
import { moodOptions } from "@/utils/ReflectionUtils";
import { useToast } from "@/hooks/useToast";
import { useUserData } from "@/context/UserDataContext";
import type { UserClient } from "@shared/types/user";
import { saveJournalEntry, getJournalEntries } from "@/services/JournalService";
import { JournalTextEditor } from "./JournalTextEditor";
import { useVoiceNavigation } from "@/hooks/useVoiceNavigation";
import { useTheme } from "@/context/ThemeContext";
import { useJournalPreferences } from "@/context/JournalPreferencesContext";
import { motion } from "framer-motion";

interface SubmitJournalOptions {
  user: any;
  userData: UserClient;
  journalType: string;
  journalContent: string;
  mood: string;
  tags: string[];
  timeSpentWriting: number;
  setEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
  setJournalContent: (val: string) => void;
  setTags: (tags: string[]) => void;
  handleTypeChange: (type: string) => void;
  refreshUserData: () => Promise<void>;
  showToast: (config: { title: string; description?: string }) => void;
  onSubmit: (entry: { type: string; content: string; mood: string }) => void;
  resetTimer: () => void;
}

// Journal type styling
const journalTypeStyles = {
  'free-writing': {
    iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    promptGradient: 'from-blue-50/90 to-indigo-50/90',
    promptBorder: 'border-blue-200/50',
    promptText: 'text-blue-800',
    buttonGradient: 'from-blue-500 to-indigo-600',
  },
  'guided': {
    iconBg: 'bg-gradient-to-br from-purple-500 to-violet-600',
    promptGradient: 'from-purple-50/90 to-violet-50/90',
    promptBorder: 'border-purple-200/50',
    promptText: 'text-purple-800',
    buttonGradient: 'from-purple-500 to-violet-600',
  },
  'gratitude': {
    iconBg: 'bg-gradient-to-br from-pink-500 to-rose-600',
    promptGradient: 'from-pink-50/90 to-rose-50/90',
    promptBorder: 'border-pink-200/50',
    promptText: 'text-pink-800',
    buttonGradient: 'from-pink-500 to-rose-600',
  },
};

export const Journal = ({ onSubmit = () => {}, setEntries }: JournalProps) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { preferences } = useJournalPreferences();
  const [journalType, setJournalType] = useState<'free-writing' | 'guided' | 'gratitude'>("free-writing");
  const [journalContent, setJournalContent] = useState("");
  const [mood, setMood] = useState("neutral");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [timeSpentWriting, setTimeSpentWriting] = useState(0);
  const { showToast } = useToast();
  const { userData, refreshUserData } = useUserData();

  const style = journalTypeStyles[journalType];

  // Voice navigation for accessibility
  useVoiceNavigation({
    onSave: () => {
      if (journalContent.trim()) {
        handleSubmitJournalEntry({
          user,
          userData: userData!,
          journalType,
          journalContent,
          mood,
          tags,
          timeSpentWriting,
          setEntries,
          setJournalContent,
          setTags,
          handleTypeChange,
          refreshUserData,
          showToast,
          onSubmit,
          resetTimer: () => setTimeSpentWriting(0),
        });
      }
    },
    onCancel: () => {
      setJournalContent("");
      setTags([]);
    },
  });

  // Fetch Entries from API on mount
  useEffect(() => {
    if (!user) return;

    const fetchEntries = async () => {
      try {
        const fetchedEntries = await getJournalEntries();
        setEntries(fetchedEntries);
        console.log("Successfully imported Entries");
      } catch (error) {
        console.error("Error fetching journal entries:", error);
      }
    };

    fetchEntries();
  }, [user]);

  const handleTypeChange = (value: string) => {
    setJournalType(value as 'free-writing' | 'guided' | 'gratitude');
    if (value === "free-writing") {
      setCurrentPrompt(
        prompts.freeWriting[
          Math.floor(Math.random() * prompts.freeWriting.length)
        ]
      );
    } else if (value === "guided") {
      setCurrentPrompt(
        prompts.guided[Math.floor(Math.random() * prompts.guided.length)]
      );
    } else if (value === "gratitude") {
      setCurrentPrompt(
        prompts.gratitude[Math.floor(Math.random() * prompts.gratitude.length)]
      );
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmitJournalEntry = async ({
    user,
    userData,
    journalType,
    journalContent,
    mood,
    tags,
    timeSpentWriting,
    setEntries,
    setJournalContent,
    setTags,
    handleTypeChange,
    refreshUserData,
    showToast,
    onSubmit,
    resetTimer,
  }: SubmitJournalOptions) => {
    if (!journalContent.trim() || !user) return;

    try {
      // Save journal entry via API (automatically awards 30 XP and updates stats)
      const response: any = await saveJournalEntry({
        type: journalType,
        content: journalContent,
        mood,
        isFavorite: false,
        tags,
        timeSpentWriting,
      });

      // Add to local state
      const savedEntry = response.entry || response;
      setEntries((prev) => [savedEntry, ...prev]);

      // Reset the Entry Field
      setJournalContent("");
      setTags([]);
      resetTimer();
      handleTypeChange(journalType);
      onSubmit({
        type: journalType,
        content: journalContent,
        mood,
      });

      // Show achievement notifications if any
      if (response.achievementsUnlocked && response.achievementsUnlocked.length > 0) {
        response.achievementsUnlocked.forEach((achievement: any) => {
          showToast({
            title: `Achievement Unlocked: ${achievement.title}`,
            description: `+${achievement.points} points! ${achievement.description}`,
          });
        });
      }

      // Show the toast of the user gaining points
      showToast({
        title: "+30 Points!",
        description: "Your journal entry was saved successfully. Good Job :)",
      });

      await refreshUserData();
    } catch (error) {
      console.error("Error saving journal entry:", error);
      showToast({
        title: "Error",
        description: "Failed to save journal entry. Please try again.",
      });
    }
  };

  const getPlaceholder = () => {
    switch (journalType) {
      case 'free-writing':
        return "Start writing your thoughts here...";
      case 'guided':
        return "Follow the prompt and write your response...";
      case 'gratitude':
        return "Write about what you're grateful for today...";
      default:
        return "Start writing...";
    }
  };

  const getDefaultPrompt = () => {
    switch (journalType) {
      case 'free-writing':
        return prompts.freeWriting[0];
      case 'guided':
        return prompts.guided[0];
      case 'gratitude':
        return prompts.gratitude[0];
      default:
        return prompts.freeWriting[0];
    }
  };

  return (
    <div
      className="w-full max-w-5xl mx-auto mt-4 mb-8 space-y-6"
      role="region"
      aria-label="Journal entry form"
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <motion.div
            className={`p-3 rounded-xl ${style.iconBg} shadow-lg`}
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <PenLine className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <h2
              className="text-2xl font-bold text-gray-900"
              id="journal-title"
            >
              Journal Your Thoughts
            </h2>
            <p className="text-gray-600">
              Express yourself and earn points for your wellbeing journey
            </p>
          </div>
        </div>
        <Badge
          variant="secondary"
          className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-white/50 shadow-sm"
          aria-label="Reward: 30 points per journal entry"
          style={{ color: theme.colors.primaryDark }}
        >
          <Star className="w-4 h-4 mr-1.5 text-amber-500" aria-hidden="true" /> +30 points
        </Badge>
      </motion.div>

      {/* Journal Type Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs
          defaultValue="free-writing"
          value={journalType}
          onValueChange={handleTypeChange}
          className="w-full"
          aria-labelledby="journal-title"
        >
          <TabsList
            className="grid grid-cols-3 w-full bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl p-1.5 shadow-sm"
            role="tablist"
            aria-label="Journal types"
          >
            <TabsTrigger
              value="free-writing"
              aria-label="Free writing journal type"
              className="text-xs sm:text-sm px-3 sm:px-4 py-2.5 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md transition-all gap-2"
            >
              <Edit3 className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Free Writing</span>
              <span className="sm:hidden">Free</span>
            </TabsTrigger>
            <TabsTrigger
              value="guided"
              aria-label="Guided journal type"
              className="text-xs sm:text-sm px-3 sm:px-4 py-2.5 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md transition-all gap-2"
            >
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Guided</span>
              <span className="sm:hidden">Guided</span>
            </TabsTrigger>
            <TabsTrigger
              value="gratitude"
              aria-label="Gratitude journal type"
              className="text-xs sm:text-sm px-3 sm:px-4 py-2.5 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md transition-all gap-2"
            >
              <Heart className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Gratitude</span>
              <span className="sm:hidden">Thanks</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="free-writing" className="mt-0" />
          <TabsContent value="guided" className="mt-0" />
          <TabsContent value="gratitude" className="mt-0" />
        </Tabs>
      </motion.div>

      {/* Prompt Card */}
      <motion.div
        className={`relative overflow-hidden bg-gradient-to-br ${style.promptGradient} backdrop-blur-sm rounded-2xl p-5 border-2 ${style.promptBorder} shadow-sm`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        key={journalType} // Re-animate when type changes
      >
        <div className="flex gap-4">
          <div className={`p-2.5 rounded-xl ${style.iconBg} h-fit shadow-md`}>
            <Lightbulb className="h-4 w-4 text-white" />
          </div>
          <p className={`${style.promptText} font-medium leading-relaxed text-base italic`}>
            {currentPrompt || getDefaultPrompt()}
          </p>
        </div>
      </motion.div>

      {/* Text Editor Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <JournalTextEditor
          value={journalContent}
          onChange={setJournalContent}
          onTimeUpdate={(time) => setTimeSpentWriting(time)}
          placeholder={getPlaceholder()}
          wordCountGoal={preferences.wordCountGoal}
        />
      </motion.div>

      {/* Tags & Mood Row */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {/* Tags Card */}
        <div
          className="relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-sm"
          role="group"
          aria-labelledby="tags-label"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-gray-100 to-slate-100">
              <Tag className="w-4 h-4 text-gray-600" aria-hidden="true" />
            </div>
            <p id="tags-label" className="text-sm font-semibold text-gray-700">
              Tags <span className="font-normal text-gray-500">(Optional)</span>
            </p>
          </div>
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Add a tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 bg-white/80 border-gray-200/80 rounded-xl focus:ring-2 focus:ring-indigo-200"
              aria-label="Add tag to journal entry"
              aria-describedby="tags-help"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddTag}
              disabled={!tagInput.trim()}
              aria-label="Add tag"
              className="rounded-xl border-gray-200 hover:bg-gray-50"
            >
              Add
            </Button>
          </div>
          <span id="tags-help" className="sr-only">
            Press Enter to add a tag. Click on a tag to remove it.
          </span>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2" role="list" aria-label="Added tags">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="px-3 py-1.5 cursor-pointer bg-white/80 hover:bg-gray-100 border border-gray-200/50 rounded-lg transition-colors"
                  onClick={() => handleRemoveTag(tag)}
                  role="listitem"
                  aria-label={`Remove tag: ${tag}`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleRemoveTag(tag);
                    }
                  }}
                >
                  {tag} <span className="ml-1 text-gray-400">×</span>
                </Badge>
              ))}
            </div>
          )}
          {tags.length === 0 && (
            <p className="text-xs text-gray-400 italic">No tags added yet</p>
          )}
        </div>

        {/* Mood Card */}
        <div
          className="relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-sm"
          role="group"
          aria-labelledby="mood-label"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100">
              <Smile className="w-4 h-4 text-amber-600" aria-hidden="true" />
            </div>
            <p id="mood-label" className="text-sm font-semibold text-gray-700">
              How are you feeling?
            </p>
          </div>
          <Select value={mood} onValueChange={setMood}>
            <SelectTrigger
              className="w-full bg-white/80 border-gray-200/80 rounded-xl focus:ring-2 focus:ring-indigo-200"
              aria-label="Select your current mood"
              aria-describedby="mood-help"
            >
              <SelectValue placeholder="Select your mood" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              className="max-h-64 overflow-y-auto rounded-xl"
              role="listbox"
              aria-label="Mood options"
            >
              {moodOptions.map((moodOption) => (
                <SelectItem
                  key={moodOption.value}
                  value={moodOption.value}
                  role="option"
                  aria-label={moodOption.label}
                  className="rounded-lg"
                >
                  {moodOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span id="mood-help" className="sr-only">
            Choose the mood that best reflects how you feel right now
          </span>
          <p className="text-xs text-gray-400 mt-3 italic">
            Tracking your mood helps identify patterns over time
          </p>
        </div>
      </motion.div>

      {/* Save Button Section */}
      <motion.div
        className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-xs text-gray-500" role="note" aria-label="Privacy and tips">
          <p className="font-medium text-gray-600 mb-1">Your entries are private and secure</p>
          <p>
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">S</kbd> to save &nbsp;·&nbsp;
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">Shift</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">F</kbd> for focus mode
          </p>
        </div>
        <Button
          onClick={() =>
            handleSubmitJournalEntry({
              user,
              userData: userData!,
              journalType,
              journalContent,
              mood,
              tags,
              timeSpentWriting,
              setEntries,
              setJournalContent,
              setTags,
              handleTypeChange,
              refreshUserData,
              showToast,
              onSubmit,
              resetTimer: () => setTimeSpentWriting(0),
            })
          }
          disabled={!journalContent.trim()}
          size="lg"
          className={`gap-2 rounded-xl bg-gradient-to-r ${style.buttonGradient} hover:opacity-90 shadow-lg transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed px-6`}
          aria-label="Save journal entry and earn 30 points"
          aria-describedby={!journalContent.trim() ? "save-disabled-help" : undefined}
        >
          Save Entry & Earn Points
          <ArrowRight className="h-4 w-4" />
        </Button>
        {!journalContent.trim() && (
          <span id="save-disabled-help" className="sr-only">
            Button is disabled because journal content is empty
          </span>
        )}
      </motion.div>
    </div>
  );
};
