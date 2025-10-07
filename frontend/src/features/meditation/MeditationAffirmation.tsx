import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Quote } from "@/models/Meditation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Save } from "lucide-react";
import { quotes } from "@/data/MeditationData";

export const MeditationAffirmations = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote>({
    text: "",
    author: "",
  });
  const [savedQuotes, setSavedQuotes] = useState<Quote[]>([]);

  const refreshQuote = () => {
    const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(newQuote);
  };

  const saveQuote = () => {
    if (!savedQuotes.find((q) => q.text === currentQuote.text)) {
      setSavedQuotes([...savedQuotes, currentQuote]);
    }
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
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700"
            >
              <Save className="h-4 w-4" />
              Save Quote
            </Button>
          </div>

          {savedQuotes.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-800 mb-3 text-center">
                Your Saved Quotes ({savedQuotes.length})
              </h4>
              <div className="max-h-32 overflow-y-auto space-y-2">
                {savedQuotes.map((quote, index) => (
                  <div
                    key={index}
                    className="text-sm text-gray-600 p-2 bg-white/30 rounded"
                  >
                    "{quote.text}" — {quote.author}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.section>
  );
};
