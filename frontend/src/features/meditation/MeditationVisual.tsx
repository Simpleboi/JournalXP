import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, ArrowLeft } from "lucide-react";
import { VISUALIZATIONS } from "@/data/MeditationData";
import { VisualizationExercise } from "@/types/Meditation";
import { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

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

interface VisualDialogProps {
  closeVisualization: () => void;
  currentVisualization: VisualizationExercise;
  visualizationStep: number;
  nextVisualizationStep: () => void;
}

export const VisualDialog: FC<VisualDialogProps> = ({
  closeVisualization,
  currentVisualization,
  visualizationStep,
  nextVisualizationStep,
}) => {
  return (
    <Dialog
      open={currentVisualization !== null}
      onOpenChange={(open) => !open && closeVisualization()}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            {currentVisualization && (
              <>
                <currentVisualization.icon className="h-6 w-6" />
                {currentVisualization.title}
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        {currentVisualization && (
          <div className="space-y-6">
            <Progress
              value={
                (visualizationStep / currentVisualization.script.length) * 100
              }
            />
            <motion.div
              key={visualizationStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="min-h-[200px] flex items-center justify-center"
            >
              <p className="text-xl text-gray-700 text-center leading-relaxed p-8">
                {currentVisualization.script[visualizationStep]}
              </p>
            </motion.div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Step {visualizationStep + 1} of{" "}
                {currentVisualization.script.length}
              </span>
              <div className="flex gap-2">
                {visualizationStep < currentVisualization.script.length - 1 ? (
                  <Button onClick={nextVisualizationStep}>
                    Next
                    <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                  </Button>
                ) : (
                  <Button
                    onClick={closeVisualization}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
