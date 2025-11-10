import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Send,
  AlertCircle,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { NEW_POST_MOODS } from "@shared/utils/CommunityPost";

const MAX_LENGTH = 280;

export default function NewReflectionPage() {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const remainingChars = MAX_LENGTH - text.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!text.trim()) {
      setError("Please share your reflection");
      return;
    }

    if (!mood) {
      setError("Please select a mood");
      return;
    }

    if (text.length > MAX_LENGTH) {
      setError(`Reflection must be ${MAX_LENGTH} characters or less`);
      return;
    }

    setSubmitting(true);

    // Simulate AI moderation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simple content check (in real app, this would be AI moderation)
    const hasNegativeWords = /hate|kill|die|suicide|hurt/i.test(text);
    const hasPositiveIntent = text.length > 20;

    if (hasNegativeWords) {
      // Rejected
      setError(
        "We noticed your reflection might contain concerning content. Our community focuses on uplifting and supportive messages. Would you like to rephrase your thought in a more positive way? Remember, you're not alone, and there's always hope. 💙"
      );
      setSubmitting(false);
      return;
    }

    if (!hasPositiveIntent) {
      // Needs review
      toast({
        title: "Queued for review",
        description:
          "Thanks for sharing! Your reflection will appear once reviewed by our team.",
        duration: 5000,
      });
    } else {
      // Approved
      const newReflection = {
        id: Date.now().toString(),
        text: text.trim(),
        mood,
        createdAt: new Date().toISOString(),
        supportCount: 0,
        supported: false,
      };

      // Save to localStorage
      const saved = localStorage.getItem("communityReflections");
      const reflections = saved ? JSON.parse(saved) : [];
      reflections.unshift(newReflection);
      localStorage.setItem("communityReflections", JSON.stringify(reflections));

      toast({
        title: "Shared with the community ✨",
        description:
          "Your reflection has been posted and may brighten someone's day!",
        duration: 5000,
      });
    }

    setSubmitting(false);
    navigate("/community");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/community">
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Share a Reflection
              </h1>
              <p className="text-sm text-gray-600">
                Your words can inspire others
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="shadow-xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Guidelines */}
                <div className="bg-sky-50 rounded-lg p-4 border border-sky-200">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-sky-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-700 space-y-2">
                      <p className="font-medium text-gray-800">
                        Community Guidelines:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>Share positive, uplifting thoughts</li>
                        <li>Be authentic and kind</li>
                        <li>Respect others' experiences</li>
                        <li>No personal information or identifiers</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Mood Selection */}
                <div className="space-y-2">
                  <Label htmlFor="mood" className="text-base font-semibold">
                    How are you feeling? *
                  </Label>
                  <Select value={mood} onValueChange={setMood} required>
                    <SelectTrigger
                      id="mood"
                      className="w-full"
                      aria-label="Select your mood"
                    >
                      <SelectValue placeholder="Choose a mood..." />
                    </SelectTrigger>
                    <SelectContent>
                      {NEW_POST_MOODS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Text Input */}
                <div className="space-y-2">
                  <Label
                    htmlFor="reflection"
                    className="text-base font-semibold"
                  >
                    Your reflection *
                  </Label>
                  <Textarea
                    id="reflection"
                    placeholder="Share something uplifting... What brought you joy today? What are you grateful for? What wisdom would you share?"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[200px] text-base resize-none focus:ring-2 focus:ring-sky-500"
                    maxLength={MAX_LENGTH}
                    required
                    aria-describedby="char-count"
                  />
                  <div
                    id="char-count"
                    className={`text-sm text-right ${
                      remainingChars < 20
                        ? "text-orange-600 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {remainingChars} characters remaining
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-800 leading-relaxed">
                        {error}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate("/reflections")}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600"
                    disabled={submitting || !text.trim() || !mood}
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Reviewing...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Share Reflection
                      </>
                    )}
                  </Button>
                </div>

                {/* Privacy Note */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-700">
                      <p className="font-medium text-gray-800 mb-1">
                        Your privacy matters
                      </p>
                      <p className="text-gray-600">
                        All reflections are posted anonymously. We never share
                        your identity or personal information. Posts are
                        moderated to maintain a safe, supportive environment.
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
