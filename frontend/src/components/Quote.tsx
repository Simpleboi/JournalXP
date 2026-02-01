import "../styles/example.scss";
import quotes from "@/data/quotes.json";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export const Blockquote = () => {
  const { theme } = useTheme();

  // Picks a random quote per render
  const randomQuote = useMemo(() => {
    const index = Math.floor(Math.random() * quotes.length);
    return quotes[index];
  }, []);

  return (
    <motion.blockquote
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="relative max-w-4xl mx-auto bg-white/70 backdrop-blur-md border-2 border-white/50 p-6 sm:p-8 rounded-2xl shadow-lg quote mb-6"
    >
      {/* Quote icon */}
      <div className="absolute -top-4 -left-4 p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg"
        style={{
          background: `linear-gradient(to bottom right, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
        }}>
        <Quote className="w-5 h-5 text-white" />
      </div>

      <div className="relative z-10 pt-2">
        <p className="text-lg sm:text-xl text-gray-700 leading-relaxed italic">
          "{randomQuote.quote}"
        </p>
      </div>

      <footer className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          — {randomQuote.author}
        </div>
      </footer>
    </motion.blockquote>
  );
};
