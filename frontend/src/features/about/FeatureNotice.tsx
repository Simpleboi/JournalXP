import { AlertCircle, Info, Wrench, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface FeatureNoticeProps {
  type?: "info" | "warning" | "development" | "coming-soon";
  title?: string;
  message: string;
  features?: string[];
}

export const FeatureNotice = ({
  type = "info",
  title,
  message,
  features,
}: FeatureNoticeProps) => {
  const config = {
    info: {
      icon: Info,
      gradient: "from-blue-50 to-cyan-50",
      border: "border-blue-200",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      titleColor: "text-blue-900",
      textColor: "text-blue-700",
      defaultTitle: "Good to Know",
    },
    warning: {
      icon: AlertCircle,
      gradient: "from-amber-50 to-orange-50",
      border: "border-amber-200",
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100",
      titleColor: "text-amber-900",
      textColor: "text-amber-700",
      defaultTitle: "Please Note",
    },
    development: {
      icon: Wrench,
      gradient: "from-purple-50 to-pink-50",
      border: "border-purple-200",
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
      titleColor: "text-purple-900",
      textColor: "text-purple-700",
      defaultTitle: "Under Development",
    },
    "coming-soon": {
      icon: Sparkles,
      gradient: "from-indigo-50 to-purple-50",
      border: "border-indigo-200",
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-100",
      titleColor: "text-indigo-900",
      textColor: "text-indigo-700",
      defaultTitle: "Coming Soon",
    },
  };

  const { icon: Icon, gradient, border, iconColor, iconBg, titleColor, textColor, defaultTitle } =
    config[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-gradient-to-br ${gradient} border-2 ${border} rounded-xl p-5 shadow-sm mb-4`}
    >
      <div className="flex items-start gap-4">
        <div className={`${iconBg} rounded-lg p-2 flex-shrink-0`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="flex-1 space-y-2">
          <h4 className={`font-semibold text-base ${titleColor}`}>
            {title || defaultTitle}
          </h4>
          <p className={`text-sm leading-relaxed ${textColor}`}>{message}</p>
          {features && features.length > 0 && (
            <ul className={`text-sm ${textColor} space-y-1 mt-3`}>
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </motion.div>
  );
};
