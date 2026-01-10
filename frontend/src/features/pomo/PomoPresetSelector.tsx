import { FC } from "react";
import { motion } from "framer-motion";
import { PomodoroPreset } from "@/models/Pomo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Clock, Trash2 } from "lucide-react";
import {
  formatDuration,
  calculateTotalSessionDuration,
} from "@/services/PomoService";

interface PomoPresetSelectorProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  presets: PomodoroPreset[];
  customPresets: PomodoroPreset[];
  selectedPreset: PomodoroPreset;
  onPresetSelect: (presetId: string) => void;
  onDeletePreset: (preset: PomodoroPreset) => void;
}

export const PomoPresetSelector: FC<PomoPresetSelectorProps> = ({
  activeTab,
  onTabChange,
  presets,
  customPresets,
  selectedPreset,
  onPresetSelect,
  onDeletePreset,
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="presets">Presets</TabsTrigger>
        <TabsTrigger value="my-timers">My Timers</TabsTrigger>
        <TabsTrigger value="custom">Create New</TabsTrigger>
      </TabsList>

      <TabsContent value="presets">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {presets.map((preset) => (
            <motion.div
              key={preset.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`cursor-pointer transition-all ${
                  selectedPreset.id === preset.id
                    ? "ring-2 ring-indigo-500 bg-indigo-50"
                    : "hover:shadow-md"
                }`}
                onClick={() => onPresetSelect(preset.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    {selectedPreset.id === preset.id && (
                      <Check className="h-4 w-4 text-indigo-600 mr-1" />
                    )}
                    <span className="font-semibold text-gray-800">
                      {preset.name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {preset.focusDuration}/{preset.shortBreakDuration}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDuration(calculateTotalSessionDuration(preset))}{" "}
                    total
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="my-timers">
        {customPresets.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <Clock className="h-12 w-12 text-gray-400" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  No Custom Timers Yet
                </h3>
                <p className="text-sm text-gray-500">
                  Create your first custom timer in the "Create New" tab
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {customPresets.map((preset) => (
              <motion.div
                key={preset.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative group"
              >
                <Card
                  className={`cursor-pointer transition-all ${
                    selectedPreset.id === preset.id
                      ? "ring-2 ring-offset-2 shadow-md"
                      : "hover:shadow-md"
                  }`}
                  style={{
                    borderColor:
                      selectedPreset.id === preset.id
                        ? (preset as any).themeColor
                        : undefined,
                    backgroundColor:
                      selectedPreset.id === preset.id
                        ? `${(preset as any).themeColor}10`
                        : undefined,
                  }}
                  onClick={() => onPresetSelect(preset.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      {selectedPreset.id === preset.id && (
                        <Check
                          className="h-4 w-4 mr-1"
                          style={{ color: (preset as any).themeColor }}
                        />
                      )}
                      <span className="font-semibold text-gray-800">
                        {preset.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {preset.focusDuration}/{preset.shortBreakDuration}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDuration(calculateTotalSessionDuration(preset))}{" "}
                      total
                    </p>
                    {(preset as any).themeColor && (
                      <div
                        className="w-6 h-1 mx-auto mt-2 rounded-full"
                        style={{
                          backgroundColor: (preset as any).themeColor,
                        }}
                      />
                    )}
                  </CardContent>
                </Card>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-1 right-1 h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePreset(preset);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
