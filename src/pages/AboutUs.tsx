import { motion } from "framer-motion";
import {
  ArrowLeft,
  Book,
  Compass,
  Heart,
  HelpCircle,
  Info,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import ContactUsMapForm from "@/components/ContactUs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Footer } from "@/components/Footer";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: 0 }}
              className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
            />
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              JournalXP
            </h1>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" className="flex items-center space-x-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl text-gray-800 font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            About JournalXP
          </motion.h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Your personal mental health companion designed to make self-care
            engaging and rewarding.
          </p>
        </div>

        <Tabs defaultValue="about" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="about">
              <Info className="h-4 w-4 mr-2" />
              About
            </TabsTrigger>
            <TabsTrigger value="features">
              <Star className="h-4 w-4 mr-2" />
              Features
            </TabsTrigger>
            <TabsTrigger value="guide">
              <Book className="h-4 w-4 mr-2" />
              User Guide
            </TabsTrigger>
          </TabsList>

          {/* The Information Tab */}
          <AboutInfo />

          {/* The Features Tab */}
          <AboutFeatures />

          {/* The About User Guide */}
          <AboutUserGuide />
        </Tabs>
      </main>

      {/* Contact Us section */}
      {/* <ContactUsMapForm /> */}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUs;

// The About Features Tab
export const AboutFeatures = () => {
  return (
    <TabsContent value="features" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
          <CardDescription>What makes JournalXP special</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-indigo-100 p-2 rounded-full">
                <HelpCircle className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  Daily Tasks & Journaling
                </h3>
                <p className="text-gray-600">
                  Complete personalized self-care tasks and journal entries to
                  earn points and build streaks.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 p-2 rounded-full">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  Progress & Rewards
                </h3>
                <p className="text-gray-600">
                  Track your mental health journey with points, levels, and
                  ranks. Unlock rewards like avatar items and premium themes.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <Info className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Insights & Trends</h3>
                <p className="text-gray-600">
                  Visualize your mood patterns and activity over time to better
                  understand your mental health.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-2 rounded-full">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Meditation Room</h3>
                <p className="text-gray-600">
                  Access guided meditations and breathing exercises to help
                  manage stress and anxiety.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

// The About User Guide Component
export const AboutUserGuide = () => {
  return (
    <TabsContent value="guide" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>How to navigate and use JournalXP</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="border-l-4 border-indigo-500 pl-4 py-2">
              <h3 className="font-medium text-gray-900">Dashboard</h3>
              <p className="text-gray-600 mb-2">
                Your home base shows your progress stats, daily tasks, and quick
                access to all features.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>View your points, level, and streak at the top</li>
                <li>Complete daily tasks to earn points</li>
                <li>Switch between tabs to access different features</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <h3 className="font-medium text-gray-900">Journal</h3>
              <p className="text-gray-600 mb-2">
                Express your thoughts and track your mood with guided prompts or
                free writing.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Select from different journal entry types</li>
                <li>Track your mood with each entry</li>
                <li>Review past entries to see your progress</li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h3 className="font-medium text-gray-900">Insights</h3>
              <p className="text-gray-600 mb-2">
                Visualize your mental health trends and activity patterns over
                time.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>View mood trends across different time periods</li>
                <li>Track your activity completion rates</li>
                <li>Identify patterns in your mental wellbeing</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h3 className="font-medium text-gray-900">Meditation Room</h3>
              <p className="text-gray-600 mb-2">
                Practice mindfulness with guided meditations and breathing
                exercises.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Choose from different meditation types</li>
                <li>Set duration based on your availability</li>
                <li>Track your meditation streak</li>
              </ul>
            </div>

            <div className="border-l-4 border-amber-500 pl-4 py-2">
              <h3 className="font-medium text-gray-900">Settings</h3>
              <p className="text-gray-600 mb-2">
                Customize your JournalXP experience to suit your preferences.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Adjust appearance settings</li>
                <li>Customize dashboard layout</li>
                <li>Manage notification preferences</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

// The About Info Section
export const AboutInfo = () => {
  return (
    <TabsContent value="about" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
          <CardDescription>Why we created JournalXP</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Hi, I'm{" "}
            <a
              href="https://n8jsx.com/"
              target="_blank"
              className="text-blue-700"
            >
              Nate
            </a>
            , the creator of{" "}
            <b className="font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              JournalXP
            </b>
            .
            <br />
            <br />I started this project after nearly losing my battle with
            mental health. For a long time, I was stuck in a deep depression and
            didn't know how to move forward. Journaling became a small but
            powerful step in my healing, a way to reflect, release, and grow.
            Over time, I realized I wanted to help others who were going through
            similar struggles. That's why I created{" "}
            <b className="font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              JournalXP
            </b>
            , a space where mental well-being becomes something you can build,
            level up, and feel proud of, just like a game.
          </p>
          <p>
            Here at{" "}
            <b className="font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              JournalXP
            </b>
            , our mission is to make mental wellness more engaging and
            accessible for everyone. We combine thoughtful design with gamified
            features to help you build positive habits, reflect on your journey,
            and level up, one step at a time.
            <br />
            <br />
            Because your mental health matters, and you deserve to grow with
            every entry.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-indigo-50 p-4 rounded-lg text-center">
              <Heart className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <h3 className="font-medium text-indigo-900">Self-Care</h3>
              <p className="text-sm text-indigo-700">
                Prioritize your mental wellbeing daily
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <Star className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-medium text-purple-900">Motivation</h3>
              <p className="text-sm text-purple-700">
                Stay engaged with rewards and progress tracking
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Compass className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-medium text-blue-900">Growth</h3>
              <p className="text-sm text-blue-700">
                Build lasting habits for long-term wellbeing
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
