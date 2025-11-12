import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

export const PersonalShoutOut = () => {
  // ✏️ EDIT THESE VALUES:
  const shoutOutTo = "Haley"; 
  const relationship = "Friend & Supporter";
  const message = "I want to give a personal thank you to Haley Baugh, the one who first inspired and gave me the idea to bring this project to life. She believed in this vision long before it became real, and her support carried me through the hardest times. Without her, JournalXP wouldn't exist.";
  const accentColor = "indigo";

  // Color mappings
  const colorClasses = {
    indigo: {
      bg: "bg-indigo-50",
      icon: "bg-indigo-100 text-indigo-600",
      text: "text-indigo-600",
      border: "border-indigo-200",
    },
    purple: {
      bg: "bg-purple-50",
      icon: "bg-purple-100 text-purple-600",
      text: "text-purple-600",
      border: "border-purple-200",
    },
    pink: {
      bg: "bg-pink-50",
      icon: "bg-pink-100 text-pink-600",
      text: "text-pink-600",
      border: "border-pink-200",
    },
    blue: {
      bg: "bg-blue-50",
      icon: "bg-blue-100 text-blue-600",
      text: "text-blue-600",
      border: "border-blue-200",
    },
    green: {
      bg: "bg-green-50",
      icon: "bg-green-100 text-green-600",
      text: "text-green-600",
      border: "border-green-200",
    },
    orange: {
      bg: "bg-orange-50",
      icon: "bg-orange-100 text-orange-600",
      text: "text-orange-600",
      border: "border-orange-200",
    },
    red: {
      bg: "bg-red-50",
      icon: "bg-red-100 text-red-600",
      text: "text-red-600",
      border: "border-red-200",
    },
  };

  const colors = colorClasses[accentColor as keyof typeof colorClasses] || colorClasses.indigo;

  return (
    <Card className={`${colors.bg} ${colors.border} border-2 shadow-md`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Heart Icon */}
          <div className={`${colors.icon} p-3 rounded-full flex-shrink-0`}>
            <Heart className="h-6 w-6 fill-current" />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="mb-2">
              <h3 className={`text-xl font-bold ${colors.text} mb-1`}>
                Special Thanks to {shoutOutTo}
              </h3>
              <p className="text-sm text-gray-600 italic">{relationship}</p>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {message}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
