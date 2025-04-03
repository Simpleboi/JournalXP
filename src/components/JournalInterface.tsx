import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Smile, Frown, Meh, Edit3, Star, Heart, BookOpen } from "lucide-react";

interface JournalInterfaceProps {
  onSubmit?: (entry: { type: string; content: string; mood: string }) => void;
  prompts?: {
    freeWriting: string[];
    guided: string[];
    gratitude: string[];
  };
}

const JournalInterface = ({
  onSubmit = () => {},
  prompts = {
    freeWriting: [
      "How are you feeling today?",
      "What's on your mind right now?",
      "Reflect on something that happened today.",
    ],
    guided: [
      "Describe a challenge you faced today and how you handled it.",
      "What are three things that went well today?",
      "Write about something you're looking forward to.",
    ],
    gratitude: [
      "List three things you're grateful for today.",
      "Who made a positive impact on your day and why?",
      "What's something small that brought you joy today?",
    ],
  },
}: JournalInterfaceProps) => {
  const [journalType, setJournalType] = useState("free-writing");
  const [journalContent, setJournalContent] = useState("");
  const [mood, setMood] = useState("neutral");
  const [currentPrompt, setCurrentPrompt] = useState("");

  const handleTypeChange = (value: string) => {
    setJournalType(value);
    // Set a random prompt based on the selected type
    if (value === "free-writing") {
      setCurrentPrompt(
        prompts.freeWriting[
          Math.floor(Math.random() * prompts.freeWriting.length)
        ],
      );
    } else if (value === "guided") {
      setCurrentPrompt(
        prompts.guided[Math.floor(Math.random() * prompts.guided.length)],
      );
    } else if (value === "gratitude") {
      setCurrentPrompt(
        prompts.gratitude[Math.floor(Math.random() * prompts.gratitude.length)],
      );
    }
  };

  const handleSubmit = () => {
    if (journalContent.trim()) {
      onSubmit({
        type: journalType,
        content: journalContent,
        mood: mood,
      });
      // Reset form after submission
      setJournalContent("");
      // Show a new prompt
      handleTypeChange(journalType);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto bg-white shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-indigo-700">
              Journal Your Thoughts
            </CardTitle>
            <CardDescription className="text-indigo-500">
              Express yourself and earn points for your wellbeing journey
            </CardDescription>
          </div>
          <Badge
            variant="secondary"
            className="px-3 py-1 bg-indigo-100 text-indigo-700"
          >
            <Star className="w-4 h-4 mr-1" /> +10 points per entry
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <Tabs
          defaultValue="free-writing"
          value={journalType}
          onValueChange={handleTypeChange}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="free-writing" className="flex items-center">
              <Edit3 className="w-4 h-4 mr-2" />
              Free Writing
            </TabsTrigger>
            <TabsTrigger value="guided" className="flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              Guided
            </TabsTrigger>
            <TabsTrigger value="gratitude" className="flex items-center">
              <Heart className="w-4 h-4 mr-2" />
              Gratitude
            </TabsTrigger>
          </TabsList>

          <TabsContent value="free-writing" className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-md text-blue-700 text-sm italic">
              {currentPrompt || prompts.freeWriting[0]}
            </div>
            <Textarea
              placeholder="Start writing your thoughts here..."
              className="min-h-[200px] focus:border-indigo-300"
              value={journalContent}
              onChange={(e) => setJournalContent(e.target.value)}
            />
          </TabsContent>

          <TabsContent value="guided" className="space-y-4">
            <div className="bg-purple-50 p-3 rounded-md text-purple-700 text-sm italic">
              {currentPrompt || prompts.guided[0]}
            </div>
            <Textarea
              placeholder="Follow the prompt and write your response..."
              className="min-h-[200px] focus:border-purple-300"
              value={journalContent}
              onChange={(e) => setJournalContent(e.target.value)}
            />
          </TabsContent>

          <TabsContent value="gratitude" className="space-y-4">
            <div className="bg-pink-50 p-3 rounded-md text-pink-700 text-sm italic">
              {currentPrompt || prompts.gratitude[0]}
            </div>
            <Textarea
              placeholder="Write about what you're grateful for today..."
              className="min-h-[200px] focus:border-pink-300"
              value={journalContent}
              onChange={(e) => setJournalContent(e.target.value)}
            />
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700 mb-2">
            How are you feeling right now?
          </p>
          <div className="flex space-x-2">
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="happy" className="flex items-center">
                  <div className="flex items-center">
                    <Smile className="w-4 h-4 mr-2 text-yellow-500" />
                    Happy
                  </div>
                </SelectItem>
                <SelectItem value="neutral">
                  <div className="flex items-center">
                    <Meh className="w-4 h-4 mr-2 text-gray-500" />
                    Neutral
                  </div>
                </SelectItem>
                <SelectItem value="sad">
                  <div className="flex items-center">
                    <Frown className="w-4 h-4 mr-2 text-blue-500" />
                    Sad
                  </div>
                </SelectItem>
                <SelectItem value="anxious">
                  <div className="flex items-center">
                    <Frown className="w-4 h-4 mr-2 text-purple-500" />
                    Anxious
                  </div>
                </SelectItem>
                <SelectItem value="calm">
                  <div className="flex items-center">
                    <Smile className="w-4 h-4 mr-2 text-green-500" />
                    Calm
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <p className="text-xs text-gray-500 italic">
          Your journal entries are private and only visible to you.
        </p>
        <Button
          onClick={handleSubmit}
          className="bg-indigo-600 hover:bg-indigo-700"
          disabled={!journalContent.trim()}
        >
          Save Entry & Earn Points
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JournalInterface;
