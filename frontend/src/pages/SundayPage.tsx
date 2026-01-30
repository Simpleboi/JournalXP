import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Mic,
  MicOff,
  Sparkles,
  MessageCircle,
  Bot,
  RefreshCw,
  Coffee,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/Header";
import { SundayHelpfulTips } from "@/features/sunday/SundayBanners";
import { SundayChat } from "@/features/sunday/SundayChat";
import { JournalPlusDialog } from "@/features/sunday/JournalPlusDialog";
import { getMoodIcon } from "@/utils/SundayUtils";
import { FeatureNotice } from "@/components/FeatureNotice";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

interface Message {
  id: string;
  text: string;
  sender: "user" | "sunday";
  timestamp: Date;
  mood?: "supportive" | "encouraging" | "reflective" | "gentle";
}

const SundayPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi, I'm Sunday! This is a calm space just for you. I'm here to listen without judgment and help you understand what you're feeling. How are you doing today?",
      sender: "sunday",
      timestamp: new Date(),
      mood: "gentle",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { theme } = useTheme();

  // Dynamic ambient colors based on theme
  const sundayAmbience = {
    primary: `${theme.colors.primary}38`,
    secondary: `${theme.colors.secondary}30`,
    accent: `${theme.colors.primaryLight}32`,
    warm: `${theme.colors.accent}28`,
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll to bottom of chat container when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // When the user submits the message
  const handleSendMessage = async () => {
    const text = inputMessage.trim();
    if (!text || isLimitReached) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      // call your Firebase callable
      const replyText = await SundayChat(text);

      const sundayReply: Message = {
        id: crypto.randomUUID(),
        text: replyText || "Sorry, I didn't catch that—want to try again?",
        sender: "sunday",
        timestamp: new Date(),
        mood: "gentle",
      };
      setMessages((prev) => [...prev, sundayReply]);
    } catch (err: any) {
      // Check if this is a conversation limit error
      if (err?.message?.includes("CONVERSATION_LIMIT_REACHED")) {
        setIsLimitReached(true);
        setShowLimitDialog(true);

        const limitReply: Message = {
          id: crypto.randomUUID(),
          text: "You've reached your daily limit of 25 conversations with Sunday. Your limit will reset at noon tomorrow.",
          sender: "sunday",
          timestamp: new Date(),
          mood: "gentle",
        };
        setMessages((prev) => [...prev, limitReply]);
      } else {
        const errorReply: Message = {
          id: crypto.randomUUID(),
          text:
            "I hit a snag reaching the server. Please try again in a moment. " +
            (err?.message ? `(${err.message})` : ""),
          sender: "sunday",
          timestamp: new Date(),
          mood: "reflective",
        };
        setMessages((prev) => [...prev, errorReply]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Animated ambient background - positioned behind everything */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50 via-white to-pink-50" />

        {/* Floating ambient orbs - soft and slow */}
        <motion.div
          className="absolute top-1/4 -left-16 sm:-left-32 w-48 h-48 sm:w-96 sm:h-96 rounded-full blur-2xl sm:blur-3xl"
          style={{ background: sundayAmbience.primary }}
          animate={{
            x: [0, 20, 0],
            y: [0, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 -right-12 sm:-right-24 w-40 h-40 sm:w-80 sm:h-80 rounded-full blur-2xl sm:blur-3xl"
          style={{ background: sundayAmbience.secondary }}
          animate={{
            x: [0, -15, 0],
            y: [0, 20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-36 h-36 sm:w-72 sm:h-72 rounded-full blur-2xl sm:blur-3xl"
          style={{ background: sundayAmbience.accent }}
          animate={{
            x: [0, 25, 0],
            y: [0, -12, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-32 h-32 sm:w-64 sm:h-64 rounded-full blur-2xl sm:blur-3xl hidden sm:block"
          style={{ background: sundayAmbience.warm }}
          animate={{
            x: [0, -18, 0],
            y: [0, 18, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 8,
          }}
        />
        <motion.div
          className="absolute top-2/3 left-1/2 w-28 h-28 sm:w-56 sm:h-56 rounded-full blur-2xl sm:blur-3xl hidden sm:block"
          style={{ background: sundayAmbience.primary }}
          animate={{
            x: [0, 12, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Header */}
      <Header title="Sunday" icon={MessageCircle} />

      {/* Main Chat Area */}
      <main className="relative container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-4xl">
        <SEO
          title="AI Wellness Companion - 24/7 Emotional Support"
          description="Meet Sunday, your empathetic AI wellness companion. Get personalized mental health support, emotional guidance, and a safe space to explore your thoughts 24/7. Not a replacement for therapy."
          url="https://journalxp.com/sunday"
        />

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 max-w-5xl mx-auto"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <motion.div
              className="p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg"
              style={{
                background: `linear-gradient(to bottom right, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
                boxShadow: `0 10px 15px -3px ${theme.colors.primary}30`,
              }}
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </motion.div>
            <div className="text-center sm:text-left">
              <h1
                className="text-2xl sm:text-3xl font-bold pb-2 bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(to right, ${theme.colors.primaryDark}, ${theme.colors.primary}, ${theme.colors.secondary})`,
                }}
              >
                Chat with Sunday
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                A safe space for your thoughts and feelings
              </p>
            </div>
          </div>
          <motion.div
            className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 backdrop-blur-sm border-2 rounded-xl sm:rounded-2xl shadow-sm"
            style={{
              background: `linear-gradient(to right, ${theme.colors.primary}15, ${theme.colors.secondary}15)`,
              borderColor: `${theme.colors.primary}40`,
            }}
            whileHover={{ scale: 1.02 }}
          >
            <Coffee className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: theme.colors.primary }} />
            <span className="font-medium text-sm sm:text-base" style={{ color: theme.colors.primaryDark }}>Always here for you</span>
          </motion.div>
        </motion.div>

        {/* Show preview mode if user is not logged in */}
        {user ? "" : <FeatureNotice
          title="You're in preview mode"
          message="To chat with Sunday and access AI features, please log in." />}

        {/* Glass morphism chat container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/70 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl border-2 border-white/50 overflow-hidden"
        >

          {/* Messages Area */}
          <div ref={messagesContainerRef} className="h-80 sm:h-96 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-purple-50/30 to-pink-50/30">
            <AnimatePresence>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${m.sender === "user"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-purple-200/50"
                      : "bg-white/80 backdrop-blur-sm border border-purple-100/50 text-gray-800"
                      }`}
                  >
                    <div className="flex items-start space-x-2">
                      {m.sender === "sunday" && (
                        <div className="flex-shrink-0 mt-1">
                          {getMoodIcon(m.mood)}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap">{m.text}</p>
                        <p
                          className={`text-xs mt-1 ${m.sender === "user"
                            ? "text-purple-200"
                            : "text-gray-400"
                            }`}
                        >
                          {m.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white/90 backdrop-blur-sm border border-purple-100/50 px-4 py-3 rounded-2xl shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-purple-500" />
                    <div className="flex space-x-1">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0,
                        }}
                        className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0.2,
                        }}
                        className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0.4,
                        }}
                        className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      Sunday is typing...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 sm:p-6 bg-white/60 backdrop-blur-sm border-t border-purple-100/50">
            {isLimitReached && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 backdrop-blur-sm border-2 border-purple-200/60 rounded-xl flex items-center gap-3"
              >
                <div className="p-1.5 rounded-lg bg-purple-100">
                  <Lock className="h-4 w-4 text-purple-600" />
                </div>
                <p className="text-sm text-purple-800">
                  Daily limit reached (25 conversations). Resets at noon tomorrow.
                </p>
              </motion.div>
            )}
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <Textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isLimitReached
                      ? "Wait until tomorrow at noon to continue using Sunday..."
                      : "Share what's on your mind..."
                  }
                  disabled={isLimitReached}
                  className="resize-none bg-white/80 backdrop-blur-sm border-2 border-purple-100/60 focus:border-purple-300 focus:ring-purple-200 disabled:opacity-60 rounded-xl"
                  rows={2}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping || isLimitReached}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl shadow-md shadow-purple-200/50"
                >
                  <Send className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsListening(!isListening)}
                  disabled={isLimitReached}
                  className={`rounded-xl border-2 ${isListening ? "bg-red-50 border-red-300" : "border-purple-100/60 hover:border-purple-200"}`}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4 text-red-500" />
                  ) : (
                    <Mic className="h-4 w-4 text-purple-500" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center mt-4 text-sm text-gray-500">
              <div className="flex items-center justify-between space-x-4 w-full">
                <span className="text-purple-600/70">Press Enter to send</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setMessages([messages[0]]);
                    setSessionTime(0);
                  }}
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  New Session
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Helpful Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SundayHelpfulTips />
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 sm:mt-8 p-4 bg-gradient-to-r from-amber-50/90 to-yellow-50/90 backdrop-blur-sm border-2 border-amber-200/60 rounded-xl sm:rounded-2xl shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 flex-shrink-0">
              <Sparkles className="h-4 w-4 text-amber-600" />
            </div>
            <p className="text-sm text-amber-800">
              <strong>Important:</strong> Sunday is an AI companion designed to
              provide emotional support and a listening ear. While Sunday can
              offer helpful perspectives and coping strategies, this is not a
              replacement for professional mental health care. If you're
              experiencing a crisis or need immediate help, please contact a
              mental health professional or crisis hotline.
            </p>
          </div>
        </motion.div>
      </main>

      {/* JournalXP Plus Dialog */}
      <JournalPlusDialog
        open={showLimitDialog}
        onOpenChange={setShowLimitDialog}
      />
    </div>
  );
};

export default SundayPage;
