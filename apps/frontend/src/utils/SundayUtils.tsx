import { Heart, Sparkles, Brain, Smile, MessageCircle } from "lucide-react";

export const getMoodIcon = (mood?: string) => {
  switch (mood) {
    case "supportive":
      return <Sparkles className="h-4 w-4 text-yellow-500" />;
    case "reflective":
      return <Brain className="h-4 w-4 text-purple-500" />;
    case "gentle":
      return <Smile className="h-4 w-4 text-blue-500" />;
    default:
      return <MessageCircle className="h-4 w-4 text-gray-500" />;
  }
};
        
export const getMoodColor = (mood?: string) => {
  switch (mood) {
    case "supportive":
      return "from-pink-50 to-rose-50 border-pink-200";
    case "encouraging":
      return "from-yellow-50 to-amber-50 border-yellow-200";
    case "reflective":
      return "from-purple-50 to-indigo-50 border-purple-200";
    case "gentle":
      return "from-blue-50 to-cyan-50 border-blue-200";
    default:
      return "from-gray-50 to-slate-50 border-gray-200";
  }
};
