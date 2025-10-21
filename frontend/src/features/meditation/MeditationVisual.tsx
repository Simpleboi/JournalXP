import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { VISUALIZATIONS } from "@/data/MeditationData";
import { VisualizationExercise } from "@/types/Meditation";
import { FC } from "react";

interface MeditationVisalProps {
  startVisualization: (viz: VisualizationExercise) => void;
}

export const MeditationVisual: FC<MeditationVisalProps> = ({
  startVisualization,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {VISUALIZATIONS.map((viz, index) => (
        <motion.div
          key={viz.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <Card
            onClick={() => startVisualization(viz)}
            className="cursor-pointer hover:shadow-xl transition-all duration-300 h-full"
          >
            <CardContent className="p-6 text-center space-y-4">
              <div
                className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${viz.color} flex items-center justify-center`}
              >
                <viz.icon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {viz.title}
                </h4>
                <p className="text-sm text-gray-600 mb-2">{viz.description}</p>
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {viz.duration}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
