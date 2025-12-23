import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Mic,
  MicOff,
  Heart,
  Brain,
  Sparkles,
  MessageCircle,
  Bot,
  RefreshCw,
  Coffee,
  Smile,
  Lock,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SEO } from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Header } from "@/components/Header";
import { SundayHelpfulTips } from "@/features/sunday/SundayBanners";
import { SundayChat } from "@/features/sunday/SundayChat";
import { JournalPlusDialog } from "@/features/sunday/JournalPlusDialog";
import { getMoodColor, getMoodIcon } from "@/utils/SundayUtils";
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
      text: "Hi, I’m Sunday! This is a calm space just for you. I’m here to listen without judgment and help you understand what you’re feeling. How are you doing today?",
      sender: "sunday",
      timestamp: new Date(),
      mood: "gentle",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [sessionTime, setSessionTime] = useState(0);
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <Header title="Sunday" icon={MessageCircle} />

      {/* Main Chat Area */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <SEO
          title="AI Wellness Companion - 24/7 Emotional Support"
          description="Meet Sunday, your empathetic AI wellness companion. Get personalized mental health support, emotional guidance, and a safe space to explore your thoughts 24/7. Not a replacement for therapy."
          url="https://journalxp.com/sunday"
        />
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Chat with Sunday</h2>
                <p className="text-purple-100">
                  A safe space for your thoughts and feelings
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Coffee className="h-5 w-5 text-purple-200" />
                <span className="text-sm text-purple-200">
                  Always here for you
                </span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div ref={messagesContainerRef} className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
            <AnimatePresence>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${
                    m.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      m.sender === "user"
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                        : `bg-gradient-to-r ${getMoodColor(
                            m.mood
                          )} text-gray-800`
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
                          className={`text-xs mt-1 ${
                            m.sender === "user"
                              ? "text-purple-200"
                              : "text-gray-500"
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
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl shadow-sm">
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
                        className="w-2 h-2 bg-purple-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0.2,
                        }}
                        className="w-2 h-2 bg-purple-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0.4,
                        }}
                        className="w-2 h-2 bg-purple-400 rounded-full"
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
          <div className="p-6 bg-white border-t border-gray-200">
            {isLimitReached && (
              <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-purple-600" />
                  <p className="text-sm text-purple-800">
                    Daily limit reached (25 conversations). Resets at noon.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowLimitDialog(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  <Crown className="h-3 w-3 mr-1" />
                  Upgrade
                </Button>
              </div>
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
                  className="resize-none border-gray-300 focus:border-purple-500 focus:ring-purple-500 disabled:opacity-60"
                  rows={2}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping || isLimitReached}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsListening(!isListening)}
                  disabled={isLimitReached}
                  className={isListening ? "bg-red-50 border-red-300" : ""}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4 text-red-500" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center mt-4 text-sm text-gray-500">
              <div className="flex items-center justify-between space-x-4 w-full">
                <span>Press Enter to send</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setMessages([messages[0]]);
                    setSessionTime(0);
                  }}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  New Session
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Helpful Tips */}
        <SundayHelpfulTips />

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Important:</strong> Sunday is an AI companion designed to
            provide emotional support and a listening ear. While Sunday can
            offer helpful perspectives and coping strategies, this is not a
            replacement for professional mental health care. If you're
            experiencing a crisis or need immediate help, please contact a
            mental health professional or crisis hotline.
          </p>
        </div>
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
