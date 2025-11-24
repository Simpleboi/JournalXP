import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Edit3, BookOpen, Heart, Tag } from "lucide-react";
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
import { JournalTextEditor } from "@/components/JournalTextEditor";
import { useVoiceNavigation } from "@/hooks/useVoiceNavigation";

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

export const EnhancedJournal = ({ onSubmit = () => {}, setEntries }: JournalProps) => {
  const { user } = useAuth();
  const [journalType, setJournalType] = useState("free-writing");
  const [journalContent, setJournalContent] = useState("");
  const [mood, setMood] = useState("neutral");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [timeSpentWriting, setTimeSpentWriting] = useState(0);
  const { showToast } = useToast();
  const { userData, refreshUserData } = useUserData();

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
    setJournalType(value);
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
            title: `🏆 Achievement Unlocked: ${achievement.title}`,
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

  return (
    <Card
      className="w-full max-w-5xl mx-auto bg-white shadow-md mt-4 mb-8"
      role="region"
      aria-label="Journal entry form"
    >
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
        <div className="flex items-center justify-between flex-col sm:flex-row">
          <div>
            <CardTitle
              className="text-2xl sm:text-xl text-indigo-700 text-center sm:text-left"
              id="journal-title"
            >
              Journal Your Thoughts
            </CardTitle>
            <CardDescription className="text-indigo-500 text-center sm:text-left p-2 sm:p-0">
              Express yourself and earn points for your wellbeing journey
            </CardDescription>
          </div>
          <Badge
            variant="secondary"
            className="px-3 py-1 bg-indigo-100 text-indigo-700"
            aria-label="Reward: 30 points per journal entry"
          >
            <Star className="w-4 h-4 mr-1" aria-hidden="true" /> +30 points per entry
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* TABS */}
        <Tabs
          defaultValue="free-writing"
          value={journalType}
          onValueChange={handleTypeChange}
          className="w-full"
          aria-labelledby="journal-title"
        >
          <TabsList className="grid grid-cols-3 mb-6" role="tablist" aria-label="Journal types">
            <TabsTrigger value="free-writing" aria-label="Free writing journal type">
              <Edit3 className="w-4 h-4 mr-2" aria-hidden="true" />
              Free Writing
            </TabsTrigger>
            <TabsTrigger value="guided" aria-label="Guided journal type">
              <BookOpen className="w-4 h-4 mr-2" aria-hidden="true" />
              Guided
            </TabsTrigger>
            <TabsTrigger value="gratitude" aria-label="Gratitude journal type">
              <Heart className="w-4 h-4 mr-2" aria-hidden="true" />
              Gratitude
            </TabsTrigger>
          </TabsList>

          {/* Free-writing Tab */}
          <TabsContent value="free-writing" role="tabpanel" aria-labelledby="free-writing-tab">
            <div
              className="bg-blue-50 p-3 rounded-md text-blue-700 text-sm italic mb-4"
              role="note"
              aria-label="Journal prompt"
            >
              {currentPrompt || prompts.freeWriting[0]}
            </div>
            <JournalTextEditor
              value={journalContent}
              onChange={(val) => {
                setJournalContent(val);
              }}
              placeholder="Start writing your thoughts here..."
              wordCountGoal={250}
            />
          </TabsContent>

          {/* Guided Tab */}
          <TabsContent value="guided" role="tabpanel" aria-labelledby="guided-tab">
            <div
              className="bg-purple-50 p-3 rounded-md text-purple-700 text-sm italic mb-4"
              role="note"
              aria-label="Journal prompt"
            >
              {currentPrompt || prompts.guided[0]}
            </div>
            <JournalTextEditor
              value={journalContent}
              onChange={setJournalContent}
              placeholder="Follow the prompt and write your response..."
              wordCountGoal={300}
            />
          </TabsContent>

          {/* Gratitude Tab */}
          <TabsContent value="gratitude" role="tabpanel" aria-labelledby="gratitude-tab">
            <div
              className="bg-pink-50 p-3 rounded-md text-pink-700 text-sm italic mb-4"
              role="note"
              aria-label="Journal prompt"
            >
              {currentPrompt || prompts.gratitude[0]}
            </div>
            <JournalTextEditor
              value={journalContent}
              onChange={setJournalContent}
              placeholder="Write about what you're grateful for today..."
              wordCountGoal={200}
            />
          </TabsContent>
        </Tabs>

        {/* Tags Input */}
        <div className="mt-6" role="group" aria-labelledby="tags-label">
          <p
            id="tags-label"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center"
          >
            <Tag className="w-4 h-4 mr-1" aria-hidden="true" />
            Tags (Optional)
          </p>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Add a tag (e.g., work, family, health)..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
              aria-label="Add tag to journal entry"
              aria-describedby="tags-help"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddTag}
              disabled={!tagInput.trim()}
              aria-label="Add tag"
            >
              Add Tag
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
                  className="px-3 py-1 cursor-pointer hover:bg-gray-300"
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
                  {tag} ×
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Mood Selector */}
        <div className="mt-6" role="group" aria-labelledby="mood-label">
          <p id="mood-label" className="text-sm font-medium text-gray-700 mb-2">
            How are you feeling right now?
          </p>
          <div className="flex space-x-2">
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger
                className="w-full"
                aria-label="Select your current mood"
                aria-describedby="mood-help"
              >
                <SelectValue placeholder="Select your mood" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                className="max-h-64 overflow-y-auto"
                role="listbox"
                aria-label="Mood options"
              >
                {moodOptions.map((mood) => (
                  <SelectItem
                    key={mood.value}
                    value={mood.value}
                    role="option"
                    aria-label={mood.label}
                  >
                    {mood.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <span id="mood-help" className="sr-only">
            Choose the mood that best reflects how you feel right now
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between border-t pt-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="text-xs text-gray-500 italic" role="note" aria-label="Privacy and tips">
          <p>Your journal entries are private and only visible to you.</p>
          <p className="mt-1">
            💡 <strong>Tip:</strong> Use Ctrl+S to save, Ctrl+Shift+F for focus mode
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
          className="bg-indigo-600 hover:bg-indigo-700"
          disabled={!journalContent.trim()}
          aria-label="Save journal entry and earn 30 points"
          aria-describedby={!journalContent.trim() ? "save-disabled-help" : undefined}
        >
          Save Entry & Earn Points
        </Button>
        {!journalContent.trim() && (
          <span id="save-disabled-help" className="sr-only">
            Button is disabled because journal content is empty
          </span>
        )}
      </CardFooter>
    </Card>
  );
};
