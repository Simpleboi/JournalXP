import ReflectionArchive from "@/features/journal/ReflectionArchive";
import { Journal } from "@/features/journal/Journal";
import { TemplatedJournal } from "@/features/journal/TemplatedJournal";
import { VaultSection } from "@/features/journal/VaultSection";
import { useState } from "react";
import { JournalEntry } from "@/features/journal/JournalEntry";
import { Header } from "@/components/Header";
import { Book } from "lucide-react";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/context/ThemeContext";
import { SEO } from "@/components/SEO";

const JournalPage = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const { theme } = useTheme();

  return (
    <div
      className="min-h-screen"
    >
      <SEO
        title="Mental Health Journaling - Track Moods & Earn XP"
        description="Express yourself freely with JournalXP's guided journaling. Track moods, reflect on your day, and earn 30 XP per entry. Free writing, gratitude, and prompted journaling modes available."
        url="https://journalxp.com/journal"
      />
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link sr-only-focusable">
        Skip to main content
      </a>

      {/* Header */}
      <Header title="Journal & Reflection" icon={Book}/>

      {/* Main Content */}
      <main id="main-content" className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <Tabs defaultValue="journal" className="space-y-4 sm:space-y-6">
          <TabsList
            className="grid w-full grid-cols-2 sm:grid-cols-2 gap-1 sm:gap-0 h-auto p-1"
            aria-label="Journal sections"
            style={{ borderColor: theme.colors.border }}
          >
            <TabsTrigger
              value="journal"
              aria-label="Regular journal entries"
              className="text-xs sm:text-sm py-2 sm:py-2.5"
              style={{
                color: theme.colors.primary,
              }}
              data-theme-hover-bg={theme.colors.surfaceLight}
            >
              Journal
            </TabsTrigger>
            {/* Will be implemented in 2.3 or whenever */}
            <TabsTrigger
              value="templates"
              aria-label="Template-based journal entries"
              className="text-xs sm:text-sm py-2 sm:py-2.5"
              style={{
                color: theme.colors.primary,
              }}
              data-theme-hover-bg={theme.colors.surfaceLight}
            >
              Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="journal" className="space-y-4 sm:space-y-6">
            {/* Journal Component */}
            <Journal entries={entries} setEntries={setEntries} />
          </TabsContent>

          <TabsContent value="templates" className="space-y-4 sm:space-y-6">
            {/* Templated Journal Component */}
            <TemplatedJournal entries={entries} setEntries={setEntries} />
          </TabsContent>

          <TabsContent value="vault" className="space-y-4 sm:space-y-6">
            {/* Secure Vault Section */}
            <VaultSection />
          </TabsContent>

          <TabsContent value="archive" className="space-y-4 sm:space-y-6">
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
