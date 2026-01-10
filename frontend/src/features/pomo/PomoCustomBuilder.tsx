import { FC } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Sparkles } from "lucide-react";
import {
  AmbientSound,
  AMBIENT_SOUNDS,
  THEME_COLORS,
} from "@/models/Pomo";
import { formatDuration } from "@/services/PomoService";

interface PomoCustomBuilderProps {
  customName: string;
  customFocus: number;
  customShortBreak: number;
  customLongBreak: number;
  customCycles: number;
  customSound: AmbientSound;
  customColor: string;
  customAutoStart: boolean;
  onNameChange: (name: string) => void;
  onFocusChange: (focus: number) => void;
  onShortBreakChange: (shortBreak: number) => void;
  onLongBreakChange: (longBreak: number) => void;
  onCyclesChange: (cycles: number) => void;
  onSoundChange: (sound: AmbientSound) => void;
  onColorChange: (color: string) => void;
  onAutoStartChange: (autoStart: boolean) => void;
  onSave: () => void;
}

export const PomoCustomBuilder: FC<PomoCustomBuilderProps> = ({
  customName,
  customFocus,
  customShortBreak,
  customLongBreak,
  customCycles,
  customSound,
  customColor,
  customAutoStart,
  onNameChange,
  onFocusChange,
  onShortBreakChange,
  onLongBreakChange,
  onCyclesChange,
  onSoundChange,
  onColorChange,
  onAutoStartChange,
  onSave,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create Custom Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customName">Timer Name</Label>
            <Input
              id="customName"
              value={customName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="My Custom Timer"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="customFocus">Focus Duration (min)</Label>
            <Input
              id="customFocus"
              type="number"
              value={customFocus}
              onChange={(e) => onFocusChange(parseInt(e.target.value) || 25)}
              min={1}
              max={120}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="customShortBreak">Short Break (min)</Label>
            <Input
              id="customShortBreak"
              type="number"
              value={customShortBreak}
              onChange={(e) =>
                onShortBreakChange(parseInt(e.target.value) || 5)
              }
              min={1}
              max={30}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="customLongBreak">Long Break (min)</Label>
            <Input
              id="customLongBreak"
              type="number"
              value={customLongBreak}
              onChange={(e) =>
                onLongBreakChange(parseInt(e.target.value) || 15)
              }
              min={1}
              max={60}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="customCycles">Cycles Before Long Break</Label>
            <Input
              id="customCycles"
              type="number"
              value={customCycles}
              onChange={(e) => onCyclesChange(parseInt(e.target.value) || 4)}
              min={1}
              max={10}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Ambient Sound</Label>
            <Select
              value={customSound}
              onValueChange={(v: AmbientSound) => onSoundChange(v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AMBIENT_SOUNDS.map((sound) => (
                  <SelectItem key={sound.value} value={sound.value}>
                    {sound.icon} {sound.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Theme Color</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {THEME_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => onColorChange(color.value)}
                className={`w-8 h-8 rounded-full transition-transform ${
                  customColor === color.value
                    ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                    : ""
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="customAutoStart">Auto-start sessions</Label>
          <Switch
            id="customAutoStart"
            checked={customAutoStart}
            onCheckedChange={onAutoStartChange}
          />
        </div>

        {/* Preview */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-700 mb-2">
            Session Preview
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Total Duration:</span>
              <span className="ml-2 font-medium">
                {formatDuration(
                  customFocus * customCycles +
                    customShortBreak * (customCycles - 1) +
                    customLongBreak
                )}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Focus Time:</span>
              <span className="ml-2 font-medium">
                {formatDuration(customFocus * customCycles)}
              </span>
            </div>
          </div>
        </div>

        <Button
          onClick={onSave}
          disabled={!customName.trim()}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Create & Use Timer
        </Button>
      </CardContent>
    </Card>
  );
};
