import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Compass } from "lucide-react";

export const GuidedReflectionCard = () => {
  return (
    <motion.div
      whileHover={{
        y: -5,
        boxShadow:
          "0 10px 25px -5px rgba(124, 58, 237, 0.1), 0 10px 10px -5px rgba(124, 58, 237, 0.04)",
      }}
      transition={{ duration: 0.2 }}
    >
      <Link to="/guided-reflection" className="block h-full">
        <Card className="overflow-hidden h-full bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 border-teal-100 hover:border-teal-300 transition-colors">
          <CardContent className="p-6 flex flex-col items-center text-center h-full">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center mb-4 shadow-lg">
              <Compass className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Guided Reflection
            </h3>
            <p className="text-gray-600 text-sm">
              Gentle self-exploration paths for anxiety, burnout, and more
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};
