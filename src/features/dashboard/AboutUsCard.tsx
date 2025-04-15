import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

export const AboutUsCard = () => {
  return (
    <motion.div
      whileHover={{
        y: -5,
        boxShadow:
          "0 10px 25px -5px rgba(124, 58, 237, 0.1), 0 10px 10px -5px rgba(124, 58, 237, 0.04)",
      }}
      transition={{ duration: 0.2 }}
    >
      <Link to="/about" className="block h-full">
        <Card className="overflow-hidden h-full bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-100 hover:border-teal-300 transition-colors">
          <CardContent className="p-6 flex flex-col items-center text-center h-full">
            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-4">
              <Info className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              About Us
            </h3>
            <p className="text-gray-600 text-sm">
              Learn about our mission and mental health resources
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};
