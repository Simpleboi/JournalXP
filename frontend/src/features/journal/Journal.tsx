import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Edit3, BookOpen, Heart } from "lucide-react";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { prompts } from "./JournalPrompts";
import { JournalProps, JournalEntry } from "./JournalEntry";
import { moodOptions } from "@/utils/ReflectionUtils";
import { useToast } from "@/hooks/useToast";
import { useUserData } from "@/context/UserDataContext";
import type { UserClient } from "@shared/types/user";
import { getWordCount } from "@/utils/JournalUtils";
import { saveJournalEntry, getJournalEntries } from "@/services/JournalService";


interface SubmitJournalOptions {
  user: any;
  userData: UserClient;
  journalType: string;
  journalContent: string;
  mood: string;
  setEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
  setJournalContent: (val: string) => void;
  handleTypeChange: (type: string) => void;
  refreshUserData: () => Promise<void>;
  showToast: (config: { title: string; description?: string }) => void;
  onSubmit: (entry: { type: string; content: string; mood: string }) => void;
}

export const Journal = ({ onSubmit = () => {}, setEntries }: JournalProps) => {
  const { user } = useAuth();
  const [journalType, setJournalType] = useState("free-writing");
  const [journalContent, setJournalContent] = useState("");
  const [mood, setMood] = useState("neutral");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const { showToast } = useToast();
  const { userData, refreshUserData } = useUserData();

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

  const handleSubmitJournalEntry = async ({
    user,
    userData,
    journalType,
    journalContent,
    mood,
    setEntries,
    setJournalContent,
    handleTypeChange,
    refreshUserData,
    showToast,
    onSubmit,
  }: SubmitJournalOptions) => {
    if (!journalContent.trim() || !user) return;

    try {
      // Save journal entry via API (automatically awards 30 XP and updates stats)
      const savedEntry = await saveJournalEntry({
        type: journalType,
        content: journalContent,
        mood,
        isFavorite: false,
      });

      // Add to local state
      setEntries((prev) => [savedEntry, ...prev]);

      // Reset the Entry Field
      setJournalContent("");
      handleTypeChange(journalType);
      onSubmit({
        type: journalType,
        content: journalContent,
        mood,
      });

      // Show the toast of the user gaining points
      showToast({
        title: "+30 Points!",
        description: "Your journal entry was saved successfully. Good Job :)",
      });

      await refreshUserData();
    } catch (error) {
      console.error("Error saving journal entry:", error);
    }
  };

  return (
    <Card className="w-full max-w-5xl mx-auto bg-white shadow-md mt-4 mb-8">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
        <div className="flex items-center justify-between flex-col sm:flex-row">
          <div>
            <CardTitle className="text-2xl sm:text-xl text-indigo-700 text-center sm:text-left">
              Journal Your Thoughts
            </CardTitle>
            <CardDescription className="text-indigo-500 text-center sm:text-left  p-2 sm:p-0">
              Express yourself and earn points for your wellbeing journey
            </CardDescription>
          </div>
          <Badge
            variant="secondary"
            className="px-3 py-1 bg-indigo-100 text-indigo-700"
          >
            <Star className="w-4 h-4 mr-1" /> +30 points per entry
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
        >
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="free-writing">
              <Edit3 className="w-4 h-4 mr-2" />
              Free Writing
            </TabsTrigger>
            <TabsTrigger value="guided">
              <BookOpen className="w-4 h-4 mr-2" />
              Guided
            </TabsTrigger>
            <TabsTrigger value="gratitude">
              <Heart className="w-4 h-4 mr-2" />
              Gratitude
            </TabsTrigger>
          </TabsList>

          {/* Free-writing Tab */}
          <TabsContent value="free-writing">
            <div className="bg-blue-50 p-3 rounded-md text-blue-700 text-sm italic mb-4">
              {currentPrompt || prompts.freeWriting[0]}
            </div>
            <Textarea
              placeholder="Start writing your thoughts here..."
              value={journalContent}
              onChange={(e) => setJournalContent(e.target.value)}
              className="min-h-[200px]"
            />
          </TabsContent>

          {/* Guided Tab */}
          <TabsContent value="guided">
            <div className="bg-purple-50 p-3 rounded-md text-purple-700 text-sm italic mb-4">
              {currentPrompt || prompts.guided[0]}
            </div>
            <Textarea
              placeholder="Follow the prompt and write your response..."
              value={journalContent}
              onChange={(e) => setJournalContent(e.target.value)}
              className="min-h-[200px]"
            />
          </TabsContent>

          {/* Grattitude Tab */}
          <TabsContent value="gratitude">
            <div className="bg-pink-50 p-3 rounded-md text-pink-700 text-sm italic mb-4">
              {currentPrompt || prompts.gratitude[0]}
            </div>
            <Textarea
              placeholder="Write about what you're grateful for today..."
              value={journalContent}
              onChange={(e) => setJournalContent(e.target.value)}
              className="min-h-[200px]"
            />
          </TabsContent>
        </Tabs>

        {/* Mood Selector */}
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700 mb-2">
            How are you feeling right now?
          </p>
          <div className="flex space-x-2">
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your mood" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                className="max-h-64 overflow-y-auto"
              >
                {moodOptions.map((mood) => (
                  <SelectItem key={mood.value} value={mood.value}>
                    {mood.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between border-t pt-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <p className="text-xs text-gray-500 italic">
          Your journal entries are private and only visible to you.
        </p>
        <Button
          onClick={() =>
            handleSubmitJournalEntry({
              user,
              userData: userData!,
              journalType,
              journalContent,
              mood,
              setEntries,
              setJournalContent,
              handleTypeChange,
              refreshUserData,
              showToast,
              onSubmit,
            })
          }
          className="bg-indigo-600 hover:bg-indigo-700"
          disabled={!journalContent.trim()}
        >
          Save Entry & Earn Points
        </Button>
      </CardFooter>
    </Card>
  );
};
