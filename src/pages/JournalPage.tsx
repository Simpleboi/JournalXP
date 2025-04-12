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
        <Tabs defaultValue="write" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="write" className="flex items-center">
              <Book className="w-4 h-4 mr-2" />
              Write & Reflect
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Calendar View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="write">
            <JournalInterface />
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-indigo-700">
                  Journal Calendar
                </CardTitle>
                <CardDescription>
                  View your journal entries by date
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-10 text-gray-500">
                  Calendar view will be implemented in the next phase.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default JournalPage;
