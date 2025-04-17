import { motion } from "framer-motion";
import { Book, Calendar as CalendarIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import JournalInterface from "@/components/JournalInterface";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ReflectionArchive from "@/features/journal/ReflectionArchive";
import { Journal } from "@/features/journal/Journal";

const JournalPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-3">
            <Link to="/" className="h-8 w-8 text-indigo-600">
              <ArrowLeft />
            </Link>
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Book className="h-8 w-8 text-indigo-600" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-indigo-700">Journal</h1>
              <p className="text-indigo-500">
                Reflect, process, and track your thoughts
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        
        {/* Journal Component */}
        <Journal />
        
        {/* Reflection Archive */}
        <ReflectionArchive />
      </main>
    </div>
  );
};

export default JournalPage;
