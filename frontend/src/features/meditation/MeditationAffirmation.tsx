import { motion } from "framer-motion";
import { Quote } from "@/models/Meditation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Save, Trash2, Check, Sparkles } from "lucide-react";
import { quotes } from "@/data/MeditationData";
import { useTheme } from "@/context/ThemeContext";

const SAVED_QUOTES_KEY = "meditation_saved_quotes";

export const MeditationAffirmations = () => {
  const { theme } = useTheme();
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
      className="mb-8"
    >
      <div
        className="max-w-4xl mx-auto rounded-3xl p-8 md:p-10 backdrop-blur-xl border"
        style={{
          background: `${theme.colors.surface}80`,
          borderColor: `${theme.colors.border}50`,
          boxShadow: `0 8px 32px ${theme.colors.secondary}10`,
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{
              background: `${theme.colors.accent}20`,
              border: `1px solid ${theme.colors.accent}40`,
            }}
          >
            <Sparkles className="h-4 w-4" style={{ color: theme.colors.accent }} />
            <span className="text-sm font-medium" style={{ color: theme.colors.text }}>
              Daily Inspiration
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Quote display */}
          <motion.div
            key={currentQuote.text}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center p-8 rounded-2xl backdrop-blur-md border"
            style={{
              background: `${theme.colors.surfaceLight}40`,
              borderColor: `${theme.colors.border}30`,
            }}
          >
            <blockquote
              className="text-xl md:text-2xl italic leading-relaxed mb-4"
              style={{ color: theme.colors.text }}
            >
              "{currentQuote.text}"
            </blockquote>
            <cite
              className="font-medium"
              style={{ color: theme.colors.textSecondary }}
            >
              — {currentQuote.author}
            </cite>
          </motion.div>

          {/* Action buttons */}
          <div className="flex justify-center gap-4 flex-wrap">
            <Button
              onClick={refreshQuote}
              className="backdrop-blur-md border transition-all"
              style={{
                background: `${theme.colors.surfaceLight}50`,
                borderColor: `${theme.colors.border}50`,
                color: theme.colors.text,
              }}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              New Quote
            </Button>
            <Button
              onClick={saveQuote}
              disabled={justSaved || savedQuotes.find((q) => q.text === currentQuote.text) !== undefined}
              className="transition-all"
              style={{
                background: justSaved
                  ? `linear-gradient(135deg, #10b981, #14b8a6)`
                  : `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                boxShadow: justSaved
                  ? `0 4px 16px #10b98140`
                  : `0 4px 16px ${theme.colors.primary}40`,
                color: theme.colors.background,
              }}
            >
              {justSaved ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {savedQuotes.find((q) => q.text === currentQuote.text) ? "Already Saved" : "Save Quote"}
                </>
              )}
            </Button>
          </div>

          {/* Saved quotes list */}
          {savedQuotes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-8 pt-6 border-t"
              style={{ borderColor: `${theme.colors.border}30` }}
            >
              <h4
                className="font-medium mb-4 text-center"
                style={{ color: theme.colors.text }}
              >
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
                    className="text-sm p-4 rounded-xl flex justify-between items-start gap-3 group transition-all backdrop-blur-md border"
                    style={{
                      background: `${theme.colors.surfaceLight}30`,
                      borderColor: `${theme.colors.border}20`,
                    }}
                  >
                    <div className="flex-1">
                      <p className="italic" style={{ color: theme.colors.text }}>
                        "{quote.text}"
                      </p>
                      <p
                        className="text-xs mt-1"
                        style={{ color: theme.colors.textSecondary }}
                      >
                        — {quote.author}
                      </p>
                    </div>
                    <Button
                      onClick={() => removeQuote(index)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
};
