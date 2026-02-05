import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useUserData } from "@/context/UserDataContext";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import {
  Sparkles,
  Lock,
  Shield,
  Info,
  Check,
  Heart,
  TrendingUp,
  Brain,
  Star,
  Lightbulb,
  Zap,
  PenTool,
  HelpCircle,
  LifeBuoy,
  Eye,
  ChevronDown,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { generateSelfReflection, digDeeperOnSection } from "@/services/JournalService";
import { useToast } from "@/hooks/useToast";
import { SelfReflectionGenerateResponse } from "@shared/types/api";
import { motion } from "framer-motion";

type ReflectionSection = keyof SelfReflectionGenerateResponse['reflection'];

const DAILY_LIMIT = 5;

// Glassmorphism wrapper
const GlassCard = ({
  children,
  className = "",
  gradient,
}: {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}) => (
  <div className={`relative rounded-2xl overflow-hidden ${className}`}>
    {gradient && (
      <div className={`absolute -inset-[1px] rounded-2xl ${gradient}`} />
    )}
    <div className="relative rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg">
      {children}
    </div>
  </div>
);

// Daily usage dots
const UsageDots = ({ used }: { used: number }) => {
  const remaining = Math.max(0, DAILY_LIMIT - used);
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex gap-1">
        {[...Array(DAILY_LIMIT)].map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i < remaining
                ? "bg-gradient-to-br from-purple-400 to-pink-400 shadow-sm shadow-purple-300/50"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500">
        {remaining}/{DAILY_LIMIT} today
      </span>
    </div>
  );
};

export const InsightSelfReflection = () => {
  const { userData, refreshUserData } = useUserData();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [showOptIn, setShowOptIn] = useState(false);
  const [reflection, setReflection] = useState<SelfReflectionGenerateResponse | null>(null);
  const [showTransparency, setShowTransparency] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<'metadata' | 'full-content'>('full-content');
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Record<ReflectionSection, string>>({} as Record<ReflectionSection, string>);
  const [digDeeperLoading, setDigDeeperLoading] = useState<ReflectionSection | null>(null);

  const loadingMessages = [
    "Reading through your journal entries...",
    "Identifying emotional patterns...",
    "Looking for signs of growth...",
    "Discovering recurring themes...",
    "Recognizing your strengths...",
    "Crafting personalized insights...",
    "Almost there, putting it all together...",
    "Adding the finishing touches...",
  ];

  // Rotate loading messages
  useEffect(() => {
    if (!loading) {
      setLoadingMessageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) =>
        prev < loadingMessages.length - 1 ? prev + 1 : prev
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [loading, loadingMessages.length]);

  const totalEntries = userData?.journalStats?.totalJournalEntries || 0;
  const isEligible = totalEntries >= 15;
  const hasConsent = userData?.aiDataConsent?.journalAnalysisEnabled || false;
  const dailyUsed = userData?.selfReflectionStats?.dailyGenerationCount ?? 0;

  // Initialize analysis mode from user's stored preference
  useEffect(() => {
    if (userData?.aiDataConsent?.allowFullContentAnalysis !== undefined) {
      setAnalysisMode(userData.aiDataConsent.allowFullContentAnalysis ? 'full-content' : 'metadata');
    }
  }, [userData?.aiDataConsent?.allowFullContentAnalysis]);

  useEffect(() => {
    // Check if we should show opt-in dialog
    if (isEligible && !hasConsent && !showOptIn) {
      // Don't auto-show, wait for user to click generate
    }
  }, [isEligible, hasConsent]);

  const handleEnableConsent = async () => {
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        aiDataConsent: {
          journalAnalysisEnabled: true,
          allowFullContentAnalysis: analysisMode === 'full-content',
          sundayEnabled: userData?.aiDataConsent?.sundayEnabled || false,
          habitAnalysisEnabled: userData?.aiDataConsent?.habitAnalysisEnabled || false,
          consentTimestamp: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        }
      }, { merge: true });

      await refreshUserData();
      setShowOptIn(false);
      await handleGenerate();
    } catch (error: any) {
      console.error("Error enabling consent:", error);
      showToast({
        title: "Error",
        description: "Failed to enable journal analysis",
        variant: "destructive",
      });
    }
  };

  const handleGenerate = async () => {
    if (!isEligible) {
      showToast({
        title: "Not enough entries",
        description: `You need ${15 - totalEntries} more journal entries to generate insights.`,
        variant: "destructive",
      });
      return;
    }

    if (!hasConsent) {
      setShowOptIn(true);
      return;
    }

    setLoading(true);
    try {
      if (user) {
        const storedPreference = userData?.aiDataConsent?.allowFullContentAnalysis;
        const currentPreference = analysisMode === 'full-content';

        if (storedPreference !== currentPreference) {
          const userRef = doc(db, "users", user.uid);
          await setDoc(userRef, {
            aiDataConsent: {
              ...userData?.aiDataConsent,
              allowFullContentAnalysis: currentPreference,
              lastUpdated: new Date().toISOString(),
            }
          }, { merge: true });
          await refreshUserData();
        }
      }

      const result = await generateSelfReflection();
      setReflection(result);
      await refreshUserData();

      showToast({
        title: "Reflection Generated",
        description: `You have ${Math.max(0, DAILY_LIMIT - (dailyUsed + 1))} reflections remaining today.`,
      });
    } catch (error: any) {
      console.error("Error generating reflection:", error);

      if (error.code === "INSUFFICIENT_ENTRIES") {
        showToast({
          title: "Not enough entries",
          description: `You need ${error.requiredEntries} journal entries. Current: ${error.currentEntries}`,
          variant: "destructive",
        });
      } else if (error.code === "DAILY_LIMIT_REACHED") {
        showToast({
          title: "Daily limit reached",
          description: `You can generate ${DAILY_LIMIT} reflections per day. Try again tomorrow!`,
          variant: "destructive",
        });
      } else if (error.code === "AI_CONSENT_REQUIRED") {
        setShowOptIn(true);
      } else {
        showToast({
          title: "Generation failed",
          description: error.message || "Failed to generate reflection",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDigDeeper = async (section: ReflectionSection) => {
    if (!reflection) return;

    setDigDeeperLoading(section);
    try {
      const currentContent = reflection.reflection[section];
      const result = await digDeeperOnSection(section, currentContent);

      setExpandedSections((prev) => ({
        ...prev,
        [section]: result.expandedContent,
      }));

      showToast({
        title: "Section Expanded",
        description: "Here's a deeper look at this insight.",
      });
    } catch (error: any) {
      console.error("Error expanding section:", error);
      showToast({
        title: "Expansion failed",
        description: error.message || "Failed to expand section",
        variant: "destructive",
      });
    } finally {
      setDigDeeperLoading(null);
    }
  };

  // Helper component for rendering reflection sections with Dig Deeper
  const ReflectionCard = ({
    section,
    title,
    icon: Icon,
    iconGradient,
  }: {
    section: ReflectionSection;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    iconGradient: string;
  }) => {
    const content = reflection?.reflection[section];
    const expandedContent = expandedSections[section];
    const isLoading = digDeeperLoading === section;

    if (!content) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <GlassCard>
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${iconGradient} shadow-sm`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900">{title}</h4>
              </div>
              {!expandedContent && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDigDeeper(section)}
                  disabled={isLoading}
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50/60 rounded-xl text-xs"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                      Expanding...
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3.5 w-3.5 mr-1" />
                      Dig Deeper
                    </>
                  )}
                </Button>
              )}
            </div>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">{content}</p>
            {expandedContent && (
              <div className="mt-4 pt-4 border-t border-purple-100/60">
                <p className="text-[10px] font-semibold text-purple-500 mb-2 uppercase tracking-widest">
                  Expanded Insights
                </p>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">{expandedContent}</p>
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>
    );
  };

  // --- INELIGIBLE STATE ---
  if (!isEligible) {
    return (
      <GlassCard gradient="bg-gradient-to-r from-purple-300/20 via-pink-300/20 to-indigo-300/20">
        <div className="p-8 sm:p-12 text-center">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 mb-5">
            <Lock className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Self-Reflection Unlocks at 15 Entries
          </h3>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            Keep journaling to unlock AI-powered insights about your emotional patterns and growth.
          </p>
          <div className="max-w-xs mx-auto space-y-2">
            <Progress value={(totalEntries / 15) * 100} className="h-2" />
            <p className="text-xs text-gray-400">{totalEntries} of 15 entries</p>
          </div>
        </div>
      </GlassCard>
    );
  }

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="space-y-4">
        <GlassCard gradient="bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-indigo-400/30">
          <div className="p-8 sm:p-12">
            <div className="flex flex-col items-center text-center space-y-6">
              <motion.div
                className="relative p-5 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-xl shadow-purple-500/20"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="h-8 w-8 text-white" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              </motion.div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Generating Your Reflection
                </h3>
                <motion.p
                  key={loadingMessageIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-purple-600 font-medium text-sm"
                >
                  {loadingMessages[loadingMessageIndex]}
                </motion.p>
                <p className="text-xs text-gray-400 pt-1">
                  This may take a moment as we craft personalized insights.
                </p>
              </div>
              <div className="flex gap-1.5">
                {loadingMessages.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${
                      index <= loadingMessageIndex
                        ? "bg-gradient-to-br from-purple-500 to-pink-500 scale-110"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="p-5 sm:p-6 space-y-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </GlassCard>
      </div>
    );
  }

  // --- MAIN UI: NO REFLECTION YET ---
  if (!reflection) {
    return (
      <>
        <GlassCard gradient="bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-indigo-400/20">
          <div className="p-5 sm:p-6 space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/20 flex-shrink-0">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Self-Reflection Insights</h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    AI-powered analysis of your emotional patterns and growth
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/60 border border-white/50 text-xs font-medium flex-shrink-0">
                <Shield className="h-3 w-3 text-purple-500" />
                <span className="text-gray-600 hidden sm:inline">
                  {analysisMode === 'full-content' ? 'In-Depth' : 'Private'}
                </span>
              </div>
            </div>

            {/* Info + Mode Toggle */}
            <div className="rounded-xl bg-white/50 border border-white/40 p-4 space-y-4">
              <p className="text-sm text-gray-600">
                Our AI will analyze your last 15 journal entries to identify patterns in your
                emotional journey, highlight areas of growth, and recognize your strengths.
              </p>

              {/* Analysis Mode Toggle */}
              <div className="rounded-xl bg-white/70 border border-purple-100/60 p-4">
                <Label className="text-xs font-semibold text-gray-700 mb-3 block uppercase tracking-wide">
                  Analysis Depth
                </Label>
                <RadioGroup value={analysisMode} onValueChange={(value: 'metadata' | 'full-content') => setAnalysisMode(value)}>
                  <div className="flex items-start space-x-3 mb-3">
                    <RadioGroupItem value="full-content" id="full-content-main" />
                    <div className="flex-1">
                      <Label htmlFor="full-content-main" className="font-medium cursor-pointer text-sm">
                        Full Content Analysis
                        <span className="ml-1.5 text-[10px] font-semibold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full">Recommended</span>
                      </Label>
                      <p className="text-xs text-gray-500 mt-0.5">
                        AI reads your entries for specific, actionable insights.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="metadata" id="metadata-main" />
                    <div className="flex-1">
                      <Label htmlFor="metadata-main" className="font-medium cursor-pointer text-sm">
                        Metadata Only
                      </Label>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Only mood, date, and word count. More private, less specific.
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Generate Button + Usage */}
            <div className="space-y-3">
              <Button
                onClick={handleGenerate}
                disabled={dailyUsed >= DAILY_LIMIT}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/20 h-11"
                size="lg"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate My Reflection
              </Button>
              <div className="flex items-center justify-between">
                <UsageDots used={dailyUsed} />
                <span className="text-[10px] text-gray-400">{DAILY_LIMIT} reflections per day</span>
              </div>
            </div>

            {/* Transparency */}
            <Collapsible open={showTransparency} onOpenChange={setShowTransparency}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full text-gray-500 hover:text-gray-700 rounded-xl text-xs">
                  <Info className="h-3.5 w-3.5 mr-1.5" />
                  What data is being analyzed?
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="rounded-xl bg-blue-50/60 backdrop-blur-sm border border-blue-100/40 p-4 space-y-2.5 mt-2">
                  {analysisMode === 'full-content' ? (
                    <div className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-purple-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-600">
                        <strong>Full Content:</strong> AI reads your journal entries to identify specific themes, patterns, and actionable insights.
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-600">
                        <strong>Metadata Only:</strong> AI analyzes mood, date, word count, and frequency patterns. Your content is never shared.
                      </p>
                    </div>
                  )}
                  <div className="flex items-start gap-2.5">
                    <Shield className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-600">
                      <strong>Privacy:</strong> Data is encrypted in transit and never stored by OpenAI.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Heart className="h-4 w-4 text-pink-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-600">
                      <strong>Purpose:</strong> Empathetic insights to support your personal growth.
                    </p>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </GlassCard>

        {/* Opt-in Dialog */}
        <Dialog open={showOptIn} onOpenChange={setShowOptIn}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enable Self-Reflection Insights?</DialogTitle>
              <DialogDescription>
                Get AI-powered insights into your journaling patterns to support your growth.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm">Identifies emotional patterns and growth areas</p>
                </div>
                <div className="flex gap-3">
                  <Heart className="h-5 w-5 text-pink-600 flex-shrink-0" />
                  <p className="text-sm">Receive empathetic, growth-focused insights</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <Label className="text-sm font-semibold mb-3 block">
                  Choose Analysis Depth:
                </Label>
                <RadioGroup value={analysisMode} onValueChange={(value: 'metadata' | 'full-content') => setAnalysisMode(value)}>
                  <div className="flex items-start space-x-3 mb-3">
                    <RadioGroupItem value="full-content" id="full-content" />
                    <div className="flex-1">
                      <Label htmlFor="full-content" className="font-medium cursor-pointer">
                        Full Content Analysis (Recommended)
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">
                        AI reads your journal entries to provide specific, actionable insights about themes and patterns.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="metadata" id="metadata" />
                    <div className="flex-1">
                      <Label htmlFor="metadata" className="font-medium cursor-pointer">
                        Metadata Only (Basic)
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">
                        AI only sees mood, date, and word count. More private, but insights will be general.
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg flex gap-2">
                <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-700">
                  Your data is encrypted in transit and never stored by OpenAI. You can change this preference anytime in settings.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowOptIn(false)}>
                Cancel
              </Button>
              <Button onClick={handleEnableConsent}>
                Enable Self-Reflection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // --- GENERATED REFLECTION ---
  const remaining = Math.max(0, DAILY_LIMIT - dailyUsed);

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <GlassCard gradient="bg-gradient-to-r from-purple-400/25 via-pink-400/25 to-indigo-400/25">
        <div className="p-5 sm:p-6 space-y-5">
          {/* Title Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/20 flex-shrink-0">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Your Self-Reflection</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Based on {reflection.metadata.entriesAnalyzed} recent entries
                  {reflection.metadata.analysisMode && (
                    <span className="text-purple-500 font-medium">
                      {' '}&middot; {reflection.metadata.analysisMode === 'full-content' ? 'Full Analysis' : 'Metadata Only'}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/60 border border-white/50 text-xs font-medium flex-shrink-0">
              <Shield className="h-3 w-3 text-purple-500" />
              <span className="text-gray-600 hidden sm:inline">
                {reflection.metadata.analysisMode === 'full-content' ? 'In-Depth' : 'Private'}
              </span>
            </div>
          </div>

          {/* Summary */}
          <p className="text-gray-700 text-sm leading-relaxed">{reflection.summary}</p>

          {/* Analysis Mode Toggle */}
          <Collapsible>
            <CollapsibleTrigger asChild>
              <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1">
                <ChevronDown className="h-3 w-3" />
                Change analysis depth
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="rounded-xl bg-white/50 border border-white/40 p-3 mt-2">
                <RadioGroup value={analysisMode} onValueChange={(value: 'metadata' | 'full-content') => setAnalysisMode(value)} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full-content" id="full-content-regen" />
                    <Label htmlFor="full-content-regen" className="text-xs cursor-pointer">
                      Full Content Analysis (Recommended)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="metadata" id="metadata-regen" />
                    <Label htmlFor="metadata-regen" className="text-xs cursor-pointer">
                      Metadata Only (Basic)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Regenerate + Usage */}
          <div className="flex items-center justify-between pt-1">
            <UsageDots used={dailyUsed} />
            <Button
              onClick={handleGenerate}
              variant="outline"
              size="sm"
              disabled={remaining === 0}
              className="rounded-xl bg-white/60 hover:bg-white/80 border-purple-200/60 hover:border-purple-300 text-purple-700 text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Regenerate
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Reflection Sections */}
      <ReflectionCard
        section="emotionalPatterns"
        title="Emotional Patterns"
        icon={Heart}
        iconGradient="bg-gradient-to-br from-pink-500 to-rose-500"
      />
      <ReflectionCard
        section="growthTrajectory"
        title="Growth Trajectory"
        icon={TrendingUp}
        iconGradient="bg-gradient-to-br from-emerald-500 to-green-500"
      />
      <ReflectionCard
        section="recurringThemes"
        title="Recurring Themes"
        icon={Brain}
        iconGradient="bg-gradient-to-br from-purple-500 to-violet-500"
      />
      <ReflectionCard
        section="identifiedStrengths"
        title="Identified Strengths"
        icon={Star}
        iconGradient="bg-gradient-to-br from-amber-500 to-yellow-500"
      />
      <ReflectionCard
        section="actionableSuggestions"
        title="Actionable Suggestions"
        icon={Lightbulb}
        iconGradient="bg-gradient-to-br from-amber-400 to-orange-500"
      />
      <ReflectionCard
        section="moodTriggers"
        title="Mood Triggers"
        icon={Zap}
        iconGradient="bg-gradient-to-br from-orange-500 to-red-500"
      />
      <ReflectionCard
        section="copingStrategiesWorking"
        title="What's Working"
        icon={LifeBuoy}
        iconGradient="bg-gradient-to-br from-teal-500 to-cyan-500"
      />
      <ReflectionCard
        section="journalingPrompts"
        title="Personalized Journaling Prompts"
        icon={PenTool}
        iconGradient="bg-gradient-to-br from-indigo-500 to-blue-500"
      />
      <ReflectionCard
        section="questionsForReflection"
        title="Questions for Reflection"
        icon={HelpCircle}
        iconGradient="bg-gradient-to-br from-blue-500 to-sky-500"
      />
      <ReflectionCard
        section="blindSpots"
        title="Areas to Explore"
        icon={Eye}
        iconGradient="bg-gradient-to-br from-rose-500 to-pink-500"
      />

      {/* Transparency */}
      <GlassCard>
        <div className="p-4">
          <Collapsible open={showTransparency} onOpenChange={setShowTransparency}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full text-gray-500 hover:text-gray-700 rounded-xl text-xs">
                <Info className="h-3.5 w-3.5 mr-1.5" />
                About this analysis
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="rounded-xl bg-blue-50/60 backdrop-blur-sm border border-blue-100/40 p-4 space-y-2 mt-2">
                <p className="text-xs text-gray-600">
                  <strong>Analysis Mode:</strong> {reflection.metadata.analysisMode === 'full-content'
                    ? 'Full Content — AI read your entries to identify specific themes and patterns.'
                    : 'Metadata Only — Only mood, date, and word count were analyzed.'}
                </p>
                <p className="text-xs text-gray-600">
                  <strong>Privacy:</strong> Your data is encrypted in transit and never stored by OpenAI.
                </p>
                <p className="text-xs text-gray-600">
                  <strong>Purpose:</strong> These insights support your self-awareness and personal growth, not to diagnose or treat any condition.
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </GlassCard>
    </div>
  );
};
