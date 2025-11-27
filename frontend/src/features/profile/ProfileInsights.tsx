import { useState } from "react";
import { useUserData } from "@/context/UserDataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Minus, Plus } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { authFetch } from "@/lib/authFetch";
import { useToast } from "@/components/ui/use-toast";

export function ProfileInsights() {
  const { userData, refreshUserData } = useUserData();
  const { theme } = useTheme();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const currentGoal = userData?.preferences?.monthlyJournalGoal || 20;

  const updateMonthlyGoal = async (newGoal: number) => {
    try {
      setIsUpdating(true);
      await authFetch("/profile/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monthlyJournalGoal: newGoal,
        }),
      });

      await refreshUserData();

      toast({
        title: "Goal Updated",
        description: `Monthly journal goal set to ${newGoal} entries`,
      });
    } catch (error) {
      console.error("Failed to update monthly goal:", error);
      toast({
        title: "Update Failed",
        description: "Could not update your monthly goal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const decreaseGoal = () => {
    const newGoal = Math.max(5, currentGoal - 5);
    updateMonthlyGoal(newGoal);
  };

  const increaseGoal = () => {
    const newGoal = Math.min(100, currentGoal + 5);
    updateMonthlyGoal(newGoal);
  };

  const presetGoals = [10, 15, 20, 25, 30, 50];

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
              <BarChart3 className="mr-2 h-5 w-5" />
              Insights & Analytics Preferences
            </CardTitle>
            <CardDescription className="text-white/90">
              Customize your analytics goals and targets
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Monthly Journal Goal */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Monthly Journal Entry Goal</label>
              <p className="text-xs text-gray-500 mt-1">
                Set your target number of journal entries per month
              </p>
            </div>
          </div>

          {/* Current Goal Display */}
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={decreaseGoal}
              disabled={currentGoal <= 5 || isUpdating}
              aria-label="Decrease monthly goal"
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
              {currentGoal} entries
            </Badge>

            <Button
              variant="outline"
              size="sm"
              onClick={increaseGoal}
              disabled={currentGoal >= 100 || isUpdating}
              aria-label="Increase monthly goal"
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
                  variant={currentGoal === goal ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateMonthlyGoal(goal)}
                  disabled={isUpdating}
                  className="min-w-[70px]"
                  style={
                    currentGoal === goal
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
              backgroundImage: theme.colors.gradient,
            }}
          >
            <p className="text-xs" style={{ color: theme.colors.text }}>
              <strong>Note:</strong> Your monthly journal goal is tracked in the Insights & Analytics
              page under the "Journal Insights" tab. This helps you maintain consistency in your
              journaling practice.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
