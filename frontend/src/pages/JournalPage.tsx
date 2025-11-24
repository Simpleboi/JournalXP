import ReflectionArchive from "@/features/journal/ReflectionArchive";
import { EnhancedJournal } from "@/features/journal/EnhancedJournal";
import { VaultSection } from "@/features/journal/VaultSection";
import { ExportEntries } from "@/features/journal/ExportEntries";
import { useState } from "react";
import { JournalEntry } from "@/features/journal/JournalEntry";
import { Header } from "@/components/Header";
import { Book } from "lucide-react";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        <Tabs defaultValue="journal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3" aria-label="Journal sections">
            <TabsTrigger value="journal" aria-label="Regular journal entries">
              Journal
            </TabsTrigger>
            <TabsTrigger value="vault" aria-label="Secure vault for sensitive entries">
              🔒 Secure Vault
            </TabsTrigger>
            <TabsTrigger value="archive" aria-label="Journal archive and export">
              Archive
            </TabsTrigger>
          </TabsList>

          <TabsContent value="journal" className="space-y-6">
            {/* Journal Component */}
            <EnhancedJournal entries={entries} setEntries={setEntries} />
          </TabsContent>

          <TabsContent value="vault" className="space-y-6">
            {/* Secure Vault Section */}
            <VaultSection />
          </TabsContent>

          <TabsContent value="archive" className="space-y-6">
            {/* Export Functionality */}
            <div className="mb-4">
              <ExportEntries entries={entries} />
            </div>

            {/* Reflection Archive */}
            <ReflectionArchive entries={entries} setEntries={setEntries} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Offline Indicator */}
      <OfflineIndicator />

      {/* <Footer /> */}
    </div>
  );
};

export default JournalPage;
