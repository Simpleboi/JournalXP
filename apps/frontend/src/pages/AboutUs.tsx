import { motion } from "framer-motion";
import { FeedbackForm } from "@/components/Feedback";
import { AboutInfo } from "@/features/about/aboutInfo";
import { AboutUserGuide } from "@/features/about/aboutUserGuide";
import { AboutContribute } from "@/features/about/aboutContribute";
import { Header } from "@/components/Header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Info, Star } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 pb-16">
      {/* Header */}
      <Header title="About JXP" icon={Info}/>

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
            <TabsTrigger value="guide">
              <Book className="h-4 w-4 mr-2" />
              User Guide
            </TabsTrigger>
            <TabsTrigger value="contribute">
              <Star className="h-4 w-4 mr-2" />
              Contributing
            </TabsTrigger>
          </TabsList>

          {/* The Information Tab */}
          <AboutInfo />

          {/* The Features Tab */}
          <AboutContribute />

          {/* The About User Guide */}
          <AboutUserGuide />
        </Tabs>
      </main>
    </div>
  );
};

export default AboutUs;
