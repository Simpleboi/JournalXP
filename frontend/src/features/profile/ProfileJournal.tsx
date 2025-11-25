import { useJournalPreferences } from "@/context/JournalPreferencesContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, RotateCcw, Minus, Plus } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function ProfileJournal() {
  const { preferences, updateWordCountGoal, resetPreferences } = useJournalPreferences();
  const { theme } = useTheme();

  const decreaseGoal = () => {
    const newGoal = Math.max(50, preferences.wordCountGoal - 50);
    updateWordCountGoal(newGoal);
  };

  const increaseGoal = () => {
    const newGoal = Math.min(1000, preferences.wordCountGoal + 50);
    updateWordCountGoal(newGoal);
  };

  const presetGoals = [100, 150, 200, 250, 300, 500];

  return (
    <Card className="w-full">
      <CardHeader
        className="border-b"
        style={{
          backgroundImage: theme.colors.gradient,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-white flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Journal Preferences
            </CardTitle>
            <CardDescription className="text-white/90">
              Customize your journaling experience
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetPreferences}
            className="gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20"
            aria-label="Reset journal preferences to default"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Word Count Goal */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Daily Word Count Goal</label>
              <p className="text-xs text-gray-500 mt-1">
                Set your target word count for each journal entry
              </p>
            </div>
          </div>

          {/* Current Goal Display */}
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={decreaseGoal}
              disabled={preferences.wordCountGoal <= 50}
              aria-label="Decrease word count goal"
              className="h-10 w-10 p-0"
            >
              <Minus className="h-4 w-4" />
            </Button>

            <Badge
              variant="outline"
              className="px-6 py-3 text-lg font-semibold min-w-[150px] justify-center"
              style={{
                borderColor: theme.colors.primary,
                color: theme.colors.primaryDark,
              }}
            >
              {preferences.wordCountGoal} words
            </Badge>

            <Button
              variant="outline"
              size="sm"
              onClick={increaseGoal}
              disabled={preferences.wordCountGoal >= 1000}
              aria-label="Increase word count goal"
              className="h-10 w-10 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Preset Goals */}
          <div className="space-y-2">
            <p className="text-xs text-gray-500 text-center">Quick presets:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {presetGoals.map((goal) => (
                <Button
                  key={goal}
                  variant={preferences.wordCountGoal === goal ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateWordCountGoal(goal)}
                  className="min-w-[70px]"
                  style={
                    preferences.wordCountGoal === goal
                      ? { backgroundImage: theme.colors.gradient }
                      : undefined
                  }
                >
                  {goal}
                </Button>
              ))}
            </div>
          </div>

          {/* Info Banner */}
          <div
            className="p-3 rounded-lg border"
            style={{
              backgroundColor: theme.colors.surfaceLight,
              borderColor: theme.colors.border,
            }}
          >
            <p className="text-xs" style={{ color: theme.colors.primaryDark }}>
              <strong>Note:</strong> Your word count goal helps track your writing progress.
              The journal editor will show a progress bar as you write towards your goal.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
