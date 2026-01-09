import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CardContent, Card } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export const BlogCard = () => {
  return (
    <motion.div
      whileHover={{
        y: -5,
        boxShadow:
          "0 10px 25px -5px rgba(124, 58, 237, 0.1), 0 10px 10px -5px rgba(124, 58, 237, 0.04)",
      }}
      transition={{ duration: 0.2 }}
    >
      <Link to="/blog" className="block h-full">
        <Card className="overflow-hidden h-full bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 hover:border-emerald-300 transition-colors">
          <CardContent className="p-6 flex flex-col items-center text-center h-full">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Mental Wellness Blog
            </h3>
            <p className="text-gray-600 text-sm">
              Read expert insights on mental health and journaling
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};
