import ReflectionArchive from "@/features/journal/ReflectionArchive";
import { Journal } from "@/features/journal/Journal";
import { TemplatedJournal } from "@/features/journal/TemplatedJournal";
import { VaultSection } from "@/features/journal/VaultSection";
import { useState } from "react";
import { JournalEntry } from "@/features/journal/JournalEntry";
import { Header } from "@/components/Header";
import { Book, Sparkles, Lock, Archive } from "lucide-react";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/context/ThemeContext";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useUserData } from "@/context/UserDataContext";
import { FeatureNotice } from "@/components/FeatureNotice";
import { useAuth } from "@/context/AuthContext";

const JournalPage = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { userData } = useUserData();
  const { user } = useAuth();

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
      <Header title="Journal & Reflection" icon={Book} />

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
            {/* Promotional Card for Self-Reflection */}
            {userData && userData.journalStats?.totalJournalEntries && userData.journalStats.totalJournalEntries >= 15 && (
              <Card className="w-full max-w-5xl mx-auto mb-4 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <CardContent className="py-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-purple-900">
                          See what your journals reveal about you
                        </p>
                        <p className="text-sm text-purple-700">
                          Get AI-powered insights into your emotional patterns and growth
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/insights?tab=self-reflection')}
                      className="whitespace-nowrap"
                    >
                      View Insights
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Feature Notice */}
            {!user ? <FeatureNotice
              type="info"
              title="You're in preview mode"
              message="Feel free to explore and write, but sign in to keep your entries safe and saved."
              className="max-w-5xl mx-auto"
            /> : ""}

            {/* Journal Component */}
            <Journal entries={entries} setEntries={setEntries} />

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
                onClick={() => navigate('/reflection-archive')}
                className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200"
              >
                <div className="p-2 rounded-lg bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
                  <Archive className="h-4 w-4 text-indigo-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-indigo-900">Reflection Archive</p>
                  <p className="text-xs text-indigo-600">Past reflections</p>
                </div>
              </button>
            </div>
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
