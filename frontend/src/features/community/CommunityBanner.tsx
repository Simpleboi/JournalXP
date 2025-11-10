import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export const CommunityBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <Card className="bg-gradient-to-r from-sky-100 to-blue-100 border-sky-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-sky-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">
                Welcome to our safe space
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Share uplifting thoughts anonymously. All posts are moderated to
                ensure this remains a supportive, positive environment. Be kind,
                be authentic, and remember—your words might be exactly what
                someone needs to hear today.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
