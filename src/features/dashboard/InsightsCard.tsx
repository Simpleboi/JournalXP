import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { NotYet } from "@/components/NotYet";

export const InsightsCard = () => {
  return (
    <motion.div
      whileHover={{
        y: -5,
        boxShadow:
          "0 10px 25px -5px rgba(124, 58, 237, 0.1), 0 10px 10px -5px rgba(124, 58, 237, 0.04)",
      }}
      transition={{ duration: 0.2 }}
    >
      <Link to="/insights" className="block h-full">
        <Card className="overflow-hidden h-full bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 hover:border-green-300 transition-colors">
          <CardContent className="p-6 flex flex-col items-center text-center h-full">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Insights
            </h3>
            <p className="text-gray-600 text-sm">
              View your progress and mental health trends
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};
