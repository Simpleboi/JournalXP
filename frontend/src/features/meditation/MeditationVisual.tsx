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
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";

interface MeditationVisalProps {
  startVisualization: (viz: VisualizationExercise) => void;
}

export const MeditationVisual: FC<MeditationVisalProps> = ({
  startVisualization,
}) => {
  const { theme } = useTheme();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            className="w-full h-full text-left cursor-pointer rounded-2xl p-6 md:p-8 backdrop-blur-xl border transition-all duration-500 group relative overflow-hidden"
            style={{
              background: `${theme.colors.surface}70`,
              borderColor: `${theme.colors.border}40`,
              boxShadow: `0 4px 24px ${theme.colors.background}60`,
            }}
          >
            {/* Gradient glow on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${theme.colors.primary}15, transparent 60%)`,
              }}
            />

            {/* Top accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
              }}
            />

            <div className="relative z-10 flex flex-col h-full">
              {/* Icon and Title Row */}
              <div className="flex items-start gap-5 mb-4">
                <motion.div
                  className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-md border"
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.primary}40, ${theme.colors.secondary}30)`,
                    borderColor: `${theme.colors.primary}40`,
                    boxShadow: `0 4px 16px ${theme.colors.primary}30`,
                  }}
                  whileHover={{ rotate: [0, -5, 5, 0], scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                >
                  <viz.icon className="h-8 w-8" style={{ color: theme.colors.text }} />
                </motion.div>

                <div className="flex-1">
                  <h4
                    className="text-xl font-semibold mb-1"
                    style={{ color: theme.colors.text }}
                  >
                    {viz.title}
                  </h4>
                  <div
                    className="flex items-center gap-2 text-sm"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    {viz.duration}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p
                className="text-sm leading-relaxed flex-1 mb-4"
                style={{ color: theme.colors.textSecondary }}
              >
                {viz.description}
              </p>

              {/* Call to action */}
              <div
                className="flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all duration-300"
                style={{ color: theme.colors.primary }}
              >
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
  const { theme } = useTheme();

  return (
    <Dialog
      open={currentVisualization !== null}
      onOpenChange={(open) => !open && closeVisualization()}
    >
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto backdrop-blur-2xl border"
        style={{
          background: `${theme.colors.surface}95`,
          borderColor: `${theme.colors.border}50`,
        }}
      >
        <DialogHeader
          className="border-b pb-4"
          style={{ borderColor: `${theme.colors.border}30` }}
        >
          <DialogTitle className="flex items-center gap-4 text-2xl">
            {currentVisualization && (
              <>
                <div
                  className="p-3 rounded-xl backdrop-blur-md border"
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.primary}40, ${theme.colors.secondary}30)`,
                    borderColor: `${theme.colors.primary}40`,
                    boxShadow: `0 4px 16px ${theme.colors.primary}30`,
                  }}
                >
                  <currentVisualization.icon
                    className="h-7 w-7"
                    style={{ color: theme.colors.text }}
                  />
                </div>
                <div>
                  <div style={{ color: theme.colors.text }}>{currentVisualization.title}</div>
                  <div
                    className="text-sm font-normal mt-1"
                    style={{ color: theme.colors.textSecondary }}
                  >
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
              <div
                className="flex justify-between text-xs mb-1"
                style={{ color: theme.colors.textSecondary }}
              >
                <span>Progress</span>
                <span>
                  {visualizationStep + 1} of {currentVisualization.script.length}
                </span>
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ background: `${theme.colors.surfaceLight}80` }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                    boxShadow: `0 0 10px ${theme.colors.primary}60`,
                  }}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((visualizationStep + 1) / currentVisualization.script.length) * 100}%`,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Script content with glassmorphism */}
            <motion.div
              key={visualizationStep}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="min-h-[300px] flex items-center justify-center rounded-2xl p-10 backdrop-blur-md border"
              style={{
                background: `${theme.colors.surfaceLight}40`,
                borderColor: `${theme.colors.border}30`,
                boxShadow: `inset 0 2px 20px ${theme.colors.background}40`,
              }}
            >
              <p
                className="text-lg md:text-xl leading-loose text-center max-w-3xl font-light"
                style={{ color: theme.colors.text }}
              >
                {currentVisualization.script[visualizationStep]}
              </p>
            </motion.div>

            {/* Navigation */}
            <div
              className="flex justify-between items-center pt-4 border-t"
              style={{ borderColor: `${theme.colors.border}30` }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                    boxShadow: `0 0 8px ${theme.colors.primary}60`,
                  }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: theme.colors.textSecondary }}
                >
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
                    className="group backdrop-blur-md"
                    style={{
                      background: `${theme.colors.surfaceLight}50`,
                      borderColor: `${theme.colors.border}50`,
                      color: theme.colors.text,
                    }}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Previous
                  </Button>
                )}

                {visualizationStep < currentVisualization.script.length - 1 ? (
                  <Button
                    onClick={nextVisualizationStep}
                    className="group"
                    size="lg"
                    style={{
                      background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                      boxShadow: `0 4px 16px ${theme.colors.primary}40`,
                      color: theme.colors.background,
                    }}
                  >
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                ) : (
                  <Button
                    onClick={closeVisualization}
                    className="group"
                    size="lg"
                    style={{
                      background: `linear-gradient(135deg, #10b981, #14b8a6)`,
                      boxShadow: `0 4px 16px #10b98140`,
                      color: "#fff",
                    }}
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
