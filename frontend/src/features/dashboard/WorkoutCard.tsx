import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";

export const WorkoutCard = () => {
  return (
    <motion.div
      whileHover={{
        y: -5,
        boxShadow:
          "0 10px 25px -5px rgba(239, 68, 68, 0.1), 0 10px 10px -5px rgba(239, 68, 68, 0.04)",
      }}
      transition={{ duration: 0.2 }}
    >
      <Link to="/workouts" className="block h-full">
        <Card className="overflow-hidden h-full bg-gradient-to-br from-red-50 to-orange-50 border-red-100 hover:border-red-300 transition-colors">
          <CardContent className="p-6 flex flex-col items-center text-center h-full">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <Dumbbell className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Training & Workouts
            </h3>
            <p className="text-gray-600 text-sm">
              Track your fitness journey and progression
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};
