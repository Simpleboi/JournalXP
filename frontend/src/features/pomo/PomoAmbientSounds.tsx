import { FC } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Volume2, VolumeX } from "lucide-react";
import { AmbientSound, AMBIENT_SOUNDS } from "@/models/Pomo";

interface PomoAmbientSoundsProps {
  soundEnabled: boolean;
  currentSound: AmbientSound;
  volume: number;
  onSoundEnabledChange: (enabled: boolean) => void;
  onSoundChange: (sound: AmbientSound) => void;
  onVolumeChange: (volume: number) => void;
}

export const PomoAmbientSounds: FC<PomoAmbientSoundsProps> = ({
  soundEnabled,
  currentSound,
  volume,
  onSoundEnabledChange,
  onSoundChange,
  onVolumeChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {soundEnabled ? (
              <Volume2 className="h-5 w-5" />
            ) : (
              <VolumeX className="h-5 w-5" />
            )}
            Ambient Sounds
          </CardTitle>
          <Switch checked={soundEnabled} onCheckedChange={onSoundEnabledChange} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {AMBIENT_SOUNDS.map((sound) => (
            <Button
              key={sound.value}
              variant={currentSound === sound.value ? "default" : "outline"}
              size="sm"
              onClick={() => {
                onSoundChange(sound.value);
                if (sound.value !== "none") {
                  onSoundEnabledChange(true);
                }
              }}
              className={currentSound === sound.value ? "bg-indigo-600" : ""}
              disabled={!soundEnabled && sound.value !== "none"}
            >
              {sound.icon} {sound.label}
            </Button>
          ))}
        </div>
        {currentSound !== "none" && soundEnabled && (
          <div className="mt-4">
            <Label>Volume: {volume}%</Label>
            <Slider
              value={[volume]}
              onValueChange={(v) => onVolumeChange(v[0])}
              min={0}
              max={100}
              step={1}
              className="mt-2"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
