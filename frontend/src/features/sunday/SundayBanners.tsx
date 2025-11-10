import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Heart, Brain, Sparkles } from "lucide-react";

export const SundayHelpfulTips = () => {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Heart className="h-5 w-5 text-blue-500 mr-2" />
            Safe Space
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            This is a judgment-free zone. Share whatever is on your mind, and
            Sunday will listen with empathy and understanding.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Brain className="h-5 w-5 text-purple-500 mr-2" />
            Thoughtful Responses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Sunday uses advanced AI to provide thoughtful, personalized
            responses that adapt to your emotional state and needs.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Sparkles className="h-5 w-5 text-green-500 mr-2" />
            Always Available
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Sunday is available 24/7 whenever you need someone to talk to. No
            appointments necessary, just start chatting.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
