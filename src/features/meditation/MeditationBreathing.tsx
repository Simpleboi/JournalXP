import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

export const MeditationBreathing = () => {
  const [breathingType, setBreathingType] = useState("calm");
  const [breathingDuration, setBreathingDuration] = useState(3);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingProgress, setBreathingProgress] = useState(0);
  const [isSoundOn, setIsSoundOn] = useState(true);

  const startBreathing = () => {
    setIsBreathing(true);
    setBreathingProgress(0);

    const totalTime = breathingDuration * 60 * 1000; // convert to milliseconds
    const interval = 100; // update every 100ms
    const increment = (interval / totalTime) * 100;

    const timer = setInterval(() => {
      setBreathingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsBreathing(false);
          return 100;
        }
        return prev + increment;
      });
    }, interval);
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    setBreathingProgress(0);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="mb-12"
    >
      <Card className="max-w-4xl mx-auto bg-gradient-to-br from-indigo-50 to-purple-50 border-0 shadow-xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-medium text-gray-800">
            Breathing Exercise
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Find your rhythm and center yourself
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <motion.div
              className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center shadow-lg"
              animate={
                isBreathing
                  ? {
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7],
                    }
                  : {}
              }
              transition={{
                duration: 4,
                repeat: isBreathing ? Infinity : 0,
                ease: "easeInOut",
              }}
            >
              <motion.div
                className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm"
                animate={
                  isBreathing
                    ? {
                        scale: [0.8, 1.1, 0.8],
                      }
                    : {}
                }
                transition={{
                  duration: 4,
                  repeat: isBreathing ? Infinity : 0,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exercise Type
              </label>
              <Select value={breathingType} onValueChange={setBreathingType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calm">Calm</SelectItem>
                  <SelectItem value="focus">Focus</SelectItem>
                  <SelectItem value="energize">Energize</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <Select
                value={breathingDuration.toString()}
                onValueChange={(value) => setBreathingDuration(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 minute</SelectItem>
                  <SelectItem value="3">3 minutes</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sound
              </label>
              <Button
                variant="outline"
                onClick={() => setIsSoundOn(!isSoundOn)}
                className="w-full"
              >
                {isSoundOn ? (
                  <>
                    <Volume2 className="h-4 w-4 mr-2" /> On
                  </>
                ) : (
                  <>
                    <VolumeX className="h-4 w-4 mr-2" /> Off
                  </>
                )}
              </Button>
            </div>
          </div>

          {breathingProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${breathingProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          <div className="flex justify-center gap-4">
            {!isBreathing ? (
              <Button
                onClick={startBreathing}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Breathing
              </Button>
            ) : (
              <Button
                onClick={stopBreathing}
                variant="outline"
                className="px-8"
              >
                <Pause className="h-4 w-4 mr-2" />
                Stop
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
};
