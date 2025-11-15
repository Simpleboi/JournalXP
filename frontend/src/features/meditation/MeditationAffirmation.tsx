import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Quote } from "@/models/Meditation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Save, Trash2, Check } from "lucide-react";
import { quotes } from "@/data/MeditationData";

const SAVED_QUOTES_KEY = "meditation_saved_quotes";

export const MeditationAffirmations = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote>({
    text: "",
    author: "",
  });
  const [savedQuotes, setSavedQuotes] = useState<Quote[]>([]);
  const [justSaved, setJustSaved] = useState(false);

  // Initialize current quote and load saved quotes from localStorage on mount
  useEffect(() => {
    // Set a random quote on first load
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(randomQuote);

    // Load saved quotes from localStorage
    const savedQuotesString = localStorage.getItem(SAVED_QUOTES_KEY);
    if (savedQuotesString) {
      try {
        const parsed = JSON.parse(savedQuotesString);
        setSavedQuotes(parsed);
      } catch (error) {
        console.error("Error loading saved quotes:", error);
        localStorage.removeItem(SAVED_QUOTES_KEY);
      }
    }
  }, []);

  const refreshQuote = () => {
    const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(newQuote);
    setJustSaved(false);
  };

  const saveQuote = () => {
    if (!savedQuotes.find((q) => q.text === currentQuote.text)) {
      const updatedQuotes = [...savedQuotes, currentQuote];
      setSavedQuotes(updatedQuotes);

      // Persist to localStorage
      localStorage.setItem(SAVED_QUOTES_KEY, JSON.stringify(updatedQuotes));

      // Show saved feedback
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    }
  };

  const removeQuote = (index: number) => {
    const updatedQuotes = savedQuotes.filter((_, i) => i !== index);
    setSavedQuotes(updatedQuotes);

    // Update localStorage
    localStorage.setItem(SAVED_QUOTES_KEY, JSON.stringify(updatedQuotes));
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <Card className="max-w-4xl mx-auto bg-gradient-to-br from-teal-50 to-green-50 border-0 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-medium text-gray-800">
            Daily Inspiration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div
            key={currentQuote.text}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center p-6 bg-white/50 rounded-xl"
          >
            <blockquote className="text-lg text-gray-700 italic leading-relaxed mb-4">
              "{currentQuote.text}"
            </blockquote>
            <cite className="text-gray-600 font-medium">
              — {currentQuote.author}
            </cite>
          </motion.div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={refreshQuote}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              New Quote
            </Button>
            <Button
              onClick={saveQuote}
              disabled={justSaved || savedQuotes.find((q) => q.text === currentQuote.text) !== undefined}
              className={`flex items-center gap-2 transition-all ${
                justSaved
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-teal-600 hover:bg-teal-700"
              }`}
            >
              {justSaved ? (
                <>
                  <Check className="h-4 w-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {savedQuotes.find((q) => q.text === currentQuote.text) ? "Already Saved" : "Save Quote"}
                </>
              )}
            </Button>
          </div>

          {savedQuotes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6"
            >
              <h4 className="font-medium text-gray-800 mb-3 text-center">
                Your Saved Quotes ({savedQuotes.length})
              </h4>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {savedQuotes.map((quote, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm text-gray-700 p-3 bg-white/50 rounded-lg flex justify-between items-start gap-3 group hover:bg-white/70 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="italic">"{quote.text}"</p>
                      <p className="text-gray-600 text-xs mt-1">— {quote.author}</p>
                    </div>
                    <Button
                      onClick={() => removeQuote(index)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.section>
  );
};
