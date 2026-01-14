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
import { useUserData } from "@/context/UserDataContext";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
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
} from "lucide-react";
import { generateSelfReflection } from "@/services/JournalService";
import { useToast } from "@/hooks/useToast";
import { SelfReflectionGenerateResponse } from "@shared/types/api";

export const InsightSelfReflection = () => {
  const { userData, refreshUserData } = useUserData();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [showOptIn, setShowOptIn] = useState(false);
  const [reflection, setReflection] = useState<SelfReflectionGenerateResponse | null>(null);
  const [showTransparency, setShowTransparency] = useState(false);

  const totalEntries = userData?.journalStats?.totalJournalEntries || 0;
  const isEligible = totalEntries >= 15;
  const hasConsent = userData?.aiDataConsent?.journalAnalysisEnabled || false;

  useEffect(() => {
    // Check if we should show opt-in dialog
    if (isEligible && !hasConsent && !showOptIn) {
      // Don't auto-show, wait for user to click generate
    }
  }, [isEligible, hasConsent]);

  const handleEnableConsent = async () => {
    try {
      // Update consent via API endpoint (you may need to create this endpoint)
      // For now, we'll handle it in the generate call
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
          description: "You can generate 3 reflections per day. Try again tomorrow!",
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
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
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
              <Badge variant="outline" className="border-green-600 text-green-700">
                <Shield className="h-3 w-3 mr-1" />
                Private Analysis
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 mb-4">
                Our AI will analyze your last 15 journal entries to identify patterns in your
                emotional journey, highlight areas of growth, and recognize your strengths.
              </p>
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
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">
                      <strong>Analyzed:</strong> Mood patterns, journaling frequency, word count, and dates from your last 15 entries
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">
                      <strong>NOT analyzed:</strong> Your actual journal content remains completely private
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">
                      <strong>Generated:</strong> Empathetic insights to support your personal growth
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
            <div className="space-y-3 py-4">
              <div className="flex gap-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                <p className="text-sm">Analyzes your last 15 journal entries metadata</p>
              </div>
              <div className="flex gap-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                <p className="text-sm">Identifies emotional patterns and growth areas</p>
              </div>
              <div className="flex gap-3">
                <Shield className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <p className="text-sm">Your raw journal content remains completely private</p>
              </div>
              <div className="flex gap-3">
                <Heart className="h-5 w-5 text-pink-600 flex-shrink-0" />
                <p className="text-sm">Receive empathetic, growth-focused insights</p>
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
                </p>
              </div>
              <Badge variant="outline" className="border-green-600 text-green-700">
                <Shield className="h-3 w-3 mr-1" />
                Private
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{reflection.summary}</p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {reflection.metadata.remainingToday} of 3 generations remaining today
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
                    <strong>Privacy:</strong> Only metadata (mood, date, word count) was analyzed.
                    Your actual journal content was never shared with the AI.
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
