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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {VISUALIZATIONS.map((viz, index) => (
        <motion.div
          key={viz.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.15 }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="h-full"
        >
          <Card
            onClick={() => startVisualization(viz)}
            className="cursor-pointer hover:shadow-2xl transition-all duration-500 h-full overflow-hidden group relative"
          >
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${viz.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

            <CardContent className="p-8 flex flex-col h-full relative z-10">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <motion.div
                  className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${viz.color} flex items-center justify-center shadow-lg`}
                  whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <viz.icon className="h-12 w-12 text-white" />
                </motion.div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col">
                <h4 className="text-2xl font-bold text-gray-800 mb-3 text-center group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-gray-800 group-hover:to-gray-600 transition-all duration-300">
                  {viz.title}
                </h4>

                <p className="text-base text-gray-600 mb-4 text-center leading-relaxed flex-1">
                  {viz.description}
                </p>

                {/* Duration badge */}
                <div className="flex justify-center mt-4">
                  <Badge
                    variant="outline"
                    className="text-sm px-4 py-2 group-hover:bg-gray-50 transition-colors"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    {viz.duration}
                  </Badge>
                </div>

                {/* Call to action */}
                <motion.div
                  className="mt-6 text-center text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  Begin Journey →
                </motion.div>
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center gap-3 text-3xl">
            {currentVisualization && (
              <>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${currentVisualization.color}`}>
                  <currentVisualization.icon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div>{currentVisualization.title}</div>
                  <div className="text-sm font-normal text-gray-500 mt-1">
                    {currentVisualization.duration} guided journey
                  </div>
                </div>
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        {currentVisualization && (
          <div className="space-y-8 py-6">
            {/* Progress indicator */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>
                  {visualizationStep + 1} of {currentVisualization.script.length}
                </span>
              </div>
              <Progress
                value={
                  ((visualizationStep + 1) / currentVisualization.script.length) * 100
                }
                className="h-2"
              />
            </div>

            {/* Script content with enhanced styling */}
            <motion.div
              key={visualizationStep}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="min-h-[300px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-white rounded-2xl p-10 shadow-inner"
            >
              <p className="text-lg md:text-xl text-gray-800 leading-loose text-center max-w-3xl font-light">
                {currentVisualization.script[visualizationStep]}
              </p>
            </motion.div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${currentVisualization.color}`} />
                <span className="text-sm text-gray-600 font-medium">
                  Step {visualizationStep + 1}
                </span>
              </div>

              <div className="flex gap-3">
                {visualizationStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      /* Could add back functionality */
                    }}
                    className="group"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Previous
                  </Button>
                )}

                {visualizationStep < currentVisualization.script.length - 1 ? (
                  <Button
                    onClick={nextVisualizationStep}
                    className={`bg-gradient-to-r ${currentVisualization.color} hover:opacity-90 transition-opacity group`}
                    size="lg"
                  >
                    Continue
                    <ArrowLeft className="h-4 w-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </Button>
                ) : (
                  <Button
                    onClick={closeVisualization}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 group"
                    size="lg"
                  >
                    <CheckCircle className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    Complete Journey
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
