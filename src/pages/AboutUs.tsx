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
import { FeedbackForm } from "@/components/Feedback";
import { AboutInfo } from "@/features/about/aboutInfo";
import { AboutUserGuide } from "@/features/about/aboutUserGuide";

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
      {/* <FeedbackForm /> */}

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
                  ranks. Unlock rewards like avatar items and premium themes. (feature coming soon)
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
                  understand your mental health. (feature coming soon)
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

