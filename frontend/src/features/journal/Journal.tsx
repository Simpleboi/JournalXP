import { Badge } from "@/components/ui/badge";
import { Edit3, BookOpen, Heart, Tag, Lightbulb, Smile, ArrowRight } from "lucide-react";
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
import { useTheme } from "@/context/ThemeContext";
import { prompts } from "./JournalPrompts";
import { JournalProps, JournalEntry } from "./JournalEntry";
import { moodOptions } from "@/utils/ReflectionUtils";
import { useToast } from "@/hooks/useToast";
import { useUserData } from "@/context/UserDataContext";
import type { UserClient } from "@shared/types/user";
import { saveJournalEntry, getJournalEntries } from "@/services/JournalService";
import { JournalTextEditor } from "./JournalTextEditor";
import { useVoiceNavigation } from "@/hooks/useVoiceNavigation";
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
    activeBg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    activeBorder: 'border-blue-300',
    activeText: 'text-blue-900',
    activeSubtext: 'text-blue-600',
    hoverBorder: 'hover:border-blue-200',
    hoverBg: 'hover:bg-blue-50/50',
  },
  'guided': {
    iconBg: 'bg-gradient-to-br from-purple-500 to-violet-600',
    promptGradient: 'from-purple-50/90 to-violet-50/90',
    promptBorder: 'border-purple-200/50',
    promptText: 'text-purple-800',
    buttonGradient: 'from-purple-500 to-violet-600',
    activeBg: 'bg-gradient-to-br from-purple-50 to-violet-50',
    activeBorder: 'border-purple-300',
    activeText: 'text-purple-900',
    activeSubtext: 'text-purple-600',
    hoverBorder: 'hover:border-purple-200',
    hoverBg: 'hover:bg-purple-50/50',
  },
  'gratitude': {
    iconBg: 'bg-gradient-to-br from-pink-500 to-rose-600',
    promptGradient: 'from-pink-50/90 to-rose-50/90',
    promptBorder: 'border-pink-200/50',
    promptText: 'text-pink-800',
    buttonGradient: 'from-pink-500 to-rose-600',
    activeBg: 'bg-gradient-to-br from-pink-50 to-rose-50',
    activeBorder: 'border-pink-300',
    activeText: 'text-pink-900',
    activeSubtext: 'text-pink-600',
    hoverBorder: 'hover:border-pink-200',
    hoverBg: 'hover:bg-pink-50/50',
  },
};

// Journal type options for the selector
const journalTypeOptions = [
  {
    value: 'free-writing' as const,
    label: 'Free Writing',
    shortLabel: 'Free',
    description: 'Express freely',
    icon: Edit3
  },
  {
    value: 'guided' as const,
    label: 'Guided',
    shortLabel: 'Guided',
    description: 'With prompts',
    icon: BookOpen
  },
  {
    value: 'gratitude' as const,
    label: 'Gratitude',
    shortLabel: 'Thanks',
    description: 'Be thankful',
    icon: Heart
  },
];

export const Journal = ({ onSubmit = () => { }, setEntries }: JournalProps) => {
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
      className="w-full max-w-5xl mx-auto mb-6 sm:mb-8 space-y-4 sm:space-y-6"
      role="region"
      aria-label="Journal entry form"
    >
      {/* Journal Type Selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-row gap-2 sm:gap-3"
        role="radiogroup"
        aria-label="Journal type"
      >
        {journalTypeOptions.map((option) => {
          const typeStyle = journalTypeStyles[option.value];
          const isActive = journalType === option.value;
          const Icon = option.icon;

          return (
            <motion.button
              key={option.value}
              onClick={() => handleTypeChange(option.value)}
              className={`group relative flex-1 flex items-center gap-2 sm:gap-3 px-2.5 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl backdrop-blur-sm border-2 shadow-sm transition-all duration-300 ${isActive
                  ? `${typeStyle.activeBg} ${typeStyle.activeBorder} shadow-md`
                  : `bg-white/70 border-white/50 ${typeStyle.hoverBorder} ${typeStyle.hoverBg}`
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              role="radio"
              aria-checked={isActive}
              aria-label={`${option.label} journal type`}
            >
              <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-sm transition-all duration-300 ${isActive
                  ? `${typeStyle.iconBg} scale-105`
                  : `${typeStyle.iconBg} opacity-80 group-hover:opacity-100 group-hover:scale-105`
                }`}>
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" aria-hidden="true" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <p className={`font-medium text-xs sm:text-sm truncate transition-colors ${isActive ? typeStyle.activeText : 'text-gray-700'
                  }`}>
                  <span className="hidden sm:inline">{option.label}</span>
                  <span className="sm:hidden">{option.shortLabel}</span>
                </p>
                <p className={`text-[9px] sm:text-xs truncate transition-colors hidden sm:block ${isActive ? typeStyle.activeSubtext : 'text-gray-500'
                  }`}>
                  {option.description}
                </p>
              </div>
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`absolute -top-1 -right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${typeStyle.iconBg} shadow-sm`}
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Prompt Card */}
      <motion.div
        className={`relative overflow-hidden bg-gradient-to-br ${style.promptGradient} backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-5 border-2 ${style.promptBorder} shadow-sm`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        key={journalType} // Re-animate when type changes
      >
        <div className="flex gap-3 sm:gap-4">
          <div className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl ${style.iconBg} h-fit shadow-md flex-shrink-0`}>
            <Lightbulb className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
          </div>
          <p className={`${style.promptText} font-medium leading-relaxed text-sm sm:text-base italic`}>
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
        className="grid grid-cols-1 gap-3 sm:gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {/* Tags Card */}
        <div
          className="relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/50 shadow-sm"
          role="group"
          aria-labelledby="tags-label"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-gray-100 to-slate-100">
              <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" aria-hidden="true" />
            </div>
            <p id="tags-label" className="text-xs sm:text-sm font-semibold text-gray-700">
              Tags <span className="font-normal text-gray-500">(Optional)</span>
            </p>
          </div>
          <div className="flex gap-2 mb-2 sm:mb-3">
            <Input
              placeholder="Add a tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 bg-white/80 border-gray-200/80 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-200 text-sm h-9 sm:h-10"
              aria-label="Add tag to journal entry"
              aria-describedby="tags-help"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddTag}
              disabled={!tagInput.trim()}
              aria-label="Add tag"
              className="rounded-lg sm:rounded-xl border-gray-200 hover:bg-gray-50 h-9 sm:h-10 px-3 sm:px-4 text-sm"
            >
              Add
            </Button>
          </div>
          <span id="tags-help" className="sr-only">
            Press Enter to add a tag. Click on a tag to remove it.
          </span>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2" role="list" aria-label="Added tags">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="px-2 sm:px-3 py-1 sm:py-1.5 cursor-pointer bg-white/80 hover:bg-gray-100 border border-gray-200/50 rounded-md sm:rounded-lg transition-colors text-xs sm:text-sm"
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
            <p className="text-[10px] sm:text-xs text-gray-400 italic">No tags added yet</p>
          )}
        </div>

        {/* Mood Card */}
        <div
          className="relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/50 shadow-sm"
          role="group"
          aria-labelledby="mood-label"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100">
              <Smile className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" aria-hidden="true" />
            </div>
            <p id="mood-label" className="text-xs sm:text-sm font-semibold text-gray-700">
              How are you feeling?
            </p>
          </div>
          <Select value={mood} onValueChange={setMood}>
            <SelectTrigger
              className="w-full bg-white/80 border-gray-200/80 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-200 h-9 sm:h-10 text-sm"
              aria-label="Select your current mood"
              aria-describedby="mood-help"
            >
              <SelectValue placeholder="Select your mood" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              className="max-h-64 overflow-y-auto rounded-lg sm:rounded-xl"
              role="listbox"
              aria-label="Mood options"
            >
              {moodOptions.map((moodOption) => (
                <SelectItem
                  key={moodOption.value}
                  value={moodOption.value}
                  role="option"
                  aria-label={moodOption.label}
                  className="rounded-md sm:rounded-lg text-sm"
                >
                  {moodOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span id="mood-help" className="sr-only">
            Choose the mood that best reflects how you feel right now
          </span>
          <p className="text-[10px] sm:text-xs text-gray-400 mt-2 sm:mt-3 italic">
            Tracking your mood helps identify patterns
          </p>
        </div>
      </motion.div>

      {/* Save Button Section */}
      <motion.div
        className="flex flex-col items-stretch gap-3 sm:gap-4 bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/50 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {/* Privacy note - hidden on very small screens, shown on sm+ */}
        <div className="hidden sm:block text-xs text-gray-500" role="note" aria-label="Privacy and tips">
          <p className="font-medium text-gray-600 mb-1">Your entries are private and secure</p>
          <p>
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">S</kbd> to save &nbsp;entries · &nbsp;
            <br />
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">Shift</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">F</kbd> for focus mode
            <br />
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">B</kbd>for bold text
            <br />
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">I</kbd>for itallic text
          </p>
        </div>
        {/* Mobile privacy note */}
        <p className="sm:hidden text-[10px] text-gray-500 text-center">
          Your entries are private and secure
        </p>
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
          className="gap-2 rounded-lg sm:rounded-xl hover:opacity-90 shadow-lg transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base w-full sm:w-auto sm:self-end text-white"
          style={{
            background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
          }}
          aria-label="Save journal entry and earn 30 points"
          aria-describedby={!journalContent.trim() ? "save-disabled-help" : undefined}
        >
          <span className="sm:hidden">Save & Earn +30</span>
          <span className="hidden sm:inline">Save Entry & Earn Points</span>
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
