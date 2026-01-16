import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useState, useEffect, useCallback } from "react";
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
  AlertCircle,
  Lightbulb,
  Zap,
  PenTool,
  HelpCircle,
  LifeBuoy,
  Eye,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { generateSelfReflection, digDeeperOnSection } from "@/services/JournalService";
import { useToast } from "@/hooks/useToast";
import { SelfReflectionGenerateResponse } from "@shared/types/api";

type ReflectionSection = keyof SelfReflectionGenerateResponse['reflection'];

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
      // Update user's AI consent in Firestore
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

      // Refresh user data to get updated consent
      await refreshUserData();

      setShowOptIn(false);

      // Now generate the reflection
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
      // Update preference if it changed
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
        description: `You have ${result.metadata.remainingToday} generations remaining today.`,
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
          description: "You can generate 30 reflections per day. Try again tomorrow!",
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
    iconColor,
  }: {
    section: ReflectionSection;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    iconColor: string;
  }) => {
    const content = reflection?.reflection[section];
    const expandedContent = expandedSections[section];
    const isLoading = digDeeperLoading === section;

    if (!content) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <Icon className={`h-5 w-5 ${iconColor}`} />
              {title}
            </div>
            {!expandedContent && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDigDeeper(section)}
                disabled={isLoading}
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Expanding...
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Dig Deeper
                  </>
                )}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{content}</p>
          {expandedContent && (
            <div className="border-t pt-4 mt-4">
              <p className="text-xs font-semibold text-purple-600 mb-2 uppercase tracking-wide">
                Expanded Insights
              </p>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{expandedContent}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Insufficient data state
  if (!isEligible) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Lock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Self-Reflection Unlocked at 15 Entries
          </h3>
          <p className="text-gray-600 mb-4">
            You have {totalEntries} of 15 journal entries needed.
          </p>
          <Progress value={(totalEntries / 15) * 100} className="max-w-xs mx-auto mb-4" />
          <p className="text-sm text-gray-500">
            Keep journaling to unlock AI-powered insights about your emotional patterns and growth.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" />
                <Sparkles className="h-8 w-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  Generating Your Reflection
                </h3>
                <p className="text-purple-600 font-medium animate-pulse min-h-[24px]">
                  {loadingMessages[loadingMessageIndex]}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  This may take a moment as we craft detailed, personalized insights just for you.
                </p>
              </div>
              <div className="flex space-x-2">
                {loadingMessages.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                      index <= loadingMessageIndex
                        ? 'bg-purple-500'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main UI - No reflection generated yet
  if (!reflection) {
    return (
      <>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Self-Reflection Insights
                </CardTitle>
                <p className="text-sm text-gray-600 mt-2">
                  Get AI-powered insights into your emotional patterns, growth, and strengths
                </p>
              </div>
              <Badge variant="outline" className={analysisMode === 'full-content' ? "border-purple-600 text-purple-700" : "border-green-600 text-green-700"}>
                <Shield className="h-3 w-3 mr-1" />
                {analysisMode === 'full-content' ? 'In-Depth Analysis' : 'Private (Metadata Only)'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg space-y-4">
              <p className="text-sm text-gray-700">
                Our AI will analyze your last 15 journal entries to identify patterns in your
                emotional journey, highlight areas of growth, and recognize your strengths.
              </p>

              {/* Analysis Mode Toggle */}
              <div className="bg-white/80 p-4 rounded-lg border border-purple-200">
                <Label className="text-sm font-semibold mb-3 block">
                  Choose Analysis Depth:
                </Label>
                <RadioGroup value={analysisMode} onValueChange={(value: 'metadata' | 'full-content') => setAnalysisMode(value)}>
                  <div className="flex items-start space-x-3 mb-3">
                    <RadioGroupItem value="full-content" id="full-content-main" />
                    <div className="flex-1">
                      <Label htmlFor="full-content-main" className="font-medium cursor-pointer text-sm">
                        Full Content Analysis (Recommended)
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">
                        AI reads your journal entries for specific, actionable insights. More accurate and meaningful.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="metadata" id="metadata-main" />
                    <div className="flex-1">
                      <Label htmlFor="metadata-main" className="font-medium cursor-pointer text-sm">
                        Metadata Only (Basic)
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">
                        AI only sees mood, date, and word count. More private, but less specific insights.
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <Button onClick={handleGenerate} className="w-full" size="lg">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate My Reflection
              </Button>
            </div>

            <Collapsible open={showTransparency} onOpenChange={setShowTransparency}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full">
                  <Info className="h-4 w-4 mr-2" />
                  What data is being analyzed?
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="bg-blue-50 p-4 rounded-lg space-y-2 mt-2">
                  {analysisMode === 'full-content' ? (
                    <>
                      <div className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">
                          <strong>Full Content Analysis:</strong> AI reads your journal entries to identify specific themes, patterns, and actionable insights
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">
                          <strong>Privacy:</strong> Data is encrypted in transit and never stored by OpenAI
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">
                          <strong>Metadata Only:</strong> AI analyzes mood, date, word count, and frequency patterns
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">
                          <strong>Privacy:</strong> Your actual journal content is never shared with the AI
                        </p>
                      </div>
                    </>
                  )}
                  <div className="flex items-start gap-2">
                    <Heart className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">
                      <strong>Purpose:</strong> Empathetic insights to support your personal growth
                    </p>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

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
                        AI reads your journal entries to provide specific, actionable insights about themes and patterns. More accurate and meaningful.
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
                        AI only sees mood, date, and word count. More private, but insights will be general and less specific.
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

  // Display generated reflection
  return (
    <>
      <div className="space-y-4">
        {/* Header Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Your Self-Reflection
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Based on {reflection.metadata.entriesAnalyzed} recent journal entries
                  {reflection.metadata.analysisMode && (
                    <span className="text-purple-600 font-medium">
                      {' '}• {reflection.metadata.analysisMode === 'full-content' ? 'Full Content Analysis' : 'Metadata Only'}
                    </span>
                  )}
                </p>
              </div>
              <Badge variant="outline" className={reflection.metadata.analysisMode === 'full-content' ? "border-purple-600 text-purple-700" : "border-green-600 text-green-700"}>
                <Shield className="h-3 w-3 mr-1" />
                {reflection.metadata.analysisMode === 'full-content' ? 'In-Depth' : 'Private'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">{reflection.summary}</p>

            {/* Analysis Mode Toggle for Regeneration */}
            <div className="bg-gray-50 p-3 rounded-lg border">
              <Label className="text-xs font-semibold mb-2 block">
                Change Analysis Depth:
              </Label>
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

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {reflection.metadata.remainingToday} of 30 generations remaining today
              </p>
              <Button
                onClick={handleGenerate}
                variant="outline"
                size="sm"
                disabled={reflection.metadata.remainingToday === 0}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Emotional Patterns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="h-5 w-5 text-pink-600" />
              Emotional Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {reflection.reflection.emotionalPatterns}
            </p>
          </CardContent>
        </Card>

        {/* Growth Trajectory */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Growth Trajectory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {reflection.reflection.growthTrajectory}
            </p>
          </CardContent>
        </Card>

        {/* Recurring Themes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="h-5 w-5 text-purple-600" />
              Recurring Themes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {reflection.reflection.recurringThemes}
            </p>
          </CardContent>
        </Card>

        {/* Identified Strengths */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="h-5 w-5 text-yellow-600" />
              Identified Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {reflection.reflection.identifiedStrengths}
            </p>
          </CardContent>
        </Card>

        {/* Transparency Section */}
        <Card>
          <CardContent className="pt-6">
            <Collapsible open={showTransparency} onOpenChange={setShowTransparency}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full">
                  <Info className="h-4 w-4 mr-2" />
                  About this analysis
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="bg-blue-50 p-4 rounded-lg space-y-2 mt-2">
                  <p className="text-sm text-gray-700">
                    <strong>Analysis Mode:</strong> {reflection.metadata.analysisMode === 'full-content'
                      ? 'Full Content Analysis - The AI read your journal entries to identify specific themes, patterns, and insights.'
                      : 'Metadata Only - Only mood, date, and word count were analyzed. Your journal content was not shared with the AI.'}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Privacy:</strong> Your data is encrypted in transit and never stored by OpenAI.
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Purpose:</strong> These insights are meant to support your self-awareness
                    and personal growth, not to diagnose or treat any condition.
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
