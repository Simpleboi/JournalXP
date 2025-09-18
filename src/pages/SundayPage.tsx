import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Send,
  Mic,
  MicOff,
  Heart,
  Brain,
  Sparkles,
  MessageCircle,
  User,
  Bot,
  Volume2,
  VolumeX,
  RefreshCw,
  Coffee,
  Sun,
  Moon,
  Smile,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

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
      text: "Hello! I'm Sunday, your AI wellness companion. I'm here to listen, support, and help you explore your thoughts and feelings in a safe space. How are you feeling today?",
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sample responses from Sunday
  const sundayResponses = [
    {
      triggers: ["sad", "down", "depressed", "low"],
      responses: [
        "I hear that you're feeling down right now. That takes courage to share. Can you tell me more about what's been weighing on your mind?",
        "It sounds like you're going through a difficult time. Remember that it's okay to feel sad - these emotions are valid. What do you think might help you feel a little lighter today?",
        "Thank you for trusting me with how you're feeling. Sometimes when we're feeling low, it helps to focus on small, manageable steps. What's one tiny thing that usually brings you comfort?",
      ],
      mood: "supportive" as const,
    },
    {
      triggers: ["anxious", "worried", "stress", "panic", "nervous"],
      responses: [
        "I can sense the anxiety in your words. Let's take a moment together. Can you try taking three deep breaths with me? In for 4, hold for 4, out for 6. What's making you feel most anxious right now?",
        "Anxiety can feel overwhelming, but you're not alone in this. Let's break down what you're worried about. Sometimes naming our fears can help reduce their power over us.",
        "I notice you're feeling anxious. That's a very human response to uncertainty. What would it feel like to give yourself permission to feel worried without judgment?",
      ],
      mood: "gentle" as const,
    },
    {
      triggers: ["happy", "good", "great", "excited", "joy"],
      responses: [
        "I love hearing the joy in your message! It's wonderful that you're feeling good. What's been contributing to this positive feeling?",
        "Your happiness is contagious! I'm so glad you're having a good day. What would you like to do to celebrate or maintain this feeling?",
        "It's beautiful to witness your joy. These moments of happiness are precious - how can we help you remember this feeling when times get tough?",
      ],
      mood: "encouraging" as const,
    },
    {
      triggers: ["confused", "lost", "don't know", "uncertain"],
      responses: [
        "Feeling uncertain is part of being human. It's okay not to have all the answers right now. What's one small thing you do feel sure about?",
        "Confusion can actually be a sign that you're growing and questioning things - that's healthy. What's the most confusing part of what you're experiencing?",
        "Sometimes when we feel lost, it helps to focus on our values and what matters most to us. What are some things that feel important to you right now?",
      ],
      mood: "reflective" as const,
    },
  ];

  const defaultResponses = [
    "That's really interesting. Can you tell me more about that?",
    "I appreciate you sharing that with me. How does that make you feel?",
    "It sounds like you've been thinking about this a lot. What stands out most to you?",
    "Thank you for being so open. What would you like to explore about this?",
    "I'm here to listen. What feels most important for you to talk about right now?",
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const generateSundayResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Find matching response category
    for (const category of sundayResponses) {
      if (category.triggers.some(trigger => lowerMessage.includes(trigger))) {
        const randomResponse = category.responses[Math.floor(Math.random() * category.responses.length)];
        return {
          id: Date.now().toString(),
          text: randomResponse,
          sender: "sunday",
          timestamp: new Date(),
          mood: category.mood,
        };
      }
    }

    // Default response
    const randomDefault = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    return {
      id: Date.now().toString(),
      text: randomDefault,
      sender: "sunday",
      timestamp: new Date(),
      mood: "gentle",
    };
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate Sunday typing and responding
    setTimeout(() => {
      const sundayResponse = generateSundayResponse(inputMessage);
      setMessages((prev) => [...prev, sundayResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMoodIcon = (mood?: string) => {
    switch (mood) {
      case "supportive":
        return <Heart className="h-4 w-4 text-pink-500" />;
      case "encouraging":
        return <Sparkles className="h-4 w-4 text-yellow-500" />;
      case "reflective":
        return <Brain className="h-4 w-4 text-purple-500" />;
      case "gentle":
        return <Smile className="h-4 w-4 text-blue-500" />;
      default:
        return <MessageCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getMoodColor = (mood?: string) => {
    switch (mood) {
      case "supportive":
        return "from-pink-50 to-rose-50 border-pink-200";
      case "encouraging":
        return "from-yellow-50 to-amber-50 border-yellow-200";
      case "reflective":
        return "from-purple-50 to-indigo-50 border-purple-200";
      case "gentle":
        return "from-blue-50 to-cyan-50 border-blue-200";
      default:
        return "from-gray-50 to-slate-50 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center shadow-md"
              >
                <Sun className="h-5 w-5 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Sunday</h1>
                <p className="text-sm text-gray-600">AI Wellness Companion</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Session: {formatTime(sessionTime)}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            >
              {isSoundEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Chat with Sunday</h2>
                <p className="text-purple-100">
                  A safe space for your thoughts and feelings
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Coffee className="h-5 w-5 text-purple-200" />
                <span className="text-sm text-purple-200">Always here for you</span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                        : `bg-gradient-to-r ${getMoodColor(message.mood)} text-gray-800`
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === "sunday" && (
                        <div className="flex-shrink-0 mt-1">
                          {getMoodIcon(message.mood)}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === "user"
                              ? "text-purple-200"
                              : "text-gray-500"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], {
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
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 bg-purple-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-purple-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-purple-400 rounded-full"
                      />
                    </div>
                    <span className="text-sm text-gray-600">Sunday is typing...</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-gray-200">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <Textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share what's on your mind..."
                  className="resize-none border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  rows={2}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsListening(!isListening)}
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
            
            <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
              <p>Sunday is here to listen and support you</p>
              <div className="flex items-center space-x-4">
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
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Heart className="h-5 w-5 text-blue-500 mr-2" />
                Safe Space
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                This is a judgment-free zone. Share whatever is on your mind, and Sunday will listen with empathy and understanding.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Brain className="h-5 w-5 text-purple-500 mr-2" />
                Thoughtful Responses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Sunday uses advanced AI to provide thoughtful, personalized responses that adapt to your emotional state and needs.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Sparkles className="h-5 w-5 text-green-500 mr-2" />
                Always Available
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Sunday is available 24/7 whenever you need someone to talk to. No appointments necessary - just start chatting.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Important:</strong> Sunday is an AI companion designed to provide emotional support and a listening ear. 
            While Sunday can offer helpful perspectives and coping strategies, this is not a replacement for professional 
            mental health care. If you're experiencing a crisis or need immediate help, please contact a mental health 
            professional or crisis hotline.
          </p>
        </div>
      </main>
    </div>
  );
};

export default SundayPage;