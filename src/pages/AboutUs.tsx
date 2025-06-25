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
import { AboutFeatures } from "@/features/about/aboutFeatures";

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
      <FeedbackForm />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUs;

