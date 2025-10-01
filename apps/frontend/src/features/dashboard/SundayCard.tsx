import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

export const SundayCard = () => {
  return (
    <motion.div
      whileHover={{
        y: -5,
        boxShadow:
          "0 10px 25px -5px rgba(124, 58, 237, 0.1), 0 10px 10px -5px rgba(124, 58, 237, 0.04)",
      }}
      transition={{ duration: 0.2 }}
    >
      <Link to="/sunday" className="block h-full">
        <Card className="overflow-hidden h-full bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100 hover:border-purple-300 transition-colors">
          <CardContent className="p-6 flex flex-col items-center text-center h-full">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <MessageCircle className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Chat with Sunday
            </h3>
            <p className="text-gray-600 text-sm">
              Talk to your personal AI mental health therapist
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};
