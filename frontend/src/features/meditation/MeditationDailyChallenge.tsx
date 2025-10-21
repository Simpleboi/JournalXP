import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Target, CheckCircle, RotateCcw, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { FC } from "react";
import { MindfulnessChallenge } from "@/types/Meditation";

interface DailyChallengeProps {
  startTimer: () => void;
  stopTimer: () => void;
  dailyChallenge: MindfulnessChallenge;
  completedChallenges: string[];
  timerSeconds: any;
  timerActive: boolean;
  completeChallenge: () => void;
}

export const DailyChallenge: FC<DailyChallengeProps> = ({
    startTimer,
    stopTimer,
    dailyChallenge,
    completedChallenges,
    timerSeconds,
    timerActive,
    completeChallenge
}) => {
  return (
    <Card className="max-w-2xl mx-auto bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Target className="h-6 w-6 text-amber-600" />
            Today's Mindfulness Challenge
          </span>
          <Badge className="bg-amber-500 text-white">
            +{dailyChallenge.xp} XP
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {dailyChallenge.title}
          </h3>
          <p className="text-gray-600">{dailyChallenge.description}</p>
        </div>

        {/* Timer for 60-second challenge */}
        {dailyChallenge.id === "stillness-60" &&
          !completedChallenges.includes(dailyChallenge.id) && (
            <div className="bg-white/50 rounded-lg p-6 space-y-4">
              <div className="text-center">
                <div className="text-6xl font-bold text-amber-600 mb-4">
                  {timerSeconds}
                </div>
                <Progress
                  value={((60 - timerSeconds) / 60) * 100}
                  className="h-2 mb-4"
                />
                <p className="text-sm text-gray-600">
                  {timerActive
                    ? "Stay still and breathe..."
                    : "Click start when you're ready"}
                </p>
              </div>
              <div className="flex gap-2">
                {!timerActive ? (
                  <Button
                    onClick={startTimer}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Timer
                  </Button>
                ) : (
                  <Button
                    onClick={stopTimer}
                    variant="outline"
                    className="flex-1"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                )}
              </div>
            </div>
          )}

        {!completedChallenges.includes(dailyChallenge.id) ? (
          dailyChallenge.id !== "stillness-60" && (
            <Button
              onClick={completeChallenge}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Challenge
            </Button>
          )
        ) : (
          <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
            <CheckCircle className="h-5 w-5" />
            Challenge Completed! 🎉
          </div>
        )}
      </CardContent>
    </Card>
  );
};
