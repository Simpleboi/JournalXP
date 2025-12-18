import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Timer } from "lucide-react";

export const PomoCard = () => {
  return (
    <motion.div
      whileHover={{
        y: -5,
        boxShadow:
          "0 10px 25px -5px rgba(239, 68, 68, 0.1), 0 10px 10px -5px rgba(239, 68, 68, 0.04)",
      }}
      transition={{ duration: 0.2 }}
    >
      <Link to="/pomo" className="block h-full">
        <Card className="overflow-hidden h-full bg-gradient-to-br from-rose-50 to-orange-50 border-rose-100 hover:border-rose-300 transition-colors">
          <CardContent className="p-6 flex flex-col items-center text-center h-full">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-rose-100 to-orange-100 flex items-center justify-center mb-4">
              <Timer className="h-8 w-8 text-rose-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Pomodoro Timer
            </h3>
            <p className="text-gray-600 text-sm">
              Focus sessions with breaks to boost productivity
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};
