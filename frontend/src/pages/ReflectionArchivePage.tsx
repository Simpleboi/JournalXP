import ReflectionArchive from "@/features/journal/ReflectionArchive";
import { useState, useEffect } from "react";
import { JournalEntry } from "@/features/journal/JournalEntry";
import { Header } from "@/components/Header";
import { Archive, Lock, Book } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { SEO } from "@/components/SEO";
import { getJournalEntries } from "@/services/JournalService";
import { useAuth } from "@/context/AuthContext";

const ReflectionArchivePage = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

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

        {/* Quick Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mt-8 max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/vault')}
            className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 hover:border-amber-300 hover:shadow-md transition-all duration-200"
          >
            <div className="p-2 rounded-lg bg-amber-100 group-hover:bg-amber-200 transition-colors">
              <Lock className="h-4 w-4 text-amber-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-amber-900">Vault</p>
              <p className="text-xs text-amber-600">Secure entries</p>
            </div>
          </button>
          <button
            onClick={() => navigate('/journal')}
            className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200"
          >
            <div className="p-2 rounded-lg bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
              <Book className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-emerald-900">Journal</p>
              <p className="text-xs text-emerald-600">Write new entry</p>
            </div>
          </button>
        </div>
      </main>

      {/* Offline Indicator */}
      <OfflineIndicator />
    </div>
  );
};

export default ReflectionArchivePage;
