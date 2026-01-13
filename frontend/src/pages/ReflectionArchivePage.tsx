import ReflectionArchive from "@/features/journal/ReflectionArchive";
import { useState, useEffect } from "react";
import { JournalEntry } from "@/features/journal/JournalEntry";
import { Header } from "@/components/Header";
import { Archive } from "lucide-react";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { SEO } from "@/components/SEO";
import { getJournalEntries } from "@/services/JournalService";
import { useAuth } from "@/context/AuthContext";

const ReflectionArchivePage = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEntries = async () => {
      if (user) {
        try {
          const fetchedEntries = await getJournalEntries();
          setEntries(fetchedEntries);
        } catch (error) {
          console.error("Failed to fetch journal entries:", error);
        }
      }
    };

    fetchEntries();
  }, [user]);

  return (
    <div className="min-h-screen">
      <SEO
        title="Reflection Archive - Browse Past Journal Entries"
        description="Browse, search, and export your journal entries. View your thoughts in list or calendar format with powerful filtering options."
        url="https://journalxp.com/reflection-archive"
      />

      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link sr-only-focusable">
        Skip to main content
      </a>

      {/* Header */}
      <Header title="Reflection Archive" icon={Archive} />

      {/* Main Content */}
      <main id="main-content" className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <ReflectionArchive entries={entries} setEntries={setEntries} />
      </main>

      {/* Offline Indicator */}
      <OfflineIndicator />
    </div>
  );
};

export default ReflectionArchivePage;
