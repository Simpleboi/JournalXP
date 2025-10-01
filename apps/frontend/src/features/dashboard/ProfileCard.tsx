import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

export const ProfileCard = () => {
  return (
    <motion.div
      whileHover={{
        y: -5,
        boxShadow:
          "0 10px 25px -5px rgba(124, 58, 237, 0.1), 0 10px 10px -5px rgba(124, 58, 237, 0.04)",
      }}
      transition={{ duration: 0.2 }}
    >
      <Link to="/profile" className="block h-full">
        <Card className="overflow-hidden h-full bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100 hover:border-amber-300 transition-colors">
          <CardContent className="p-6 flex flex-col items-center text-center h-full">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Profile
            </h3>
            <p className="text-gray-600 text-sm">
              Manage your account and view achievements
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};
