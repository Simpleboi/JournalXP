import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ListChecks } from "lucide-react";

export const HabitCard = () => {
  return (
    <motion.div
      whileHover={{
        y: -5,
        boxShadow:
          "0 10px 25px -5px rgba(124, 58, 237, 0.1), 0 10px 10px -5px rgba(124, 58, 237, 0.04)",
      }}
      transition={{ duration: 0.2 }}
    >
      <Link to="/habits" className="block h-full">
        <Card className="overflow-hidden h-full bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100 hover:border-blue-300 transition-colors">
          <CardContent className="p-6 flex flex-col items-center text-center h-full">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <ListChecks className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Habit Builder
            </h3>
            <p className="text-gray-600 text-sm">
              Create and track daily habits for better wellbeing
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};
