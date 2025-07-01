import { motion } from "framer-motion";
import { Book, Calendar as CalendarIcon, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ReflectionArchive from "@/features/journal/ReflectionArchive";
import { Journal } from "@/features/journal/Journal";
import { useState } from "react";
import { JournalEntry } from "@/features/journal/JournalEntry";
import { Button } from "@/components/ui/button";
import { Nav } from "@/components/Nav";

const JournalPage = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

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
              Journal
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
        {/* Journal Component */}
        <Journal entries={entries} setEntries={setEntries} />

        {/* Reflection Archive */}
        <ReflectionArchive entries={entries} setEntries={setEntries} />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default JournalPage;
