import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Moon, Wind, Clock, Heart, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface MeditationProps {
  title: string;
  duration: string;
  description: string;
  category: "breathing" | "guided" | "reflection";
  icon: React.ReactNode;
}

const MeditationRoom = () => {
  const [activeTab, setActiveTab] = useState("breathing");
  const [activeMeditation, setActiveMeditation] =
    useState<MeditationProps | null>(null);
  const [meditationProgress, setMeditationProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const meditations: MeditationProps[] = [
    {
      title: "4-7-8 Breathing",
      duration: "5 min",
      description:
        "Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds. A calming breath pattern to reduce anxiety.",
      category: "breathing",
      icon: <Wind className="h-5 w-5 text-blue-500" />,
    },
    {
      title: "Box Breathing",
      duration: "3 min",
      description:
        "Equal duration inhale, hold, exhale, and hold. Creates mental clarity and calmness.",
      category: "breathing",
      icon: <Wind className="h-5 w-5 text-blue-500" />,
    },
    {
      title: "Morning Calm",
      duration: "10 min",
      description:
        "Start your day with clarity and purpose through this guided morning meditation.",
      category: "guided",
      icon: <Moon className="h-5 w-5 text-purple-500" />,
    },
    {
      title: "Stress Relief",
      duration: "15 min",
      description:
        "Release tension and find your center with this guided meditation for stress relief.",
      category: "guided",
      icon: <Moon className="h-5 w-5 text-purple-500" />,
    },
    {
      title: "Gratitude Reflection",
      duration: "7 min",
      description:
        "Reflect on things you're grateful for to cultivate a positive mindset.",
      category: "reflection",
      icon: <Heart className="h-5 w-5 text-pink-500" />,
    },
    {
      title: "Journal Insights",
      duration: "10 min",
      description:
        "Review your past journal entries and reflect on your growth and patterns.",
      category: "reflection",
      icon: <BookOpen className="h-5 w-5 text-pink-500" />,
    },
  ];

  const startMeditation = (meditation: MeditationProps) => {
    setActiveMeditation(meditation);
    setMeditationProgress(0);
    setIsPlaying(true);

    // Simulate progress for demo purposes
    const duration = parseInt(meditation.duration.split(" ")[0]) * 60; // convert to seconds
    const interval = 100 / duration; // percentage increase per second

    const timer = setInterval(() => {
      setMeditationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsPlaying(false);
          return 100;
        }
        return prev + interval;
      });
    }, 1000);
  };

  const stopMeditation = () => {
    setIsPlaying(false);
    setActiveMeditation(null);
    setMeditationProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Button>
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: 0 }}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
              />
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                JournalXP
              </h1>
            </Link>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-indigo-700">
              Meditation Room
            </h2>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-gray-800 text-center"
          >
            Find Your Calm
          </motion.h2>
          <p className="text-gray-600 mt-2 text-center">
            Take a moment to breathe, reflect, and center yourself.
          </p>
        </div>

        {activeMeditation ? (
          <Card className="max-w-2xl mx-auto bg-white shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {activeMeditation.icon}
                  <span>{activeMeditation.title}</span>
                </div>
                <span className="text-sm font-normal flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {activeMeditation.duration}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <p className="text-gray-700">{activeMeditation.description}</p>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progress</span>
                  <span>{Math.round(meditationProgress)}%</span>
                </div>
                <Progress value={meditationProgress} className="h-2" />
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  onClick={stopMeditation}
                  variant="outline"
                  className="px-8"
                >
                  {isPlaying ? "Stop" : "Done"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs
            defaultValue="breathing"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full max-w-4xl mx-auto"
          >
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger
                value="breathing"
                className="flex items-center gap-2"
              >
                <Wind className="h-4 w-4" />
                Breathing
              </TabsTrigger>
              <TabsTrigger value="guided" className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                Guided
              </TabsTrigger>
              <TabsTrigger
                value="reflection"
                className="flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Reflection
              </TabsTrigger>
            </TabsList>

            {["breathing", "guided", "reflection"].map((category) => (
              <TabsContent
                key={category}
                value={category}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {meditations
                    .filter((m) => m.category === category)
                    .map((meditation, index) => (
                      <Card
                        key={index}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {meditation.icon}
                              <h3 className="font-semibold text-gray-800">
                                {meditation.title}
                              </h3>
                            </div>
                            <span className="text-sm text-gray-500">
                              {meditation.duration}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            {meditation.description}
                          </p>
                          <Button
                            onClick={() => startMeditation(meditation)}
                            className="w-full bg-indigo-600 hover:bg-indigo-700"
                          >
                            Begin
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>WellPoint - Your Mental Health Companion</p>
          <p className="mt-2">
            Remember, taking care of your mental health is a journey, not a
            destination.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MeditationRoom;
