import { motion } from "framer-motion";
import { Clock, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {VISUALIZATIONS.map((viz, index) => (
        <motion.div
          key={viz.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -6, scale: 1.01 }}
          className="h-full"
        >
          <button
            onClick={() => startVisualization(viz)}
            className="w-full h-full text-left cursor-pointer rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 bg-white/80 backdrop-blur-sm border-2 border-white/50 hover:border-gray-200 hover:shadow-xl transition-all duration-500 group relative overflow-hidden"
          >
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${viz.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-xl sm:rounded-2xl`} />

            <div className="relative z-10 flex flex-col h-full">
              {/* Icon and Title Row */}
              <div className="flex items-start gap-4 sm:gap-5 mb-4">
                <motion.div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${viz.color} shadow-lg`}
                  whileHover={{ rotate: [0, -5, 5, 0], scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                >
                  <viz.icon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                </motion.div>

                <div className="flex-1">
                  <h4 className="text-lg sm:text-xl font-semibold mb-1 text-gray-800 group-hover:text-gray-900">
                    {viz.title}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-3.5 w-3.5" />
                    {viz.duration}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed flex-1 mb-4 text-gray-600">
                {viz.description}
              </p>

              {/* Call to action */}
              <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 group-hover:gap-3 transition-all duration-300">
                Begin Journey
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>
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
          <DialogTitle className="flex items-center gap-3 text-2xl sm:text-3xl">
            {currentVisualization && (
              <>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${currentVisualization.color} shadow-lg`}>
                  <currentVisualization.icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <div>
                  <div className="text-gray-800">{currentVisualization.title}</div>
                  <div className="text-sm font-normal text-gray-500 mt-1">
                    {currentVisualization.duration} guided journey
                  </div>
                </div>
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        {currentVisualization && (
          <div className="space-y-6 sm:space-y-8 py-4 sm:py-6">
            {/* Progress indicator */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>
                  {visualizationStep + 1} of {currentVisualization.script.length}
                </span>
              </div>
              <Progress
                value={((visualizationStep + 1) / currentVisualization.script.length) * 100}
                className="h-2"
              />
            </div>

            {/* Script content */}
            <motion.div
              key={visualizationStep}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="min-h-[250px] sm:min-h-[300px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 sm:p-10 shadow-inner"
            >
              <p className="text-base sm:text-lg md:text-xl text-gray-800 leading-loose text-center max-w-3xl font-light">
                {currentVisualization.script[visualizationStep]}
              </p>
            </motion.div>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t">
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
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
