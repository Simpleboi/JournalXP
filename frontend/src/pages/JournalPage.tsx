import ReflectionArchive from "@/features/journal/ReflectionArchive";
import { EnhancedJournal } from "@/features/journal/EnhancedJournal";
import { useState } from "react";
import { JournalEntry } from "@/features/journal/JournalEntry";
import { Header } from "@/components/Header";
import { Book } from "lucide-react";
import { AccessibilityPanel } from "@/components/AccessibilityPanel";

const JournalPage = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link sr-only-focusable">
        Skip to main content
      </a>

      {/* Header */}
      <Header title="Journal & Reflection" icon={Book}/>

      {/* Main Content */}
      <main id="main-content" className="container mx-auto px-4 py-8">
        {/* Accessibility Panel */}
        <AccessibilityPanel />

        {/* Journal Component */}
        <EnhancedJournal entries={entries} setEntries={setEntries} />

        {/* Reflection Archive */}
        <ReflectionArchive entries={entries} setEntries={setEntries} />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default JournalPage;
