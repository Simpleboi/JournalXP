import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardHeader,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Edit3, BookOpen, Heart, Smile, Meh, Frown } from "lucide-react";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

interface JournalEntry {
  id: string;
  type: string;
  content: string;
  mood: string;
  date: string;
  tags: string[];
  isFavorite: boolean;
  sentiment?: {
    label: string;
    score: number;
  };
}

interface JournalInterfaceProps {
  onSubmit?: (entry: { type: string; content: string; mood: string }) => void;
  prompts?: {
    freeWriting: string[];
    guided: string[];
    gratitude: string[];
  };
}

export const Journal = ({
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
  const { user } = useAuth();
  const [journalType, setJournalType] = useState("free-writing");
  const [journalContent, setJournalContent] = useState("");
  const [mood, setMood] = useState("neutral");
  const [currentPrompt, setCurrentPrompt] = useState("");

  const [showArchive, setShowArchive] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  // Load entries from localStorage on component mount
  useEffect(() => {
    if (!user) return;

    const fetchEntries = async () => {
      const entriesRef = collection(db, "users", user.uid, "journalEntries");
      const snapshot = await getDocs(entriesRef);
      const fetchedEntries: JournalEntry[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<JournalEntry, "id">),
      }));

      setEntries(fetchedEntries);
    };

    fetchEntries();
  }, [user]);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("journalEntries", JSON.stringify(entries));
  }, [entries]);

  const handleTypeChange = (value: string) => {
    setJournalType(value);
    if (value === "free-writing") {
      setCurrentPrompt(prompts.freeWriting[Math.floor(Math.random() * prompts.freeWriting.length)]);
    } else if (value === "guided") {
      setCurrentPrompt(prompts.guided[Math.floor(Math.random() * prompts.guided.length)]);
    } else if (value === "gratitude") {
      setCurrentPrompt(prompts.gratitude[Math.floor(Math.random() * prompts.gratitude.length)]);
    }
  };

  // Simple sentiment analysis function
  const analyzeSentiment = (text: string) => {
    // This is a very basic implementation
    // In a real app, you would use a proper NLP library or API
    const positiveWords = [
      "happy",
      "joy",
      "grateful",
      "thankful",
      "excited",
      "love",
      "good",
      "great",
      "wonderful",
      "amazing",
    ];
    const negativeWords = [
      "sad",
      "angry",
      "upset",
      "frustrated",
      "anxious",
      "worried",
      "bad",
      "terrible",
      "awful",
      "hate",
    ];

    const lowerText = text.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;

    positiveWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "g");
      const matches = lowerText.match(regex);
      if (matches) positiveCount += matches.length;
    });

    negativeWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "g");
      const matches = lowerText.match(regex);
      if (matches) negativeCount += matches.length;
    });

    if (positiveCount > negativeCount) {
      return {
        label: "Positive",
        score: positiveCount / (positiveCount + negativeCount),
      };
    } else if (negativeCount > positiveCount) {
      return {
        label: "Negative",
        score: negativeCount / (positiveCount + negativeCount),
      };
    } else {
      return { label: "Neutral", score: 0.5 };
    }
  };

  const handleSubmit = async () => {
    if (!journalContent.trim() || !user) return;

    const newEntry = {
      type: journalType,
      content: journalContent,
      mood: mood,
      date: new Date().toISOString(),
      tags: [],
      isFavorite: false,
      sentiment: analyzeSentiment(journalContent),
    };

    try {
      const docRef = await addDoc(collection(db, "users", user.uid, "journalEntries"), newEntry);

      // Update local state
      setEntries((prev) => [{ id: docRef.id, ...newEntry }, ...prev]);

      // Optional: call the onSubmit callback
      onSubmit({
        type: journalType,
        content: journalContent,
        mood: mood,
      });

      // Reset form
      setJournalContent("");
      handleTypeChange(journalType);
    } catch (error) {
      console.error("Error saving journal entry:", error);
    }
  };

  const handleToggleFavorite = (id: string) => {
    setEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === id ? { ...entry, isFavorite: !entry.isFavorite } : entry
      )
    );
  };

  const handleAddTag = (id: string, tag: string) => {
    setEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === id ? { ...entry, tags: [...entry.tags, tag] } : entry
      )
    );
  };

  const handleRemoveTag = (id: string, tag: string) => {
    setEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === id
          ? { ...entry, tags: entry.tags.filter((t) => t !== tag) }
          : entry
      )
    );
  };

  return (
    <Card className="w-full max-w-3xl mx-auto bg-white shadow-md mt-4 mb-8">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-indigo-700">Journal Your Thoughts</CardTitle>
            <CardDescription className="text-indigo-500">
              Express yourself and earn points for your wellbeing journey
            </CardDescription>
          </div>
          <Badge variant="secondary" className="px-3 py-1 bg-indigo-100 text-indigo-700">
            <Star className="w-4 h-4 mr-1" /> +10 points per entry
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
            <TabsTrigger value="free-writing"><Edit3 className="w-4 h-4 mr-2" />Free Writing</TabsTrigger>
            <TabsTrigger value="guided"><BookOpen className="w-4 h-4 mr-2" />Guided</TabsTrigger>
            <TabsTrigger value="gratitude"><Heart className="w-4 h-4 mr-2" />Gratitude</TabsTrigger>
          </TabsList>

          <TabsContent value="free-writing">
            <div className="bg-blue-50 p-3 rounded-md text-blue-700 text-sm italic">
              {currentPrompt || prompts.freeWriting[0]}
            </div>
            <Textarea
              placeholder="Start writing your thoughts here..."
              value={journalContent}
              onChange={(e) => setJournalContent(e.target.value)}
              className="min-h-[200px]"
            />
          </TabsContent>

          {/* Same for guided and gratitude */}
          <TabsContent value="guided">
            <div className="bg-purple-50 p-3 rounded-md text-purple-700 text-sm italic">
              {currentPrompt || prompts.guided[0]}
            </div>
            <Textarea
              placeholder="Follow the prompt and write your response..."
              value={journalContent}
              onChange={(e) => setJournalContent(e.target.value)}
              className="min-h-[200px]"
            />
          </TabsContent>

          <TabsContent value="gratitude">
            <div className="bg-pink-50 p-3 rounded-md text-pink-700 text-sm italic">
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
          <p className="text-sm font-medium text-gray-700 mb-2">How are you feeling right now?</p>
          <div className="flex space-x-2">
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="happy">😊 Happy</SelectItem>
                <SelectItem value="neutral">😐 Neutral</SelectItem>
                <SelectItem value="sad">😔 Sad</SelectItem>
                <SelectItem value="anxious">😰 Anxious</SelectItem>
                <SelectItem value="calm">😌 Calm</SelectItem>
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
