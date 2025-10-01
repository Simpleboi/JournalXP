import ReflectionArchive from "@/features/journal/ReflectionArchive";
import { Journal } from "@/features/journal/Journal";
import { useState } from "react";
import { JournalEntry } from "@/features/journal/JournalEntry";
import { Header } from "@/components/Header";
import { Book } from "lucide-react";

const JournalPage = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <Header title="Journal & Reflection" icon={Book}/>

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
